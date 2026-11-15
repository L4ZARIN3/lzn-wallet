import type { Messages } from './en';

export const it: Messages = {
    brand: {
        name: 'Portafoglio',
        tagline: 'Le tue chiavi. I tuoi asset. Il tuo controllo.',
    },
    recover: {
        header: 'Recupera portafoglio · Passaggio {{step}} di {{total}}',
        step1: {
            badge: 'PASSAGGIO 01 — FRASE DI RECUPERO',
            title: 'Inserisci la tua frase di recupero',
            description:
                'Digita le 12 parole della tua frase di recupero qui sotto, separate da spazi. Questo ripristinerà il tuo portafoglio su questo dispositivo.',
            phraseLabel: 'Frase di recupero (12 parole)',
            phrasePlaceholder: 'parola1 parola2 parola3 … parola12',
            warning:
                'Non inserire mai la tua frase di recupero su un sito web né condividerla con nessuno. Questa app la elabora completamente offline.',
        },
        step2: {
            badge: 'PASSAGGIO 02 — NUOVA PASSWORD',
            title: 'Imposta una nuova password',
            description:
                'Scegli una password per proteggere il tuo portafoglio su questo dispositivo. Non deve corrispondere alla password originale.',
            submit: 'Continua',
            submitting: 'Elaborazione…',
        },
        step3: {
            badge: 'PASSAGGIO 03 — SCOPERTA ACCOUNT',
            title: 'Scopri account',
            description:
                'Scansioniamo la rete {{chain}} per trovare automaticamente tutti gli account attivi derivati dalla tua frase di recupero.',
            scanning: 'Ricerca account attivi sulla rete {{chain}}…',
            found: '{{count}} account scoperto/i',
            manualTitle: 'Aggiungi account manualmente',
            manualDescription:
                'Aggiungi un account specifico derivato dalla tua frase seed.',
            manualInputPlaceholder: '0x… (indirizzo) o indice account (es: 1)',
            manualAddButton: 'Verifica e aggiungi',
            addNextButton: '+ Aggiungi Account {{index}}',
            addressNotDerived:
                'Indirizzo non valido: questo indirizzo non deriva dalla tua frase di recupero.',
            addressAlreadyAdded: 'Questo account è già presente nell’elenco.',
            addressVerified: 'Indirizzo verificato: derivato nell’Account {{index}}.',
            submit: 'Ripristina portafoglio ({{count}} account)',
            submitting: 'Ripristino portafoglio…',
            balanceLabel: 'Saldo: {{balance}} {{symbol}}',
            activeBadge: 'Attivo sulla rete',
            emptyBadge: 'Nuovo',
        },
        messages: {
            phraseInvalid: 'Inserisci esattamente 12 parole separate da spazi.',
        },
    },
    removeWallet: {
        title: 'Rimuovi portafoglio',
        description:
            'Questo eliminerà definitivamente il portafoglio da questo dispositivo. I tuoi fondi sono al sicuro — puoi ripristinarlo in qualsiasi momento con la tua frase di recupero di 12 parole.',
        warning:
            'Senza la frase di recupero perderai l\'accesso ai tuoi fondi per sempre.',
        confirm: 'Ho salvato la mia frase di recupero e capisco che questa azione è irreversibile.',
        submit: 'Rimuovi portafoglio',
    },
    common: {
        close: 'Chiudi',
        copy: 'Copia',
        copied: 'Copiato',
        cancel: 'Annulla',
    },
    language: {
        label: 'Lingua',
    },
    explorer: 'Esploratore',
    refresh: 'Aggiorna',
    testnet: 'Testnet',
    accounts: {
        title: 'Account',
        label: 'Account {{index}}',
        active: 'Attivo',
        add: 'Aggiungi account',
    },
    receive: {
        title: 'Ricevi',
        description:
            'Scansiona il codice QR o copia questo indirizzo qui sotto.',
        warning: 'Invia solo asset della rete {{chain}} a questo indirizzo.',
        copy: 'Copia indirizzo',
    },
    send: {
        title: 'Invia',
        reviewTitle: 'Rivedi il trasferimento',
        confirmTitle: 'Conferma il trasferimento',
        address: 'Indirizzo del destinatario',
        addressPlaceholder: '0x… (indirizzo del portafoglio)',
        amount: 'Importo',
        amountPlaceholder: '0,00',
        available: 'Disponibile: {{amount}} {{symbol}}',
        max: 'Max',
        to: 'A',
        asset: 'Asset',
        network: 'Rete',
        continue: 'Continua',
        confirm: 'Conferma',
        back: 'Indietro',
        password: 'Password',
        passwordPlaceholder: 'La tua password',
        submit: 'Invia {{symbol}}',
        sending: 'Invio in corso…',
        successTitle: 'Transazione inviata',
        successDescription: 'Il tuo trasferimento è stato trasmesso alla rete.',
        view: 'Visualizza nell’esploratore',
        done: 'Fine',
        errors: {
            address: 'Indirizzo non valido.',
            amount: 'Importo non valido.',
            insufficient: 'Saldo insufficiente.',
            password: 'Password errata. Riprova.',
            generic: 'Non siamo riusciti a inviare la transazione.',
        },
    },
    addAccount: {
        title: 'Aggiungi account',
        description:
            'Inserisci la tua password per derivare un nuovo indirizzo dalla tua frase di recupero.',
        tabs: {
            next: 'Account successivo',
            manual: 'Per indirizzo',
            scan: 'Scopri sulla rete',
        },
        addressLabel: 'Indirizzo o indice account',
        addressPlaceholder: '0x… o indice (es: 1)',
        scanDescription:
            'Scansiona la rete {{chain}} per rilevare altri account derivati da questa frase con saldo o transazioni.',
        scanButton: 'Scansiona e importa',
        scanning: 'Scansione della rete…',
        scanResults: 'Trovato/i e importato/i {{count}} nuovo/i account.',
        scanNone: 'Nessun account attivo aggiuntivo trovato sulla rete.',
        addressNotDerived:
            'Indirizzo non valido: questo indirizzo non deriva dalla tua frase di recupero.',
        addressAlreadyAdded: 'Questo indirizzo è già presente nel tuo portafoglio.',
        addressAddedSuccess: 'Account {{index}} verificato e aggiunto!',
        password: 'Password',
        placeholder: 'La tua password',
        submit: 'Aggiungi account',
        incorrect: 'Password errata. Riprova.',
    },
    empty: {
        title: 'Il tuo portafoglio, le tue chiavi',
        description:
            'Questo portafoglio è autocustodiale: la tua frase di recupero resta cifrata su questo dispositivo. Crea un portafoglio per monitorare saldi, prezzi e la cronologia reale delle transazioni su {{chain}}.',
        create: 'Crea portafoglio',
        recover: 'Recupera con frase',
    },
    portfolio: {
        total: 'Saldo totale del portafoglio',
        past24h: 'ultime 24 ore',
        noData: 'Nessun dato di prezzo a 24h disponibile',
    },
    assets: {
        title: 'I tuoi asset',
        error: 'Non siamo riusciti a caricare i saldi di questo portafoglio.',
        empty: 'Nessun saldo trovato per questo indirizzo.',
        faucet: 'Usa il <link>faucet di Chiado</link> per ricevere token di test.',
    },
    activity: {
        title: 'Attività recente',
        window: 'Ultimi {{days}} giorni',
        loading: 'Caricamento transazioni…',
        error: 'Non siamo riusciti a caricare la cronologia di questo portafoglio.',
        empty: 'Nessuna transazione recente per questo indirizzo.',
        received: 'Ricevuto {{symbol}}',
        sent: 'Inviato {{symbol}}',
        from: 'da',
        to: 'a',
        view: 'Visualizza',
    },
    address: {
        title: 'Indirizzo del tuo portafoglio',
        copy: 'Copia indirizzo',
        remove: 'Rimuovi da questo dispositivo',
    },
    create: {
        header: 'Nuovo portafoglio · Passaggio {{step}} di {{total}}',
        back: 'Indietro',
        continue: 'Continua',
        step1: {
            badge: 'PASSAGGIO 01 — SICUREZZA',
            title: 'Proteggi il tuo portafoglio',
            description:
                'Crea una password per proteggere il tuo portafoglio su questo dispositivo.',
            password: 'Nuova password',
            passwordPlaceholder: 'Almeno 8 caratteri',
            confirm: 'Conferma password',
            confirmPlaceholder: 'Digita di nuovo',
            notice: 'La tua password protegge questo dispositivo. Non sostituisce la tua frase di recupero.',
            show: 'Mostra password',
            hide: 'Nascondi password',
        },
        step2: {
            badge: 'PASSAGGIO 02 — RECUPERO',
            title: 'Salva la tua frase segreta',
            description:
                'Queste 12 parole sono la chiave di recupero del tuo portafoglio. Conservale nello stesso ordine mostrato.',
            copy: 'Copia frase di recupero',
            copied: 'Frase copiata!',
            warningTitle: 'Non condividere mai la tua frase',
            warningText:
                'Chiunque possieda queste parole può controllare i tuoi fondi.',
            confirm:
                'Ho capito e ho salvato la mia frase di recupero in un luogo sicuro.',
        },
        step3: {
            badge: 'PASSAGGIO 03 — VERIFICA',
            title: 'Conferma la tua frase',
            description:
                'Inserisci le parole richieste per confermare di aver salvato correttamente la tua frase.',
            word: 'Parola numero {{number}}',
            wordPlaceholder: 'Digita la parola',
            incorrectWord: 'Parola errata.',
            submit: 'Crea portafoglio',
            submitting: 'Creazione portafoglio…',
        },
        step4: {
            title: 'Il tuo portafoglio è pronto!',
            description:
                'Il tuo portafoglio è stato creato correttamente. Ora puoi ricevere, inviare e gestire i tuoi asset digitali.',
            access: 'Apri il mio portafoglio',
        },
        error: {
            title: 'Impossibile generare la frase',
            retry: 'Riprova',
        },
        messages: {
            passwordMin:
                'La password deve contenere almeno {{count}} caratteri.',
            passwordMismatch: 'Le password non corrispondono.',
            mnemonicGenerate:
                'Non siamo riusciti a generare la tua frase di recupero.',
            copy: 'Non siamo riusciti a copiare automaticamente. Seleziona le parole manualmente.',
            backup: 'Conferma di aver salvato la tua frase di recupero.',
            verification:
                'Una o più parole sono errate. Controlla la tua frase e riprova.',
            keystore:
                'Non siamo riusciti a salvare il tuo portafoglio su questo dispositivo.',
        },
    },
};
