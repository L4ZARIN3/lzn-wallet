export const en = {
    brand: {
        name: 'Wallet',
        tagline: 'Your keys. Your assets. Your control.',
    },
    recover: {
        header: 'Recover wallet · Step {{step}} of {{total}}',
        step1: {
            badge: 'STEP 01 — RECOVERY PHRASE',
            title: 'Enter your recovery phrase',
            description:
                'Type your 12-word recovery phrase below, separated by spaces. This will restore your wallet on this device.',
            phraseLabel: 'Recovery phrase (12 words)',
            phrasePlaceholder: 'word1 word2 word3 … word12',
            warning:
                'Never enter your recovery phrase on a website or share it with anyone. This app processes it entirely offline.',
        },
        step2: {
            badge: 'STEP 02 — NEW PASSWORD',
            title: 'Set a new password',
            description:
                'Choose a password to protect access to your wallet on this device. It does not need to match your original password.',
            submit: 'Continue',
            submitting: 'Processing…',
        },
        step3: {
            badge: 'STEP 03 — ACCOUNT DISCOVERY',
            title: 'Discover accounts',
            description:
                'We scan the {{chain}} network to automatically find all active accounts derived from your recovery phrase.',
            scanning: 'Searching for active accounts on {{chain}}…',
            found: '{{count}} account(s) discovered',
            manualTitle: 'Add account manually',
            manualDescription:
                'Add a specific account derived from your seed phrase.',
            manualInputPlaceholder: '0x… (address) or account index (e.g. 1)',
            manualAddButton: 'Verify & add',
            addNextButton: '+ Add Account {{index}}',
            addressNotDerived:
                'Invalid address: this address does not derive from your recovery phrase.',
            addressAlreadyAdded: 'This account is already in the list.',
            addressVerified: 'Address verified: derived at Account {{index}}.',
            submit: 'Restore wallet ({{count}} accounts)',
            submitting: 'Restoring wallet…',
            balanceLabel: 'Balance: {{balance}} {{symbol}}',
            activeBadge: 'Active on chain',
            emptyBadge: 'New',
        },
        messages: {
            phraseInvalid: 'Enter exactly 12 words separated by spaces.',
        },
    },
    removeWallet: {
        title: 'Remove wallet',
        description:
            'This will permanently delete your wallet from this device. Your funds are safe — you can restore your wallet at any time using your 12-word recovery phrase.',
        warning:
            'Without your recovery phrase you will lose access to your funds forever.',
        confirm: 'I have saved my recovery phrase and understand this action is irreversible.',
        submit: 'Remove wallet',
    },
    common: {
        close: 'Close',
        copy: 'Copy',
        copied: 'Copied',
        cancel: 'Cancel',
    },
    language: {
        label: 'Language',
    },
    explorer: 'Explorer',
    refresh: 'Refresh',
    testnet: 'Testnet',
    accounts: {
        title: 'Accounts',
        label: 'Account {{index}}',
        active: 'Active',
        add: 'Add account',
    },
    receive: {
        title: 'Receive',
        description: 'Scan the QR code or copy the address below.',
        warning: 'Send only {{chain}} assets to this address.',
        copy: 'Copy address',
    },
    send: {
        title: 'Send',
        reviewTitle: 'Review transfer',
        confirmTitle: 'Confirm transfer',
        address: 'Recipient address',
        addressPlaceholder: '0x… (wallet address)',
        amount: 'Amount',
        amountPlaceholder: '0.00',
        available: 'Available: {{amount}} {{symbol}}',
        max: 'Max',
        to: 'To',
        asset: 'Asset',
        network: 'Network',
        continue: 'Continue',
        confirm: 'Confirm',
        back: 'Back',
        password: 'Password',
        passwordPlaceholder: 'Your password',
        submit: 'Send {{symbol}}',
        sending: 'Sending…',
        successTitle: 'Transaction sent',
        successDescription: 'Your transfer was broadcast to the network.',
        view: 'View in explorer',
        done: 'Done',
        errors: {
            address: 'Invalid address.',
            amount: 'Invalid amount.',
            insufficient: 'Insufficient balance.',
            password: 'Incorrect password. Try again.',
            generic: 'We could not send the transaction.',
        },
    },
    addAccount: {
        title: 'Add account',
        description:
            'Enter your password to derive a new address from your recovery phrase.',
        tabs: {
            next: 'Next account',
            manual: 'Manual (by address)',
            scan: 'Discover on chain',
        },
        addressLabel: 'Address or account index',
        addressPlaceholder: '0x… or index (e.g. 1)',
        scanDescription:
            'Scan {{chain}} to detect other accounts derived from this phrase that have balance or transactions.',
        scanButton: 'Scan and import',
        scanning: 'Scanning network…',
        scanResults: 'Found and imported {{count}} new account(s).',
        scanNone: 'No additional active accounts found on the network.',
        addressNotDerived:
            'Invalid address: this address does not derive from your recovery phrase.',
        addressAlreadyAdded: 'This address is already in your wallet.',
        addressAddedSuccess: 'Account {{index}} verified and added!',
        password: 'Password',
        placeholder: 'Your password',
        submit: 'Add account',
        incorrect: 'Incorrect password. Try again.',
    },
    empty: {
        title: 'Your wallet, your keys',
        description:
            'This wallet is self-custodial: your recovery phrase stays encrypted on this device. Create a wallet to track balances, prices and real transaction history on {{chain}}.',
        create: 'Create wallet',
        recover: 'Recover with phrase',
    },
    portfolio: {
        total: 'Total portfolio balance',
        past24h: 'past 24 hours',
        noData: 'No 24h price data available',
    },
    assets: {
        title: 'Your assets',
        error: 'We could not load this wallet balances.',
        empty: 'No balances found for this address.',
        faucet: 'Use the <link>Chiado faucet</link> to receive test tokens.',
    },
    activity: {
        title: 'Recent activity',
        window: 'Last {{days}} days',
        loading: 'Loading transactions…',
        error: 'We could not load this wallet history.',
        empty: 'No recent transactions for this address.',
        received: 'Received {{symbol}}',
        sent: 'Sent {{symbol}}',
        from: 'from',
        to: 'to',
        view: 'View',
    },
    address: {
        title: 'Your wallet address',
        copy: 'Copy address',
        remove: 'Remove from this device',
    },
    create: {
        header: 'New wallet · Step {{step}} of {{total}}',
        back: 'Back',
        continue: 'Continue',
        step1: {
            badge: 'STEP 01 — SECURITY',
            title: 'Protect your wallet',
            description:
                'Create a password to protect access to your wallet on this device.',
            password: 'New password',
            passwordPlaceholder: 'At least 8 characters',
            confirm: 'Confirm password',
            confirmPlaceholder: 'Type it again',
            notice: 'Your password protects local access. It does not replace your recovery phrase.',
            show: 'Show password',
            hide: 'Hide password',
        },
        step2: {
            badge: 'STEP 02 — RECOVERY',
            title: 'Save your secret phrase',
            description:
                'These 12 words are your wallet recovery key. Keep them in the order shown.',
            copy: 'Copy recovery phrase',
            copied: 'Phrase copied!',
            warningTitle: 'Never share your phrase',
            warningText: 'Anyone with these words can control your funds.',
            confirm:
                'I understand and stored my recovery phrase somewhere safe.',
        },
        step3: {
            badge: 'STEP 03 — VERIFICATION',
            title: 'Confirm your phrase',
            description:
                'Enter the requested words to confirm you saved your phrase correctly.',
            word: 'Word number {{number}}',
            wordPlaceholder: 'Type the word',
            incorrectWord: 'Incorrect word.',
            submit: 'Create wallet',
            submitting: 'Creating wallet…',
        },
        step4: {
            title: 'Your wallet is ready!',
            description:
                'Your wallet was created successfully. You can now receive, send and manage your digital assets.',
            access: 'Open my wallet',
        },
        error: {
            title: 'Could not generate the phrase',
            retry: 'Try again',
        },
        messages: {
            passwordMin: 'The password must be at least {{count}} characters.',
            passwordMismatch: 'Passwords do not match.',
            mnemonicGenerate: 'We could not generate your recovery phrase.',
            copy: 'We could not copy automatically. Select the words manually.',
            backup: 'Confirm that you saved your recovery phrase.',
            verification:
                'One or more words are incorrect. Check your phrase and try again.',
            keystore: 'We could not save your wallet on this device.',
        },
    },
};

export type Messages = typeof en;
