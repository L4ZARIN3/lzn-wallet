import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import {
    createPublicClient,
    createWalletClient,
    erc20Abi,
    formatUnits,
    http,
    parseAbiItem,
    type Address,
    type Hash,
    type PublicClient,
} from 'viem';
import {
    useBalance,
    useEstimateFeesPerGas,
    usePublicClient,
    useReadContracts,
} from 'wagmi';

import xdaiIcon from '@/assets/xdai.svg';
import { addressHasCode, CONTRACT_CODE_WARNING } from '@/lib/account-safety';
import { type StoredWallet, unlockAccount } from '@/lib/keystore';
import {
    type TokenBadge,
    type TokenInfo,
    tokensForChain,
    WRAPPED_XDAI,
    WRAPPED_XDAI_MAINNET,
} from '@/lib/tokens';
import { activeChain } from '@/lib/wagmi';

export type { TokenBadge, TokenInfo };
export { tokensForChain, WRAPPED_XDAI, WRAPPED_XDAI_MAINNET };

export type NativeTokenInfo = TokenBadge & {
    symbol: string;
    name: string;
    decimals: number;
    coingeckoId: string;
};

/** Moeda nativa da cadeia ativa (xDAI na Gnosis/Chiado). */
export const nativeToken: NativeTokenInfo = {
    symbol: activeChain.nativeCurrency.symbol,
    name: activeChain.nativeCurrency.name,
    decimals: activeChain.nativeCurrency.decimals,
    coingeckoId: 'xdai',
    badge: '◈',
    badgeClassName: 'bg-emerald-50 text-emerald-600',
    icon: xdaiIcon,
};

/** Casas decimais máximas de um ERC-20 (uint256 com 18 decimais). */
const MAX_DECIMALS = 18;

/** Algarismos significativos preservados em valores menores que US$ 0,01. */
const SIGNIFICANT_DIGITS = 4;

/** Menor valor representável com 18 casas: 1 wei de um ativo cotado a US$ 1. */
const SMALLEST_USD = 10 ** -MAX_DECIMALS;

const usdFormatters = new Map<number, Intl.NumberFormat>();

function usdFormatter(fractionDigits: number): Intl.NumberFormat {
    let formatter = usdFormatters.get(fractionDigits);

    if (!formatter) {
        formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: fractionDigits,
        });
        usdFormatters.set(fractionDigits, formatter);
    }

    return formatter;
}

/**
 * Formata USD com precisão adaptativa: a partir de US$ 0,01 mantém as duas
 * casas usuais e, abaixo disso, abre casas decimais (até 18) conforme a ordem
 * de grandeza — assim um valor minúsculo nunca aparece como "$0.00".
 */
export function formatUsd(value: number): string {
    if (value === 0) {
        return usdFormatter(2).format(0);
    }

    const abs = Math.abs(value);

    if (abs >= 0.01) {
        return usdFormatter(2).format(value);
    }

    if (abs < SMALLEST_USD) {
        return `< ${usdFormatter(MAX_DECIMALS).format(SMALLEST_USD)}`;
    }

    const decimals = Math.min(
        MAX_DECIMALS,
        SIGNIFICANT_DIGITS - 1 - Math.floor(Math.log10(abs)),
    );

    return usdFormatter(decimals).format(value);
}

/** Converte um valor on-chain (bigint) para o número decimal equivalente. */
export function toTokenAmount(value: bigint, decimals: number): number {
    return Number(formatUnits(value, decimals));
}

const integerFormatter = new Intl.NumberFormat('en-US');

/**
 * Formata um valor on-chain com a precisão exata do token (até as 18 casas de
 * um uint256), cortando apenas os zeros à direita. A conversão é feita
 * diretamente do `bigint` — sem passar por `number` — para não perder casas,
 * e assim 1 wei deixa de ser exibido como "0".
 */
export function formatTokenAmount(value: bigint, decimals: number): string {
    const [whole, fraction] = formatUnits(value, decimals).split('.');

    return fraction
        ? `${integerFormatter.format(BigInt(whole))}.${fraction}`
        : integerFormatter.format(BigInt(whole));
}

export function shortenAddress(address: string, size = 4): string {
    return `${address.slice(0, size + 2)}…${address.slice(-size)}`;
}

/** Formata um timestamp de bloco (segundos) no idioma ativo. */
export function formatTimestamp(seconds: number, locale: string): string {
    if (seconds === 0) {
        return '—';
    }

    const loc = locale === 'arz' ? ['arz', 'ar-EG', 'ar'] : locale;

    return new Date(seconds * 1000).toLocaleString(loc, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function explorerUrl(path: string): string | undefined {
    const base = activeChain.blockExplorers?.default.url;

    return base ? `${base}${path}` : undefined;
}

export function explorerAddressUrl(address: Address): string | undefined {
    return explorerUrl(`/address/${address}`);
}

export function explorerTransactionUrl(hash: Address): string | undefined {
    return explorerUrl(`/tx/${hash}`);
}

export type TokenPrice = {
    usd: number;
    usd24hChange: number | null;
};

export type TokenPrices = Record<string, TokenPrice>;

type CoinGeckoResponse = Record<
    string,
    { usd?: number; usd_24h_change?: number }
>;

/**
 * Cotações reais em USD via CoinGecko para todos os ativos acompanhados.
 */
export function useTokenPrices() {
    const ids = useMemo(
        () => [
            ...new Set([
                nativeToken.coingeckoId,
                ...tokensForChain(activeChain).map(
                    (token) => token.coingeckoId,
                ),
            ]),
        ],
        [],
    );

    return useQuery({
        queryKey: ['token-prices', ids],
        queryFn: async (): Promise<TokenPrices> => {
            // Timeout explícito: sem ele, um fetch pendurado travaria o
            // botão de atualizar da Home para sempre.
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 12_000);

            try {
                const url = new URL(
                    'https://api.coingecko.com/api/v3/simple/price',
                );
                url.searchParams.set('ids', ids.join(','));
                url.searchParams.set('vs_currencies', 'usd');
                url.searchParams.set('include_24hr_change', 'true');

                const response = await fetch(url, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error('Não foi possível carregar as cotações.');
                }

                const payload = (await response.json()) as CoinGeckoResponse;

                return Object.fromEntries(
                    Object.entries(payload).flatMap(([id, value]) =>
                        typeof value.usd === 'number'
                            ? [
                                  [
                                      id,
                                      {
                                          usd: value.usd,
                                          usd24hChange:
                                              value.usd_24h_change ?? null,
                                      },
                                  ] as const,
                              ]
                            : [],
                    ),
                );
            } finally {
                clearTimeout(timeout);
            }
        },
        staleTime: 60_000,
        refetchInterval: 60_000,
        refetchIntervalInBackground: true,
    });
}

export type AssetHolding = TokenBadge & {
    symbol: string;
    name: string;
    decimals: number;
    balance: bigint;
    coingeckoId: string;
    /** Ausente para a moeda nativa. */
    address?: Address;
};

/**
 * Saldos reais do endereço conectado: moeda nativa via `eth_getBalance` e
 * os ERC-20 acompanhados via uma única chamada multicall.
 */
export function useAssetHoldings(address?: Address) {
    const tokens = tokensForChain(activeChain);

    const nativeBalance = useBalance({
        address,
        chainId: activeChain.id,
        query: {
            enabled: Boolean(address),
            refetchInterval: 15_000,
            refetchIntervalInBackground: true,
        },
    });

    const tokenBalances = useReadContracts({
        contracts: tokens.map((token) => ({
            address: token.address,
            abi: erc20Abi,
            functionName: 'balanceOf' as const,
            args: address ? [address] : [],
            chainId: activeChain.id,
        })),
        query: {
            enabled: Boolean(address),
            refetchInterval: 15_000,
            refetchIntervalInBackground: true,
        },
    });

    const assets = useMemo<AssetHolding[]>(() => {
        const holdings: AssetHolding[] = [];
        const nativeValue = nativeBalance.data?.value;

        // A moeda nativa é sempre exibida (mesmo com saldo 0), para que a
        // lista nunca pareça "vazia" por um saldo zerado.
        if (nativeValue !== undefined) {
            holdings.push({ ...nativeToken, balance: nativeValue });
        }

        tokens.forEach((token, index) => {
            const result = tokenBalances.data?.[index];

            if (
                result?.status === 'success' &&
                typeof result.result === 'bigint' &&
                result.result > 0n
            ) {
                holdings.push({ ...token, balance: result.result });
            }
        });

        return holdings;
    }, [nativeBalance.data, tokenBalances.data, tokens]);

    const refetchNative = nativeBalance.refetch;
    const refetchTokens = tokenBalances.refetch;

    const refetch = useCallback(async () => {
        // allSettled: um erro isolado numa consulta não bloqueia as demais.
        await Promise.allSettled([refetchNative(), refetchTokens()]);
    }, [refetchNative, refetchTokens]);

    return {
        assets,
        isLoading: nativeBalance.isPending || tokenBalances.isPending,
        isError: nativeBalance.isError || tokenBalances.isError,
        refetch,
    };
}

/** Dados da transferência informados pelo usuário na interface. */
export type NativeTransferRequest = {
    to: Address;
    amount: bigint;
    password: string;
};

/** Contexto da carteira necessário para assinar (conta ativa). */
export type NativeTransferContext = {
    /** Registro persistido: guarda a frase secreta cifrada. */
    wallet: StoredWallet;
    /** Índice HD da conta ativa (`m/44'/60'/{índice}'/0/0`). */
    accountIndex: number;
};

/**
 * Transfere a moeda nativa (xDAI) a partir da conta ativa.
 *
 * A frase secreta é decifrada com a senha do usuário somente em memória, o
 * `eth_estimateGas`/nonce/fees são preenchidos pelo próprio nó e a transação é
 * assinada localmente e transmitida crua — nada além do keystore é persistido.
 * O cliente de escrita usa o RPC padrão da cadeia ativa, o mesmo das leituras.
 */
export function useSendNative() {
    return useMutation({
        mutationFn: async ({
            wallet,
            accountIndex,
            to,
            amount,
            password,
        }: NativeTransferContext & NativeTransferRequest): Promise<Hash> => {
            const account = await unlockAccount(wallet, password, accountIndex);

            // Proteção: endereço com código on-chain (delegação EIP-7702 etc.)
            // pode executar código ao receber fundos e drenar o saldo.
            const publicClient = createPublicClient({
                chain: activeChain,
                transport: http(),
            });

            if (await addressHasCode(publicClient, account.address)) {
                throw new Error(CONTRACT_CODE_WARNING);
            }

            const walletClient = createWalletClient({
                account,
                chain: activeChain,
                transport: http(),
            });

            return walletClient.sendTransaction({ to, value: amount });
        },
    });
}

/** Gás consumido por uma transferência nativa simples, sem dados de chamada. */
const NATIVE_TRANSFER_GAS = 21_000n;

/**
 * Taxa máxima estimada que uma transferência nativa consome, em wei.
 *
 * Enviar o saldo inteiro não deixaria valor para pagar o próprio gás, então o
 * máximo realmente transferível é `saldo − taxa`. Enquanto a estimativa não
 * chega — ou se o RPC não a fornece — retorna `undefined`, para a interface
 * nunca oferecer um valor que certamente falharia.
 */
export function useNativeTransferFee(): bigint | undefined {
    const { data } = useEstimateFeesPerGas({ chainId: activeChain.id });

    return data ? data.maxFeePerGas * NATIVE_TRANSFER_GAS : undefined;
}

export type PortfolioRow = AssetHolding & {
    /** Cotação em USD, ou `null` quando indisponível. */
    price: number | null;
    /** Variação em 24h (fração), ou `null` quando indisponível. */
    change24h: number | null;
    /** Valor em USD, ou `null` quando não há cotação. */
    value: number | null;
};

/** Cruza os saldos com as cotações para montar as linhas do portfólio. */
export function toPortfolioRows(
    assets: AssetHolding[],
    prices?: TokenPrices,
): PortfolioRow[] {
    return assets.map((asset) => {
        const quote = prices?.[asset.coingeckoId];
        const price = quote?.usd ?? null;
        const amount = toTokenAmount(asset.balance, asset.decimals);

        return {
            ...asset,
            price,
            change24h: quote?.usd24hChange ?? null,
            value: price === null ? null : amount * price,
        };
    });
}

export function portfolioTotal(rows: PortfolioRow[]): number {
    return rows.reduce((sum, row) => sum + (row.value ?? 0), 0);
}

/** Variação em 24h ponderada pelo valor das posições com cotação. */
export function portfolioChange24h(
    rows: PortfolioRow[],
    total: number,
): { percent: number; value: number } | null {
    let weighted = 0;
    let covered = 0;

    for (const row of rows) {
        if (row.change24h === null || row.value === null) {
            continue;
        }

        weighted += row.value * row.change24h;
        covered += row.value;
    }

    if (covered === 0) {
        return null;
    }

    const percent = weighted / covered;

    return { percent, value: (total * percent) / 100 };
}

const TRANSFER_EVENT = parseAbiItem(
    'event Transfer(address indexed from, address indexed to, uint256 value)',
);

/** Janela consultada no RPC público (~2,9 dias na Gnosis, blocos de 5s). */
const LOOKBACK_BLOCKS = 50_000n;

const MAX_TRANSFERS = 10;

/** Duração aproximada (em dias) da janela de blocos consultada. */
export function activityWindowDays(): number | null {
    return activeChain.blockTime
        ? Math.round(
              (Number(LOOKBACK_BLOCKS) * activeChain.blockTime) / 3600 / 24,
          )
        : null;
}

export type WalletTransfer = TokenBadge & {
    hash: Address;
    direction: 'received' | 'sent';
    symbol: string;
    amount: bigint;
    decimals: number;
    counterparty: Address;
    timestamp: number;
};

async function loadErc20Transfers(
    client: PublicClient,
    address: Address,
    tokens: TokenInfo[],
): Promise<WalletTransfer[]> {
    if (tokens.length === 0) {
        return [];
    }

    const latestBlock = await client.getBlockNumber();
    const fromBlock =
        latestBlock > LOOKBACK_BLOCKS ? latestBlock - LOOKBACK_BLOCKS : 0n;
    const addresses = tokens.map((token) => token.address);

    const [sent, received] = await Promise.all([
        client.getLogs({
            address: addresses,
            event: TRANSFER_EVENT,
            args: { from: address },
            fromBlock,
            toBlock: latestBlock,
        }),
        client.getLogs({
            address: addresses,
            event: TRANSFER_EVENT,
            args: { to: address },
            fromBlock,
            toBlock: latestBlock,
        }),
    ]);

    const tokenByAddress = new Map(
        tokens.map((token) => [token.address.toLowerCase(), token]),
    );

    const entries = [
        ...sent.map((log) => ({ log, direction: 'sent' as const })),
        ...received.map((log) => ({ log, direction: 'received' as const })),
    ]
        .filter(
            ({ log }) =>
                log.blockNumber !== null &&
                log.transactionHash !== null &&
                typeof log.args.value === 'bigint',
        )
        .sort((a, b) =>
            Number((b.log.blockNumber ?? 0n) - (a.log.blockNumber ?? 0n)),
        )
        .slice(0, MAX_TRANSFERS);

    const blockNumbers = [
        ...new Set(entries.map(({ log }) => log.blockNumber as bigint)),
    ];

    const blocks = await Promise.all(
        blockNumbers.map((blockNumber) => client.getBlock({ blockNumber })),
    );

    const timestamps = new Map(
        blockNumbers.map((blockNumber, index) => [
            blockNumber.toString(),
            Number(blocks[index].timestamp),
        ]),
    );

    return entries.flatMap(({ log, direction }) => {
        const token = tokenByAddress.get(log.address.toLowerCase());
        const { value, from, to } = log.args;
        const blockNumber = log.blockNumber;
        const hash = log.transactionHash;

        if (
            !token ||
            value === undefined ||
            blockNumber === null ||
            hash === null ||
            !from ||
            !to
        ) {
            return [];
        }

        return [
            {
                hash,
                direction,
                symbol: token.symbol,
                amount: value,
                decimals: token.decimals,
                badge: token.badge,
                badgeClassName: token.badgeClassName,
                counterparty: direction === 'sent' ? to : from,
                timestamp: timestamps.get(blockNumber.toString()) ?? 0,
            },
        ];
    });
}

/** Converte o timestamp ISO 8601 do Blockscout para unix (segundos). */
function parseTimestamp(value?: string): number {
    if (!value) {
        return 0;
    }

    const milliseconds = Date.parse(value.replace(/\.(\d{3})\d+/, '.$1'));

    return Number.isNaN(milliseconds) ? 0 : Math.floor(milliseconds / 1000);
}

/** Campos comuns das transferências retornadas pela API v2 do Blockscout. */
type BlockscoutTransfer = {
    hash?: string | null;
    transaction_hash?: string | null;
    value?: string | null;
    from?: { hash?: string | null } | null;
    to?: { hash?: string | null } | null;
    timestamp?: string | null;
};

/** Converte itens do Blockscout em transferências da moeda nativa. */
function toNativeTransfers(
    items: BlockscoutTransfer[],
    wallet: string,
): WalletTransfer[] {
    return items.flatMap((item) => {
        const hash = item.hash ?? item.transaction_hash;
        const from = item.from?.hash?.toLowerCase();
        const to = item.to?.hash?.toLowerCase();

        if (!hash || !item.value || !/^\d+$/.test(item.value)) {
            return [];
        }

        const amount = BigInt(item.value);
        const direction =
            from === wallet ? 'sent' : to === wallet ? 'received' : null;
        const counterparty =
            direction === 'sent' ? item.to?.hash : item.from?.hash;

        if (amount === 0n || !direction || !counterparty) {
            return [];
        }

        return [
            {
                hash: hash as Address,
                direction,
                symbol: nativeToken.symbol,
                amount,
                decimals: nativeToken.decimals,
                badge: nativeToken.badge,
                badgeClassName: nativeToken.badgeClassName,
                icon: nativeToken.icon,
                counterparty: counterparty as Address,
                timestamp: parseTimestamp(item.timestamp ?? undefined),
            },
        ];
    });
}

/**
 * Transferências da moeda nativa (xDAI). Diferentemente dos ERC-20, elas não
 * emitem evento e por isso não aparecem no `eth_getLogs`; são lidas da API v2
 * do explorador (Blockscout) da cadeia ativa — transações e transferências
 * internas, o que cobre também envios originados por contratos. Retorna vazio
 * quando o explorador não expõe essa API.
 */
async function loadNativeTransfers(address: Address): Promise<WalletTransfer[]> {
    const base = activeChain.blockExplorers?.default.url;

    if (!base) {
        return [];
    }

    const wallet = address.toLowerCase();
    const paths = ['transactions', 'internal-transactions'];

    const groups = await Promise.all(
        paths.map(async (path) => {
            // Timeout explícito: evita que um fetch pendurado do explorador
            // trave o refresh (e o botão de atualizar) por tempo indeterminado.
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8_000);

            try {
                const response = await fetch(
                    `${base}/api/v2/addresses/${address}/${path}`,
                    {
                        headers: { accept: 'application/json' },
                        signal: controller.signal,
                    },
                );

                if (!response.ok) {
                    return [];
                }

                const payload = (await response.json()) as {
                    items?: BlockscoutTransfer[];
                };

                return toNativeTransfers(payload.items ?? [], wallet);
            } catch {
                return [];
            } finally {
                clearTimeout(timeout);
            }
        }),
    );

    return groups.flat();
}

/** Histórico completo: ERC-20 via RPC e moeda nativa via explorador. */
async function loadTransfers(
    client: PublicClient,
    address: Address,
    tokens: TokenInfo[],
): Promise<WalletTransfer[]> {
    const [erc20, native] = await Promise.all([
        loadErc20Transfers(client, address, tokens),
        loadNativeTransfers(address),
    ]);

    return [...erc20, ...native]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, MAX_TRANSFERS);
}

/**
 * Histórico real do endereço conectado: eventos `Transfer` de ERC-20 lidos via
 * `eth_getLogs` somados às transferências da moeda nativa vindas do explorador,
 * ordenados do mais recente para o mais antigo.
 */
export function useRecentTransfers(address?: Address) {
    const client = usePublicClient({ chainId: activeChain.id });
    const tokens = tokensForChain(activeChain);

    return useQuery({
        queryKey: ['wallet-transfers', activeChain.id, address],
        enabled: Boolean(address && client),
        queryFn: () =>
            loadTransfers(client as PublicClient, address as Address, tokens),
        staleTime: 30_000,
        refetchInterval: 30_000,
        refetchIntervalInBackground: true,
    });
}
