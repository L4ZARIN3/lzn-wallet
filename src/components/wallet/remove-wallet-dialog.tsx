import { AlertTriangle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@/components/ui/modal';

type RemoveWalletDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export function RemoveWalletDialog({
    open,
    onClose,
    onConfirm,
}: RemoveWalletDialogProps) {
    const { t } = useTranslation();
    const [confirmed, setConfirmed] = useState(false);

    const close = () => {
        setConfirmed(false);
        onClose();
    };

    const handleConfirm = () => {
        if (!confirmed) return;
        onConfirm();
    };

    return (
        <Modal open={open} onClose={close} title={t('removeWallet.title')}>
            {/* Ícone de alerta */}
            <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle size={28} className="text-red-500" />
                </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-gray-600">
                {t('removeWallet.description')}
            </p>

            {/* Aviso em destaque */}
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50/60 px-4 py-3">
                <p className="text-xs font-medium leading-relaxed text-red-700">
                    {t('removeWallet.warning')}
                </p>
            </div>

            {/* Checkbox de confirmação */}
            <label className="mt-5 flex cursor-pointer items-start gap-3">
                <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 cursor-pointer rounded accent-red-600"
                />
                <span className="select-none text-sm text-gray-700">
                    {t('removeWallet.confirm')}
                </span>
            </label>

            {/* Ações */}
            <div className="mt-6 flex flex-col gap-2">
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!confirmed}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-red-600 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Trash2 size={16} />
                    {t('removeWallet.submit')}
                </button>

                <button
                    type="button"
                    onClick={close}
                    className="h-9 w-full rounded-full text-sm text-gray-500 transition hover:bg-gray-50"
                >
                    {t('common.cancel')}
                </button>
            </div>
        </Modal>
    );
}
