import { RefreshCw, Search, Sparkles, UserPlus } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';
import { activeChain } from '@/lib/wagmi';

type Tab = 'next' | 'manual' | 'scan';

type AddAccountFormProps = {
    /** Deriva a próxima conta sequencial. */
    onAdd: (password: string) => Promise<unknown>;
    /** Deriva conta específica por endereço ou índice, com checagem estrita da seed. */
    onAddManual?: (
        password: string,
        addressOrIndex: string,
    ) => Promise<unknown>;
    /** Escaneia a rede ativa usando BIP-44 e importa contas ativas. */
    onScan?: (password: string) => Promise<number>;
    /** Chamado após o sucesso, para a view voltar à lista de contas. */
    onAdded: () => void;
};

export function AddAccountForm({
    onAdd,
    onAddManual,
    onScan,
    onAdded,
}: AddAccountFormProps) {
    const { t } = useTranslation();
    const [tab, setTab] = useState<Tab>('next');

    const [password, setPassword] = useState('');
    const [addressOrIndex, setAddressOrIndex] = useState('');

    const [busy, setBusy] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [scanSummary, setScanSummary] = useState<string | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const resetErrors = () => {
        setErrorMessage(null);
        setScanSummary(null);
    };

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setBusy(true);
        resetErrors();

        try {
            if (tab === 'next') {
                await onAdd(password);
                onAdded();
            } else if (tab === 'manual') {
                if (!onAddManual) {
                    throw new Error('not-supported');
                }
                const target = addressOrIndex.trim();
                if (!target) {
                    setErrorMessage(t('addAccount.addressNotDerived'));
                    setBusy(false);
                    return;
                }
                await onAddManual(password, target);
                onAdded();
            } else if (tab === 'scan') {
                if (!onScan) {
                    throw new Error('not-supported');
                }
                const addedCount = await onScan(password);
                if (addedCount > 0) {
                    setScanSummary(
                        t('addAccount.scanResults', { count: addedCount }),
                    );
                    timeoutRef.current = setTimeout(() => {
                        onAdded();
                    }, 1200);
                } else {
                    setScanSummary(t('addAccount.scanNone'));
                }
            }
        } catch (error) {
            const err = error as Error;
            if (
                err.message === 'address-not-derived' ||
                err.message === 'invalid-address-format' ||
                err.message === 'invalid-index'
            ) {
                setErrorMessage(t('addAccount.addressNotDerived'));
            } else if (err.message === 'invalid-password') {
                setErrorMessage(t('addAccount.incorrect'));
            } else {
                setErrorMessage(
                    err.message || t('create.messages.keystore'),
                );
            }
        } finally {
            setBusy(false);
        }
    };

    return (
        <div>
            {/* Tabs */}
            <div className="mb-4 flex rounded-xl bg-gray-100 p-1 text-xs font-medium">
                <button
                    type="button"
                    onClick={() => {
                        setTab('next');
                        resetErrors();
                    }}
                    className={cn(
                        'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 transition',
                        tab === 'next'
                            ? 'bg-white text-gray-900 shadow-xs font-semibold'
                            : 'text-gray-500 hover:text-gray-900',
                    )}
                >
                    <UserPlus size={13} />
                    {t('addAccount.tabs.next')}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setTab('manual');
                        resetErrors();
                    }}
                    className={cn(
                        'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 transition',
                        tab === 'manual'
                            ? 'bg-white text-gray-900 shadow-xs font-semibold'
                            : 'text-gray-500 hover:text-gray-900',
                    )}
                >
                    <Search size={13} />
                    {t('addAccount.tabs.manual')}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setTab('scan');
                        resetErrors();
                    }}
                    className={cn(
                        'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 transition',
                        tab === 'scan'
                            ? 'bg-white text-gray-900 shadow-xs font-semibold'
                            : 'text-gray-500 hover:text-gray-900',
                    )}
                >
                    <Sparkles size={13} />
                    {t('addAccount.tabs.scan')}
                </button>
            </div>

            <form onSubmit={submit} noValidate>
                {tab === 'next' && (
                    <p className="text-sm text-gray-500">
                        {t('addAccount.description')}
                    </p>
                )}

                {tab === 'manual' && (
                    <>
                        <label
                            htmlFor="manual-address-input"
                            className="block text-sm font-medium"
                        >
                            {t('addAccount.addressLabel')}
                        </label>
                        <input
                            id="manual-address-input"
                            type="text"
                            value={addressOrIndex}
                            onChange={(e) => {
                                setAddressOrIndex(e.target.value);
                                resetErrors();
                            }}
                            placeholder={t('addAccount.addressPlaceholder')}
                            className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-4 font-mono text-sm transition outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-50"
                        />
                    </>
                )}

                {tab === 'scan' && (
                    <p className="text-sm text-gray-500">
                        {t('addAccount.scanDescription', {
                            chain: activeChain.name,
                        })}
                    </p>
                )}

                {/* Campo de Senha para autenticar a ação */}
                <label
                    htmlFor="account-password"
                    className="mt-4 block text-sm font-medium"
                >
                    {t('addAccount.password')}
                </label>

                <input
                    id="account-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                        resetErrors();
                    }}
                    placeholder={t('addAccount.placeholder')}
                    aria-invalid={Boolean(errorMessage)}
                    className={cn(
                        'mt-2 h-11 w-full rounded-xl border px-4 transition outline-none focus:ring-2',
                        errorMessage
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-50'
                            : 'border-gray-200 focus:border-[#1a73e8] focus:ring-blue-50',
                    )}
                />

                {errorMessage && (
                    <p role="alert" className="mt-2 text-xs text-red-600">
                        {errorMessage}
                    </p>
                )}

                {scanSummary && (
                    <p className="mt-2 text-xs font-medium text-emerald-600">
                        {scanSummary}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={
                        busy ||
                        password.length === 0 ||
                        (tab === 'manual' && addressOrIndex.trim().length === 0)
                    }
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#1a73e8] text-sm font-medium text-white transition hover:bg-[#1765cc] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {busy && <RefreshCw size={16} className="animate-spin" />}
                    {tab === 'scan'
                        ? t(
                              busy
                                  ? 'addAccount.scanning'
                                  : 'addAccount.scanButton',
                          )
                        : t('addAccount.submit')}
                </button>
            </form>
        </div>
    );
}
