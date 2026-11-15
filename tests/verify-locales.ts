import assert from 'node:assert';
import { en } from '@/lib/i18n/locales/en';
import { ar } from '@/lib/i18n/locales/ar';
import { arz } from '@/lib/i18n/locales/arz';
import { bn } from '@/lib/i18n/locales/bn';
import { de } from '@/lib/i18n/locales/de';
import { es } from '@/lib/i18n/locales/es';
import { fr } from '@/lib/i18n/locales/fr';
import { hi } from '@/lib/i18n/locales/hi';
import { id } from '@/lib/i18n/locales/id';
import { it } from '@/lib/i18n/locales/it';
import { ja } from '@/lib/i18n/locales/ja';
import { mr } from '@/lib/i18n/locales/mr';
import { pcm } from '@/lib/i18n/locales/pcm';
import { ptBR } from '@/lib/i18n/locales/pt-br';
import { ru } from '@/lib/i18n/locales/ru';
import { te } from '@/lib/i18n/locales/te';
import { ur } from '@/lib/i18n/locales/ur';
import { vi } from '@/lib/i18n/locales/vi';
import { zhCN } from '@/lib/i18n/locales/zh-cn';
import { zhTW } from '@/lib/i18n/locales/zh-tw';
import {
    LOCALES,
    LOCALE_LABELS,
    changeLocale,
    detectLocale,
    i18n,
    isRtlLocale,
    resolveLocale,
} from '@/lib/i18n';

console.log('--- Starting i18n Verification Tests ---');

const requestedLocales = [
    'zh-CN', // Chinês Mandarim
    'hi',    // Hindi
    'ar',    // Árabe Padrão Moderno
    'fr',    // Francês
    'bn',    // Bengali
    'id',    // Indonésio
    'ur',    // Urdu
    'ru',    // Russo
    'de',    // Alemão Padrão
    'ja',    // Japonês
    'pcm',   // Pidgin Nigeriano
    'arz',   // Árabe Egípcio
    'mr',    // Marata (Marathi)
    'vi',    // Vietnamita
    'te',    // Telugo (Telugu)
];

const localeObjects: Record<string, typeof en> = {
    'pt-BR': ptBR,
    en,
    es,
    it,
    'zh-TW': zhTW,
    'zh-CN': zhCN,
    hi,
    ar,
    fr,
    bn,
    id,
    ur,
    ru,
    de,
    ja,
    pcm,
    arz,
    mr,
    vi,
    te,
};

// 1. Check all requested locales are registered in LOCALES
for (const req of requestedLocales) {
    assert(
        (LOCALES as readonly string[]).includes(req),
        `Requested locale ${req} must be in LOCALES`
    );
    assert(
        typeof LOCALE_LABELS[req as keyof typeof LOCALE_LABELS] === 'string' &&
            LOCALE_LABELS[req as keyof typeof LOCALE_LABELS].length > 0,
        `LOCALE_LABELS must have non-empty label for ${req}`
    );
}

// 2. Validate recursive keys and placeholder tokens match en
function extractPlaceholders(str: string): string[] {
    const matches = str.match(/\{\{([^}]+)\}\}/g);
    return matches ? matches.sort() : [];
}

function compareObjects(
    base: Record<string, unknown>,
    target: Record<string, unknown>,
    loc: string,
    currentPath: string = ''
) {
    for (const key of Object.keys(base)) {
        const fullPath = currentPath ? `${currentPath}.${key}` : key;
        assert(
            key in target,
            `[${loc}] Missing key: ${fullPath}`
        );

        const baseVal = base[key];
        const targetVal = target[key];

        if (typeof baseVal === 'string') {
            assert(
                typeof targetVal === 'string' && targetVal.trim().length > 0,
                `[${loc}] Key ${fullPath} must be a non-empty string`
            );

            // Check interpolation variables
            const basePlaceholders = extractPlaceholders(baseVal);
            const targetPlaceholders = extractPlaceholders(targetVal);
            assert.deepStrictEqual(
                targetPlaceholders,
                basePlaceholders,
                `[${loc}] Placeholder mismatch at ${fullPath}: expected ${JSON.stringify(
                    basePlaceholders
                )}, got ${JSON.stringify(targetPlaceholders)}`
            );

            // Check <link> tags
            if (baseVal.includes('<link>')) {
                assert(
                    targetVal.includes('<link>') && targetVal.includes('</link>'),
                    `[${loc}] Missing <link> tags at ${fullPath}`
                );
            }
        } else if (typeof baseVal === 'object' && baseVal !== null) {
            assert(
                typeof targetVal === 'object' && targetVal !== null,
                `[${loc}] Key ${fullPath} must be an object`
            );
            compareObjects(
                baseVal as Record<string, unknown>,
                targetVal as Record<string, unknown>,
                loc,
                fullPath
            );
        }
    }
}

for (const [loc, obj] of Object.entries(localeObjects)) {
    compareObjects(en as unknown as Record<string, unknown>, obj as unknown as Record<string, unknown>, loc);
}
console.log('✓ All 20 locales have complete keys and matching interpolation tokens.');

// 3. Test i18n instance language switching and resolution
for (const loc of LOCALES) {
    changeLocale(loc);
    assert.strictEqual(i18n.language, loc, `i18n.language should be ${loc}`);
    const brandName = i18n.t('brand.name');
    assert(brandName && brandName.length > 0, `brand.name should not be empty in ${loc}`);
    const foundMsg = i18n.t('recover.step3.found', { count: 5 });
    assert(foundMsg.includes('5'), `recover.step3.found should interpolate count in ${loc}`);

    // Verify document direction and lang
    const expectedDir = (loc === 'ar' || loc === 'arz' || loc === 'ur') ? 'rtl' : 'ltr';
    assert.strictEqual(
        document.documentElement.dir,
        expectedDir,
        `document.documentElement.dir for ${loc} should be ${expectedDir}`
    );
    assert.strictEqual(
        document.documentElement.lang,
        loc,
        `document.documentElement.lang for ${loc} should be ${loc}`
    );
}
console.log('✓ i18n changes language and resolves keys across all 20 locales.');

// 4. Test RTL helper
assert.strictEqual(isRtlLocale('ar'), true);
assert.strictEqual(isRtlLocale('arz'), true);
assert.strictEqual(isRtlLocale('ur'), true);
assert.strictEqual(isRtlLocale('en'), false);
assert.strictEqual(isRtlLocale('pt-BR'), false);
assert.strictEqual(isRtlLocale('zh-CN'), false);
console.log('✓ RTL detection accurately identifies Arabic and Urdu.');

// 5. Test resolveLocale rules
assert.strictEqual(resolveLocale('zh-CN'), 'zh-CN');
assert.strictEqual(resolveLocale('zh-hans'), 'zh-CN');
assert.strictEqual(resolveLocale('zh-Hans-CN'), 'zh-CN');
assert.strictEqual(resolveLocale('zh-sg'), 'zh-CN');
assert.strictEqual(resolveLocale('zh-TW'), 'zh-TW');
assert.strictEqual(resolveLocale('zh-hant'), 'zh-TW');
assert.strictEqual(resolveLocale('zh-Hant-TW'), 'zh-TW');
assert.strictEqual(resolveLocale('zh-hk'), 'zh-TW');
assert.strictEqual(resolveLocale('ar-EG'), 'arz');
assert.strictEqual(resolveLocale('ar-SA'), 'ar');
assert.strictEqual(resolveLocale('de-DE'), 'de');
assert.strictEqual(resolveLocale('fr-FR'), 'fr');
assert.strictEqual(resolveLocale('ja-JP'), 'ja');
assert.strictEqual(resolveLocale('invalid-locale'), null);
console.log('✓ resolveLocale handles browser locale tags and BCP-47 variants.');

// 6. Test persistence and detectLocale
window.localStorage.setItem('laza.locale', 'hi');
assert.strictEqual(detectLocale(), 'hi');
window.localStorage.setItem('laza.locale', 'zh-hans');
assert.strictEqual(detectLocale(), 'zh-CN');
window.localStorage.removeItem('laza.locale');
console.log('✓ detectLocale correctly restores saved preference from localStorage.');

console.log('ALL I18N VERIFICATION TESTS PASSED SUCCESSFULLY!');
