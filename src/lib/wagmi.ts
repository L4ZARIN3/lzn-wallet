import { defineChain, http, type Chain } from 'viem';
import { createConfig } from 'wagmi';
import {
    gnosis as defaultGnosis,
    gnosisChiado as defaultChiado,
} from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

import chainsConfigJson from '@/config/chains.json';

/** Estrutura de cada rede descrita no JSON central de configuração. */
interface RpcChainConfig {
    id: number;
    name: string;
    rpcUrls: string[];
    blockExplorer?: { name: string; url: string };
    testnet?: boolean;
}

const CHAINS_CONFIG = chainsConfigJson as Record<string, RpcChainConfig>;

/** Rede usada quando `VITE_ACTIVE_CHAIN` não é definida ou não é reconhecida. */
const DEFAULT_CHAIN_KEY = 'gnosis';

function requireChainConfig(key: string): RpcChainConfig {
    const config = CHAINS_CONFIG[key];

    if (!config) {
        throw new Error(
            `Rede "${key}" não encontrada em src/config/chains.json.`,
        );
    }

    return config;
}

/**
 * Resolve a rede ativa a partir de `VITE_ACTIVE_CHAIN`, aceitando tanto o
 * nome (ex.: `gnosis`, `chiado`, `anvil-fork`) quanto o id numérico
 * (ex.: `100`, `10200`, `31337`).
 */
function resolveActiveChainKey(): string {
    const raw = import.meta.env?.VITE_ACTIVE_CHAIN?.trim();

    if (!raw) {
        return DEFAULT_CHAIN_KEY;
    }

    if (CHAINS_CONFIG[raw]) {
        return raw;
    }

    const byId = Object.entries(CHAINS_CONFIG).find(
        ([, config]) => String(config.id) === raw,
    );

    if (byId) {
        return byId[0];
    }

    console.warn(
        `VITE_ACTIVE_CHAIN="${raw}" não corresponde a nenhuma rede em ` +
            `src/config/chains.json. Usando "${DEFAULT_CHAIN_KEY}".`,
    );

    return DEFAULT_CHAIN_KEY;
}

/** Aplica o RPC e o explorador vindos do JSON sobre uma chain base do wagmi. */
function withRpcConfig(base: Chain, config: RpcChainConfig): Chain {
    return {
        ...base,
        rpcUrls: {
            ...base.rpcUrls,
            default: { http: config.rpcUrls },
        },
        blockExplorers: config.blockExplorer
            ? {
                  ...base.blockExplorers,
                  default: {
                      name: config.blockExplorer.name,
                      url: config.blockExplorer.url,
                  },
              }
            : base.blockExplorers,
    };
}

const gnosisConfig = requireChainConfig('gnosis');
const chiadoConfig = requireChainConfig('chiado');
const forkConfig = requireChainConfig('anvil-fork');

/** Gnosis Chain (mainnet) enriquecida com o RPC/explorador do JSON. */
export const gnosis: Chain = withRpcConfig(defaultGnosis, gnosisConfig);

/** Gnosis Chiado (testnet) enriquecida com o RPC/explorador do JSON. */
export const chiado: Chain = withRpcConfig(defaultChiado, chiadoConfig);

/**
 * Definição do fork local da Gnosis Chain via Anvil (chainId 31337).
 * Moeda nativa definida como xDAI para manter consistência nos erros e na UI.
 */
export const gnosisFork: Chain = defineChain({
    id: forkConfig.id,
    name: forkConfig.name,
    nativeCurrency: {
        name: 'xDAI',
        symbol: 'XDAI',
        decimals: 18,
    },
    rpcUrls: {
        default: { http: forkConfig.rpcUrls },
    },
    ...(forkConfig.blockExplorer
        ? {
              blockExplorers: {
                  default: {
                      name: forkConfig.blockExplorer.name,
                      url: forkConfig.blockExplorer.url,
                  },
              },
          }
        : {}),
    testnet: forkConfig.testnet ?? true,
});

const CHAIN_BY_KEY: Record<string, Chain> = {
    gnosis,
    chiado,
    'anvil-fork': gnosisFork,
};

/**
 * Cadeia ativa do dashboard: define de onde vêm saldos, cotações e o
 * histórico de transações. Controlada por `VITE_ACTIVE_CHAIN` (nome ou id).
 */
export const activeChain: Chain = CHAIN_BY_KEY[resolveActiveChainKey()];

/** Cadeias atendidas pelo app. */
export const supportedChains = [gnosis, gnosisFork, chiado] as const;

if (typeof window !== 'undefined') {
    if (typeof (window as any).addEventListener !== 'function') {
        (window as any).addEventListener = () => {};
    }
    if (typeof (window as any).removeEventListener !== 'function') {
        (window as any).removeEventListener = () => {};
    }
    if (typeof (window as any).dispatchEvent !== 'function') {
        (window as any).dispatchEvent = () => false;
    }
}

/** Transportes HTTP direcionados aos RPCs descritos no JSON central. */
const transports = {
    [gnosis.id]: http(gnosis.rpcUrls.default.http[0]),
    [gnosisFork.id]: http(gnosisFork.rpcUrls.default.http[0]),
    [chiado.id]: http(chiado.rpcUrls.default.http[0]),
};

/**
 * Configuração wagmi: transportes HTTP direcionados aos RPCs configurados,
 * suporte a carteiras injetadas (MetaMask, Rabby) e leitura para self-custodial.
 */
export const wagmiConfig = createConfig({
    chains: supportedChains,
    connectors: [injected()],
    transports,
    ssr: false,
});
