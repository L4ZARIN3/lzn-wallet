import { KeyRound, Plus, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from "wouter";

type EmptyWalletProps = {
    chainName: string;
};

export function EmptyWallet({ chainName }: EmptyWalletProps) {
    const { t } = useTranslation();
    const [, navigate] = useLocation();

    return (
        <div className="rounded-2xl border border-gray-100 px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f0fe] text-[#1967d2]">
                <Wallet size={22} />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">
                {t('empty.title')}
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
                {t('empty.description', { chain: chainName })}
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                    type="button"
                    onClick={() => navigate("/create")}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1a73e8] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1765cc]"
                >
                    <Plus size={17} />
                    {t('empty.create')}
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/recover")}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    <KeyRound size={17} />
                    {t('empty.recover')}
                </button>
            </div>
        </div>
    );
}
