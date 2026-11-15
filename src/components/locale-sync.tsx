import { useLocaleSync } from '@/lib/i18n';

/**
 * Aplica o idioma salvo/navegador depois da montagem, mantendo o SSR e a
 * primeira renderização do cliente determinísticos.
 */
export function LocaleSync() {
    useLocaleSync();

    return null;
}
