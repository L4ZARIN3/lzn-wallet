import { AlertCircle, ArrowRightLeft } from 'lucide-react';
import { useAccount, useSwitchChain } from 'wagmi';
import { GNOSIS_CHAIN_ID, INVEST } from '@/constants/investments';
import { activeChain } from '@/lib/wagmi';

type NetworkGateProps = {
    children: React.ReactNode;
};

export function NetworkGate({ children }: NetworkGateProps) {
    const { chainId: accountChainId } = useAccount();
    // Carteira local (keystore) opera na cadeia ativa do app (definida via .env);
    // carteira conectada usa a cadeia informada pelo conector.
    const chainId = accountChainId ?? activeChain.id;
    const { switchChain, isPending, error } = useSwitchChain();

    // Em vez de comparar estritamente com 100, só mostra o aviso se a chain NÃO estiver no mapa INVEST
    const isSupported = chainId ? Boolean(INVEST[chainId]) : false;
    const isWrongNetwork = !isSupported;

    return (
        <>
            {isWrongNetwork && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 text-center shadow-sm mb-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-gray-900">
                        Investimentos indisponíveis nesta rede
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                        O Savings xDAI (sDAI) não está disponível na rede atual (Chain ID: {chainId}).
                        Por favor, alterne a rede da sua carteira para continuar.
                    </p>

                    {error && (
                        <p className="mt-3 text-xs text-red-600">
                            {error.message || 'Não foi possível solicitar a troca de rede.'}
                        </p>
                    )}

                    <div className="mt-5 flex justify-center">
                        <button
                            type="button"
                            onClick={() => switchChain({ chainId: GNOSIS_CHAIN_ID })}
                            disabled={isPending}
                            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1a73e8] px-6 text-sm font-medium text-white transition hover:bg-[#1765cc] disabled:opacity-50 shadow-sm"
                        >
                            <ArrowRightLeft size={16} />
                            {isPending ? 'Alternando rede...' : 'Trocar para Gnosis Chain'}
                        </button>
                    </div>
                </div>
            )}
            {children}
        </>
    );
}
