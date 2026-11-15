import { useCallback, useEffect, useState } from 'react';
import { useAccount, useChainId, useConnect, usePublicClient, useReadContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { AlertTriangle, ArrowDownLeft, ArrowUpRight, Shield, Wallet } from 'lucide-react';
import { Link } from 'wouter';

import {
    INVEST,
    INVESTMENT_CONFIG,
    sdaiVaultAbi,
} from '@/constants/investments';
import { PosicaoCard } from '@/components/investments/PosicaoCard';
import { DepositForm } from '@/components/investments/DepositForm';
import { WithdrawForm } from '@/components/investments/WithdrawForm';
import { NetworkGate } from '@/components/investments/NetworkGate';
import { AccountsDialog } from '@/components/wallet/accounts-dialog';
import { WalletHeader } from '@/components/wallet/wallet-header';
import { addressHasCode, CONTRACT_CODE_WARNING } from '@/lib/account-safety';
import { useWallet } from '@/lib/use-wallet';
import { activeChain, supportedChains } from '@/lib/wagmi';

export default function Investments() {
    const { address: connectedAddress, isConnected } = useAccount();
    const { connect, isPending: isConnecting } = useConnect();
    const {
        ready,
        wallet,
        accounts,
        activeIndex,
        activeAddress,
        switchAccount,
        addAccount,
        addAccountByAddress,
        importDiscovered,
    } = useWallet();

    const [accountsOpen, setAccountsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

    const wagmiChainId = useChainId();
    // Carteira local (keystore) opera na cadeia ativa do app (definida via .env);
    // carteira conectada (MetaMask/Rabby) opera na cadeia do conector.
    const chainId = isConnected ? wagmiChainId : activeChain.id;
    const investConfig = INVEST[chainId];
    const isSupported = Boolean(investConfig);
    const currentChain = supportedChains.find((c) => c.id === chainId) || activeChain;

    // Endereço efetivo: prioriza a carteira conectada no wagmi, com fallback para o endereço ativo local
    const effectiveAddress = connectedAddress || activeAddress;
    const isWalletConnected = isConnected || Boolean(activeAddress);

    // Proteção: detecta código de contrato no endereço ativo (ex.: delegação
    // EIP-7702) — endereços assim executam código ao receber fundos.
    const safetyClient = usePublicClient({ chainId });
    const [activeAccountHasCode, setActiveAccountHasCode] = useState(false);

    useEffect(() => {
        let cancelled = false;

        if (!safetyClient || !effectiveAddress) {
            setActiveAccountHasCode(false);
            return;
        }

        void addressHasCode(safetyClient, effectiveAddress)
            .then((hasCode) => {
                if (!cancelled) {
                    setActiveAccountHasCode(hasCode);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setActiveAccountHasCode(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [safetyClient, effectiveAddress]);

    // Leitura 1: Saldo de cotas balanceOf(usuário) no Vault sDAI
    const {
        data: sharesBalance,
        isLoading: isSharesLoading,
        isError: isSharesError,
        refetch: refetchShares,
    } = useReadContract({
        address: investConfig?.vaultAddress,
        abi: sdaiVaultAbi,
        functionName: 'balanceOf',
        args: effectiveAddress ? [effectiveAddress] : undefined,
        chainId,
        query: {
            enabled: Boolean(isSupported && effectiveAddress && investConfig?.vaultAddress),
        },
    });

    // Leitura 2: Valor atual em xDAI: convertToAssets(cotas)
    const {
        data: assetsInXDai,
        isLoading: isAssetsLoading,
        isError: isAssetsError,
        refetch: refetchAssets,
    } = useReadContract({
        address: investConfig?.vaultAddress,
        abi: sdaiVaultAbi,
        functionName: 'convertToAssets',
        args: sharesBalance !== undefined ? [sharesBalance] : undefined,
        chainId,
        query: {
            enabled: Boolean(
                isSupported &&
                effectiveAddress &&
                sharesBalance !== undefined &&
                investConfig?.vaultAddress
            ),
        },
    });

    // Leitura 3: Preço atual da cota: convertToAssets(1e18)
    const {
        data: sharePriceInXDai,
        isLoading: isPriceLoading,
        isError: isPriceError,
        refetch: refetchPrice,
    } = useReadContract({
        address: investConfig?.vaultAddress,
        abi: sdaiVaultAbi,
        functionName: 'convertToAssets',
        args: [INVESTMENT_CONFIG.oneShare],
        chainId,
        query: {
            enabled: Boolean(isSupported && investConfig?.vaultAddress),
        },
    });

    // Atualização manual ou pós-transação.
    // allSettled: um erro isolado no RPC não impede as demais consultas.
    const handleRefreshAll = useCallback(() => {
        void Promise.allSettled([refetchShares(), refetchAssets(), refetchPrice()]);
    }, [refetchShares, refetchAssets, refetchPrice]);

    const isPositionLoading = isSupported && (isSharesLoading || isAssetsLoading || isPriceLoading);
    const isPositionError = isSupported && (isSharesError || isAssetsError || isPriceError);

    // Se nenhuma carteira estiver conectada (nem extensão nem local), exibe tela para conexão
    if (ready && !isWalletConnected) {
        return (
            <div className="min-h-screen bg-[#fafbfc] text-[#202124]">
                <WalletHeader
                    chainName={currentChain.name}
                    isTestnet={Boolean(currentChain.testnet)}
                    onOpenAccounts={() => {}}
                />
                <main className="mx-auto max-w-5xl px-5 py-12 md:px-10">
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-8 text-center shadow-sm max-w-lg mx-auto">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1a73e8]">
                            <Wallet size={28} />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-gray-900">
                            Conecte sua carteira para investir
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                            Conecte sua extensão (MetaMask, Rabby) ou crie/importe uma conta local para visualizar seus rendimentos e operar no Savings xDAI.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 justify-center items-center">
                            <button
                                type="button"
                                onClick={() => connect({ connector: injected() })}
                                disabled={isConnecting}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-8 text-sm font-medium text-white shadow-sm transition hover:bg-[#1765cc] disabled:opacity-50"
                            >
                                {isConnecting ? 'Conectando...' : 'Conectar Carteira'}
                            </button>
                            <Link
                                href="/"
                                className="text-xs text-gray-500 hover:text-gray-800 transition py-1"
                            >
                                Ir para a carteira local
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafbfc] text-[#202124]">
            <WalletHeader
                chainName={currentChain.name}
                isTestnet={Boolean(currentChain.testnet)}
                address={effectiveAddress}
                onOpenAccounts={() => setAccountsOpen(true)}
            />

            {/* Barra de Navegação de Abas de Investimento */}
            <div className="border-b border-gray-100 bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-5 md:px-10">
                    <nav className="flex space-x-8">
                        <Link
                            href="/investments"
                            className="inline-flex items-center gap-2 border-b-2 border-[#1a73e8] py-4 text-sm font-semibold text-[#1a73e8]"
                        >
                            <img
                                src={INVESTMENT_CONFIG.icon}
                                alt="sDAI"
                                className="h-5 w-5 rounded-full object-cover shrink-0"
                            />
                            <span>{INVESTMENT_CONFIG.displayName}</span>
                        </Link>
                    </nav>

                    <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                        <Shield size={14} className={isSupported ? 'text-emerald-600' : 'text-amber-500'} />
                        <span>{currentChain.name} (Chain ID: {chainId})</span>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-5xl px-5 py-8 md:px-10">
                <NetworkGate>
                    <div className="space-y-6">
                        {/* Alerta: endereço com código de contrato (armadilha EIP-7702) */}
                        {activeAccountHasCode && (
                            <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-600" />
                                <div>
                                    <p className="font-semibold text-red-900">
                                        Endereço com código de contrato detectado
                                    </p>
                                    <p className="mt-0.5">{CONTRACT_CODE_WARNING}</p>
                                </div>
                            </div>
                        )}

                        {/* Card de Posição Atual */}
                        <PosicaoCard
                            shares={sharesBalance}
                            assetsInXDai={assetsInXDai}
                            sharePriceInXDai={sharePriceInXDai}
                            isLoading={isPositionLoading}
                            isError={isPositionError}
                            isSupported={isSupported}
                            onRefresh={handleRefreshAll}
                        />

                        {/* Seção Operacional: Depositar / Sacar */}
                        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
                            <div className="flex border-b border-gray-100 pb-4">
                                <div className="flex rounded-xl bg-gray-100/80 p-1">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('deposit')}
                                        className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition ${
                                            activeTab === 'deposit'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        <ArrowDownLeft size={16} className="text-emerald-600" />
                                        Depositar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('withdraw')}
                                        className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition ${
                                            activeTab === 'withdraw'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        <ArrowUpRight size={16} className="text-blue-600" />
                                        Sacar
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6">
                                {effectiveAddress && (
                                    activeTab === 'deposit' ? (
                                        <DepositForm
                                            wallet={wallet ?? undefined}
                                            accountIndex={activeIndex}
                                            userAddress={effectiveAddress}
                                            isExternalWallet={isConnected}
                                            onSuccess={handleRefreshAll}
                                        />
                                    ) : (
                                        <WithdrawForm
                                            wallet={wallet ?? undefined}
                                            accountIndex={activeIndex}
                                            userAddress={effectiveAddress}
                                            sharesBalance={sharesBalance}
                                            isExternalWallet={isConnected}
                                            onSuccess={handleRefreshAll}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </NetworkGate>
            </main>

            {wallet && (
                <AccountsDialog
                    open={accountsOpen}
                    onClose={() => setAccountsOpen(false)}
                    accounts={accounts}
                    activeIndex={activeIndex}
                    onSelect={(index) => {
                        switchAccount(index);
                        setAccountsOpen(false);
                    }}
                    onAdd={addAccount}
                    onAddManual={addAccountByAddress}
                    onScan={(password) => importDiscovered(password, 20)}
                />
            )}
        </div>
    );
}
