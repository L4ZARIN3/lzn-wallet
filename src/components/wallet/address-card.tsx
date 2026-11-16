import { Check, Copy, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';

import { openExternalUrl } from '@/lib/external';
import { useCopyToClipboard } from '@/lib/use-copy';
import { shortenAddress } from '@/lib/wallet';

type AddressCardProps = {
    address: Address;
    explorerUrl?: string;
    onRemove: () => void;
};

export function AddressCard({
    address,
    explorerUrl,
    onRemove,
}: AddressCardProps) {
    const { t } = useTranslation();
    const { copied, copy } = useCopyToClipboard();

    return (
        <div className="mt-12 flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 p-5 sm:flex-row sm:items-center">
            <div>
                <p className="text-sm font-medium">{t('address.title')}</p>
                <p className="mt-1 font-mono text-sm text-gray-400">
                    {shortenAddress(address, 6)}
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <button
                    type="button"
                    onClick={() => void copy(address)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1a73e8]"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? t('common.copied') : t('address.copy')}
                </button>

                {explorerUrl && (
                    <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => void openExternalUrl(explorerUrl, e)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1a73e8]"
                    >
                        <ExternalLink size={14} />
                        {t('explorer')}
                    </a>
                )}

                <button
                    type="button"
                    onClick={onRemove}
                    className="text-sm text-gray-400 transition hover:text-red-600"
                >
                    {t('address.remove')}
                </button>
            </div>
        </div>
    );
}
