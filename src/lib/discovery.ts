import {
    createPublicClient,
    erc20Abi,
    http,
    isAddress,
    type Address,
    type PublicClient,
} from 'viem';

import { fmt } from '@/utils/format';
import { addressFromMnemonic } from '@/lib/keystore';
import { tokensForChain } from '@/lib/tokens';
import { activeChain } from '@/lib/wagmi';

export type AccountActivity = {
    nativeBalance: bigint;
    formattedBalance: string;
    txCount: number;
    hasTokenBalance: boolean;
    hasExplorerActivity: boolean;
    isActive: boolean;
};

export type DiscoveredAccount = AccountActivity & {
    index: number;
    address: Address;
};

export const DEFAULT_GAP_LIMIT = 5;
export const MAX_SCAN_LIMIT = 30;
export const MAX_VERIFY_SCAN = 100;

/**
 * Cria um cliente público para consultas na cadeia ativa.
 */
export function getPublicClient(): PublicClient {
    return createPublicClient({
        chain: activeChain,
        transport: http(),
    });
}

/**
 * Verifica atividade on-chain de um endereço:
 * 1. Saldo nativo (`eth_getBalance`)
 * 2. Contador de transações / nonce (`eth_getTransactionCount`)
 * 3. Saldos de tokens ERC-20 suportados pela cadeia ativa
 * 4. Histórico de transações via Blockscout (quando disponível)
 */
export async function checkAccountActivity(
    client: PublicClient,
    address: Address,
): Promise<AccountActivity> {
    const tokens = tokensForChain(activeChain);

    const [nativeBalanceResult, txCountResult, tokenBalancesResult] =
        await Promise.allSettled([
            client.getBalance({ address }),
            client.getTransactionCount({ address }),
            tokens.length > 0
                ? client.multicall({
                      contracts: tokens.map((token) => ({
                          address: token.address,
                          abi: erc20Abi,
                          functionName: 'balanceOf' as const,
                          args: [address],
                      })),
                  })
                : Promise.resolve([]),
        ]);

    const nativeBalance =
        nativeBalanceResult.status === 'fulfilled'
            ? nativeBalanceResult.value
            : 0n;

    const txCount =
        txCountResult.status === 'fulfilled' ? txCountResult.value : 0;

    let hasTokenBalance = false;
    if (tokenBalancesResult.status === 'fulfilled') {
        const results = tokenBalancesResult.value as Array<{
            status: string;
            result?: unknown;
        }>;
        hasTokenBalance = results.some(
            (r) =>
                r.status === 'success' &&
                typeof r.result === 'bigint' &&
                r.result > 0n,
        );
    }

    let hasExplorerActivity = false;
    // Se saldo for 0 e nonce for 0, checa histórico do explorador para transferências passadas
    if (
        nativeBalance === 0n &&
        txCount === 0 &&
        !hasTokenBalance &&
        activeChain.blockExplorers?.default.url
    ) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        try {
            const response = await fetch(
                `${activeChain.blockExplorers.default.url}/api/v2/addresses/${address}/transactions?filter=to%20%7C%20from`,
                {
                    headers: { accept: 'application/json' },
                    signal: controller.signal,
                },
            );
            if (response.ok) {
                const payload = (await response.json()) as {
                    items?: unknown[];
                };
                if (Array.isArray(payload.items) && payload.items.length > 0) {
                    hasExplorerActivity = true;
                }
            }
        } catch {
            // Falha não-fatal de explorador
        } finally {
            clearTimeout(timeout);
        }
    }

    const isActive =
        nativeBalance > 0n ||
        txCount > 0 ||
        hasTokenBalance ||
        hasExplorerActivity;

    // Exibição com arredondamento em 4 casas (nunca trunca).
    const formattedBalance = fmt(
        nativeBalance,
        4,
        activeChain.nativeCurrency.decimals,
    );

    return {
        nativeBalance,
        formattedBalance,
        txCount,
        hasTokenBalance,
        hasExplorerActivity,
        isActive,
    };
}

export type DiscoverProgress = {
    scannedCount: number;
    highestActiveIndex: number;
    activeCount: number;
};

/**
 * Executa Descoberta de Contas BIP-44 (gap limit):
 * Deriva endereços sequenciais `m/44'/60'/{index}'/0/0`.
 * Varre em blocos de 5 contas por vez até atingir `gapLimit` contas vazias consecutivas.
 * Garante que no mínimo a Conta 0 esteja presente, e inclui todas as contas
 * desde o índice 0 até o maior índice com atividade detectada.
 */
export async function discoverAccounts({
    words,
    client,
    gapLimit = DEFAULT_GAP_LIMIT,
    maxScan = MAX_SCAN_LIMIT,
    minCount = 1,
    onProgress,
}: {
    words: string[];
    client?: PublicClient;
    gapLimit?: number;
    maxScan?: number;
    minCount?: number;
    onProgress?: (progress: DiscoverProgress) => void;
}): Promise<DiscoveredAccount[]> {
    const publicClient = client ?? getPublicClient();

    const accountsMap = new Map<number, DiscoveredAccount>();
    let consecutiveEmpty = 0;
    let highestActiveIndex = -1;
    let currentIndex = 0;
    const BATCH_SIZE = 5;

    while (
        (consecutiveEmpty < gapLimit || currentIndex < minCount) &&
        currentIndex < maxScan
    ) {
        const batchIndices: number[] = [];
        for (let i = 0; i < BATCH_SIZE && currentIndex + i < maxScan; i++) {
            batchIndices.push(currentIndex + i);
        }

        const batchResults = await Promise.all(
            batchIndices.map(async (index) => {
                const address = addressFromMnemonic(words, index);
                const activity = await checkAccountActivity(
                    publicClient,
                    address,
                );
                return {
                    index,
                    address,
                    ...activity,
                };
            }),
        );

        for (const item of batchResults) {
            accountsMap.set(item.index, item);

            if (item.isActive) {
                highestActiveIndex = Math.max(highestActiveIndex, item.index);
                consecutiveEmpty = 0;
            } else {
                consecutiveEmpty++;
            }

            onProgress?.({
                scannedCount: accountsMap.size,
                highestActiveIndex: Math.max(0, highestActiveIndex),
                activeCount: Array.from(accountsMap.values()).filter(
                    (a) => a.isActive,
                ).length,
            });

            if (consecutiveEmpty >= gapLimit && item.index >= minCount - 1) {
                break;
            }
        }

        currentIndex += batchIndices.length;
    }

    const finalCount = Math.max(minCount, highestActiveIndex + 1, 1);
    const result: DiscoveredAccount[] = [];

    for (let i = 0; i < finalCount; i++) {
        const existing = accountsMap.get(i);
        if (existing) {
            result.push(existing);
        } else {
            const address = addressFromMnemonic(words, i);
            result.push({
                index: i,
                address,
                nativeBalance: 0n,
                formattedBalance: '0',
                txCount: 0,
                hasTokenBalance: false,
                hasExplorerActivity: false,
                isActive: false,
            });
        }
    }

    return result;
}

/**
 * Procura se um determinado endereço deriva da frase mnemônica nos índices 0 até `maxScan`.
 * Retorna o índice numérico se derivar, ou `null` caso NÃO derive.
 */
export function findDerivedAccountIndex(
    words: string[],
    targetAddress: string,
    maxScan = MAX_VERIFY_SCAN,
): number | null {
    const trimmed = targetAddress.trim();
    const normalized = (
        trimmed.startsWith('0x') || trimmed.startsWith('0X')
            ? trimmed
            : `0x${trimmed}`
    ).toLowerCase();

    if (!isAddress(normalized)) {
        return null;
    }

    for (let index = 0; index < maxScan; index++) {
        const derived = addressFromMnemonic(words, index);
        if (derived.toLowerCase() === normalized) {
            return index;
        }
    }

    return null;
}
