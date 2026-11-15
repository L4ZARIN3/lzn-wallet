import { parseAbi, type Address } from 'viem';

import { gnosis } from '@/lib/wagmi';

/**
 * Constantes centralizadas para a área de Investimentos (Savings xDAI).
 */
export const GNOSIS_CHAIN_ID = 100 as const;
export const ANVIL_FORK_CHAIN_ID = 31337 as const;
export const CHIADO_CHAIN_ID = 10200 as const;

/** Vault sDAI (ERC-4626 / ERC-20 na Gnosis Chain) */
export const SDAI_VAULT_ADDRESS: Address =
    (import.meta.env?.VITE_SDAI_VAULT_ADDRESS as Address) ||
    '0xaf204776c7245bF4147c2612BF6e5972Ee483701';

/** Ativo do vault sDAI (Wrapped xDAI) */
export const WXDAI_ADDRESS: Address =
    (import.meta.env?.VITE_WXDAI_ADDRESS as Address) ||
    '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d';

/**
 * Adapter oficial para depósitos e saques diretos de xDAI nativo.
 * Verificado na Gnosis Chain e expõe depositXDAI, withdrawXDAI e redeemXDAI.
 */
export const SAVINGS_XDAI_ADAPTER_ADDRESS: Address =
    (import.meta.env?.VITE_SAVINGS_XDAI_ADAPTER_ADDRESS as Address) ||
    '0xD499b51fcFc66bd31248ef4b28d656d67E591A94';

export interface InvestChainConfig {
    adapter: Address;
    adapterAddress: Address;
    vault: Address;
    vaultAddress: Address;
}

/**
 * Mapeamento centralizado de contratos de investimentos por chainId.
 * - 100 (Gnosis mainnet): adapter oficial e vault sDAI
 * - 31337 (fork local do Anvil): os mesmos endereços da mainnet
 * - 10200 (Chiado, testes): mock a ser configurado depois (TODO)
 */
export const INVEST: Record<number, InvestChainConfig> = {
    100: {
        adapter: SAVINGS_XDAI_ADAPTER_ADDRESS,
        adapterAddress: SAVINGS_XDAI_ADAPTER_ADDRESS,
        vault: SDAI_VAULT_ADDRESS,
        vaultAddress: SDAI_VAULT_ADDRESS,
    },
    31337: {
        adapter: SAVINGS_XDAI_ADAPTER_ADDRESS,
        adapterAddress: SAVINGS_XDAI_ADAPTER_ADDRESS,
        vault: SDAI_VAULT_ADDRESS,
        vaultAddress: SDAI_VAULT_ADDRESS,
    },
    // TODO: 10200 (Chiado, testes): endereço de um mock a ser configurado depois;
    // deixe um placeholder claramente marcado como TODO e não use esse placeholder em nenhuma chamada.
};

/**
 * TODO: 10200 (Chiado, testes): endereço de um mock a ser configurado depois.
 * Placeholder claramente marcado como TODO.
 * AVISO: Não use este placeholder em nenhuma chamada de contrato.
 */
export const CHIADO_MOCK_CONFIG_TODO = {
    adapter: undefined as unknown as Address,
    adapterAddress: undefined as unknown as Address,
    vault: undefined as unknown as Address,
    vaultAddress: undefined as unknown as Address,
} as const;

/**
 * Configuração de nomenclaturas (fácil de ajustar).
 * Desde 07/11/2025, o vault passou a ser lastreado em USDS (Sky Protocol).
 */
export const INVESTMENT_CONFIG = {
    displayName: 'Savings xDAI',
    shareSymbol: 'sDAI',
    assetSymbol: 'xDAI',
    backingInfo: 'Lastreado em USDS (Sky Protocol)',
    oneShare: 10n ** 18n,
    /** Reserva recomendada para taxas de gás na Gnosis Chain (0.01 xDAI) */
    gasReserveWei: 10000000000000000n, // 0.01 ETH/xDAI (10^16 wei)
    gnosisscanUrl:
        gnosis.blockExplorers?.default.url || 'https://gnosisscan.io',
    icon: '/sdai.png',
} as const;

/** ABI mínima para o Vault sDAI (ERC-4626 + ERC-20) */
export const sdaiVaultAbi = parseAbi([
    'function balanceOf(address account) view returns (uint256)',
    'function convertToAssets(uint256 shares) view returns (uint256)',
    'function convertToShares(uint256 assets) view returns (uint256)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function decimals() view returns (uint8)',
]);

/** ABI mínima para o SavingsXDaiAdapter */
export const savingsXDaiAdapterAbi = parseAbi([
    'function depositXDAI(address receiver) payable returns (uint256)',
    'function withdrawXDAI(uint256 assets, address receiver) returns (uint256)',
    'function redeemXDAI(uint256 shares, address receiver) returns (uint256)',
]);
