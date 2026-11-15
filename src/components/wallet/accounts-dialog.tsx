import { Check, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';

import { Modal } from '@/components/ui/modal';
import { AddAccountForm } from '@/components/wallet/add-account-form';
import { cn } from '@/lib/utils';
import { shortenAddress } from '@/lib/wallet';

type AccountsDialogProps = {
    open: boolean;
    onClose: () => void;
    accounts: Address[];
    activeIndex: number;
    onSelect: (index: number) => void;
    onAdd: (password: string) => Promise<unknown>;
    onAddManual?: (
        password: string,
        addressOrIndex: string,
    ) => Promise<unknown>;
    onScan?: (password: string) => Promise<number>;
};

export function AccountsDialog({
    open,
    onClose,
    accounts,
    activeIndex,
    onSelect,
    onAdd,
    onAddManual,
    onScan,
}: AccountsDialogProps) {
    const { t } = useTranslation();
    const [adding, setAdding] = useState(false);

    const close = () => {
        setAdding(false);
        onClose();
    };

    return (
        <Modal open={open} onClose={close} title={t('accounts.title')}>
            {adding ? (
                <AddAccountForm
                    onAdd={onAdd}
                    onAddManual={onAddManual}
                    onScan={onScan}
                    onAdded={() => setAdding(false)}
                />
            ) : (
                <>
                    <ul className="space-y-1">
                        {accounts.map((account, index) => {
                            const isActive = index === activeIndex;

                            return (
                                <li key={account}>
                                    <button
                                        type="button"
                                        onClick={() => onSelect(index)}
                                        className={cn(
                                            'flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-gray-50',
                                            isActive && 'bg-gray-50',
                                        )}
                                    >
                                        <span>
                                            <span className="block text-sm font-medium">
                                                {t('accounts.label', {
                                                    index: index + 1,
                                                })}
                                            </span>
                                            <span className="mt-0.5 block font-mono text-xs text-gray-400">
                                                {shortenAddress(account, 6)}
                                            </span>
                                        </span>

                                        {isActive && (
                                            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                                                <Check size={14} />
                                                {t('accounts.active')}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <button
                        type="button"
                        onClick={() => setAdding(true)}
                        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-gray-200 text-sm font-medium transition hover:bg-gray-50"
                    >
                        <Plus size={16} />
                        {t('accounts.add')}
                    </button>
                </>
            )}
        </Modal>
    );
}
