import { useEffect, useState, type FormEvent } from 'react';
import {
    createWalletClient,
    formatEther,
    http,
    parseEther,
    type Address,
    type Hash,
    BaseError,
} from 'viem';
import {
    useChainId,
    usePublicClient,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi';
import { CheckCircle2, ExternalLink, Loader2, XCircle } from 'lucide-react';

import {
    INVEST,
    INVESTMENT_CONFIG,
    savingsXDaiAdapterAbi,
    sdaiVaultAbi,
} from '@/constants/investments';
import { ConfirmDialog } from '@/components/investments/ConfirmDialog';
import { addressHasCode, CONTRACT_CODE_WARNING } from '@/lib/account-safety';
import { fmt } from '@/utils/format';
import { unlockAccount, type StoredWallet } from '@/lib/keystore';
import { activeChain, supportedChains } from '@/lib/wagmi';

type WithdrawFormProps = {
    wallet?: StoredWallet;
    accountIndex?: number;
    userAddress: Address;
    sharesBalance: bigint | undefined;
    isExternalWallet?: boolean;
    onSuccess: () => void;
};

function formatErrorFriendly(err: unknown): string {
    if (!err) return 'Ocorreu um erro desconhecido.';
    const msg = (err as Error)?.message || String(err);
    if (msg.includes('password') || msg.includes('operation-failed') || msg.includes('decrypt')) {
        return 'Senha incorreta. Tente novamente.';
    }
    if (msg.includes('ERC4626ExceededMaxRedeem')) {
        return 'A quantidade de cotas excede o saldo disponível para resgate.';
    }
    if (err instanceof BaseError) {
        return err.shortMessage || err.message;
    }
    return msg;
}

export function WithdrawForm({
    wallet,
    accountIndex,
    userAddress,
    sharesBalance,
    isExternalWallet = false,
    onSuccess,
}: WithdrawFormProps) {
    const [amountStr, setAmountStr] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [isSigning, setIsSigning] = useState(false);
    const [txHash, setTxHash] = useState<Hash | undefined>(undefined);

    const { writeContractAsync } = useWriteContract();

    // Passo atual: 'idle' | 'approving' | 'redeeming'
    const [step, setStep] = useState<'idle' | 'approving' | 'redeeming'>('idle');

    const wagmiChainId = useChainId();
    // Carteira local (keystore) opera na cadeia ativa do app (definida via .env);
    // carteira externa (MetaMask/Rabby) opera na cadeia conectada no conector.
    const chainId = isExternalWallet ? wagmiChainId : activeChain.id;
    const investConfig = INVEST[chainId];
    const isSupported = Boolean(investConfig);
    const currentChain = supportedChains.find((c) => c.id === chainId) || activeChain;

    const publicClient = usePublicClient({ chainId });

    // Consulta de allowance atual do usuário para o Adapter no Vault sDAI
    const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
        address: investConfig?.vaultAddress,
        abi: sdaiVaultAbi,
        functionName: 'allowance',
        args: userAddress && investConfig?.adapterAddress ? [userAddress, investConfig.adapterAddress] : undefined,
        chainId,
        query: {
            enabled: Boolean(isSupported && userAddress && investConfig?.vaultAddress && investConfig?.adapterAddress),
        },
    });

    const currentAllowance = allowanceData ?? 0n;
    const availableShares = sharesBalance ?? 0n;

    // Monitoramento da transação enviada
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        error: receiptError,
    } = useWaitForTransactionReceipt({
        hash: txHash,
        chainId,
    });

    const handleMaxClick = () => {
        setValidationError(null);
        setStatusError(null);
        if (!isSupported) {
            setAmountStr('0');
            setValidationError('Investimentos indisponíveis nesta rede.');
            return;
        }
        if (availableShares <= 0n) {
            setAmountStr('0');
            setValidationError('Você não possui cotas de sDAI para resgatar.');
            return;
        }
        setAmountStr(formatEther(availableShares));
    };

    const handleAmountChange = (val: string) => {
        if (/^[0-9]*\.?[0-9]*$/.test(val)) {
            setAmountStr(val);
            setValidationError(null);
            setStatusError(null);
        }
    };

    // Abre diálogo de confirmação após simular
    const handleOpenReview = async (e: FormEvent) => {
        e.preventDefault();
        setValidationError(null);
        setStatusError(null);

        if (!investConfig) {
            setValidationError('Investimentos indisponíveis nesta rede.');
            return;
        }

        let parsedShares: bigint;
        try {
            parsedShares = parseEther(amountStr);
        } catch {
            setValidationError('Informe uma quantidade válida de cotas.');
            return;
        }

        if (parsedShares <= 0n) {
            setValidationError('O valor de saque deve ser maior que zero.');
            return;
        }

        if (parsedShares > availableShares) {
            setValidationError(
                `Você possui apenas ${fmt(availableShares)} cotas disponíveis para resgate.`
            );
            return;
        }

        setIsSimulating(true);
        try {
            if (!publicClient) {
                throw new Error('Cliente RPC da rede não disponível.');
            }

            // Proteção: endereço com código on-chain (delegação EIP-7702 etc.)
            // executa código ao receber o pagamento do resgate e pode drenar o saldo.
            if (await addressHasCode(publicClient, userAddress)) {
                setValidationError(CONTRACT_CODE_WARNING);
                return;
            }

            // Se allowance for menor, simula o approve exato
            if (currentAllowance < parsedShares) {
                await publicClient.simulateContract({
                    address: investConfig.vaultAddress,
                    abi: sdaiVaultAbi,
                    functionName: 'approve',
                    args: [investConfig.adapterAddress, parsedShares],
                    account: userAddress,
                });
            } else {
                // Se já tiver allowance suficiente, simula o redeemXDAI direto no adapter
                await publicClient.simulateContract({
                    address: investConfig.adapterAddress,
                    abi: savingsXDaiAdapterAbi,
                    functionName: 'redeemXDAI',
                    args: [parsedShares, userAddress],
                    account: userAddress,
                });
            }

            setConfirmOpen(true);
        } catch (simErr) {
            setStatusError(`Falha na simulação prévia: ${formatErrorFriendly(simErr)}`);
        } finally {
            setIsSimulating(false);
        }
    };

    // Execução: aprovação pontual (se necessária) + resgate, em uma única ação.
    // O resgate só é enviado depois que a aprovação é confirmada na rede.
    const handleConfirmAction = async (password?: string) => {
        if (!investConfig) {
            setStatusError('Investimentos indisponíveis nesta rede.');
            return;
        }

        const parsedShares = parseEther(amountStr);
        setStatusError(null);
        setIsSigning(true);
        setStep('idle');
        setTxHash(undefined);

        try {
            if (!publicClient) {
                throw new Error('Cliente RPC da rede não disponível.');
            }

            // Etapa 1 (somente se necessário): approve exato, nunca ilimitado
            if (currentAllowance < parsedShares) {
                setStep('approving');

                let approveHash: Hash;
                if (isExternalWallet) {
                    approveHash = await writeContractAsync({
                        address: investConfig.vaultAddress,
                        abi: sdaiVaultAbi,
                        functionName: 'approve',
                        args: [investConfig.adapterAddress, parsedShares],
                        chainId,
                    });
                } else if (wallet && accountIndex !== undefined && password) {
                    const account = await unlockAccount(wallet, password, accountIndex);
                    const walletClient = createWalletClient({
                        account,
                        chain: currentChain,
                        transport: http(currentChain.rpcUrls.default.http[0]),
                    });

                    approveHash = await walletClient.writeContract({
                        address: investConfig.vaultAddress,
                        abi: sdaiVaultAbi,
                        functionName: 'approve',
                        args: [investConfig.adapterAddress, parsedShares],
                    });
                } else {
                    throw new Error('Nenhuma carteira disponível para autorizar a operação.');
                }

                // Aguarda a aprovação entrar na cadeia antes de resgatar
                await publicClient.waitForTransactionReceipt({
                    hash: approveHash,
                });

                // Atualiza a allowance exibida (não bloqueia o resgate)
                void refetchAllowance();
            }

            // Etapa 2: resgate das cotas (redeemXDAI)
            setStep('redeeming');

            let redeemHash: Hash;
            if (isExternalWallet) {
                redeemHash = await writeContractAsync({
                    address: investConfig.adapterAddress,
                    abi: savingsXDaiAdapterAbi,
                    functionName: 'redeemXDAI',
                    args: [parsedShares, userAddress],
                    chainId,
                });
            } else if (wallet && accountIndex !== undefined && password) {
                const account = await unlockAccount(wallet, password, accountIndex);
                const walletClient = createWalletClient({
                    account,
                    chain: currentChain,
                    transport: http(currentChain.rpcUrls.default.http[0]),
                });

                redeemHash = await walletClient.writeContract({
                    address: investConfig.adapterAddress,
                    abi: savingsXDaiAdapterAbi,
                    functionName: 'redeemXDAI',
                    args: [parsedShares, userAddress],
                });
            } else {
                throw new Error('Nenhuma carteira disponível para autorizar a operação.');
            }

            // A confirmação final é acompanhada pelo useWaitForTransactionReceipt
            setTxHash(redeemHash);
        } catch (err) {
            setStep('idle');
            setTxHash(undefined);
            setStatusError(formatErrorFriendly(err));
            throw err;
        } finally {
            setIsSigning(false);
        }
    };

    // Após a confirmação do resgate, limpa o formulário e atualiza a posição.
    // O clearTimeout evita disparos duplicados (ex.: StrictMode) e re-renderizes.
    useEffect(() => {
        if (!isConfirmed || step !== 'redeeming' || !txHash) {
            return;
        }

        const timer = setTimeout(() => {
            setStep('idle');
            setTxHash(undefined);
            setAmountStr('');
            onSuccess();
        }, 1000);

        return () => clearTimeout(timer);
    }, [isConfirmed, step, txHash, onSuccess]);

    const explorerBaseUrl = currentChain.blockExplorers?.default?.url || (chainId === 100 ? INVESTMENT_CONFIG.gnosisscanUrl : null);
    const explorerTxUrl = txHash && explorerBaseUrl
        ? `${explorerBaseUrl}/tx/${txHash}`
        : null;

    const parsedShares = amountStr ? ((): bigint => {
        try { return parseEther(amountStr); } catch { return 0n; }
    })() : 0n;

    const needsApproval = parsedShares > 0n && currentAllowance < parsedShares;

    return (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">
                Sacar do {INVESTMENT_CONFIG.displayName}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
                Resgate suas cotas de {INVESTMENT_CONFIG.shareSymbol} e receba xDAI nativo diretamente em sua carteira.
            </p>

            <form onSubmit={handleOpenReview} className="mt-5 space-y-4">
                {!isSupported && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 font-medium">
                        Investimentos indisponíveis nesta rede
                    </div>
                )}

                <div>
                    <div className="flex items-center justify-between text-xs">
                        <label htmlFor="withdraw-amount" className="flex items-center gap-1.5 font-medium text-gray-700">
                            <img
                                src={INVESTMENT_CONFIG.icon}
                                alt={INVESTMENT_CONFIG.shareSymbol}
                                className="h-4 w-4 rounded-full object-cover shrink-0"
                            />
                            <span>Quantidade de cotas ({INVESTMENT_CONFIG.shareSymbol})</span>
                        </label>
                        <span className="text-gray-500">
                            Disponível: <span className="font-mono font-medium text-gray-800" title={formatEther(availableShares)}>{fmt(availableShares)}</span> {INVESTMENT_CONFIG.shareSymbol}
                        </span>
                    </div>

                    <div className="relative mt-2">
                        <input
                            id="withdraw-amount"
                            type="text"
                            inputMode="decimal"
                            value={amountStr}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            placeholder="Ex: 0.8"
                            disabled={!isSupported || isSigning || isConfirming}
                            className="h-11 w-full rounded-xl border border-gray-200 px-4 pr-16 text-sm font-mono transition outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-50 disabled:bg-gray-50"
                        />
                        <button
                            type="button"
                            onClick={handleMaxClick}
                            disabled={!isSupported || isSigning || isConfirming}
                            className="absolute right-2.5 top-2 h-7 rounded-lg bg-gray-100 px-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition disabled:opacity-50"
                        >
                            Máx
                        </button>
                    </div>

                    {needsApproval && (
                        <p className="mt-1.5 text-[11px] text-blue-600 font-medium">
                            * A operação inclui automaticamente uma aprovação pontual de exatamente {fmt(parsedShares)} cotas para o Adapter antes do resgate.
                        </p>
                    )}

                    {validationError && (
                        <p className="mt-2 text-xs text-red-600 font-medium">
                            {validationError}
                        </p>
                    )}
                </div>

                {statusError && (
                    <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
                        <XCircle size={16} className="shrink-0 mt-0.5" />
                        <div>{statusError}</div>
                    </div>
                )}

                {receiptError && (
                    <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
                        <XCircle size={16} className="shrink-0 mt-0.5" />
                        <div>Falha na confirmação: {formatErrorFriendly(receiptError)}</div>
                    </div>
                )}

                {/* Feedback de Estados */}
                {isSigning && (
                    <div className="flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-xs text-blue-700">
                        <Loader2 size={16} className="animate-spin shrink-0" />
                        <span>
                            {step === 'approving'
                                ? 'Aprovando cotas e aguardando a confirmação na rede...'
                                : 'Assinando resgate (redeemXDAI) com a chave da carteira...'}
                        </span>
                    </div>
                )}

                {isConfirming && txHash && (
                    <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 space-y-1">
                        <div className="flex items-center gap-2 font-medium">
                            <Loader2 size={15} className="animate-spin shrink-0" />
                            <span>
                                {step === 'approving'
                                    ? 'Aprovação enviada! Aguardando confirmação na rede...'
                                    : 'Resgate enviado! Aguardando confirmação na rede...'}
                            </span>
                        </div>
                        {explorerTxUrl && (
                            <a
                                href={explorerTxUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 hover:underline pt-1"
                            >
                                Ver no explorador: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                                <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                )}

                {isConfirmed && txHash && (
                    <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 space-y-1">
                        <div className="flex items-center gap-2 font-medium">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                            <span>
                                {step === 'approving'
                                    ? 'Aprovação de cotas confirmada! Prossiga com o resgate das cotas.'
                                    : `Saque realizado com sucesso na ${currentChain.name}! O xDAI nativo foi creditado na sua carteira.`}
                            </span>
                        </div>
                        {explorerTxUrl && (
                            <a
                                href={explorerTxUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 hover:underline pt-1"
                            >
                                Ver no explorador
                                <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!isSupported || isSigning || isConfirming || isSimulating || !amountStr || amountStr === '0'}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#1a73e8] text-sm font-medium text-white transition hover:bg-[#1765cc] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {!isSupported ? (
                        'Investimentos indisponíveis nesta rede'
                    ) : isSimulating ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Simulando transação...
                        </>
                    ) : isSigning ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Assinando...
                        </>
                    ) : isConfirming ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Confirmando na rede...
                        </>
                    ) : needsApproval ? (
                        'Aprovar e Sacar'
                    ) : (
                        'Revisar e Sacar'
                    )}
                </button>
            </form>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmAction}
                title={needsApproval ? 'Aprovar e Sacar' : 'Confirmar Saque'}
                actionLabel="Assinar e Sacar"
                amountDisplay={`${fmt(parsedShares)} ${INVESTMENT_CONFIG.shareSymbol}`}
                targetContractAddress={investConfig?.adapterAddress ?? ''}
                targetContractName={
                    needsApproval
                        ? '1) Vault sDAI (approve exato) → 2) SavingsXDaiAdapter (redeemXDAI)'
                        : 'SavingsXDaiAdapter (redeemXDAI)'
                }
                warningMessage={
                    needsApproval
                        ? 'A operação executa em sequência: (1) aprovação pontual do valor exato e (2) resgate das cotas. Nenhuma permissão ilimitada é concedida.'
                        : undefined
                }
                requiresPassword={!isExternalWallet && Boolean(wallet)}
            />
        </div>
    );
}
