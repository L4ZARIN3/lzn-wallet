import { Check, ChevronDown, Languages } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    changeLocale,
    DEFAULT_LOCALE,
    LOCALE_LABELS,
    LOCALES,
    resolveLocale,
    type Locale,
} from '@/lib/i18n';
import { cn } from '@/lib/utils';

function currentLocale(language: string): Locale {
    return resolveLocale(language) ?? DEFAULT_LOCALE;
}

type LanguageSwitcherProps = {
    /** Modo compacto: oculta o rótulo do idioma em telas pequenas (mantém ícone). */
    compact?: boolean;
};

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
    const { i18n, t } = useTranslation();
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const value = currentLocale(i18n.language);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    const select = (locale: Locale) => {
        changeLocale(locale);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((previous) => !previous)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={t('language.label')}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
            >
                <Languages size={16} />
                <span
                    className={cn(
                        'whitespace-nowrap',
                        compact && 'hidden sm:inline',
                    )}
                >
                    {LOCALE_LABELS[value]}
                </span>
                <ChevronDown
                    size={14}
                    className={cn(
                        'text-gray-400 transition-transform',
                        open && 'rotate-180',
                    )}
                />
            </button>

            {open && (
                <div
                    role="listbox"
                    aria-label={t('language.label')}
                    className="absolute end-0 z-50 mt-2 flex max-h-80 w-56 flex-col overflow-y-auto rounded-2xl border border-gray-100 bg-white p-1 shadow-xl"
                >
                    {LOCALES.map((locale) => {
                        const isActive = locale === value;

                        return (
                            <button
                                key={locale}
                                type="button"
                                role="option"
                                aria-selected={isActive}
                                onClick={() => select(locale)}
                                className={cn(
                                    'flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-start text-sm transition hover:bg-gray-50',
                                    isActive
                                        ? 'font-medium text-[#202124]'
                                        : 'text-gray-700',
                                )}
                            >
                                <span className="truncate">
                                    {LOCALE_LABELS[locale]}
                                </span>
                                {isActive && (
                                    <Check
                                        size={16}
                                        className="shrink-0 text-[#1a73e8]"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
