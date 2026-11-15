import {
    ArrowRight,
    ArrowUpRight,
    Check,
    ExternalLink,
    RefreshCw,
} from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
    formatUnits,
    isAddress,
    parseUnits,
    type Address,
    type Hash,
} from 'viem';

import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import {
    explorerTransactionUrl,
    formatTokenAmount,
    shortenAddress,
} from '@/lib/wallet';

/** Dados coletados no formulário; o hash é assinado fora do componente. */
export type SendRequest = {
    to: Address;
    amount: bigint;
    password: string;
};

type SendDialogProps = {
    open: boolean;
    onClose: () => void;
    /** Assina e transmite a transferência; resolve com o hash da transação. */
    onSend: (request: SendRequest) => Promise<Hash>;
    /** Saldo disponível da moeda nativa. */
    balance: bigint;
    /**
     * Taxa estimada da transferência, em wei. É descontada do saldo no botão
     * "Máximo", já que o envio do saldo inteiro não deixaria valor para pagar
     * o próprio gás. Enquanto indefinida, o atalho fica indisponível.
     */
    fee?: bigint;
    symbol: string;
    decimals: number;
    /** Nome da rede exibido no resumo do envio. */
    chainName: string;
    /** Logo do ativo; quando ausente, apenas o símbolo é exibido. */
    icon?: string;
};

/** Etapas do fluxo: dados → revisão → senha. */
type SendStep = 'details' | 'review' | 'password';

const STEPS: SendStep[] = ['details', 'review', 'password'];

/** Motivo da falha na assinatura: cada um vira uma mensagem específica. */
type SendFailure = 'password' | 'generic';

const FAILURE_KEYS = {
    password: 'send.errors.password',
    generic: 'send.errors.generic',
} as const;

const INPUT_CLASS =
    'mt-2 h-11 w-full rounded-xl border px-4 text-sm transition outline-none focus:ring-2';
const INPUT_OK_CLASS =
    'border-gray-200 focus:border-[#1a73e8] focus:ring-blue-50';
const INPUT_ERROR_CLASS =
    'border-red-300 focus:border-red-400 focus:ring-red-50';
const PRIMARY_BUTTON_CLASS =
    'flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#1a73e8] text-sm font-medium text-white transition hover:bg-[#1765cc] disabled:cursor-not-allowed disabled:opacity-40';
const SECONDARY_BUTTON_CLASS =
    'mt-3 h-9 w-full rounded-full text-sm font-medium text-gray-500 transition hover:bg-gray-50';

/** Endereço de valor nulo, que nunca deve receber fundos. */
const ZERO_ADDRESS = /^0x0{40}$/i;

/**
 * Valida o destinatário conforme o padrão EVM adotado pela Gnosis Chain
 * (EIP-55). Aceita o endereço sem o prefixo `0x` e ignora espaços nas pontas;
 * devolve `null` quando o valor não é um endereço válido e utilizável.
 */
function normalizeAddress(input: string): Address | null {
    const value = input.trim();
    const candidate = /^[0-9a-fA-F]{40}$/.test(value) ? `0x${value}` : value;

    if (!isAddress(candidate) || ZERO_ADDRESS.test(candidate)) {
        return null;
    }

    return candidate;
}

/**
 * Restringe o que o usuário digita no campo de valor a dígitos e um único
 * separador decimal, limitado ao número de casas do token — evita que o
 * campo aceite entradas que jamais teriam um valor válido.
 */
function sanitizeAmount(input: string, decimals: number): string {
    const filtered = input.replace(/[^\d.,]/g, '');
    const separatorAt = filtered.search(/[.,]/);

    if (separatorAt === -1) {
        return filtered;
    }

    const whole = filtered.slice(0, separatorAt);
    const fraction = filtered
        .slice(separatorAt + 1)
        .replace(/[.,]/g, '')
        .slice(0, decimals);

    return `${whole}${filtered[separatorAt]}${fraction}`;
}

export function SendDialog({
    open,
    onClose,
    onSend,
    balance,
    fee,
    symbol,
    decimals,
    chainName,
    icon,
}: SendDialogProps) {
    const { t } = useTranslation();

    const [step, setStep] = useState<SendStep>('details');
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [password, setPassword] = useState('');
    const [hash, setHash] = useState<Hash | null>(null);
    const [busy, setBusy] = useState(false);
    const [failure, setFailure] = useState<SendFailure | null>(null);

    /**
     * Máximo transferível: o saldo menos a taxa de rede. `null` quando a taxa
     * ainda não foi estimada, o que mantém o atalho desabilitado.
     */
    const maxAmount =
        fee !== undefined && balance > fee ? balance - fee : null;

    /** Aceita vírgula decimal (pt-BR) e devolve `null` se o valor não servir. */
    const parseAmount = (): bigint | null => {
        try {
            const parsed = parseUnits(amount.replace(',', '.'), decimals);

            return parsed > 0n ? parsed : null;
        } catch {
            return null;
        }
    };

    /** Destinatário e valor do formulário, já normalizados. */
    const recipient = normalizeAddress(to);
    const value = parseAmount();
    const amountTooHigh = value !== null && value > balance;

    /** Erros derivados do que já foi digitado, para feedback imediato. */
    const addressInvalid = to.trim().length > 0 && recipient === null;
    const amountInvalid = amount.length > 0 && (value === null || amountTooHigh);
    const detailsError = addressInvalid
        ? 'send.errors.address'
        : amountInvalid
          ? amountTooHigh
              ? 'send.errors.insufficient'
              : 'send.errors.amount'
          : null;

    const close = () => {
        setStep('details');
        setTo('');
        setAmount('');
        setPassword('');
        setHash(null);
        setBusy(false);
        setFailure(null);
        onClose();
    };

    /** Preenche o campo com o máximo transferível, na precisão total do token. */
    const fillMax = () => {
        if (maxAmount === null) {
            return;
        }

        setAmount(formatUnits(maxAmount, decimals));
        setFailure(null);
    };

    /** Etapa 1 → 2: só avança com destinatário e valor válidos. */
    const review = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!recipient || value === null || value > balance) {
            return;
        }

        setStep('review');
    };

    /** Etapa 3: assina com a senha e transmite. */
    const confirm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!recipient || value === null) {
            setStep('details');
            return;
        }

        setFailure(null);
        setBusy(true);

        try {
            setHash(await onSend({ to: recipient, amount: value, password }));
        } catch (cause) {
            setFailure(
                cause instanceof Error && cause.message === 'invalid-password'
                    ? 'password'
                    : 'generic',
            );
        } finally {
            setBusy(false);
        }
    };

    const errorClass = (field: SendFailure) =>
        failure === field ? INPUT_ERROR_CLASS : INPUT_OK_CLASS;

    if (hash) {
        const explorerUrl = explorerTransactionUrl(hash);

        return (
            <Modal open={open} onClose={close} title={t('send.successTitle')}>
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Check size={22} />
                    </div>

                    <p className="mt-4 text-sm text-gray-500">
                        {t('send.successDescription')}
                    </p>

                    <p className="mt-4 font-mono text-sm break-all text-gray-600">
                        {shortenAddress(hash, 10)}
                    </p>

                    {explorerUrl && (
                        <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-sm text-[#1a73e8] hover:underline"
                        >
                            <ExternalLink size={14} />
                            {t('send.view')}
                        </a>
                    )}
                </div>

                <button
                    type="button"
                    onClick={close}
                    className={cn(PRIMARY_BUTTON_CLASS, 'mt-6')}
                >
                    {t('send.done')}
                </button>
            </Modal>
        );
    }

    const titles: Record<SendStep, string> = {
        details: t('send.title'),
        review: t('send.reviewTitle'),
        password: t('send.confirmTitle'),
    };

    let content: ReactNode;

    if (step === 'review' && recipient && value !== null) {
        content = (
            <>
                <div className="text-center">
                    <p className="text-4xl font-semibold tracking-tight tabular-nums">
                        {formatTokenAmount(value, decimals)}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">{symbol}</p>
                </div>

                <dl className="mt-6 space-y-3 rounded-xl bg-gray-50 px-4 py-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                        <dt className="text-gray-400">{t('send.to')}</dt>
                        <dd className="font-mono">
                            {shortenAddress(recipient, 6)}
                        </dd>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <dt className="text-gray-400">{t('send.asset')}</dt>
                        <dd className="flex items-center gap-2 font-medium">
                            {icon && (
                                <img src={icon} alt="" className="h-5 w-5" />
                            )}
                            {symbol}
                        </dd>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <dt className="text-gray-400">{t('send.network')}</dt>
                        <dd className="font-medium">{chainName}</dd>
                    </div>
                </dl>

                <button
                    type="button"
                    onClick={() => setStep('password')}
                    className={cn(PRIMARY_BUTTON_CLASS, 'mt-6')}
                >
                    <Check size={16} />
                    {t('send.confirm')}
                </button>
                <button
                    type="button"
                    onClick={() => setStep('details')}
                    className={SECONDARY_BUTTON_CLASS}
                >
                    {t('send.back')}
                </button>
            </>
        );
    } else if (step === 'password') {
        content = (
            <form onSubmit={confirm} noValidate>
                <p className="text-center text-sm text-gray-500">
                    {formatTokenAmount(value ?? 0n, decimals)} {symbol} →{' '}
                    {recipient && shortenAddress(recipient, 4)}
                </p>

                <label
                    htmlFor="send-password"
                    className="mt-5 block text-sm font-medium"
                >
                    {t('send.password')}
                </label>
                <input
                    id="send-password"
                    type="password"
                    autoFocus
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                        setFailure(null);
                    }}
                    placeholder={t('send.passwordPlaceholder')}
                    aria-invalid={failure === 'password'}
                    className={cn(INPUT_CLASS, errorClass('password'))}
                />

                {failure && (
                    <p role="alert" className="mt-3 text-xs text-red-600">
                        {t(FAILURE_KEYS[failure])}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={busy || !password}
                    className={cn(PRIMARY_BUTTON_CLASS, 'mt-5')}
                >
                    {busy ? (
                        <RefreshCw size={16} className="animate-spin" />
                    ) : (
                        <ArrowUpRight size={16} />
                    )}
                    {busy ? t('send.sending') : t('send.submit', { symbol })}
                </button>
                <button
                    type="button"
                    onClick={() => setStep('review')}
                    className={SECONDARY_BUTTON_CLASS}
                >
                    {t('send.back')}
                </button>
            </form>
        );
    } else {
        content = (
            <form onSubmit={review} noValidate>
                <label htmlFor="send-to" className="block text-sm font-medium">
                    {t('send.address')}
                </label>
                <input
                    id="send-to"
                    value={to}
                    onChange={(event) => {
                        setTo(event.target.value);
                        setFailure(null);
                    }}
                    placeholder={t('send.addressPlaceholder')}
                    spellCheck={false}
                    autoComplete="off"
                    aria-invalid={addressInvalid}
                    className={cn(
                        INPUT_CLASS,
                        'font-mono',
                        addressInvalid ? INPUT_ERROR_CLASS : INPUT_OK_CLASS,
                    )}
                />

                <label
                    htmlFor="send-amount"
                    className="mt-4 block text-sm font-medium"
                >
                    {t('send.amount')}
                </label>
                <div
                    className={cn(
                        'mt-2 flex h-11 items-center rounded-xl border px-4 transition focus-within:ring-2',
                        amountInvalid
                            ? INPUT_ERROR_CLASS
                            : 'border-gray-200 focus-within:border-[#1a73e8] focus-within:ring-blue-50',
                    )}
                >
                    <input
                        id="send-amount"
                        inputMode="decimal"
                        value={amount}
                        onChange={(event) => {
                            setAmount(
                                sanitizeAmount(event.target.value, decimals),
                            );
                        }}
                        placeholder={t('send.amountPlaceholder')}
                        autoComplete="off"
                        aria-invalid={amountInvalid}
                        className="w-full bg-transparent outline-none"
                    />
                    <button
                        type="button"
                        onClick={fillMax}
                        disabled={maxAmount === null}
                        className="ml-3 shrink-0 rounded-full px-2 py-1 text-xs font-semibold text-[#1a73e8] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                        {t('send.max')}
                    </button>
                    <span className="ml-1 flex shrink-0 items-center gap-1.5 text-sm text-gray-400">
                        {icon && <img src={icon} alt="" className="h-5 w-5" />}
                        {symbol}
                    </span>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                    {t('send.available', {
                        amount: formatTokenAmount(
                            maxAmount ?? balance,
                            decimals,
                        ),
                        symbol,
                    })}
                </p>

                {detailsError && (
                    <p role="alert" className="mt-3 text-xs text-red-600">
                        {t(detailsError)}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={!recipient || value === null || amountTooHigh}
                    className={cn(PRIMARY_BUTTON_CLASS, 'mt-5')}
                >
                    <ArrowRight size={16} />
                    {t('send.continue')}
                </button>
            </form>
        );
    }

    return (
        <Modal open={open} onClose={close} title={titles[step]}>
            <div className="mb-5 flex gap-1.5">
                {STEPS.map((name, position) => (
                    <span
                        key={name}
                        className={cn(
                            'h-1 flex-1 rounded-full transition',
                            position <= STEPS.indexOf(step)
                                ? 'bg-[#1a73e8]'
                                : 'bg-gray-200',
                        )}
                    />
                ))}
            </div>

            {content}
        </Modal>
    );
}
