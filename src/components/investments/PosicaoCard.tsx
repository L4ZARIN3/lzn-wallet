import { AlertTriangle, RefreshCw, TrendingUp } from 'lucide-react';
import { fmt } from '@/utils/format';
import { INVESTMENT_CONFIG } from '@/constants/investments';

type PosicaoCardProps = {
    shares: bigint | undefined;
    assetsInXDai: bigint | undefined;
    sharePriceInXDai: bigint | undefined;
    isLoading: boolean;
    isError: boolean;
    isSupported?: boolean;
    onRefresh: () => void;
};

/**
 * Formata um valor em BigInt para exibição com ARREDONDAMENTO (nunca trunca).
 * Apenas exibição — transações continuam usando o valor exato em wei.
 */
function formatDisplay(wei: bigint | undefined, casas: number): string {
    return wei === undefined ? '—' : fmt(wei, casas);
}

export function PosicaoCard({
    shares,
    assetsInXDai,
    sharePriceInXDai,
    isLoading,
    isError,
    isSupported = true,
    onRefresh,
}: PosicaoCardProps) {
    const formattedShares = isSupported ? formatDisplay(shares, 4) : '—';
    const formattedAssets = isSupported ? formatDisplay(assetsInXDai, 4) : '—';
    const formattedPrice = isSupported ? formatDisplay(sharePriceInXDai, 6) : '—';

    return (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <img
                            src={INVESTMENT_CONFIG.icon}
                            alt={INVESTMENT_CONFIG.displayName}
                            className="h-8 w-8 rounded-full shadow-xs object-cover"
                        />
                        <h2 className="text-lg font-semibold text-gray-900">
                            {INVESTMENT_CONFIG.displayName}
                        </h2>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            ERC-4626
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        {INVESTMENT_CONFIG.backingInfo}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={isLoading || !isSupported}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition disabled:opacity-50"
                    title="Atualizar saldo e cotação"
                >
                    <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>

            {!isSupported ? (
                <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
                    Investimentos indisponíveis nesta rede.
                </div>
            ) : isError ? (
                <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">
                    Não foi possível consultar os dados da posição. Verifique sua conexão com o RPC da rede.
                </div>
            ) : (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-gray-50/70 p-4 border border-gray-100">
                        <span className="text-xs font-medium text-gray-500">
                            Saldo em {INVESTMENT_CONFIG.assetSymbol} (Convertido)
                        </span>
                        <div className="mt-1.5 text-2xl font-bold text-gray-900 font-mono tracking-tight">
                            {isLoading ? (
                                <span className="inline-block h-7 w-24 animate-pulse rounded bg-gray-200" />
                            ) : (
                                `${formattedAssets} ${INVESTMENT_CONFIG.assetSymbol}`
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl bg-gray-50/70 p-4 border border-gray-100">
                        <span className="text-xs font-medium text-gray-500">
                            Saldo de Cotas ({INVESTMENT_CONFIG.shareSymbol})
                        </span>
                        <div className="mt-1.5 text-2xl font-bold text-gray-800 font-mono tracking-tight">
                            {isLoading ? (
                                <span className="inline-block h-7 w-20 animate-pulse rounded bg-gray-200" />
                            ) : (
                                `${formattedShares} ${INVESTMENT_CONFIG.shareSymbol}`
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl bg-gray-50/70 p-4 border border-gray-100">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <TrendingUp size={13} className="text-emerald-600" />
                            <span>Preço da Cota</span>
                        </div>
                        <div className="mt-1.5 text-xl font-semibold text-gray-800 font-mono tracking-tight">
                            {isLoading ? (
                                <span className="inline-block h-7 w-24 animate-pulse rounded bg-gray-200" />
                            ) : (
                                `1 ${INVESTMENT_CONFIG.shareSymbol} = ${formattedPrice} ${INVESTMENT_CONFIG.assetSymbol}`
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Alerta de Risco Obrigatório */}
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-200/70 bg-amber-50/60 p-3.5 text-xs text-amber-900">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
                <div className="space-y-0.5">
                    <p className="font-medium text-amber-950">Aviso sobre riscos e rendimento</p>
                    <p className="text-amber-800">
                        O rendimento do {INVESTMENT_CONFIG.displayName} é variável e reflete a taxa do protocolo subjacente.
                        Interações com contratos inteligentes envolvem risco de contrato e volatilidade.
                    </p>
                </div>
            </div>
        </div>
    );
}
