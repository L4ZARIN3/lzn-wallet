import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    LockKeyhole,
    Plus,
    RefreshCw,
    Search,
} from 'lucide-react';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type FormEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';
import { usePublicClient } from 'wagmi';
import { useLocation } from 'wouter';

import { LanguageSwitcher } from '@/components/language-switcher';
import {
    checkAccountActivity,
    discoverAccounts,
    findDerivedAccountIndex,
    getPublicClient,
    type DiscoveredAccount,
} from '@/lib/discovery';
import {
    addressFromMnemonic,
    createWallet,
} from '@/lib/keystore';
import { cn } from '@/lib/utils';
import { activeChain } from '@/lib/wagmi';
import { nativeToken, shortenAddress } from '@/lib/wallet';

const MIN_PASSWORD_LENGTH = 8;
const WORD_COUNT = 12;

type ErrorField =
    | 'phrase'
    | 'password'
    | 'confirmPassword'
    | 'keystore';

type Errors = Partial<Record<ErrorField, true>>;

/** Normaliza e valida a frase secreta digitada pelo usuário. */
function parseMnemonic(raw: string): string[] | null {
    const words = raw
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length !== WORD_COUNT) {
        return null;
    }

    return words;
}

export default function RecoverWallet() {
    const { t } = useTranslation();
    const [, navigate] = useLocation();
    const publicClient = usePublicClient({ chainId: activeChain.id });

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [phraseInput, setPhraseInput] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [importing, setImporting] = useState(false);

    // Step 3 states
    const [scanning, setScanning] = useState(false);
    const [accounts, setAccounts] = useState<DiscoveredAccount[]>([]);
    const [manualInput, setManualInput] = useState('');
    const [manualError, setManualError] = useState<string | null>(null);
    const [manualSuccess, setManualSuccess] = useState<string | null>(null);
    const [showManualAdd, setShowManualAdd] = useState(false);
    const hasDiscoveredRef = useRef(false);

    const clearError = useCallback((field: ErrorField) => {
        setErrors((current) => {
            if (!current[field]) return current;
            const next = { ...current };
            delete next[field];
            return next;
        });
    }, []);

    /* ── Step 1: validar a frase ── */
    const goToPasswordStep = (event: FormEvent) => {
        event.preventDefault();

        const words = parseMnemonic(phraseInput);
        const nextErrors: Errors = {};

        if (!words) {
            nextErrors.phrase = true;
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length === 0) {
            setStep(2);
        }
    };

    /* ── Step 2: validar a senha e avançar para descoberta ── */
    const goToDiscoveryStep = (event: FormEvent) => {
        event.preventDefault();

        const words = parseMnemonic(phraseInput);
        const nextErrors: Errors = {};

        if (!words) {
            nextErrors.phrase = true;
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            nextErrors.password = true;
        }

        if (confirmPassword !== password) {
            nextErrors.confirmPassword = true;
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length === 0 && words) {
            setStep(3);
        }
    };

    /* ── Step 3: Descoberta automática de contas BIP-44 ── */
    const runDiscovery = useCallback(async () => {
        const words = parseMnemonic(phraseInput);
        if (!words) return;

        setScanning(true);
        setManualError(null);
        setManualSuccess(null);

        try {
            const discovered = await discoverAccounts({
                words,
                client: publicClient,
                minCount: Math.max(1, accounts.length),
            });
            setAccounts(discovered);
        } catch {
            // Em caso de falha de conexão, preserva as contas já adicionadas ou garante no mínimo a Conta 0
            setAccounts((prev) =>
                prev.length > 0
                    ? prev
                    : [
                          {
                              index: 0,
                              address: addressFromMnemonic(words, 0),
                              nativeBalance: 0n,
                              formattedBalance: '0',
                              txCount: 0,
                              hasTokenBalance: false,
                              hasExplorerActivity: false,
                              isActive: false,
                          },
                      ],
            );
        } finally {
            setScanning(false);
        }
    }, [phraseInput, publicClient, accounts.length]);

    useEffect(() => {
        if (step === 3 && !hasDiscoveredRef.current) {
            hasDiscoveredRef.current = true;
            void runDiscovery();
        }
    }, [step, runDiscovery]);

    /* ── Adicionar próxima conta sequencial ── */
    const handleAddNextAccount = () => {
        const words = parseMnemonic(phraseInput);
        if (!words) return;

        const nextIndex = accounts.length;
        const nextAddress = addressFromMnemonic(words, nextIndex);

        setAccounts((prev) => [
            ...prev,
            {
                index: nextIndex,
                address: nextAddress,
                nativeBalance: 0n,
                formattedBalance: '0',
                txCount: 0,
                hasTokenBalance: false,
                hasExplorerActivity: false,
                isActive: false,
            },
        ]);

        setManualSuccess(
            t('recover.step3.addressVerified', { index: nextIndex + 1 }),
        );
        setManualError(null);

        void (async () => {
            try {
                const activity = await checkAccountActivity(
                    publicClient ?? getPublicClient(),
                    nextAddress,
                );
                setAccounts((curr) =>
                    curr.map((acc) =>
                        acc.index === nextIndex
                            ? { ...acc, ...activity }
                            : acc,
                    ),
                );
            } catch {
                // ignore activity fetch failure
            }
        })();
    };

    /* ── Adicionar conta manualmente com validação estrita de derivação ── */
    const handleManualAdd = (event: FormEvent) => {
        event.preventDefault();
        setManualError(null);
        setManualSuccess(null);

        const words = parseMnemonic(phraseInput);
        if (!words) return;

        const raw = manualInput.trim();
        if (!raw) return;

        let targetIndex: number | null = null;

        // Caso 1: usuário digitou um número de conta (ex: 1, 2, Conta 2...)
        const cleaned = raw.replace(/^(account|conta|#)\s*/i, '');
        if (/^\d+$/.test(cleaned)) {
            const num = parseInt(cleaned, 10);
            if (num === 0) {
                targetIndex = 0;
            } else if (num >= 1 && num <= 100) {
                targetIndex = num - 1;
            } else {
                setManualError(t('recover.step3.addressNotDerived'));
                return;
            }
        } else {
            // Caso 2: usuário digitou/colou um endereço (0x...)
            // Checagem estrita para impedir endereços que não derivam de verdade da seed
            targetIndex = findDerivedAccountIndex(words, raw);
        }

        if (targetIndex === null) {
            setManualError(t('recover.step3.addressNotDerived'));
            return;
        }

        // Se já está na lista
        if (accounts.some((a) => a.index === targetIndex)) {
            setManualError(t('recover.step3.addressAlreadyAdded'));
            return;
        }

        // Deriva todas as contas intermediárias até o targetIndex
        const updated = [...accounts];
        const newIndices: number[] = [];
        for (let i = 0; i <= targetIndex; i++) {
            if (!updated.some((a) => a.index === i)) {
                newIndices.push(i);
                updated.push({
                    index: i,
                    address: addressFromMnemonic(words, i),
                    nativeBalance: 0n,
                    formattedBalance: '0',
                    txCount: 0,
                    hasTokenBalance: false,
                    hasExplorerActivity: false,
                    isActive: false,
                });
            }
        }

        updated.sort((a, b) => a.index - b.index);
        setAccounts(updated);
        setManualSuccess(
            t('recover.step3.addressVerified', { index: targetIndex + 1 }),
        );
        setManualInput('');

        // Consulta atividade em background para as novas contas adicionadas
        void (async () => {
            try {
                const client = publicClient ?? getPublicClient();
                const activities = await Promise.all(
                    newIndices.map(async (idx) => {
                        const addr = addressFromMnemonic(words, idx);
                        const act = await checkAccountActivity(client, addr);
                        return { idx, act };
                    }),
                );
                setAccounts((curr) =>
                    curr.map((acc) => {
                        const match = activities.find((a) => a.idx === acc.index);
                        return match ? { ...acc, ...match.act } : acc;
                    }),
                );
            } catch {
                // ignore activity fetch failure
            }
        })();
    };

    /* ── Concluir recuperação e salvar carteira ── */
    const handleFinalize = async () => {
        const words = parseMnemonic(phraseInput);
        if (!words) return;

        setImporting(true);

        try {
            const addressesToSave: Address[] = accounts.map((a) => a.address);
            await createWallet(words, password, addressesToSave);
            navigate('/');
        } catch {
            setErrors({ keystore: true });
            setImporting(false);
        }
    };

    return (
        <main className="min-h-screen bg-white text-[#202124]">
            <header className="flex h-16 items-center justify-between border-b border-gray-100 px-6 md:px-10">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#202124] text-white">
                        <KeyRound size={19} />
                    </div>
                    <span className="text-lg font-semibold tracking-tight">
                        {t('brand.name')}
                    </span>
                </div>

                <LanguageSwitcher />
            </header>

            <section className="mx-auto max-w-lg px-5 py-14 md:px-10">
                {/* Breadcrumb */}
                <p className="mb-6 text-sm text-gray-400">
                    {t('recover.header', { step, total: 3 })}
                </p>

                <div className="rounded-2xl border border-gray-100 p-8">
                    {/* ── Step 1: frase secreta ── */}
                    {step === 1 && (
                        <form onSubmit={goToPasswordStep} noValidate>
                            <span className="inline-block rounded-full bg-[#e8f0fe] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#1967d2]">
                                {t('recover.step1.badge')}
                            </span>

                            <h1 className="mt-4 text-2xl font-semibold tracking-tight">
                                {t('recover.step1.title')}
                            </h1>

                            <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                {t('recover.step1.description')}
                            </p>

                            <div className="mt-6">
                                <label
                                    htmlFor="recover-phrase"
                                    className="block text-sm font-medium"
                                >
                                    {t('recover.step1.phraseLabel')}
                                </label>

                                <textarea
                                    id="recover-phrase"
                                    rows={4}
                                    value={phraseInput}
                                    onChange={(e) => {
                                        setPhraseInput(e.target.value);
                                        clearError('phrase');
                                    }}
                                    placeholder={t(
                                        'recover.step1.phrasePlaceholder',
                                    )}
                                    spellCheck={false}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="none"
                                    aria-invalid={Boolean(errors.phrase)}
                                    className={cn(
                                        'mt-2 w-full resize-none rounded-xl border px-4 py-3 font-mono text-sm leading-relaxed transition outline-none focus:ring-2',
                                        errors.phrase
                                            ? 'border-red-300 focus:border-red-400 focus:ring-red-50'
                                            : 'border-gray-200 focus:border-[#1a73e8] focus:ring-blue-50',
                                    )}
                                />

                                {errors.phrase && (
                                    <p
                                        role="alert"
                                        className="mt-2 flex items-center gap-1.5 text-xs text-red-600"
                                    >
                                        <AlertCircle size={13} />
                                        {t('recover.messages.phraseInvalid')}
                                    </p>
                                )}
                            </div>

                            {/* Aviso de segurança */}
                            <div className="mt-5 flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3">
                                <AlertCircle
                                    size={16}
                                    className="mt-0.5 shrink-0 text-amber-500"
                                />
                                <p className="text-xs leading-relaxed text-amber-700">
                                    {t('recover.step1.warning')}
                                </p>
                            </div>

                            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#202124]"
                                >
                                    <ArrowLeft size={17} />
                                    {t('create.back')}
                                </button>

                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-full bg-[#1a73e8] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1765cc]"
                                >
                                    {t('create.continue')}
                                    <ArrowRight size={17} />
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ── Step 2: definir senha ── */}
                    {step === 2 && (
                        <form onSubmit={goToDiscoveryStep} noValidate>
                            <span className="inline-block rounded-full bg-[#e8f0fe] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#1967d2]">
                                {t('recover.step2.badge')}
                            </span>

                            <h1 className="mt-4 text-2xl font-semibold tracking-tight">
                                {t('recover.step2.title')}
                            </h1>

                            <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                {t('recover.step2.description')}
                            </p>

                            {/* Campo senha */}
                            <div className="mt-6">
                                <label
                                    htmlFor="recover-password"
                                    className="block text-sm font-medium"
                                >
                                    {t('create.step1.password')}
                                </label>

                                <div
                                    className={cn(
                                        'mt-2 flex h-11 items-center rounded-xl border px-4 transition focus-within:ring-2',
                                        errors.password
                                            ? 'border-red-300 focus-within:border-red-400 focus-within:ring-red-50'
                                            : 'border-gray-200 focus-within:border-[#1a73e8] focus-within:ring-blue-50',
                                    )}
                                >
                                    <input
                                        id="recover-password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            clearError('password');
                                        }}
                                        placeholder={t(
                                            'create.step1.passwordPlaceholder',
                                        )}
                                        autoComplete="new-password"
                                        aria-invalid={Boolean(errors.password)}
                                        className="flex-1 bg-transparent text-sm outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                        aria-label={
                                            showPassword
                                                ? t('create.step1.hide')
                                                : t('create.step1.show')
                                        }
                                        className="ml-2 text-gray-400 transition hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>
                                </div>

                                {errors.password && (
                                    <p
                                        role="alert"
                                        className="mt-1.5 text-xs text-red-600"
                                    >
                                        {t('create.messages.passwordMin', {
                                            count: MIN_PASSWORD_LENGTH,
                                        })}
                                    </p>
                                )}
                            </div>

                            {/* Confirmar senha */}
                            <div className="mt-4">
                                <label
                                    htmlFor="recover-confirm"
                                    className="block text-sm font-medium"
                                >
                                    {t('create.step1.confirm')}
                                </label>

                                <input
                                    id="recover-confirm"
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        clearError('confirmPassword');
                                    }}
                                    placeholder={t(
                                        'create.step1.confirmPlaceholder',
                                    )}
                                    autoComplete="new-password"
                                    aria-invalid={Boolean(
                                        errors.confirmPassword,
                                    )}
                                    className={cn(
                                        'mt-2 h-11 w-full rounded-xl border px-4 text-sm transition outline-none focus:ring-2',
                                        errors.confirmPassword
                                            ? 'border-red-300 focus:border-red-400 focus:ring-red-50'
                                            : 'border-gray-200 focus:border-[#1a73e8] focus:ring-blue-50',
                                    )}
                                />

                                {errors.confirmPassword && (
                                    <p
                                        role="alert"
                                        className="mt-1.5 text-xs text-red-600"
                                    >
                                        {t('create.messages.passwordMismatch')}
                                    </p>
                                )}
                            </div>

                            {/* Aviso */}
                            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-gray-400">
                                <LockKeyhole
                                    size={13}
                                    className="mt-0.5 shrink-0"
                                />
                                {t('create.step1.notice')}
                            </p>

                            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setErrors({});
                                        setStep(1);
                                    }}
                                    className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#202124]"
                                >
                                    <ArrowLeft size={17} />
                                    {t('create.back')}
                                </button>

                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-full bg-[#1a73e8] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1765cc]"
                                >
                                    {t('create.continue')}
                                    <ArrowRight size={17} />
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ── Step 3: Descoberta de Contas & Adição Manual ── */}
                    {step === 3 && (
                        <div>
                            <span className="inline-block rounded-full bg-[#e8f0fe] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#1967d2]">
                                {t('recover.step3.badge')}
                            </span>

                            <h1 className="mt-4 text-2xl font-semibold tracking-tight">
                                {t('recover.step3.title')}
                            </h1>

                            <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                {t('recover.step3.description', {
                                    chain: activeChain.name,
                                })}
                            </p>

                            {/* Status de Varredura */}
                            {scanning ? (
                                <div className="mt-6 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                                    <RefreshCw
                                        size={18}
                                        className="animate-spin text-[#1a73e8]"
                                    />
                                    <p className="text-sm text-blue-800">
                                        {t('recover.step3.scanning', {
                                            chain: activeChain.name,
                                        })}
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                                    <span>
                                        {t('recover.step3.found', {
                                            count: accounts.length,
                                        })}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => void runDiscovery()}
                                        className="flex items-center gap-1 font-medium text-[#1a73e8] hover:underline"
                                    >
                                        <RefreshCw size={12} />
                                        {t('refresh')}
                                    </button>
                                </div>
                            )}

                            {/* Lista de contas encontradas */}
                            <ul className="mt-3 max-h-60 space-y-2 overflow-y-auto pr-1">
                                {accounts.map((acc) => (
                                    <li
                                        key={acc.address}
                                        className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-3.5 py-3"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">
                                                    {t('accounts.label', {
                                                        index: acc.index + 1,
                                                    })}
                                                </span>
                                                {acc.isActive ? (
                                                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                                        {t(
                                                            'recover.step3.activeBadge',
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                                                        {t(
                                                            'recover.step3.emptyBadge',
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="mt-0.5 block font-mono text-xs text-gray-500">
                                                {shortenAddress(acc.address, 6)}
                                            </span>
                                        </div>

                                        <div className="text-right">
                                            {acc.nativeBalance > 0n && (
                                                <span className="block text-xs font-medium text-gray-700">
                                                    {acc.formattedBalance}{' '}
                                                    {nativeToken.symbol}
                                                </span>
                                            )}
                                            {acc.txCount > 0 && (
                                                <span className="block text-[11px] text-gray-400">
                                                    {acc.txCount} txs
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Botões para adicionar contas manualmente */}
                            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleAddNextAccount}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                    >
                                        <Plus size={14} />
                                        {t('recover.step3.addNextButton', {
                                            index: accounts.length + 1,
                                        })}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowManualAdd((prev) => !prev)
                                        }
                                        className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                    >
                                        <Search size={14} />
                                        {t('recover.step3.manualTitle')}
                                    </button>
                                </div>

                                {showManualAdd && (
                                    <form
                                        onSubmit={handleManualAdd}
                                        className="rounded-xl border border-gray-100 bg-gray-50/70 p-3"
                                    >
                                        <label
                                            htmlFor="manual-account-input"
                                            className="block text-xs font-medium text-gray-600"
                                        >
                                            {t('recover.step3.manualDescription')}
                                        </label>
                                        <div className="mt-2 flex gap-2">
                                            <input
                                                id="manual-account-input"
                                                type="text"
                                                value={manualInput}
                                                onChange={(e) => {
                                                    setManualInput(
                                                        e.target.value,
                                                    );
                                                    setManualError(null);
                                                }}
                                                placeholder={t(
                                                    'recover.step3.manualInputPlaceholder',
                                                )}
                                                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-mono text-xs outline-none focus:border-[#1a73e8]"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!manualInput.trim()}
                                                className="rounded-lg bg-[#1a73e8] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#1765cc] disabled:opacity-40"
                                            >
                                                {t(
                                                    'recover.step3.manualAddButton',
                                                )}
                                            </button>
                                        </div>

                                        {manualError && (
                                            <p
                                                role="alert"
                                                className="mt-2 flex items-center gap-1 text-[11px] text-red-600"
                                            >
                                                <AlertCircle size={12} />
                                                {manualError}
                                            </p>
                                        )}

                                        {manualSuccess && (
                                            <p className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600">
                                                <CheckCircle2 size={12} />
                                                {manualSuccess}
                                            </p>
                                        )}
                                    </form>
                                )}
                            </div>

                            {/* Erro de keystore */}
                            {errors.keystore && (
                                <p
                                    role="alert"
                                    className="mt-5 rounded-xl border border-red-100 bg-red-50/60 px-4 py-3 text-sm text-red-600"
                                >
                                    {t('create.messages.keystore')}
                                </p>
                            )}

                            {/* Ações finais */}
                            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setErrors({});
                                        setStep(2);
                                    }}
                                    disabled={importing}
                                    className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#202124] disabled:opacity-0"
                                >
                                    <ArrowLeft size={17} />
                                    {t('create.back')}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => void handleFinalize()}
                                    disabled={importing || accounts.length === 0}
                                    className="flex items-center gap-2 rounded-full bg-[#1a73e8] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1765cc] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {importing ? (
                                        <RefreshCw
                                            size={17}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Check size={17} />
                                    )}
                                    {t(
                                        importing
                                            ? 'recover.step3.submitting'
                                            : 'recover.step3.submit',
                                        { count: accounts.length },
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
                {t('brand.tagline')}
            </footer>
        </main>
    );
}
