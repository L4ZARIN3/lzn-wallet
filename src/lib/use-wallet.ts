import { useCallback, useState } from 'react';
import type { Address } from 'viem';

import {
    addWalletAccount,
    addWalletAccountByAddress,
    addWalletAccountByIndex,
    forgetWallet,
    importDiscoveredAccounts,
    readWallet,
    setWalletActiveAccount,
    type StoredWallet,
} from '@/lib/keystore';

export type WalletController = {
    /** Sempre `true` no cliente: o keystore é lido de forma síncrona no primeiro render. */
    ready: boolean;
    wallet: StoredWallet | null;
    accounts: Address[];
    activeIndex: number;
    activeAddress?: Address;
    switchAccount: (index: number) => void;
    addAccount: (password: string) => Promise<Address>;
    addAccountByIndex: (password: string, index: number) => Promise<Address>;
    addAccountByAddress: (
        password: string,
        address: string,
    ) => Promise<{ address: Address; index: number }>;
    importDiscovered: (password: string, count: number) => Promise<number>;
    removeWallet: () => void;
};

/**
 * Estado da carteira local: lê o keystore do dispositivo e expõe a conta ativa
 * e as operações de troca/adición/remoção. Todas as contas usam a mesma frase
 * secreta e a mesma senha.
 */
export function useWallet(): WalletController {
    // Inicialização síncrona (app 100% cliente): evita o "flash" de tela vazia
    // que o estado ready=false causava a cada remontagem do componente.
    const [wallet, setWallet] = useState<StoredWallet | null>(() =>
        readWallet(),
    );
    const [ready] = useState(true);

    const accounts = wallet?.addresses ?? [];
    const activeIndex = wallet?.activeIndex ?? 0;
    const activeAddress = accounts[activeIndex];

    const switchAccount = useCallback((index: number) => {
        setWallet((current) =>
            current ? setWalletActiveAccount(current, index) : current,
        );
    }, []);

    const addAccount = useCallback(
        async (password: string): Promise<Address> => {
            if (!wallet) {
                throw new Error('no-wallet');
            }

            const updated = await addWalletAccount(wallet, password);

            setWallet(updated);

            return updated.addresses[updated.activeIndex];
        },
        [wallet],
    );

    const addAccountByIndex = useCallback(
        async (password: string, index: number): Promise<Address> => {
            if (!wallet) {
                throw new Error('no-wallet');
            }

            const updated = await addWalletAccountByIndex(wallet, password, index);
            setWallet(updated);

            return updated.addresses[updated.activeIndex];
        },
        [wallet],
    );

    const addAccountByAddress = useCallback(
        async (
            password: string,
            address: string,
        ): Promise<{ address: Address; index: number }> => {
            if (!wallet) {
                throw new Error('no-wallet');
            }

            const { wallet: updated, index, address: verifiedAddr } =
                await addWalletAccountByAddress(wallet, password, address);
            setWallet(updated);

            return { address: verifiedAddr, index };
        },
        [wallet],
    );

    const importDiscovered = useCallback(
        async (password: string, count: number): Promise<number> => {
            if (!wallet) {
                throw new Error('no-wallet');
            }

            const updated = await importDiscoveredAccounts(wallet, password, count);
            setWallet(updated);

            return updated.addresses.length;
        },
        [wallet],
    );

    const removeWallet = useCallback(() => {
        forgetWallet();
        setWallet(null);
    }, []);

    return {
        ready,
        wallet,
        accounts,
        activeIndex,
        activeAddress,
        switchAccount,
        addAccount,
        addAccountByIndex,
        addAccountByAddress,
        importDiscovered,
        removeWallet,
    };
}
