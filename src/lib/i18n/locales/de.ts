import type { Messages } from './en';

export const de: Messages = {
    brand: {
        name: 'Wallet',
        tagline: 'Ihre Schlüssel. Ihre Vermögenswerte. Ihre Kontrolle.',
    },
    recover: {
        header: 'Wallet wiederherstellen · Schritt {{step}} von {{total}}',
        step1: {
            badge: 'SCHRITT 01 — WIEDERHERSTELLUNGSSATZ',
            title: 'Wiederherstellungssatz eingeben',
            description:
                'Geben Sie Ihren 12-Wort-Wiederherstellungssatz unten durch Leerzeichen getrennt ein. Dadurch wird Ihre Wallet auf diesem Gerät wiederhergestellt.',
            phraseLabel: 'Wiederherstellungssatz (12 Wörter)',
            phrasePlaceholder: 'wort1 wort2 wort3 … wort12',
            warning:
                'Geben Sie Ihren Wiederherstellungssatz niemals auf einer Website ein und teilen Sie ihn mit niemandem. Diese App verarbeitet ihn vollständig offline.',
        },
        step2: {
            badge: 'SCHRITT 02 — NEUES PASSWORT',
            title: 'Neues Passwort festlegen',
            description:
                'Wählen Sie ein Passwort, um den Zugriff auf Ihre Wallet auf diesem Gerät zu schützen. Es muss nicht mit Ihrem ursprünglichen Passwort übereinstimmen.',
            submit: 'Weiter',
            submitting: 'Wird verarbeitet…',
        },
        step3: {
            badge: 'SCHRITT 03 — KONTENSUCHE',
            title: 'Konten erkennen',
            description:
                'Wir durchsuchen das {{chain}}-Netzwerk, um automatisch alle aktiven Konten zu finden, die aus Ihrem Wiederherstellungssatz abgeleitet wurden.',
            scanning: 'Suche nach aktiven Konten auf {{chain}}…',
            found: '{{count}} Konto/Konten gefunden',
            manualTitle: 'Konto manuell hinzufügen',
            manualDescription:
                'Fügen Sie ein bestimmtes Konto hinzu, das aus Ihrem Seed-Satz abgeleitet wurde.',
            manualInputPlaceholder: '0x… (Adresse) oder Kontoindex (z. B. 1)',
            manualAddButton: 'Überprüfen & hinzufügen',
            addNextButton: '+ Konto {{index}} hinzufügen',
            addressNotDerived:
                'Ungültige Adresse: Diese Adresse stammt nicht von Ihrem Wiederherstellungssatz ab.',
            addressAlreadyAdded: 'Dieses Konto befindet sich bereits in der Liste.',
            addressVerified:
                'Adresse verifiziert: abgeleitet bei Konto {{index}}.',
            submit: 'Wallet wiederherstellen ({{count}} Konten)',
            submitting: 'Wallet wird wiederhergestellt…',
            balanceLabel: 'Guthaben: {{balance}} {{symbol}}',
            activeBadge: 'Aktiv auf der Chain',
            emptyBadge: 'Neu',
        },
        messages: {
            phraseInvalid:
                'Geben Sie genau 12 Wörter ein, getrennt durch Leerzeichen.',
        },
    },
    removeWallet: {
        title: 'Wallet entfernen',
        description:
            'Dadurch wird Ihre Wallet dauerhaft von diesem Gerät gelöscht. Ihr Guthaben ist sicher — Sie können Ihre Wallet jederzeit mit Ihrem 12-Wort-Wiederherstellungssatz wiederherstellen.',
        warning:
            'Ohne Ihren Wiederherstellungssatz verlieren Sie dauerhaft den Zugriff auf Ihr Guthaben.',
        confirm:
            'Ich habe meinen Wiederherstellungssatz gespeichert und verstehe, dass diese Aktion unwiderruflich ist.',
        submit: 'Wallet entfernen',
    },
    common: {
        close: 'Schließen',
        copy: 'Kopieren',
        copied: 'Kopiert',
        cancel: 'Abbrechen',
    },
    language: {
        label: 'Sprache',
    },
    explorer: 'Explorer',
    refresh: 'Aktualisieren',
    testnet: 'Testnetz',
    accounts: {
        title: 'Konten',
        label: 'Konto {{index}}',
        active: 'Aktiv',
        add: 'Konto hinzufügen',
    },
    receive: {
        title: 'Empfangen',
        description:
            'Scannen Sie den QR-Code oder kopieren Sie die unten stehende Adresse.',
        warning: 'Senden Sie nur {{chain}}-Vermögenswerte an diese Adresse.',
        copy: 'Adresse kopieren',
    },
    send: {
        title: 'Senden',
        reviewTitle: 'Überweisung prüfen',
        confirmTitle: 'Überweisung bestätigen',
        address: 'Empfängeradresse',
        addressPlaceholder: '0x… (Wallet-Adresse)',
        amount: 'Betrag',
        amountPlaceholder: '0.00',
        available: 'Verfügbar: {{amount}} {{symbol}}',
        max: 'Max',
        to: 'An',
        asset: 'Vermögenswert',
        network: 'Netzwerk',
        continue: 'Weiter',
        confirm: 'Bestätigen',
        back: 'Zurück',
        password: 'Passwort',
        passwordPlaceholder: 'Ihr Passwort',
        submit: '{{symbol}} senden',
        sending: 'Wird gesendet…',
        successTitle: 'Transaktion gesendet',
        successDescription:
            'Ihre Überweisung wurde an das Netzwerk übertragen.',
        view: 'Im Explorer ansehen',
        done: 'Fertig',
        errors: {
            address: 'Ungültige Adresse.',
            amount: 'Ungültiger Betrag.',
            insufficient: 'Unzureichendes Guthaben.',
            password: 'Falsches Passwort. Erneut versuchen.',
            generic: 'Transaktion konnte nicht gesendet werden.',
        },
    },
    addAccount: {
        title: 'Konto hinzufügen',
        description:
            'Geben Sie Ihr Passwort ein, um eine neue Adresse aus Ihrem Wiederherstellungssatz abzuleiten.',
        tabs: {
            next: 'Nächstes Konto',
            manual: 'Manuell (nach Adresse)',
            scan: 'Auf der Chain suchen',
        },
        addressLabel: 'Adresse oder Kontoindex',
        addressPlaceholder: '0x… oder Index (z. B. 1)',
        scanDescription:
            'Scannen Sie {{chain}}, um weitere von diesem Satz abgeleitete Konten mit Guthaben oder Transaktionen zu finden.',
        scanButton: 'Scannen und importieren',
        scanning: 'Netzwerk wird durchsucht…',
        scanResults: '{{count}} neue(s) Konto/Konten gefunden und importiert.',
        scanNone: 'Keine weiteren aktiven Konten im Netzwerk gefunden.',
        addressNotDerived:
            'Ungültige Adresse: Diese Adresse stammt nicht von Ihrem Wiederherstellungssatz ab.',
        addressAlreadyAdded:
            'Diese Adresse befindet sich bereits in Ihrer Wallet.',
        addressAddedSuccess: 'Konto {{index}} überprüft und hinzugefügt!',
        password: 'Passwort',
        placeholder: 'Ihr Passwort',
        submit: 'Konto hinzufügen',
        incorrect: 'Falsches Passwort. Erneut versuchen.',
    },
    empty: {
        title: 'Ihre Wallet, Ihre Schlüssel',
        description:
            'Diese Wallet ist selbstverwaltend: Ihr Wiederherstellungssatz bleibt verschlüsselt auf diesem Gerät. Erstellen Sie eine Wallet, um Guthaben, Kurse und echte Transaktionshistorie auf {{chain}} zu verfolgen.',
        create: 'Wallet erstellen',
        recover: 'Mit Satz wiederherstellen',
    },
    portfolio: {
        total: 'Gesamtsaldo des Portfolios',
        past24h: 'letzte 24 Stunden',
        noData: 'Keine 24h-Kursdaten verfügbar',
    },
    assets: {
        title: 'Ihre Vermögenswerte',
        error: 'Die Guthaben dieser Wallet konnten nicht geladen werden.',
        empty: 'Keine Guthaben für diese Adresse gefunden.',
        faucet: 'Nutzen Sie das <link>Chiado-Faucet</link>, um Test-Token zu erhalten.',
    },
    activity: {
        title: 'Letzte Aktivitäten',
        window: 'Letzte {{days}} Tage',
        loading: 'Transaktionen werden geladen…',
        error: 'Der Verlauf dieser Wallet konnte nicht geladen werden.',
        empty: 'Keine aktuellen Transaktionen für diese Adresse.',
        received: '{{symbol}} empfangen',
        sent: '{{symbol}} gesendet',
        from: 'von',
        to: 'an',
        view: 'Ansehen',
    },
    address: {
        title: 'Ihre Wallet-Adresse',
        copy: 'Adresse kopieren',
        remove: 'Von diesem Gerät entfernen',
    },
    create: {
        header: 'Neue Wallet · Schritt {{step}} von {{total}}',
        back: 'Zurück',
        continue: 'Weiter',
        step1: {
            badge: 'SCHRITT 01 — SICHERHEIT',
            title: 'Schützen Sie Ihre Wallet',
            description:
                'Erstellen Sie ein Passwort, um den Zugriff auf Ihre Wallet auf diesem Gerät zu sichern.',
            password: 'Neues Passwort',
            passwordPlaceholder: 'Mindestens 8 Zeichen',
            confirm: 'Passwort bestätigen',
            confirmPlaceholder: 'Erneut eingeben',
            notice: 'Ihr Passwort schützt den lokalen Zugriff. Es ersetzt nicht Ihren Wiederherstellungssatz.',
            show: 'Passwort anzeigen',
            hide: 'Passwort verbergen',
        },
        step2: {
            badge: 'SCHRITT 02 — WIEDERHERSTELLUNG',
            title: 'Geheimsatz sichern',
            description:
                'Diese 12 Wörter sind der Wiederherstellungsschlüssel für Ihre Wallet. Bewahren Sie sie in der angezeigten Reihenfolge auf.',
            copy: 'Wiederherstellungssatz kopieren',
            copied: 'Satz kopiert!',
            warningTitle: 'Geben Sie Ihren Satz niemals weiter',
            warningText:
                'Jeder, der diese Wörter kennt, hat die volle Kontrolle über Ihr Guthaben.',
            confirm:
                'Ich habe verstanden und meinen Wiederherstellungssatz an einem sicheren Ort gespeichert.',
        },
        step3: {
            badge: 'SCHRITT 03 — VERIFIZIERUNG',
            title: 'Bestätigen Sie Ihren Satz',
            description:
                'Geben Sie die angeforderten Wörter ein, um zu bestätigen, dass Sie Ihren Satz korrekt gespeichert haben.',
            word: 'Wort Nummer {{number}}',
            wordPlaceholder: 'Wort eingeben',
            incorrectWord: 'Falsches Wort.',
            submit: 'Wallet erstellen',
            submitting: 'Wallet wird erstellt…',
        },
        step4: {
            title: 'Ihre Wallet ist bereit!',
            description:
                'Ihre Wallet wurde erfolgreich erstellt. Sie können nun digitale Vermögenswerte empfangen, senden und verwalten.',
            access: 'Meine Wallet öffnen',
        },
        error: {
            title: 'Satz konnte nicht generiert werden',
            retry: 'Erneut versuchen',
        },
        messages: {
            passwordMin:
                'Das Passwort muss mindestens {{count}} Zeichen lang sein.',
            passwordMismatch: 'Passwörter stimmen nicht überein.',
            mnemonicGenerate:
                'Ihr Wiederherstellungssatz konnte nicht generiert werden.',
            copy: 'Automatisches Kopieren fehlgeschlagen. Wörter manuell markieren.',
            backup: 'Bestätigen Sie, dass Sie Ihren Wiederherstellungssatz gesichert haben.',
            verification:
                'Ein oder mehrere Wörter sind falsch. Überprüfen Sie Ihren Satz und versuchen Sie es erneut.',
            keystore:
                'Ihre Wallet konnte nicht auf diesem Gerät gespeichert werden.',
        },
    },
};
