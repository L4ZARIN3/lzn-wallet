import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePublicClient } from 'wagmi';

import { AccountsDialog } from '@/components/wallet/accounts-dialog';
import { ActivityList } from '@/components/wallet/activity-list';
import { AddressCard } from '@/components/wallet/address-card';
import { AssetsList } from '@/components/wallet/assets-list';
import { EmptyWallet } from '@/components/wallet/empty-wallet';
import { PortfolioSummary } from '@/components/wallet/portfolio-summary';
import { ReceiveDialog } from '@/components/wallet/receive-dialog';
import { RemoveWalletDialog } from '@/components/wallet/remove-wallet-dialog';
import {
    SendDialog,
    type SendRequest,
} from '@/components/wallet/send-dialog';
import { WalletHeader } from '@/components/wallet/wallet-header';
import { discoverAccounts } from '@/lib/discovery';
import { unlockWallet } from '@/lib/keystore';
import { useWallet } from '@/lib/use-wallet';
import { activeChain } from '@/lib/wagmi';
import {
    activityWindowDays,
    explorerAddressUrl,
    nativeToken,
    portfolioChange24h,
    portfolioTotal,
    toPortfolioRows,
    useAssetHoldings,
    useNativeTransferFee,
    useRecentTransfers,
    useSendNative,
    useTokenPrices,
} from '@/lib/wallet';

export default function Home() {
    const { t } = useTranslation();
    const {
        ready,
        wallet,
        accounts,
        activeIndex,
        activeAddress,
        switchAccount,
        addAccount,
        addAccountByIndex,
        addAccountByAddress,
        importDiscovered,
        removeWallet,
    } = useWallet();

    const [receiveOpen, setReceiveOpen] = useState(false);
    const [sendOpen, setSendOpen] = useState(false);
    const [accountsOpen, setAccountsOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const publicClient = usePublicClient({ chainId: activeChain.id });

    const {
        data: priceData,
        isPending: pricesPending,
        isError: pricesError,
        refetch: refetchPrices,
    } = useTokenPrices();
    const {
        assets,
        isLoading,
        isError,
        refetch: refetchAssets,
    } = useAssetHoldings(activeAddress);
    const {
        data: transfersData,
        isPending: transfersPending,
        isError: transfersError,
        refetch: refetchTransfers,
    } = useRecentTransfers(activeAddress);
    const send = useSendNative();
    const nativeFee = useNativeTransferFee();

    const nativeBalance = assets.find((asset) => !asset.address)?.balance ?? 0n;

    const rows = useMemo(
        () => toPortfolioRows(assets, priceData),
        [assets, priceData],
    );
    const total = portfolioTotal(rows);
    const change = portfolioChange24h(rows, total);

    const refresh = useCallback(async () => {
        setRefreshing(true);

        try {
            // allSettled: uma falha isolada (cotação, RPC ou histórico) não
            // impede as demais consultas. O teto de 15s garante que o botão
            // de atualizar NUNCA fique preso, mesmo se alguma promise não
            // resolver (as consultas continuam em segundo plano).
            await Promise.race([
                Promise.allSettled([
                    refetchAssets(),
                    refetchPrices(),
                    refetchTransfers(),
                ]),
                new Promise<void>((resolve) => setTimeout(resolve, 15_000)),
            ]);
        } finally {
            setRefreshing(false);
        }
    }, [refetchAssets, refetchPrices, refetchTransfers]);

    const handleSend = useCallback(
        async ({ to, amount, password }: SendRequest) => {
            if (!wallet || !activeAddress) {
                throw new Error('no-wallet');
            }

            const hash = await send.mutateAsync({
                wallet,
                accountIndex: activeIndex,
                to,
                amount,
                password,
            });

            void refresh();

            return hash;
        },
        [send, wallet, activeAddress, activeIndex, refresh],
    );

    const isTestnet = Boolean(activeChain.testnet);

    return (
        <div className="min-h-screen bg-white text-[#202124]">
            <WalletHeader
                chainName={activeChain.name}
                isTestnet={isTestnet}
                address={activeAddress}
                onOpenAccounts={() => setAccountsOpen(true)}
            />

            <main className="fade-in-page mx-auto max-w-5xl px-5 py-12 md:px-10">
                {ready && !wallet && (
                    <EmptyWallet chainName={activeChain.name} />
                )}

                {ready && wallet && activeAddress && (
                    <>
                        <PortfolioSummary
                            total={total}
                            change={change}
                            placeholder={(pricesPending || pricesError) && rows.length === 0}
                            explorerUrl={explorerAddressUrl(activeAddress)}
                            refreshing={refreshing}
                            onRefresh={() => void refresh()}
                            onSend={() => setSendOpen(true)}
                            onReceive={() => setReceiveOpen(true)}
                        />

                        <AssetsList
                            rows={rows}
                            loading={isLoading}
                            error={isError}
                            chainName={activeChain.name}
                            isTestnet={isTestnet}
                        />

                        <ActivityList
                            transfers={transfersData ?? []}
                            loading={transfersPending}
                            error={transfersError}
                            windowDays={activityWindowDays()}
                        />

                        <AddressCard
                            address={activeAddress}
                            explorerUrl={explorerAddressUrl(activeAddress)}
                            onRemove={() => setRemoveOpen(true)}
                        />
                    </>
                )}
            </main>

            <footer className="mt-16 border-t border-gray-100 py-6 text-center text-xs text-gray-400">
                {t('brand.tagline')}
            </footer>

            {activeAddress && (
                <ReceiveDialog
                    open={receiveOpen}
                    onClose={() => setReceiveOpen(false)}
                    address={activeAddress}
                    chainName={activeChain.name}
                />
            )}

            {activeAddress && (
                <SendDialog
                    open={sendOpen}
                    onClose={() => setSendOpen(false)}
                    onSend={handleSend}
                    balance={nativeBalance}
                    fee={nativeFee}
                    symbol={nativeToken.symbol}
                    decimals={nativeToken.decimals}
                    chainName={activeChain.name}
                    icon={nativeToken.icon}
                />
            )}

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
                    onAddManual={async (password, target) => {
                        const trimmed = target.trim();
                        const cleaned = trimmed.replace(
                            /^(account|conta|#)\s*/i,
                            '',
                        );
                        if (/^\d+$/.test(cleaned)) {
                            const num = parseInt(cleaned, 10);
                            let index = 0;
                            if (num === 0) {
                                index = 0;
                            } else if (num >= 1 && num <= 100) {
                                index = num - 1;
                            } else {
                                throw new Error('invalid-index');
                            }
                            return addAccountByIndex(password, index);
                        }
                        return addAccountByAddress(password, trimmed);
                    }}
                    onScan={async (password) => {
                        if (!wallet) return 0;
                        const words = await unlockWallet(wallet, password);
                        const discovered = await discoverAccounts({
                            words,
                            client: publicClient,
                            minCount: accounts.length,
                        });
                        if (discovered.length > accounts.length) {
                            const prevCount = accounts.length;
                            const newTotal = await importDiscovered(
                                password,
                                discovered.length,
                            );
                            return Math.max(0, newTotal - prevCount);
                        }
                        return 0;
                    }}
                />
            )}

            <RemoveWalletDialog
                open={removeOpen}
                onClose={() => setRemoveOpen(false)}
                onConfirm={() => {
                    removeWallet();
                    setRemoveOpen(false);
                }}
            />
        </div>
    );
}
