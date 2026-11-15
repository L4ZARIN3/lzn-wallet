import assert from 'node:assert';
import { mnemonicToAccount } from 'viem/accounts';
import {
    addressFromMnemonic,
    createWallet,
    addWalletAccountByIndex,
    addWalletAccountByAddress,
    unlockWallet,
} from '../src/lib/keystore.ts';
import {
    findDerivedAccountIndex,
    discoverAccounts,
} from '../src/lib/discovery.ts';

// Mock localStorage
const storage = new Map<string, string>();
(globalThis as any).window = {
    localStorage: {
        getItem: (k: string) => storage.get(k) ?? null,
        setItem: (k: string, v: string) => storage.set(k, v),
        removeItem: (k: string) => storage.delete(k),
        clear: () => storage.clear(),
    },
};

async function runTests() {
    console.log('--- Starting Deep Verification Tests ---');

    const mnemonic = 'test test test test test test test test test test test junk';
    const words = mnemonic.split(' ');

    const addr0 = mnemonicToAccount(mnemonic, { accountIndex: 0 }).address;
    const addr1 = mnemonicToAccount(mnemonic, { accountIndex: 1 }).address;
    const addr2 = mnemonicToAccount(mnemonic, { accountIndex: 2 }).address;
    const addr3 = mnemonicToAccount(mnemonic, { accountIndex: 3 }).address;
    const randomAddr = '0x1111111111111111111111111111111111111111';
    const invalidFormatAddr = 'not-an-address';

    console.log('1. Testing findDerivedAccountIndex:');
    assert.strictEqual(findDerivedAccountIndex(words, addr0), 0, 'Index 0 must match addr0');
    assert.strictEqual(findDerivedAccountIndex(words, addr1), 1, 'Index 1 must match addr1');
    assert.strictEqual(findDerivedAccountIndex(words, addr2), 2, 'Index 2 must match addr2');
    assert.strictEqual(findDerivedAccountIndex(words, addr3), 3, 'Index 3 must match addr3');
    assert.strictEqual(findDerivedAccountIndex(words, randomAddr), null, 'Random address must return null');
    assert.strictEqual(findDerivedAccountIndex(words, invalidFormatAddr), null, 'Invalid format must return null');
    console.log('✓ findDerivedAccountIndex correctly identifies seed derivation and rejects foreign addresses');

    console.log('2. Testing createWallet with multiple accounts:');
    storage.clear();
    const walletWith2 = await createWallet(words, 'password123', [addr0, addr1]);
    assert.strictEqual(walletWith2.addresses.length, 2, 'Must have 2 addresses');
    assert.strictEqual(walletWith2.addresses[0], addr0, 'Address 0 must match');
    assert.strictEqual(walletWith2.addresses[1], addr1, 'Address 1 must match');
    assert.strictEqual(walletWith2.activeIndex, 0, 'Active index must be 0');

    const decryptedWords = await unlockWallet(walletWith2, 'password123');
    assert.deepStrictEqual(decryptedWords, words, 'Decrypted words must match');
    console.log('✓ createWallet stores multiple accounts and decrypts properly');

    console.log('2b. Testing createWallet strictly rejecting impossible foreign addresses:');
    let createWalletRejected = false;
    try {
        await createWallet(words, 'password123', [addr0, randomAddr as any]);
    } catch (e: any) {
        if (e.message === 'address-not-derived') {
            createWalletRejected = true;
        }
    }
    assert.strictEqual(createWalletRejected, true, 'createWallet must reject non-derived foreign address');
    console.log('✓ createWallet strictly prevents initialization with impossible addresses');

    console.log('3. Testing addWalletAccountByAddress with valid derived address:');
    // Start with 1 address
    storage.clear();
    let currentWallet = await createWallet(words, 'password123', [addr0]);
    assert.strictEqual(currentWallet.addresses.length, 1);

    // Add addr2 (index 2) directly by address: must fill intermediate addr1 and add addr2
    const res = await addWalletAccountByAddress(currentWallet, 'password123', addr2);
    currentWallet = res.wallet;
    assert.strictEqual(res.index, 2);
    assert.strictEqual(currentWallet.addresses.length, 3, 'Must have accounts 0, 1, 2');
    assert.strictEqual(currentWallet.addresses[0], addr0);
    assert.strictEqual(currentWallet.addresses[1], addr1);
    assert.strictEqual(currentWallet.addresses[2], addr2);
    assert.strictEqual(currentWallet.activeIndex, 2, 'Must activate index 2');
    console.log('✓ addWalletAccountByAddress correctly adds derived address and fills contiguous BIP-44 path');

    console.log('4. Testing addWalletAccountByAddress with IMPOSSIBLE foreign address:');
    let rejected = false;
    try {
        await addWalletAccountByAddress(currentWallet, 'password123', randomAddr);
    } catch (e: any) {
        if (e.message === 'address-not-derived') {
            rejected = true;
        }
    }
    assert.strictEqual(rejected, true, 'Foreign address must be strictly rejected with address-not-derived');
    assert.strictEqual(currentWallet.addresses.length, 3, 'Wallet must NOT be modified');
    console.log('✓ addWalletAccountByAddress strictly prevents adding impossible addresses');

    console.log('5. Testing addWalletAccountByIndex:');
    const updatedByIndex = await addWalletAccountByIndex(currentWallet, 'password123', 4);
    assert.strictEqual(updatedByIndex.addresses.length, 5, 'Must have accounts 0, 1, 2, 3, 4');
    assert.strictEqual(updatedByIndex.addresses[4], addressFromMnemonic(words, 4));
    assert.strictEqual(updatedByIndex.activeIndex, 4);
    console.log('✓ addWalletAccountByIndex works sequentially');

    console.log('6. Testing discoverAccounts with mock client:');
    // Mock client where account 0 and account 2 have activity, account 1 is empty, accounts 3..7 are empty (gap = 5)
    const mockClient: any = {
        getBalance: async ({ address }: any) => {
            if (address.toLowerCase() === addr2.toLowerCase()) {
                return 1000000000000000000n; // 1 xDAI
            }
            return 0n;
        },
        getTransactionCount: async ({ address }: any) => {
            if (address.toLowerCase() === addr0.toLowerCase()) {
                return 5;
            }
            return 0;
        },
        multicall: async () => [],
    };

    const discovered = await discoverAccounts({
        words,
        client: mockClient,
        gapLimit: 3,
        maxScan: 10,
    });

    // Since index 2 was active, it should discover 0, 1, 2
    assert.strictEqual(discovered.length, 3, 'Must discover accounts 0, 1, 2');
    assert.strictEqual(discovered[0].address, addr0);
    assert.strictEqual(discovered[0].txCount, 5);
    assert.strictEqual(discovered[0].isActive, true);
    assert.strictEqual(discovered[1].address, addr1);
    assert.strictEqual(discovered[1].isActive, false);
    assert.strictEqual(discovered[2].address, addr2);
    assert.strictEqual(discovered[2].nativeBalance, 1000000000000000000n);
    assert.strictEqual(discovered[2].isActive, true);
    console.log('✓ discoverAccounts BIP-44 gap limit detection restored all accounts up to highest active index');

    console.log('7. Testing gap limit boundary (all empty accounts):');
    const allEmptyClient: any = {
        getBalance: async () => 0n,
        getTransactionCount: async () => 0,
        multicall: async () => [],
    };
    const emptyDiscovered = await discoverAccounts({
        words,
        client: allEmptyClient,
        gapLimit: 3,
        maxScan: 10,
    });
    assert.strictEqual(emptyDiscovered.length, 1, 'Must fallback to at least Account 0');
    assert.strictEqual(emptyDiscovered[0].address, addr0);
    assert.strictEqual(emptyDiscovered[0].isActive, false);
    console.log('✓ All-empty accounts fallback safely to primary Account 0');

    console.log('8. Testing case-insensitivity of findDerivedAccountIndex:');
    assert.strictEqual(findDerivedAccountIndex(words, addr1.toUpperCase()), 1, 'Uppercase address must match');
    assert.strictEqual(findDerivedAccountIndex(words, addr1.toLowerCase()), 1, 'Lowercase address must match');
    console.log('✓ Address matching is strictly case-insensitive');

    console.log('9. Testing addWalletAccountByAddress when address is already present:');
    const alreadyPresentRes = await addWalletAccountByAddress(updatedByIndex, 'password123', addr1);
    assert.strictEqual(alreadyPresentRes.wallet.addresses.length, updatedByIndex.addresses.length, 'Length must not increase');
    assert.strictEqual(alreadyPresentRes.wallet.activeIndex, 1, 'Active index must switch to index 1');
    console.log('✓ Re-adding existing address activates it without duplication');

    console.log('10. Testing addWalletAccountByIndex with negative index:');
    let negThrown = false;
    try {
        await addWalletAccountByIndex(updatedByIndex, 'password123', -1);
    } catch (e: any) {
        if (e.message === 'invalid-index') negThrown = true;
    }
    assert.strictEqual(negThrown, true, 'Negative index must throw invalid-index');
    console.log('✓ Negative index rejected properly');

    console.log('11. Testing addWalletAccountByIndex with huge out-of-range index (DoS protection):');
    let hugeThrown = false;
    try {
        await addWalletAccountByIndex(updatedByIndex, 'password123', 999999);
    } catch (e: any) {
        if (e.message === 'invalid-index') hugeThrown = true;
    }
    assert.strictEqual(hugeThrown, true, 'Huge index must be rejected with invalid-index');
    console.log('✓ Huge index correctly rejected, preventing CPU lockup');

    console.log('12. Testing addWalletAccountByAddress with malformed address string:');
    let malformedThrown = false;
    try {
        await addWalletAccountByAddress(updatedByIndex, 'password123', 'not-a-valid-hex-address');
    } catch (e: any) {
        if (e.message === 'invalid-address-format') malformedThrown = true;
    }
    assert.strictEqual(malformedThrown, true, 'Malformed address must throw invalid-address-format');
    console.log('✓ Malformed address string rejected immediately without crypto overhead');

    console.log('13. Testing discoverAccounts with minCount preservation:');
    const minCountDiscovered = await discoverAccounts({
        words,
        client: allEmptyClient,
        gapLimit: 2,
        maxScan: 10,
        minCount: 3,
    });
    assert.strictEqual(minCountDiscovered.length, 3, 'Must preserve at least 3 accounts');
    assert.strictEqual(minCountDiscovered[0].address, addr0);
    assert.strictEqual(minCountDiscovered[1].address, addr1);
    assert.strictEqual(minCountDiscovered[2].address, addr2);
    console.log('✓ discoverAccounts with minCount preserves existing accounts even when empty');

    console.log('\nALL 13 DEEP VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((e) => {
    console.error('Test failed:', e);
    process.exit(1);
});
