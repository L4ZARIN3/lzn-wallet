import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    className?: string;
};

export function Modal({ open, onClose, title, children, className }: ModalProps) {
    const { t } = useTranslation();

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label={t('common.close')}
                onClick={onClose}
                className="absolute inset-0 cursor-default bg-[#202124]/40"
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={cn(
                    'relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl',
                    className,
                )}
            >
                <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-semibold tracking-tight">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t('common.close')}
                        className="text-gray-400 transition hover:text-gray-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-5">{children}</div>
            </div>
        </div>,
        document.body,
    );
}
