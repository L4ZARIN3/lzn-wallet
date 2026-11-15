import { useState, type FormEvent } from 'react';
import { AlertTriangle, ExternalLink, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { INVESTMENT_CONFIG } from '@/constants/investments';
import { Modal } from '@/components/ui/modal';

type ConfirmDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: (password?: string) => Promise<void> | void;
    title: string;
    actionLabel: string;
    amountDisplay: string;
    targetContractAddress: string;
    targetContractName: string;
    isSimulating?: boolean;
    warningMessage?: string;
    requiresPassword?: boolean;
};

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    actionLabel,
    amountDisplay,
    targetContractAddress,
    targetContractName,
    isSimulating = false,
    warningMessage,
    requiresPassword = false,
}: ConfirmDialogProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const explorerUrl = `${INVESTMENT_CONFIG.gnosisscanUrl}/address/${targetContractAddress}`;

    const handleClose = () => {
        setPassword('');
        setError(null);
        setSubmitting(false);
        onClose();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (requiresPassword && !password) {
            setError('Digite sua senha para autorizar a assinatura.');
            return;
        }

        setError(null);
        setSubmitting(true);
        try {
            await onConfirm(requiresPassword ? password : undefined);
            handleClose();
        } catch (err: unknown) {
            const msg = (err as Error)?.message || String(err);
            if (msg.includes('password') || msg.includes('operation-failed') || msg.includes('decrypt')) {
                setError('Senha incorreta. Tente novamente.');
            } else {
                setError(msg || 'Falha ao assinar a transação.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose} title={title}>
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                    <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Valor da Operação
                    </div>
                    <div className="mt-1 text-2xl font-bold text-gray-900 font-mono">
                        {amountDisplay}
                    </div>
                </div>

                <div className="rounded-xl border border-gray-100 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Contrato de Destino</span>
                        <span className="font-semibold text-gray-700">
                            {targetContractName}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-gray-800 break-all select-all">
                            {targetContractAddress}
                        </span>
                        <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-2 inline-flex items-center text-blue-600 hover:text-blue-700 shrink-0"
                            title="Ver no Gnosisscan"
                        >
                            <ExternalLink size={14} />
                        </a>
                    </div>
                </div>

                {warningMessage ? (
                    <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200/60">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                        <div>{warningMessage}</div>
                    </div>
                ) : (
                    <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 p-3 text-xs text-blue-800 border border-blue-200/60">
                        <ShieldCheck size={16} className="shrink-0 mt-0.5 text-blue-600" />
                        <div>
                            {requiresPassword
                                ? 'Transação pré-simulada com sucesso. A assinatura é realizada exclusivamente na memória local do seu dispositivo.'
                                : 'Transação pré-simulada com sucesso. A assinatura será solicitada diretamente na sua carteira conectada.'}
                        </div>
                    </div>
                )}

                {/* Campo de Senha da Carteira (apenas para carteira interna local) */}
                {requiresPassword && (
                    <div>
                        <label htmlFor="confirm-password" className="block text-xs font-medium text-gray-700">
                            Senha da Carteira
                        </label>
                        <div className="relative mt-1.5">
                            <input
                                id="confirm-password"
                                type="password"
                                autoFocus
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(null);
                                }}
                                placeholder="Digite sua senha para assinar"
                                disabled={submitting || isSimulating}
                                className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm font-mono outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-50 disabled:bg-gray-50"
                            />
                            <div className="absolute right-3 top-3 text-gray-400">
                                <KeyRound size={18} />
                            </div>
                        </div>
                        {error && (
                            <p className="mt-2 text-xs font-medium text-red-600">
                                {error}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={submitting || isSimulating}
                        className="h-11 flex-1 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || isSimulating || (requiresPassword && !password)}
                        className="h-11 flex-1 rounded-full bg-[#1a73e8] text-sm font-medium text-white hover:bg-[#1765cc] transition flex items-center justify-center gap-2 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Assinando...</span>
                            </>
                        ) : (
                            actionLabel
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
