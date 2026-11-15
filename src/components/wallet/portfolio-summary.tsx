import { ArrowDownLeft, ArrowUpRight, ExternalLink, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { formatUsd } from '@/lib/wallet';

type PortfolioSummaryProps = {
    total: number;
    change: { percent: number; value: number } | null;
    /** `true` enquanto não há cotação algum para exibir. */
    placeholder: boolean;
    explorerUrl?: string;
    refreshing: boolean;
    onRefresh: () => void;
    onSend: () => void;
    onReceive: () => void;
};

export function PortfolioSummary({
    total,
    change,
    placeholder,
    explorerUrl,
    refreshing,
    onRefresh,
    onSend,
    onReceive,
}: PortfolioSummaryProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
                <p className="mb-3 text-sm text-gray-500">
                    {t('portfolio.total')}
                </p>
                <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                    {placeholder ? '—' : formatUsd(total)}
                </h1>
                <div className="mt-4 flex items-center gap-2 text-sm">
                    {change ? (
                        <>
                            <span
                                className={
                                    change.percent >= 0
                                        ? 'font-medium text-emerald-600'
                                        : 'font-medium text-red-500'
                                }
                            >
                                {change.percent >= 0 ? '+' : '−'}
                                {formatUsd(Math.abs(change.value))} (
                                {Math.abs(change.percent).toFixed(2)}%)
                            </span>
                            <span className="text-gray-400">
                                {t('portfolio.past24h')}
                            </span>
                        </>
                    ) : (
                        <span className="text-gray-400">
                            {t('portfolio.noData')}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={onSend}
                    className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-medium transition hover:bg-gray-50"
                >
                    <ArrowUpRight size={17} />
                    {t('send.title')}
                </button>

                <button
                    type="button"
                    onClick={onReceive}
                    className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-medium transition hover:bg-gray-50"
                >
                    <ArrowDownLeft size={17} />
                    {t('receive.title')}
                </button>

                {explorerUrl && (
                    <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-medium transition hover:bg-gray-50"
                    >
                        <ExternalLink size={17} />
                        {t('explorer')}
                    </a>
                )}

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw
                        size={17}
                        className={refreshing ? 'animate-spin' : ''}
                    />
                    {t('refresh')}
                </button>
            </div>
        </div>
    );
}
