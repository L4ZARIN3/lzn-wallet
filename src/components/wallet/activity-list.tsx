import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
    explorerTransactionUrl,
    formatTimestamp,
    formatTokenAmount,
    shortenAddress,
    type WalletTransfer,
} from '@/lib/wallet';

type ActivityListProps = {
    transfers: WalletTransfer[];
    loading: boolean;
    error: boolean;
    windowDays: number | null;
};

export function ActivityList({
    transfers,
    loading,
    error,
    windowDays,
}: ActivityListProps) {
    const { t, i18n } = useTranslation();

    return (
        <section className="mt-12 border-t border-gray-100 pt-8">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t('activity.title')}</h2>
                <span className="text-sm text-gray-400">
                    {t('activity.window', { days: windowDays ?? '—' })}
                </span>
            </div>

            {loading && (
                <p className="text-sm text-gray-400">{t('activity.loading')}</p>
            )}

            {error && (
                <p
                    role="alert"
                    className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                    {t('activity.error')}
                </p>
            )}

            {!loading && !error && transfers.length === 0 && (
                <p className="text-sm text-gray-400">{t('activity.empty')}</p>
            )}

            {transfers.length > 0 && (
                <div className="divide-y divide-gray-100">
                    {transfers.map((tx) => {
                        const txUrl = explorerTransactionUrl(tx.hash);
                        const received = tx.direction === 'received';

                        return (
                            <div
                                key={`${tx.hash}-${tx.counterparty}`}
                                className="flex items-center justify-between py-5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                        {received ? (
                                            <ArrowDownLeft
                                                size={19}
                                                className="text-emerald-600"
                                            />
                                        ) : (
                                            <ArrowUpRight
                                                size={19}
                                                className="text-gray-600"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {t(
                                                received
                                                    ? 'activity.received'
                                                    : 'activity.sent',
                                                { symbol: tx.symbol },
                                            )}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-400">
                                            {formatTimestamp(
                                                tx.timestamp,
                                                i18n.language,
                                            )}{' '}
                                            ·{' '}
                                            {t(
                                                received
                                                    ? 'activity.from'
                                                    : 'activity.to',
                                            )}{' '}
                                            {shortenAddress(tx.counterparty)}
                                            {txUrl && (
                                                <>
                                                    {' '}
                                                    ·{' '}
                                                    <a
                                                        href={txUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[#1a73e8] hover:underline"
                                                    >
                                                        {t('activity.view')}
                                                    </a>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`text-sm font-medium tabular-nums ${received ? 'text-emerald-600' : 'text-gray-700'}`}
                                >
                                    {received ? '+ ' : '- '}
                                    {formatTokenAmount(
                                        tx.amount,
                                        tx.decimals,
                                    )}{' '}
                                    {tx.symbol}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
