import { Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';
import { Link, useLocation } from 'wouter';

import { LanguageSwitcher } from '@/components/language-switcher';
import { cn } from '@/lib/utils';
import { shortenAddress } from '@/lib/wallet';

type WalletHeaderProps = {
    chainName: string;
    isTestnet: boolean;
    address?: Address;
    onOpenAccounts: () => void;
};

export function WalletHeader({
    chainName,
    isTestnet,
    address,
    onOpenAccounts,
}: WalletHeaderProps) {
    const { t } = useTranslation();
    const [location] = useLocation();

    const navLinkClass = (active: boolean) =>
        cn(
            'inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-sm font-medium transition-colors motion-reduce:transition-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] focus-visible:ring-offset-2',
            active
                ? 'bg-gray-100 font-semibold text-gray-900'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
        );

    return (
        <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-2 px-5 py-3 md:px-10">
                {/* Marca — apenas o logo em telas pequenas */}
                <Link
                    href="/"
                    aria-label={t('brand.name')}
                    title={t('brand.name')}
                    className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] focus-visible:ring-offset-2"
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#202124] text-white">
                        <Wallet size={19} aria-hidden="true" />
                    </span>
                    <span className="hidden truncate text-lg font-semibold tracking-tight md:inline">
                        {t('brand.name')}
                    </span>
                </Link>

                {/* Navegação — vira segunda linha com scroll no mobile */}
                <nav
                    aria-label="Navegação principal"
                    className="order-3 -mx-1 flex w-full items-center gap-1 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:order-none sm:mx-0 sm:w-auto sm:flex-1 sm:justify-center sm:px-0 sm:pb-0"
                >
                    <Link
                        href="/"
                        aria-current={location === '/' ? 'page' : undefined}
                        className={navLinkClass(location === '/')}
                    >
                        Carteira
                    </Link>
                    {/* Sem carteira local habilitada não existe aba de investimentos */}
                    {address && (
                        <Link
                            href="/investments"
                            aria-current={location.startsWith('/invest') ? 'page' : undefined}
                            className={navLinkClass(location.startsWith('/invest'))}
                        >
                            Investimentos
                        </Link>
                    )}
                </nav>

                {/* Ações à direita */}
                <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
                    {/* Pill da rede — sempre visível, com truncamento */}
                    <div
                        className="flex min-w-0 items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-sm text-gray-600 ring-1 ring-inset ring-gray-100"
                        title={chainName}
                    >
                        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                        <span className="max-w-32 truncate font-medium sm:max-w-48">
                            {chainName}
                        </span>
                        {isTestnet && (
                            <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600">
                                {t('testnet')}
                            </span>
                        )}
                    </div>

                    <div className="shrink-0">
                        <LanguageSwitcher compact />
                    </div>

                    {address && (
                        <button
                            type="button"
                            onClick={onOpenAccounts}
                            title={address}
                            className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-3 text-sm font-medium transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] focus-visible:ring-offset-2 sm:px-4"
                        >
                            <Wallet size={15} aria-hidden="true" />
                            <span className="max-w-28 truncate font-mono">
                                {shortenAddress(address)}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
