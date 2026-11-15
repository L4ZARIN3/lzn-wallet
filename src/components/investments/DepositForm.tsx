import { useEffect, useState, type FormEvent } from 'react';
import {
    createWalletClient,
    formatEther,
    http,
    parseEther,
    type Address,
    type Hash,
    BaseError,
} from 'viem';
import {
    useBalance,
    usePublicClient,
    useWaitForTransactionReceipt,
} from 'wagmi';
import { CheckCircle2, ExternalLink, Loader2, XCircle } from 'lucide-react';

import {
    INVEST,
    INVESTMENT_CONFIG,
    savingsXDaiAdapterAbi,
} from '@/constants/investments';
import { ConfirmDialog } from '@/components/investments/ConfirmDialog';
import { addressHasCode, CONTRACT_CODE_WARNING } from '@/lib/account-safety';
import { fmt } from '@/utils/format';
import { unlockAccount, type StoredWallet } from '@/lib/keystore';
import { activeChain, supportedChains } from '@/lib/wagmi';

type DepositFormProps = {
    wallet?: StoredWallet;
    accountIndex?: number;
    userAddress: Address;
    onSuccess: () => void;
};

function formatErrorFriendly(err: unknown): string {
    if (!err) return 'Ocorreu um erro desconhecido.';
    const msg = (err as Error)?.message || String(err);
    if (msg.includes('password') || msg.includes('operation-failed') || msg.includes('decrypt')) {
        return 'Senha incorreta. Tente novamente.';
    }
    if (msg.includes('insufficient funds') || msg.includes('exceeds balance')) {
        return 'Saldo insuficiente para pagar o valor e a taxa de gás.';
    }
    if (err instanceof BaseError) {
        return err.shortMessage || err.message;
    }
    return msg;
}

export function DepositForm({
    wallet,
    accountIndex,
    userAddress,
    onSuccess,
}: DepositFormProps) {
    const [amountStr, setAmountStr] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [isSigning, setIsSigning] = useState(false);
    const [txHash, setTxHash] = useState<Hash | undefined>(undefined);
    const [statusError, setStatusError] = useState<string | null>(null);

    // Carteira exclusivamente local (keystore): a rede é sempre a cadeia
    // ativa do app, definida via .env. Sem suporte a carteiras externas.
    const chainId = activeChain.id;
    const investConfig = INVEST[chainId];
    const isSupported = Boolean(investConfig);
    const currentChain = supportedChains.find((c) => c.id === chainId) || activeChain;

    const publicClient = usePublicClient({ chainId });

    // Saldo nativo de xDAI (atualização automática a cada 15s)
    const { data: balanceData, refetch: refetchBalance } = useBalance({
        address: userAddress,
        chainId,
        query: {
            refetchInterval: 15_000,
            refetchIntervalInBackground: true,
        },
    });

    const nativeBalance = balanceData?.value ?? 0n;
    const gasReserve = INVESTMENT_CONFIG.gasReserveWei;
    const maxDeposit = nativeBalance > gasReserve ? nativeBalance - gasReserve : 0n;

    // Espera pelo recibo da transação
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        error: receiptError,
    } = useWaitForTransactionReceipt({
        hash: txHash,
        chainId,
    });

    // Ao confirmar com sucesso, avisa o componente pai
    useEffect(() => {
        if (!isConfirmed || !txHash) {
            return;
        }

        const timer = setTimeout(() => {
            onSuccess();
            void refetchBalance();
        }, 1000);

        return () => clearTimeout(timer);
    }, [isConfirmed, txHash, onSuccess, refetchBalance]);

    const handleMaxClick = () => {
        setValidationError(null);
        setStatusError(null);
        if (!isSupported) {
            setAmountStr('0');
            setValidationError('Investimentos indisponíveis nesta rede.');
            return;
        }
        if (maxDeposit <= 0n) {
            setAmountStr('0');
            setValidationError(
                `Saldo insuficiente para cobrir o depósito e a reserva mínima de gás (${fmt(gasReserve)} xDAI).`
            );
            return;
        }
        setAmountStr(formatEther(maxDeposit));
    };

    const handleAmountChange = (val: string) => {
        if (/^[0-9]*\.?[0-9]*$/.test(val)) {
            setAmountStr(val);
            setValidationError(null);
            setStatusError(null);
        }
    };

    const handleOpenReview = async (e: FormEvent) => {
        e.preventDefault();
        setValidationError(null);
        setStatusError(null);

        if (!investConfig) {
            setValidationError('Investimentos indisponíveis nesta rede.');
            return;
        }

        let parsedWei: bigint;
        try {
            parsedWei = parseEther(amountStr);
        } catch {
            setValidationError('Informe um valor válido em xDAI.');
            return;
        }

        if (parsedWei <= 0n) {
            setValidationError('O valor de depósito deve ser maior que zero.');
            return;
        }

        if (parsedWei > maxDeposit) {
            setValidationError(
                `Valor excede o limite disponível (${fmt(maxDeposit)} xDAI), reservando ${fmt(gasReserve)} xDAI para gás.`
            );
            return;
        }

        // Simulação prévia obrigatória com viem / RPC
        setIsSimulating(true);
        try {
            if (!publicClient) {
                throw new Error('Cliente RPC da rede não disponível.');
            }

            // Proteção: endereço com código on-chain (delegação EIP-7702 etc.)
            // pode drenar fundos ao receber chamadas — bloqueia antes de operar.
            if (await addressHasCode(publicClient, userAddress)) {
                setValidationError(CONTRACT_CODE_WARNING);
                return;
            }

            await publicClient.simulateContract({
                address: investConfig.adapterAddress,
                abi: savingsXDaiAdapterAbi,
                functionName: 'depositXDAI',
                args: [userAddress],
                value: parsedWei,
                account: userAddress,
            });

            // Abre modal para confirmar e assinar com a senha da carteira
            setConfirmOpen(true);
        } catch (simErr) {
            setStatusError(`Falha na simulação prévia: ${formatErrorFriendly(simErr)}`);
        } finally {
            setIsSimulating(false);
        }
    };

    // Assina e transmite exclusivamente com o keystore local autônomo
    const handleConfirmDeposit = async (password?: string) => {
        if (!investConfig) {
            setStatusError('Investimentos indisponíveis nesta rede.');
            return;
        }

        const parsedWei = parseEther(amountStr);
        setStatusError(null);
        setIsSigning(true);

        try {
            if (!wallet || accountIndex === undefined || !password) {
                throw new Error('Nenhuma carteira disponível para autorizar a operação.');
            }

            // Transação assinada localmente com a chave privada decriptada em memória
            const account = await unlockAccount(wallet, password, accountIndex);

            const walletClient = createWalletClient({
                account,
                chain: currentChain,
                transport: http(currentChain.rpcUrls.default.http[0]),
            });

            const hash: Hash = await walletClient.writeContract({
                address: investConfig.adapterAddress,
                abi: savingsXDaiAdapterAbi,
                functionName: 'depositXDAI',
                args: [userAddress],
                value: parsedWei,
            });

            setTxHash(hash);
        } catch (err: unknown) {
            setStatusError(formatErrorFriendly(err));
            throw err;
        } finally {
            setIsSigning(false);
        }
    };

    const explorerBaseUrl = currentChain.blockExplorers?.default?.url || (chainId === 100 ? INVESTMENT_CONFIG.gnosisscanUrl : null);
    const explorerTxUrl = txHash && explorerBaseUrl
        ? `${explorerBaseUrl}/tx/${txHash}`
        : null;

    return (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">
                Depositar no {INVESTMENT_CONFIG.displayName}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
                Envie xDAI nativo diretamente para o Adapter para receber cotas de {INVESTMENT_CONFIG.shareSymbol}.
            </p>

            <form onSubmit={handleOpenReview} className="mt-5 space-y-4">
                {!isSupported && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 font-medium">
                        Investimentos indisponíveis nesta rede
                    </div>
                )}

                <div>
                    <div className="flex items-center justify-between text-xs">
                        <label htmlFor="deposit-amount" className="font-medium text-gray-700">
                            Valor a depositar (xDAI)
                        </label>
                        <span className="text-gray-500">
                            Disponível: <span className="font-mono font-medium text-gray-800" title={formatEther(nativeBalance)}>{fmt(nativeBalance)}</span> xDAI
                        </span>
                    </div>

                    <div className="relative mt-2">
                        <input
                            id="deposit-amount"
                            type="text"
                            inputMode="decimal"
                            value={amountStr}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            placeholder="Ex: 1.0"
                            disabled={!isSupported || isSigning || isConfirming}
                            className="h-11 w-full rounded-xl border border-gray-200 px-4 pr-16 text-sm font-mono transition outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-50 disabled:bg-gray-50"
                        />
                        <button
                            type="button"
                            onClick={handleMaxClick}
                            disabled={!isSupported || isSigning || isConfirming}
                            className="absolute right-2.5 top-2 h-7 rounded-lg bg-gray-100 px-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition disabled:opacity-50"
                        >
                            Máx
                        </button>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-400">
                        <span>Reserva estimada para gás: {fmt(gasReserve)} xDAI</span>
                        {maxDeposit > 0n && (
                            <span>Máximo recomendado: {fmt(maxDeposit)} xDAI</span>
                        )}
                    </div>

                    {validationError && (
                        <p className="mt-2 text-xs text-red-600 font-medium">
                            {validationError}
                        </p>
                    )}
                </div>

                {statusError && (
                    <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
                        <XCircle size={16} className="shrink-0 mt-0.5" />
                        <div>{statusError}</div>
                    </div>
                )}

                {receiptError && (
                    <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
                        <XCircle size={16} className="shrink-0 mt-0.5" />
                        <div>Falha na confirmação: {formatErrorFriendly(receiptError)}</div>
                    </div>
                )}

                {/* Feedback de Estados */}
                {isSigning && (
                    <div className="flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-xs text-blue-700">
                        <Loader2 size={16} className="animate-spin shrink-0" />
                        <span>Assinando localmente e transmitindo a transação...</span>
                    </div>
                )}

                {isConfirming && txHash && (
                    <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 space-y-1">
                        <div className="flex items-center gap-2 font-medium">
                            <Loader2 size={15} className="animate-spin shrink-0" />
                            <span>Transação enviada! Aguardando confirmação na rede...</span>
                        </div>
                        {explorerTxUrl && (
                            <a
                                href={explorerTxUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 hover:underline pt-1"
                            >
                                Ver no explorador: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                                <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                )}

                {isConfirmed && txHash && (
                    <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 space-y-1">
                        <div className="flex items-center gap-2 font-medium">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                            <span>Depósito confirmado com sucesso na {currentChain.name}!</span>
                        </div>
                        {explorerTxUrl && (
                            <a
                                href={explorerTxUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 hover:underline pt-1"
                            >
                                Ver no explorador
                                <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!isSupported || isSigning || isConfirming || isSimulating || !amountStr || amountStr === '0'}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#1a73e8] text-sm font-medium text-white transition hover:bg-[#1765cc] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {!isSupported ? (
                        'Investimentos indisponíveis nesta rede'
                    ) : isSimulating ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Simulando transação...
                        </>
                    ) : isSigning ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Assinando...
                        </>
                    ) : isConfirming ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Confirmando na rede...
                        </>
                    ) : (
                        'Revisar e Depositar'
                    )}
                </button>
            </form>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDeposit}
                title="Confirmar Depósito"
                actionLabel="Assinar e Depositar"
                amountDisplay={`${amountStr} xDAI`}
                targetContractAddress={investConfig?.adapterAddress ?? ''}
                targetContractName="SavingsXDaiAdapter (depositXDAI)"
                requiresPassword={Boolean(wallet)}
            />
        </div>
    );
}
