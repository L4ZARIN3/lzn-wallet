import type { Messages } from './en';

export const pcm: Messages = {
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
                'Type your 12-word recovery phrase for here, put space between them. Dis one go bring back your wallet for dis device.',
            phraseLabel: 'Recovery phrase (12 words)',
            phrasePlaceholder: 'word1 word2 word3 … word12',
            warning:
                'Never put your recovery phrase for any website or share am give anybody. Dis app dey run everything offline.',
        },
        step2: {
            badge: 'STEP 02 — NEW PASSWORD',
            title: 'Set new password',
            description:
                'Pick password to protect access to your wallet for dis device. E no need match your first password.',
            submit: 'Continue',
            submitting: 'E dey load…',
        },
        step3: {
            badge: 'STEP 03 — FIND ACCOUNTS',
            title: 'Find accounts',
            description:
                'We dey check {{chain}} network to find all active accounts wey come from your recovery phrase automatically.',
            scanning: 'Dey search for active accounts on {{chain}}…',
            found: 'We don find {{count}} account(s)',
            manualTitle: 'Add account by yourself',
            manualDescription:
                'Add one particular account wey come from your seed phrase.',
            manualInputPlaceholder: '0x… (address) or account index (e.g. 1)',
            manualAddButton: 'Check & add',
            addNextButton: '+ Add Account {{index}}',
            addressNotDerived:
                'Address no correct: dis address no come from your recovery phrase.',
            addressAlreadyAdded: 'Dis account dey inside the list already.',
            addressVerified:
                'Address dey verified: e come from Account {{index}}.',
            submit: 'Restore wallet ({{count}} accounts)',
            submitting: 'Dey bring back wallet…',
            balanceLabel: 'Balance: {{balance}} {{symbol}}',
            activeBadge: 'Active for chain',
            emptyBadge: 'New',
        },
        messages: {
            phraseInvalid:
                'Type exactly 12 words with space between them.',
        },
    },
    removeWallet: {
        title: 'Comot wallet',
        description:
            'Dis action go wipe your wallet completely from dis device. Your money dey safe — you fit bring your wallet back anytime with your 12-word recovery phrase.',
        warning:
            'Without your recovery phrase, you go lose access to your money forever.',
        confirm:
            'I don save my recovery phrase and I know say I no fit undo dis action.',
        submit: 'Comot wallet',
    },
    common: {
        close: 'Close',
        copy: 'Copy',
        copied: 'Don copy',
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
        description: 'Scan the QR code or copy the address wey dey below.',
        warning: 'Send only {{chain}} tokens enter dis address.',
        copy: 'Copy address',
    },
    send: {
        title: 'Send',
        reviewTitle: 'Check transfer',
        confirmTitle: 'Confirm transfer',
        address: 'Person address',
        addressPlaceholder: '0x… (wallet address)',
        amount: 'Amount',
        amountPlaceholder: '0.00',
        available: 'Dey available: {{amount}} {{symbol}}',
        max: 'Max',
        to: 'Give',
        asset: 'Asset',
        network: 'Network',
        continue: 'Continue',
        confirm: 'Confirm',
        back: 'Go back',
        password: 'Password',
        passwordPlaceholder: 'Your password',
        submit: 'Send {{symbol}}',
        sending: 'Dey send…',
        successTitle: 'Transaction don go',
        successDescription: 'Your transfer don broadcast enter the network.',
        view: 'View for explorer',
        done: 'Done',
        errors: {
            address: 'Address no correct.',
            amount: 'Amount no correct.',
            insufficient: 'Money no reach.',
            password: 'Password no correct. Try again.',
            generic: 'We no fit send the transaction.',
        },
    },
    addAccount: {
        title: 'Add account',
        description:
            'Put your password to get new address from your recovery phrase.',
        tabs: {
            next: 'Next account',
            manual: 'Manual (by address)',
            scan: 'Find for chain',
        },
        addressLabel: 'Address or account index',
        addressPlaceholder: '0x… or index (e.g. 1)',
        scanDescription:
            'Scan {{chain}} make you see other accounts from dis phrase wey get balance or transaction.',
        scanButton: 'Scan & import',
        scanning: 'Dey scan network…',
        scanResults: 'We don find and import {{count}} new account(s).',
        scanNone: 'No other active account dey for the network.',
        addressNotDerived:
            'Address no correct: dis address no come from your recovery phrase.',
        addressAlreadyAdded: 'Dis address dey your wallet already.',
        addressAddedSuccess: 'Account {{index}} verified and added!',
        password: 'Password',
        placeholder: 'Your password',
        submit: 'Add account',
        incorrect: 'Password no correct. Try again.',
    },
    empty: {
        title: 'Your wallet, your keys',
        description:
            'Dis wallet na self-custodial: your recovery phrase dey encrypted for dis device. Create wallet make you fit track balance, price, and real transactions for {{chain}}.',
        create: 'Create wallet',
        recover: 'Recover with phrase',
    },
    portfolio: {
        total: 'Total portfolio balance',
        past24h: 'last 24 hours',
        noData: 'No price data for 24h',
    },
    assets: {
        title: 'Your assets',
        error: 'We no fit load dis wallet balance.',
        empty: 'No balance found for dis address.',
        faucet: 'Use the <link>Chiado faucet</link> collect test tokens.',
    },
    activity: {
        title: 'Recent activity',
        window: 'Last {{days}} days',
        loading: 'Dey load transactions…',
        error: 'We no fit load dis wallet history.',
        empty: 'No recent transaction for dis address.',
        received: 'Receive {{symbol}}',
        sent: 'Send {{symbol}}',
        from: 'from',
        to: 'go',
        view: 'View',
    },
    address: {
        title: 'Your wallet address',
        copy: 'Copy address',
        remove: 'Comot from dis device',
    },
    create: {
        header: 'New wallet · Step {{step}} of {{total}}',
        back: 'Go back',
        continue: 'Continue',
        step1: {
            badge: 'STEP 01 — SECURITY',
            title: 'Protect your wallet',
            description:
                'Create password make you fit protect access to your wallet for dis device.',
            password: 'New password',
            passwordPlaceholder: 'At least 8 letters or numbers',
            confirm: 'Confirm password',
            confirmPlaceholder: 'Type am again',
            notice: 'Your password dey protect local access. E no fit replace your recovery phrase.',
            show: 'Show password',
            hide: 'Hide password',
        },
        step2: {
            badge: 'STEP 02 — RECOVERY',
            title: 'Save your secret phrase',
            description:
                'Dis 12 words na your wallet recovery key. Keep dem as dem arrange dem so.',
            copy: 'Copy recovery phrase',
            copied: 'Don copy phrase!',
            warningTitle: 'Never share your phrase give anybody',
            warningText:
                'Anybody wey hold dis words fit control your money.',
            confirm:
                'I understand and I don keep my recovery phrase for safe place.',
        },
        step3: {
            badge: 'STEP 03 — VERIFICATION',
            title: 'Confirm your phrase',
            description:
                'Type the words wey dem ask to confirm say you save your phrase well.',
            word: 'Word number {{number}}',
            wordPlaceholder: 'Type the word',
            incorrectWord: 'Word no correct.',
            submit: 'Create wallet',
            submitting: 'Dey create wallet…',
        },
        step4: {
            title: 'Your wallet don set!',
            description:
                'Your wallet don create successfully. You fit receive, send, and manage your digital assets now.',
            access: 'Open my wallet',
        },
        error: {
            title: 'We no fit generate the phrase',
            retry: 'Try again',
        },
        messages: {
            passwordMin:
                'Password must reach at least {{count}} characters.',
            passwordMismatch: 'Passwords no match.',
            mnemonicGenerate: 'We no fit create your recovery phrase.',
            copy: 'E no fit copy automatically. Highlight the words copy dem by yourself.',
            backup: 'Confirm say you don save your recovery phrase.',
            verification:
                'One or more words no correct. Check your phrase make you try again.',
            keystore: 'We no fit save your wallet for dis device.',
        },
    },
};
