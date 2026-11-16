import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    Copy,
    Eye,
    EyeOff,
    LockKeyhole,
    RefreshCw,
    ShieldCheck,
    Wallet,
} from 'lucide-react';
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type FormEvent,
} from 'react';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from '@/components/language-switcher';
import { generateMnemonic } from '@/lib/bip39';
import { createWallet } from '@/lib/keystore';
import { cn } from '@/lib/utils';
import { activeChain } from '@/lib/wagmi';
import { useLocation } from "wouter";

const MIN_PASSWORD_LENGTH = 8;

const VERIFICATION_SIZE = 3;

const TOTAL_STEPS = 4;

type ErrorField =
    | 'password'
    | 'confirmPassword'
    | 'saved'
    | 'verification'
    | 'keystore'
    | 'mnemonic'
    | 'copy';

type Errors = Partial<Record<ErrorField, true>>;

/**
 * Sorteia posições distintas (base zero) para o passo de verificação.
 */
function pickVerificationPositions(wordCount: number): number[] {
    const positions = Array.from({ length: wordCount }, (_, index) => index);

    for (let i = positions.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));

        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    return positions.slice(0, VERIFICATION_SIZE).sort((a, b) => a - b);
}

export default function CreateWallet() {
    const { t } = useTranslation();

    const [step, setStep] = useState(1);
    const [mnemonic, setMnemonic] = useState<string[] | null>(null);
    const [errors, setErrors] = useState<Errors>({});

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [wrongPositions, setWrongPositions] = useState<number[]>([]);
    const [creating, setCreating] = useState(false);
    const [, navigate] = useLocation();

    const clearError = useCallback((field: ErrorField) => {
        setErrors((current) => {
            if (!current[field]) {
                return current;
            }

            const next = { ...current };

            delete next[field];

            return next;
        });
    }, []);

    const loadMnemonic = useCallback(async () => {
        setErrors((current) => ({ ...current, mnemonic: undefined }));
        setMnemonic(null);
        setAnswers({});
        setWrongPositions([]);

        try {
            setMnemonic(await generateMnemonic());
        } catch {
            setErrors((current) => ({ ...current, mnemonic: true }));
        }
    }, []);

    useEffect(() => {
        void loadMnemonic();
    }, [loadMnemonic]);

    const positions = useMemo(
        () => (mnemonic ? pickVerificationPositions(mnemonic.length) : []),
        [mnemonic],
    );

    const goToPhraseStep = () => {
        const nextErrors: Errors = {};

        if (password.length < MIN_PASSWORD_LENGTH) {
            nextErrors.password = true;
        }

        if (confirmPassword !== password) {
            nextErrors.confirmPassword = true;
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length === 0) {
            setStep(2);
        }
    };

    const goToVerificationStep = () => {
        if (!saved) {
            setErrors({ saved: true });

            return;
        }

        setErrors({});
        setStep(3);
    };

    const confirmWallet = async () => {
        if (!mnemonic || creating) {
            return;
        }

        const wrong = positions.filter(
            (position) =>
                (answers[position] ?? '').trim().toLowerCase() !==
                mnemonic[position].toLowerCase(),
        );

        setWrongPositions(wrong);

        if (wrong.length > 0) {
            setErrors({ verification: true });

            return;
        }

        setErrors({});
        setCreating(true);

        try {
            await createWallet(mnemonic, password);
            setCreating(false);
            setStep(4);
        } catch {
            setErrors({ keystore: true });
            setCreating(false);
        }
    };

    const goBack = () => {
        setErrors({});
        setWrongPositions([]);
        setStep((current) => Math.max(1, current - 1));
    };

    const copyMnemonic = async () => {
        if (!mnemonic) {
            return;
        }

        try {
            await navigator.clipboard.writeText(mnemonic.join(' '));
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setErrors((current) => ({ ...current, copy: true }));
        }
    };

    const updateAnswer = (position: number, value: string) => {
        setAnswers((current) => ({ ...current, [position]: value }));
        setWrongPositions((current) =>
            current.filter((item) => item !== position),
        );

        if (errors.verification) {
            clearError('verification');
        }
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (step === 1) {
            goToPhraseStep();

            return;
        }

        if (step === 2) {
            goToVerificationStep();

            return;
        }

        if (step === 3) {
            void confirmWallet();
        }
    };

    const progress = (step / TOTAL_STEPS) * 100;

    const isLoadingMnemonic = mnemonic === null && !errors.mnemonic;

    const inputClass = (hasError: boolean) =>
        cn(
            'h-12 w-full rounded-xl border px-4 transition outline-none focus:ring-2',
            hasError
                ? 'border-red-300 focus:border-red-400 focus:ring-red-50'
                : 'border-gray-200 focus:border-[#1a73e8] focus:ring-blue-50',
        );

    return (
        <main className="flex min-h-screen flex-col bg-white text-[#202124]">
            <header className="flex h-16 items-center justify-between border-b border-gray-100 px-6 md:px-10">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#202124] text-white">
                        <Wallet size={19} />
                    </div>
                    <span className="text-lg font-semibold tracking-tight">
                        {t('brand.name')}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="hidden text-sm text-gray-400 sm:block">
                        {t('create.header', { step, total: TOTAL_STEPS })}
                    </span>
                    <LanguageSwitcher />
                </div>
            </header>

            <div className="h-1 w-full bg-gray-100">
                <div
                    className="h-full bg-[#1a73e8] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <section className="flex flex-1 justify-center px-5 py-14">
                <div className="w-full max-w-[480px]">
                    <form onSubmit={submit} noValidate>
                        {step === 1 && (
                            <div>
                                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1a73e8]">
                                    <LockKeyhole size={25} />
                                </div>

                                <p className="mb-3 text-sm text-gray-400">
                                    {t('create.step1.badge')}
                                </p>

                                <h1 className="text-3xl font-semibold tracking-tight">
                                    {t('create.step1.title')}
                                </h1>

                                <p className="mt-3 leading-relaxed text-gray-500">
                                    {t('create.step1.description')}
                                </p>

                                <div className="mt-9 space-y-5">
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="text-sm font-medium"
                                        >
                                            {t('create.step1.password')}
                                        </label>

                                        <div className="relative mt-2">
                                            <input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                autoComplete="new-password"
                                                value={password}
                                                onChange={(event) => {
                                                    setPassword(
                                                        event.target.value,
                                                    );
                                                    clearError('password');
                                                    clearError(
                                                        'confirmPassword',
                                                    );
                                                }}
                                                placeholder={t(
                                                    'create.step1.passwordPlaceholder',
                                                )}
                                                aria-invalid={Boolean(
                                                    errors.password,
                                                )}
                                                aria-describedby={
                                                    errors.password
                                                        ? 'password-error'
                                                        : undefined
                                                }
                                                className={cn(
                                                    inputClass(
                                                        Boolean(
                                                            errors.password,
                                                        ),
                                                    ),
                                                    'pr-12',
                                                )}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (current) => !current,
                                                    )
                                                }
                                                aria-label={t(
                                                    showPassword
                                                        ? 'create.step1.hide'
                                                        : 'create.step1.show',
                                                )}
                                                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </button>
                                        </div>

                                        {errors.password && (
                                            <p
                                                id="password-error"
                                                role="alert"
                                                className="mt-2 text-xs text-red-600"
                                            >
                                                {t(
                                                    'create.messages.passwordMin',
                                                    {
                                                        count: MIN_PASSWORD_LENGTH,
                                                    },
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="confirm-password"
                                            className="text-sm font-medium"
                                        >
                                            {t('create.step1.confirm')}
                                        </label>

                                        <input
                                            id="confirm-password"
                                            type="password"
                                            autoComplete="new-password"
                                            value={confirmPassword}
                                            onChange={(event) => {
                                                setConfirmPassword(
                                                    event.target.value,
                                                );
                                                clearError('confirmPassword');
                                            }}
                                            placeholder={t(
                                                'create.step1.confirmPlaceholder',
                                            )}
                                            aria-invalid={Boolean(
                                                errors.confirmPassword,
                                            )}
                                            aria-describedby={
                                                errors.confirmPassword
                                                    ? 'confirm-password-error'
                                                    : undefined
                                            }
                                            className={cn(
                                                inputClass(
                                                    Boolean(
                                                        errors.confirmPassword,
                                                    ),
                                                ),
                                                'mt-2',
                                            )}
                                        />

                                        {errors.confirmPassword && (
                                            <p
                                                id="confirm-password-error"
                                                role="alert"
                                                className="mt-2 text-xs text-red-600"
                                            >
                                                {t(
                                                    'create.messages.passwordMismatch',
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3 rounded-xl bg-gray-50 p-4">
                                    <ShieldCheck
                                        size={20}
                                        className="shrink-0 text-gray-500"
                                    />
                                    <p className="text-xs leading-relaxed text-gray-500">
                                        {t('create.step1.notice')}
                                    </p>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1a73e8]">
                                    <ShieldCheck size={25} />
                                </div>

                                <p className="mb-3 text-sm text-gray-400">
                                    {t('create.step2.badge')}
                                </p>

                                <h1 className="text-3xl font-semibold tracking-tight">
                                    {t('create.step2.title')}
                                </h1>

                                <p className="mt-3 leading-relaxed text-gray-500">
                                    {t('create.step2.description')}
                                </p>

                                {isLoadingMnemonic && (
                                    <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                        {Array.from(
                                            { length: 12 },
                                            (_, index) => (
                                                <div
                                                    key={index}
                                                    className="h-[46px] animate-pulse rounded-xl bg-gray-100"
                                                />
                                            ),
                                        )}
                                    </div>
                                )}

                                {mnemonic && (
                                    <>
                                        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                            {mnemonic.map((word, index) => (
                                                <div
                                                    key={`${index}-${word}`}
                                                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-3"
                                                >
                                                    <span className="w-4 text-xs text-gray-400">
                                                        {index + 1}.
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        {word}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => void copyMnemonic()}
                                            className="mt-4 flex items-center gap-2 text-sm text-[#1a73e8] hover:underline"
                                        >
                                            {copied ? (
                                                <Check size={16} />
                                            ) : (
                                                <Copy size={16} />
                                            )}
                                            {t(
                                                copied
                                                    ? 'create.step2.copied'
                                                    : 'create.step2.copy',
                                            )}
                                        </button>
                                    </>
                                )}

                                {errors.copy && (
                                    <p
                                        role="alert"
                                        className="mt-3 text-xs text-red-600"
                                    >
                                        {t('create.messages.copy')}
                                    </p>
                                )}

                                {errors.mnemonic && (
                                    <MnemonicError
                                        onRetry={() => void loadMnemonic()}
                                    />
                                )}

                                <div className="mt-8 rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                                    <div className="flex gap-3">
                                        <AlertCircle
                                            size={19}
                                            className="shrink-0 text-amber-600"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-[#202124]">
                                                {t('create.step2.warningTitle')}
                                            </p>
                                            <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                                {t('create.step2.warningText')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <label className="mt-6 flex cursor-pointer items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={saved}
                                        onChange={(event) => {
                                            setSaved(event.target.checked);
                                            clearError('saved');
                                        }}
                                        aria-invalid={Boolean(errors.saved)}
                                        className="mt-1 accent-[#1a73e8]"
                                    />
                                    <span className="text-sm leading-relaxed text-gray-600">
                                        {t('create.step2.confirm')}
                                    </span>
                                </label>

                                {errors.saved && (
                                    <p
                                        role="alert"
                                        className="mt-2 text-xs text-red-600"
                                    >
                                        {t('create.messages.backup')}
                                    </p>
                                )}
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1a73e8]">
                                    <CheckCircle2 size={25} />
                                </div>

                                <p className="mb-3 text-sm text-gray-400">
                                    {t('create.step3.badge')}
                                </p>

                                <h1 className="text-3xl font-semibold tracking-tight">
                                    {t('create.step3.title')}
                                </h1>

                                <p className="mt-3 leading-relaxed text-gray-500">
                                    {t('create.step3.description')}
                                </p>

                                {isLoadingMnemonic && (
                                    <div className="mt-9 space-y-5">
                                        {Array.from(
                                            { length: VERIFICATION_SIZE },
                                            (_, index) => (
                                                <div key={index}>
                                                    <div className="h-5 w-32 animate-pulse rounded bg-gray-100" />
                                                    <div className="mt-2 h-12 animate-pulse rounded-xl bg-gray-100" />
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}

                                {mnemonic && (
                                    <div className="mt-9 space-y-5">
                                        {positions.map((position) => {
                                            const isWrong =
                                                wrongPositions.includes(
                                                    position,
                                                );

                                            return (
                                                <div key={position}>
                                                    <label
                                                        htmlFor={`word-${position}`}
                                                        className="text-sm font-medium"
                                                    >
                                                        {t(
                                                            'create.step3.word',
                                                            {
                                                                number:
                                                                    position +
                                                                    1,
                                                            },
                                                        )}
                                                    </label>

                                                    <input
                                                        id={`word-${position}`}
                                                        type="text"
                                                        autoComplete="off"
                                                        autoCapitalize="none"
                                                        spellCheck={false}
                                                        value={
                                                            answers[position] ??
                                                            ''
                                                        }
                                                        onChange={(event) =>
                                                            updateAnswer(
                                                                position,
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        placeholder={t(
                                                            'create.step3.wordPlaceholder',
                                                        )}
                                                        aria-invalid={isWrong}
                                                        className={cn(
                                                            inputClass(isWrong),
                                                            'mt-2',
                                                        )}
                                                    />

                                                    {isWrong && (
                                                        <p className="mt-2 text-xs text-red-600">
                                                            {t(
                                                                'create.step3.incorrectWord',
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {errors.verification && (
                                    <p
                                        role="alert"
                                        className="mt-6 text-xs text-red-600"
                                    >
                                        {t('create.messages.verification')}
                                    </p>
                                )}

                                {errors.mnemonic && (
                                    <MnemonicError
                                        onRetry={() => void loadMnemonic()}
                                    />
                                )}
                            </div>
                        )}

                        {step === 4 && (
                            <div className="pt-10 text-center">
                                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                    <Check size={38} />
                                </div>

                                <h1 className="text-3xl font-semibold tracking-tight">
                                    {t('create.step4.title')}
                                </h1>

                                <p className="mt-4 leading-relaxed text-gray-500">
                                    {t('create.step4.description')}
                                </p>

                                <div className="mt-9 rounded-2xl border border-gray-100 p-5 text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                                            <Wallet size={20} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                {t('brand.name')}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                {activeChain.name}
                                            </p>
                                        </div>

                                        <div className="ml-auto text-emerald-600">
                                            <CheckCircle2 size={20} />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="mt-8 h-12 w-full rounded-full bg-[#1a73e8] text-sm font-medium text-white transition hover:bg-[#1765cc]"
                                >
                                    {t('create.step4.access')}
                                </button>
                            </div>
                        )}

                        {errors.keystore && (
                            <p
                                role="alert"
                                className="mt-8 rounded-xl border border-red-100 bg-red-50/60 px-4 py-3 text-sm text-red-600"
                            >
                                {t('create.messages.keystore')}
                            </p>
                        )}

                        {step < TOTAL_STEPS && (
                            <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6">
                                <button
                                    type="button"
                                    onClick={goBack}
                                    disabled={step === 1 || creating}
                                    className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#202124] disabled:opacity-0"
                                >
                                    <ArrowLeft size={17} />
                                    {t('create.back')}
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        (step > 1 && mnemonic === null) ||
                                        creating
                                    }
                                    className="flex items-center gap-2 rounded-full bg-[#1a73e8] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1765cc] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {creating && (
                                        <RefreshCw
                                            size={17}
                                            className="animate-spin"
                                        />
                                    )}
                                    {step === 3
                                        ? t(
                                              creating
                                                  ? 'create.step3.submitting'
                                                  : 'create.step3.submit',
                                          )
                                        : t('create.continue')}
                                    {!creating && <ArrowRight size={17} />}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </section>

            <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
                {t('brand.tagline')}
            </footer>
        </main>
    );
}

function MnemonicError({ onRetry }: { onRetry: () => void }) {
    const { t } = useTranslation();

    return (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/60 p-4">
            <AlertCircle size={19} className="mt-0.5 shrink-0 text-red-600" />
            <div>
                <p className="text-sm font-medium text-[#202124]">
                    {t('create.error.title')}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {t('create.messages.mnemonicGenerate')}
                </p>
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-3 flex items-center gap-2 text-sm font-medium text-[#1a73e8] hover:underline"
                >
                    <RefreshCw size={15} />
                    {t('create.error.retry')}
                </button>
            </div>
        </div>
    );
}
