import { Check, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';

import { Modal } from '@/components/ui/modal';
import { useCopyToClipboard } from '@/lib/use-copy';

type ReceiveDialogProps = {
    open: boolean;
    onClose: () => void;
    address: Address;
    chainName: string;
};

export function ReceiveDialog({
    open,
    onClose,
    address,
    chainName,
}: ReceiveDialogProps) {
    const { t } = useTranslation();
    const { copied, copy } = useCopyToClipboard();

    return (
        <Modal open={open} onClose={onClose} title={t('receive.title')}>
            <p className="text-sm text-gray-500">{t('receive.description')}</p>

            <div className="mt-5 flex justify-center rounded-2xl border border-gray-100 p-5">
                <QRCodeSVG
                    value={address}
                    size={176}
                    level="M"
                    fgColor="#202124"
                    bgColor="#ffffff"
                />
            </div>

            <p className="mt-5 text-center font-mono text-sm break-all text-gray-600">
                {address}
            </p>

            <button
                type="button"
                onClick={() => void copy(address)}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#1a73e8] text-sm font-medium text-white transition hover:bg-[#1765cc]"
            >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? t('common.copied') : t('receive.copy')}
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
                {t('receive.warning', { chain: chainName })}
            </p>
        </Modal>
    );
}
