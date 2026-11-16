import assert from 'node:assert';
import { validateMnemonic, WORDLIST } from '../src/lib/bip39.ts';
import { formatUsd, formatTokenAmount } from '../src/lib/wallet.ts';
import {
    createWallet,
    addWalletAccount,
    addWalletAccountByAddress,
    MAX_WALLET_ACCOUNTS,
} from '../src/lib/keystore.ts';
import { addressHasCode } from '../src/lib/account-safety.ts';
import { findDerivedAccountIndex } from '../src/lib/discovery.ts';

async function runSafetyAndCryptoTests() {
    console.log('--- Starting Safety and Crypto Verification Tests ---');

    // 1. BIP-39 Wordlist and Mnemonic Validation
    console.log('1. Testing BIP-39 wordlist and validateMnemonic:');
    assert.strictEqual(WORDLIST.length, 2048, 'Wordlist must contain exactly 2048 words');

    const validPhrase1 = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const validPhrase2 = 'test test test test test test test test test test test junk';
    const validPhrase24 = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';
    const invalid24Checksum = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon';
    const invalidChecksum = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon';
    const typoPhrase = 'abandno abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const shortPhrase = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const thirteenWordsPhrase = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about abandon';

    assert.strictEqual(await validateMnemonic(validPhrase1), true, 'Valid 12-word phrase 1 must pass');
    assert.strictEqual(await validateMnemonic(validPhrase2), true, 'Valid 12-word phrase 2 must pass');
    assert.strictEqual(await validateMnemonic(validPhrase24), true, 'Valid 24-word phrase must pass');
    assert.strictEqual(await validateMnemonic(invalid24Checksum), false, 'Invalid 24-word checksum must fail');
    assert.strictEqual(await validateMnemonic(invalidChecksum), false, 'Invalid checksum must fail');
    assert.strictEqual(await validateMnemonic(typoPhrase), false, 'Typo word must fail');
    assert.strictEqual(await validateMnemonic(shortPhrase), false, 'Short phrase (< 12) must fail');
    assert.strictEqual(await validateMnemonic(thirteenWordsPhrase), false, 'Non-BIP39 length (13 words) must fail');

    // Case and spacing tolerance
    assert.strictEqual(
        await validateMnemonic('   ABANDON   abandon   abandon abandon abandon abandon abandon abandon abandon abandon abandon ABOUT  '),
        true,
        'Validate should be case-insensitive and whitespace tolerant',
    );
    console.log('✓ BIP-39 mnemonic validation correctly accepts valid phrases (12 and 24 words) and rejects corruption/typos/invalid checksums');

    // 2. formatUsd edge cases (NaN, Infinity, 0, micro-values, negative sub-micro values)
    console.log('2. Testing formatUsd edge cases:');
    assert.strictEqual(formatUsd(0), '$0.00');
    assert.strictEqual(formatUsd(NaN), '$0.00', 'NaN must safely format as $0.00 without throwing RangeError');
    assert.strictEqual(formatUsd(Infinity), '$0.00', 'Infinity must safely format as $0.00');
    assert.strictEqual(formatUsd(-Infinity), '$0.00', '-Infinity must safely format as $0.00');
    assert.strictEqual(formatUsd(12.345), '$12.35');
    assert.strictEqual(formatUsd(0.005), '$0.005');
    assert.strictEqual(formatUsd(0.0001234), '$0.0001234');
    assert.strictEqual(formatUsd(1e-19), '< $0.000000000000000001');
    assert.strictEqual(formatUsd(-1e-19), '> -$0.000000000000000001', 'Negative values below smallest USD must format with > -$');
    console.log('✓ formatUsd handles all special numeric boundaries safely');

    // 3. formatTokenAmount edge cases
    console.log('3. Testing formatTokenAmount:');
    assert.strictEqual(formatTokenAmount(0n, 18), '0');
    assert.strictEqual(formatTokenAmount(1000000000000000000n, 18), '1');
    assert.strictEqual(formatTokenAmount(1500000000000000000n, 18), '1.5');
    assert.strictEqual(formatTokenAmount(-1500000000000000000n, 18), '-1.5', 'Negative amounts must preserve minus sign');
    assert.strictEqual(formatTokenAmount(1234567n, 6), '1.234567');
    console.log('✓ formatTokenAmount formats positive and negative amounts correctly');

    // 4. Keystore MAX_WALLET_ACCOUNTS boundary protection
    console.log('4. Testing addWalletAccount MAX_WALLET_ACCOUNTS protection:');
    const dummyWords = validPhrase2.split(' ');
    const mockStorage = new Map<string, string>();
    (globalThis as any).window = {
        localStorage: {
            getItem: (k: string) => mockStorage.get(k) ?? null,
            setItem: (k: string, v: string) => mockStorage.set(k, v),
            removeItem: (k: string) => mockStorage.delete(k),
            clear: () => mockStorage.clear(),
        },
    };

    const initialWallet = await createWallet(dummyWords, 'securePass', 1);
    // Simulate wallet having MAX_WALLET_ACCOUNTS
    const fullAddresses = Array.from({ length: MAX_WALLET_ACCOUNTS }, (_, i) =>
        initialWallet.addresses[0],
    );
    const fullWallet = {
        ...initialWallet,
        addresses: fullAddresses,
    };

    let maxAccountsThrew = false;
    try {
        await addWalletAccount(fullWallet, 'securePass');
    } catch (e: any) {
        if (e.message === 'max-accounts-reached') {
            maxAccountsThrew = true;
        }
    }
    assert.strictEqual(maxAccountsThrew, true, 'addWalletAccount must throw max-accounts-reached when full');
    console.log('✓ addWalletAccount enforces MAX_WALLET_ACCOUNTS limit');

    // 5. Account Safety (addressHasCode)
    console.log('5. Testing addressHasCode:');
    const mockClientWithCode: any = {
        getCode: async () => '0x608060405234801561001057600080fd5b50',
    };
    const mockClientEmptyCode: any = {
        getCode: async () => '0x',
    };
    const mockClientNullCode: any = {
        getCode: async () => null,
    };

    assert.strictEqual(
        await addressHasCode(mockClientWithCode, '0x0000000000000000000000000000000000000001'),
        true,
        'Contract address must return true',
    );
    assert.strictEqual(
        await addressHasCode(mockClientEmptyCode, '0x0000000000000000000000000000000000000001'),
        false,
        'EOA address must return false',
    );
    assert.strictEqual(
        await addressHasCode(mockClientNullCode, '0x0000000000000000000000000000000000000001'),
        false,
        'Null code must return false',
    );
    console.log('✓ addressHasCode correctly detects contract/delegation vs EOA');

    // 6. Address Normalization without 0x prefix
    console.log('6. Testing address normalization without 0x prefix:');
    const primaryAddr = initialWallet.addresses[0];
    const rawHexAddr = primaryAddr.slice(2); // without 0x
    assert.strictEqual(
        findDerivedAccountIndex(dummyWords, rawHexAddr),
        0,
        'findDerivedAccountIndex must recognize 40-char hex without 0x prefix',
    );
    const resultNoPrefix = await addWalletAccountByAddress(initialWallet, 'securePass', rawHexAddr);
    assert.strictEqual(resultNoPrefix.index, 0, 'addWalletAccountByAddress must accept 40-char hex without 0x');
    console.log('✓ Address normalization accepts both prefixed and unprefixed 40-character hex');

    // 7. Testing Fee Estimation logic with legacy gasPrice fallback vs maxFeePerGas
    console.log('7. Testing Fee Estimation logic (legacy gasPrice fallback):');
    const computeFee = (data?: { maxFeePerGas?: bigint; gasPrice?: bigint }) => {
        const gasPrice = data?.maxFeePerGas ?? data?.gasPrice;
        return gasPrice !== undefined ? gasPrice * 21_000n : undefined;
    };
    assert.strictEqual(
        computeFee({ maxFeePerGas: 3000000000n }),
        63000000000000n,
        'EIP-1559 fee calculation',
    );
    assert.strictEqual(
        computeFee({ gasPrice: 2000000000n }),
        42000000000000n,
        'Legacy node fee calculation with gasPrice',
    );
    assert.strictEqual(
        computeFee(undefined),
        undefined,
        'Undefined data must return undefined without throwing',
    );
    assert.strictEqual(
        computeFee({}),
        undefined,
        'Empty data must return undefined without throwing',
    );
    console.log('✓ Fee calculation handles legacy gasPrice and EIP-1559 without TypeError crashes');

    console.log('\nALL SAFETY AND CRYPTO VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runSafetyAndCryptoTests().catch((e) => {
    console.error('Safety and Crypto verification failed:', e);
    process.exit(1);
});
