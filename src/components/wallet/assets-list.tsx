import { Trans, useTranslation } from 'react-i18next';

import { fmt } from '@/utils/format';
import { cn } from '@/lib/utils';
import { formatTokenAmount, formatUsd, type PortfolioRow } from '@/lib/wallet';

const CHIADO_FAUCET_URL = 'https://faucet.chiadochain.net';

type AssetsListProps = {
    rows: PortfolioRow[];
    loading: boolean;
    error: boolean;
    chainName: string;
    isTestnet: boolean;
};

function AssetsSkeleton() {
    return (
        <div className="divide-y divide-gray-100">
            {[0, 1].map((index) => (
                <div
                    key={index}
                    className="flex items-center justify-between py-5"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-11 w-11 animate-pulse rounded-full bg-gray-100" />
                        <div className="space-y-2">
                            <div className="h-3.5 w-28 animate-pulse rounded bg-gray-100" />
                            <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                        </div>
                    </div>
                    <div className="h-3.5 w-20 animate-pulse rounded bg-gray-100" />
                </div>
            ))}
        </div>
    );
}

export function AssetsList({
    rows,
    loading,
    error,
    chainName,
    isTestnet,
}: AssetsListProps) {
    const { t } = useTranslation();

    return (
        <section className="mt-12 border-t border-gray-100 pt-8">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t('assets.title')}</h2>
                <span className="text-sm text-gray-400">{chainName}</span>
            </div>

            {error && (
                <p
                    role="alert"
                    className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                    {t('assets.error')}
                </p>
            )}

            {!error && loading && rows.length === 0 && <AssetsSkeleton />}

            {!error && !loading && rows.length === 0 && (
                <p className="text-sm text-gray-400">
                    {t('assets.empty')}
                    {isTestnet && (
                        <>
                            {' '}
                            <Trans
                                i18nKey="assets.faucet"
                                components={{
                                    link: (
                                        <a
                                            href={CHIADO_FAUCET_URL}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[#1a73e8] hover:underline"
                                        />
                                    ),
                                }}
                            />
                        </>
                    )}
                </p>
            )}

            {rows.length > 0 && (
                <div className="divide-y divide-gray-100">
                    {rows.map((asset) => (
                        <div
                            key={asset.symbol}
                            className="-mx-3 flex items-center justify-between rounded-xl px-3 py-5 transition hover:bg-gray-50/70"
                        >
                            <div className="flex items-center gap-4">
                                {asset.icon ? (
                                    <img
                                        src={asset.icon}
                                        alt=""
                                        className="h-11 w-11 shrink-0 rounded-full"
                                    />
                                ) : (
                                    <div
                                        className={cn(
                                            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-semibold',
                                            asset.badgeClassName,
                                        )}
                                    >
                                        {asset.badge}
                                    </div>
                                )}
                                <div>
                                    <p className="text-[15px] font-medium">
                                        {asset.name}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-400">
                                        {asset.symbol} · {chainName}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right tabular-nums">
                                <p
                                    className="text-[15px] font-medium"
                                    title={formatTokenAmount(
                                        asset.balance,
                                        asset.decimals,
                                    )}
                                >
                                    {fmt(asset.balance, 4, asset.decimals)}{' '}
                                    {asset.symbol}
                                </p>
                                <p className="mt-1 text-sm text-gray-400">
                                    {asset.value === null
                                        ? '—'
                                        : formatUsd(asset.value)}
                                    {asset.price !== null && (
                                        <span className="ml-1 text-gray-300">
                                            @{formatUsd(asset.price)}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
