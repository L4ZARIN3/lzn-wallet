import type { Address, Chain } from 'viem';
import { gnosis, gnosisChiado } from 'wagmi/chains';

export type TokenBadge = {
    /** Rótulo curto exibido no lugar do logo. */
    badge: string;
    /** Classes Tailwind do badge. */
    badgeClassName: string;
    /** Logo oficial do ativo; quando ausente, o badge textual é exibido. */
    icon?: string;
};

export type TokenInfo = TokenBadge & {
    address: Address;
    symbol: string;
    name: string;
    decimals: number;
    /** Identificador no CoinGecko usado para cotar o token em USD. */
    coingeckoId: string;
};

export const WRAPPED_XDAI =
    '0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBd3e22' as Address;
export const WRAPPED_XDAI_MAINNET =
    '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d' as Address;

/**
 * Tokens ERC-20 acompanhados por cadeia. Todos foram validados on-chain:
 * os endereços da mainnet não existem na Chiado, por isso a lista é
 * separada por `chainId`.
 */
const gnosisTokens: TokenInfo[] = [
    {
        address: WRAPPED_XDAI_MAINNET,
        symbol: 'WXDAI',
        name: 'Wrapped xDAI',
        decimals: 18,
        coingeckoId: 'xdai',
        badge: '◈',
        badgeClassName: 'bg-emerald-50 text-emerald-600',
    },
    {
        address: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
        symbol: 'GNO',
        name: 'Gnosis Token',
        decimals: 18,
        coingeckoId: 'gnosis',
        badge: 'G',
        badgeClassName: 'bg-teal-50 text-teal-600',
    },
    {
        address: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        coingeckoId: 'weth',
        badge: '◆',
        badgeClassName: 'bg-indigo-50 text-indigo-600',
    },
    {
        address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
        symbol: 'sDAI',
        name: 'Savings xDAI',
        decimals: 18,
        coingeckoId: 'savings-xdai',
        badge: 's',
        badgeClassName: 'bg-amber-50 text-amber-600',
        icon: '/sdai.png',
    },
    {
        address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        coingeckoId: 'usd-coin',
        badge: '$',
        badgeClassName: 'bg-blue-50 text-blue-600',
    },
];

const TOKENS: Record<number, TokenInfo[]> = {
    [gnosisChiado.id]: [
        {
            address: WRAPPED_XDAI,
            symbol: 'WXDAI',
            name: 'Wrapped xDAI',
            decimals: 18,
            coingeckoId: 'xdai',
            badge: '◈',
            badgeClassName: 'bg-emerald-50 text-emerald-600',
        },
        {
            address: '0x19C653Da7c37c66208fbfbE8908A5051B57b4C70',
            symbol: 'GNO',
            name: 'Gnosis Token',
            decimals: 18,
            coingeckoId: 'gnosis',
            badge: 'G',
            badgeClassName: 'bg-teal-50 text-teal-600',
        },
        {
            address: '0x7a47605930002cc2cd2c3c408d1f33fc2a18ab71',
            symbol: 'EURe',
            name: 'Monerium EURe',
            decimals: 18,
            coingeckoId: 'monerium-eur-money',
            badge: '€',
            badgeClassName: 'bg-indigo-50 text-indigo-600',
        },
        {
            address: '0xdca67fd8324990792c0bfae95903b8a64097754f',
            symbol: 'LINK',
            name: 'Chainlink',
            decimals: 18,
            coingeckoId: 'chainlink',
            badge: '⬡',
            badgeClassName: 'bg-blue-50 text-blue-600',
        },
    ],
    [gnosis.id]: gnosisTokens,
    [31337]: gnosisTokens,
};

export function tokensForChain(chain: Chain): TokenInfo[] {
    return TOKENS[chain.id] ?? [];
}
