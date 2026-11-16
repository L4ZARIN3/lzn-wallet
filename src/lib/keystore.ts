import { isAddress, type Address } from 'viem';
import { mnemonicToAccount, type HDAccount } from 'viem/accounts';

/** Chave do registro da carteira no localStorage. */
const STORAGE_KEY = 'laza.wallet';

/** Limite máximo de contas derivadas por carteira para proteger contra DoS. */
export const MAX_WALLET_ACCOUNTS = 100;

/** Custo do PBKDF2 (recomendação atual do OWASP para SHA-256). */
const PBKDF2_ITERATIONS = 600_000;

const SALT_BYTES = 16;
const IV_BYTES = 12;

const VERSION = 2;

/**
 * Registro persistido. Os endereços derivados são públicos e ficam em claro
 * para permitir consultar saldos sem desbloquear; a frase secreta — que deriva
 * todos eles — fica cifrada com a senha do usuário.
 *
 * Todos os endereços vêm da MESMA frase secreta (HD/BIP44): o índice de
 * derivação é a posição no array (`m/44'/60'/{posição}'/0/0`).
 */
export type StoredWallet = {
    version: typeof VERSION;
    addresses: Address[];
    /** Índice do endereço ativo. */
    activeIndex: number;
    salt: string;
    iv: string;
    ciphertext: string;
    iterations: number;
    createdAt: string;
};

function toBase64(bytes: Uint8Array): string {
    let binary = '';

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary);
}

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
}

async function deriveKey(
    password: string,
    salt: Uint8Array<ArrayBuffer>,
    iterations: number,
): Promise<CryptoKey> {
    const material = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveKey'],
    );

    return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
        material,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt'],
    );
}

/** Endereço EVM derivado de `m/44'/60'/{accountIndex}'/0/0`. */
export function addressFromMnemonic(
    words: string[],
    accountIndex = 0,
): Address {
    return mnemonicToAccount(words.join(' '), { accountIndex }).address;
}

function persist(stored: StoredWallet): StoredWallet {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    return stored;
}

/**
 * Cifra a frase secreta com a senha do usuário, cria a primeira conta (ou o conjunto
 * de contas especificado) e grava a carteira no dispositivo. A senha nunca é armazenada.
 */
export async function createWallet(
    words: string[],
    password: string,
    accountsCountOrAddresses: number | Address[] = 1,
): Promise<StoredWallet> {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
        throw new Error('insecure-context');
    }

    const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
    const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
    const key = await deriveKey(password, salt, PBKDF2_ITERATIONS);

    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(JSON.stringify(words)),
    );

    let addresses: Address[];
    if (Array.isArray(accountsCountOrAddresses)) {
        const count = Math.min(
            MAX_WALLET_ACCOUNTS,
            Math.max(1, accountsCountOrAddresses.length),
        );
        addresses = [];
        for (let i = 0; i < count; i++) {
            const expected = addressFromMnemonic(words, i);
            const provided = accountsCountOrAddresses[i];
            if (provided && provided.toLowerCase() !== expected.toLowerCase()) {
                throw new Error('address-not-derived');
            }
            addresses.push(expected);
        }
    } else {
        const count = Math.min(
            MAX_WALLET_ACCOUNTS,
            Math.max(1, accountsCountOrAddresses),
        );
        addresses = Array.from({ length: count }, (_, i) =>
            addressFromMnemonic(words, i),
        );
    }

    return persist({
        version: VERSION,
        addresses,
        activeIndex: 0,
        salt: toBase64(salt),
        iv: toBase64(iv),
        ciphertext: toBase64(new Uint8Array(ciphertext)),
        iterations: PBKDF2_ITERATIONS,
        createdAt: new Date().toISOString(),
    });
}

function hasCipherFields(value: Record<string, unknown>): value is Record<
    string,
    unknown
> & {
    salt: string;
    iv: string;
    ciphertext: string;
    iterations: number;
} {
    return (
        typeof value.salt === 'string' &&
        typeof value.iv === 'string' &&
        typeof value.ciphertext === 'string' &&
        typeof value.iterations === 'number'
    );
}

function isAddressList(value: unknown): value is Address[] {
    return (
        Array.isArray(value) &&
        value.length > 0 &&
        value.every((item) => typeof item === 'string')
    );
}

/** Normaliza o registro persistido (inclui o formato v1 de conta única). */
function normalizeWallet(value: unknown): StoredWallet | null {
    if (typeof value !== 'object' || value === null) {
        return null;
    }

    const candidate = value as Record<string, unknown>;

    if (!hasCipherFields(candidate)) {
        return null;
    }

    let addresses: Address[] | null = null;

    if (candidate.version === VERSION && isAddressList(candidate.addresses)) {
        addresses = candidate.addresses;
    } else if (
        candidate.version === 1 &&
        typeof candidate.address === 'string'
    ) {
        addresses = [candidate.address as Address];
    }

    if (addresses === null) {
        return null;
    }

    const activeIndex =
        typeof candidate.activeIndex === 'number' &&
        candidate.activeIndex >= 0 &&
        candidate.activeIndex < addresses.length
            ? candidate.activeIndex
            : 0;

    return {
        version: VERSION,
        addresses,
        activeIndex,
        salt: candidate.salt,
        iv: candidate.iv,
        ciphertext: candidate.ciphertext,
        iterations: candidate.iterations,
        createdAt:
            typeof candidate.createdAt === 'string'
                ? candidate.createdAt
                : new Date().toISOString(),
    };
}

/** Lê a carteira do dispositivo, ou `null` quando ainda não existe. */
export function readWallet(): StoredWallet | null {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        return null;
    }

    try {
        return normalizeWallet(JSON.parse(raw) as unknown);
    } catch {
        return null;
    }
}

/**
 * Recupera a frase secreta usando a senha do usuário.
 *
 * Lança `invalid-password` quando a senha está incorreta (o AES-GCM falha na
 * autenticação do texto cifrado).
 */
export async function unlockWallet(
    stored: StoredWallet,
    password: string,
): Promise<string[]> {
    const key = await deriveKey(
        password,
        fromBase64(stored.salt),
        stored.iterations,
    );

    let plaintext: ArrayBuffer;

    try {
        plaintext = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: fromBase64(stored.iv) },
            key,
            fromBase64(stored.ciphertext),
        );
    } catch {
        throw new Error('invalid-password');
    }

    const words: unknown = JSON.parse(new TextDecoder().decode(plaintext));

    if (
        !Array.isArray(words) ||
        !words.every((word) => typeof word === 'string')
    ) {
        throw new Error('corrupt-wallet');
    }

    return words;
}

/**
 * Desbloqueia a conta assinante do índice informado. A frase secreta é
 * decifrada apenas em memória — nunca é gravada — e descartada após derivar a
 * chave, que existe somente durante o ciclo de assinatura.
 */
export async function unlockAccount(
    stored: StoredWallet,
    password: string,
    accountIndex: number,
): Promise<HDAccount> {
    const words = await unlockWallet(stored, password);

    return mnemonicToAccount(words.join(' '), { accountIndex });
}

/**
 * Desbloqueia a frase secreta, deriva o próximo endereço e o torna ativo —
 * mesma frase secreta, mesma senha, um endereço novo por conta.
 */
export async function addWalletAccount(
    stored: StoredWallet,
    password: string,
): Promise<StoredWallet> {
    if (stored.addresses.length >= MAX_WALLET_ACCOUNTS) {
        throw new Error('max-accounts-reached');
    }

    const words = await unlockWallet(stored, password);
    const accountIndex = stored.addresses.length;

    return persist({
        ...stored,
        addresses: [
            ...stored.addresses,
            addressFromMnemonic(words, accountIndex),
        ],
        activeIndex: accountIndex,
    });
}

/**
 * Deriva contas sequencialmente até o índice alvo (inclusive) e torna
 * esse índice ativo. Se o índice já existir, apenas o torna ativo.
 */
export async function addWalletAccountByIndex(
    stored: StoredWallet,
    password: string,
    targetIndex: number,
): Promise<StoredWallet> {
    if (targetIndex < 0 || targetIndex >= MAX_WALLET_ACCOUNTS) {
        throw new Error('invalid-index');
    }

    const words = await unlockWallet(stored, password);

    if (targetIndex < stored.addresses.length) {
        return persist({
            ...stored,
            activeIndex: targetIndex,
        });
    }

    const nextAddresses = [...stored.addresses];
    for (let i = stored.addresses.length; i <= targetIndex; i++) {
        nextAddresses.push(addressFromMnemonic(words, i));
    }

    return persist({
        ...stored,
        addresses: nextAddresses,
        activeIndex: targetIndex,
    });
}

/**
 * Verifica se um endereço foi derivado da frase secreta cifrada nesta carteira
 * (varrendo até `maxScan` índices BIP-44).
 * Se derivar de verdade: deriva todas as contas intermediárias necessárias
 * até o índice correspondente, garantindo a correspondência 1:1, e ativa a conta.
 * Se NÃO derivar da semente: lança erro `address-not-derived`.
 */
export async function addWalletAccountByAddress(
    stored: StoredWallet,
    password: string,
    inputAddress: string,
    maxScan = MAX_WALLET_ACCOUNTS,
): Promise<{ wallet: StoredWallet; index: number; address: Address }> {
    const trimmed = inputAddress.trim();
    const normalized = (
        trimmed.startsWith('0x') || trimmed.startsWith('0X')
            ? trimmed
            : `0x${trimmed}`
    ).toLowerCase();

    if (!isAddress(normalized)) {
        throw new Error('invalid-address-format');
    }

    const words = await unlockWallet(stored, password);

    let matchedIndex: number | null = null;
    let matchedAddress: Address | null = null;

    for (let i = 0; i < maxScan; i++) {
        const derived = addressFromMnemonic(words, i);
        if (derived.toLowerCase() === normalized) {
            matchedIndex = i;
            matchedAddress = derived;
            break;
        }
    }

    if (matchedIndex === null || matchedAddress === null) {
        throw new Error('address-not-derived');
    }

    if (matchedIndex < stored.addresses.length) {
        const updated = persist({
            ...stored,
            activeIndex: matchedIndex,
        });
        return { wallet: updated, index: matchedIndex, address: matchedAddress };
    }

    const nextAddresses = [...stored.addresses];
    for (let i = stored.addresses.length; i <= matchedIndex; i++) {
        nextAddresses.push(addressFromMnemonic(words, i));
    }

    const updated = persist({
        ...stored,
        addresses: nextAddresses,
        activeIndex: matchedIndex,
    });

    return { wallet: updated, index: matchedIndex, address: matchedAddress };
}

/**
 * Importa um total de contas descobertas para a carteira.
 */
export async function importDiscoveredAccounts(
    stored: StoredWallet,
    password: string,
    targetCount: number,
): Promise<StoredWallet> {
    if (targetCount <= stored.addresses.length) {
        return stored;
    }

    const safeCount = Math.min(MAX_WALLET_ACCOUNTS, targetCount);
    const words = await unlockWallet(stored, password);
    const nextAddresses = [...stored.addresses];
    for (let i = stored.addresses.length; i < safeCount; i++) {
        nextAddresses.push(addressFromMnemonic(words, i));
    }

    return persist({
        ...stored,
        addresses: nextAddresses,
    });
}

/** Define qual dos endereços derivados está ativo. */
export function setWalletActiveAccount(
    stored: StoredWallet,
    activeIndex: number,
): StoredWallet {
    if (activeIndex < 0 || activeIndex >= stored.addresses.length) {
        return stored;
    }

    return persist({ ...stored, activeIndex });
}

/** Remove a carteira deste dispositivo. */
export function forgetWallet(): void {
    window.localStorage.removeItem(STORAGE_KEY);
}
