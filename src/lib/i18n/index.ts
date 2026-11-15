import i18n from 'i18next';
import { useEffect } from 'react';
import { initReactI18next } from 'react-i18next';

import type { Messages } from './locales/en';
import { ar } from './locales/ar';
import { arz } from './locales/arz';
import { bn } from './locales/bn';
import { de } from './locales/de';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { hi } from './locales/hi';
import { id as indonesian } from './locales/id';
import { it as italian } from './locales/it';
import { ja } from './locales/ja';
import { mr } from './locales/mr';
import { pcm } from './locales/pcm';
import { ptBR } from './locales/pt-br';
import { ru } from './locales/ru';
import { te } from './locales/te';
import { ur } from './locales/ur';
import { vi } from './locales/vi';
import { zhCN } from './locales/zh-cn';
import { zhTW } from './locales/zh-tw';

export type { Messages };

export const LOCALES = [
    'pt-BR',
    'en',
    'es',
    'it',
    'zh-TW',
    'zh-CN',
    'hi',
    'ar',
    'fr',
    'bn',
    'id',
    'ur',
    'ru',
    'de',
    'ja',
    'pcm',
    'arz',
    'mr',
    'vi',
    'te',
] as const;

export type Locale = (typeof LOCALES)[number];

export const RTL_LOCALES = new Set<Locale>(['ar', 'arz', 'ur']);

export function isRtlLocale(locale: string): boolean {
    return RTL_LOCALES.has(locale as Locale);
}

export const LOCALE_LABELS: Record<Locale, string> = {
    'pt-BR': 'Português (BR)',
    en: 'English',
    es: 'Español',
    it: 'Italiano',
    'zh-TW': '繁體中文',
    'zh-CN': '简体中文',
    hi: 'हिन्दी',
    ar: 'العربية',
    fr: 'Français',
    bn: 'বাংলা',
    id: 'Bahasa Indonesia',
    ur: 'اردو',
    ru: 'Русский',
    de: 'Deutsch',
    ja: '日本語',
    pcm: 'Naijá',
    arz: 'عربي مصري',
    mr: 'मराठी',
    vi: 'Tiếng Việt',
    te: 'తెలుగు',
};

export const DEFAULT_LOCALE: Locale = 'pt-BR';

const STORAGE_KEY = 'laza.locale';

const BASE_TO_LOCALE: Record<string, Locale> = {
    pt: 'pt-BR',
    en: 'en',
    es: 'es',
    it: 'it',
    zh: 'zh-CN',
    hi: 'hi',
    ar: 'ar',
    fr: 'fr',
    bn: 'bn',
    id: 'id',
    ur: 'ur',
    ru: 'ru',
    de: 'de',
    ja: 'ja',
    pcm: 'pcm',
    arz: 'arz',
    mr: 'mr',
    vi: 'vi',
    te: 'te',
};

export function applyDocumentLocale(locale: string): void {
    if (typeof document === 'undefined') {
        return;
    }
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtlLocale(locale) ? 'rtl' : 'ltr';
}

export function resolveLocale(candidate: string): Locale | null {
    if (!candidate) {
        return null;
    }
    const lower = candidate.toLowerCase().trim();
    const exact = LOCALES.find((locale) => locale.toLowerCase() === lower);

    if (exact) {
        return exact;
    }

    if (lower === 'zh-hk' || lower === 'zh-tw' || lower.startsWith('zh-hant')) {
        return 'zh-TW';
    }
    if (lower === 'zh-cn' || lower === 'zh-sg' || lower.startsWith('zh-hans')) {
        return 'zh-CN';
    }
    if (lower === 'ar-eg' || lower === 'arz') {
        return 'arz';
    }

    const base = lower.split('-')[0];

    return base ? (BASE_TO_LOCALE[base] ?? null) : null;
}

export function detectLocale(): Locale | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    const storedLocale = stored ? resolveLocale(stored) : null;

    if (storedLocale) {
        return storedLocale;
    }

    const candidates = navigator.languages?.length
        ? navigator.languages
        : [navigator.language].filter(Boolean);

    for (const candidate of candidates) {
        if (!candidate) continue;
        const locale = resolveLocale(candidate);

        if (locale) {
            return locale;
        }
    }

    return null;
}

const initialLocale = (typeof window !== 'undefined' ? detectLocale() : null) ?? DEFAULT_LOCALE;

void i18n.use(initReactI18next).init({
    resources: {
        'pt-BR': { translation: ptBR },
        en: { translation: en },
        es: { translation: es },
        it: { translation: italian },
        'zh-TW': { translation: zhTW },
        'zh-CN': { translation: zhCN },
        hi: { translation: hi },
        ar: { translation: ar },
        fr: { translation: fr },
        bn: { translation: bn },
        id: { translation: indonesian },
        ur: { translation: ur },
        ru: { translation: ru },
        de: { translation: de },
        ja: { translation: ja },
        pcm: { translation: pcm },
        arz: { translation: arz },
        mr: { translation: mr },
        vi: { translation: vi },
        te: { translation: te },
    },
    lng: initialLocale,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false,
});

applyDocumentLocale(i18n.language || initialLocale);
i18n.on('languageChanged', (lng) => {
    applyDocumentLocale(lng);
});

declare module 'i18next' {
    interface CustomTypeOptions {
        resources: { translation: Messages };
        returnNull: false;
    }
}

export function changeLocale(locale: Locale): void {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, locale);
    }
    void i18n.changeLanguage(locale);
    applyDocumentLocale(locale);
}

/**
 * Applies the stored/browser preference after mount so the server and the first
 * client render stay deterministic (no hydration mismatch).
 */
export function useLocaleSync(): void {
    useEffect(() => {
        const detected = detectLocale();

        if (detected && detected !== i18n.language) {
            void i18n.changeLanguage(detected);
            applyDocumentLocale(detected);
        } else {
            applyDocumentLocale(i18n.language);
        }
    }, []);
}

export { i18n };
