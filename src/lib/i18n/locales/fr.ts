import type { Messages } from './en';

export const fr: Messages = {
    brand: {
        name: 'Portefeuille',
        tagline: 'Vos clés. Vos actifs. Votre contrôle.',
    },
    recover: {
        header: 'Récupérer le portefeuille · Étape {{step}} sur {{total}}',
        step1: {
            badge: 'ÉTAPE 01 — PHRASE DE RÉCUPÉRATION',
            title: 'Entrez votre phrase de récupération',
            description:
                'Saisissez ci-dessous vos 12 mots de récupération, séparés par des espaces. Cela restaurera votre portefeuille sur cet appareil.',
            phraseLabel: 'Phrase de récupération (12 mots)',
            phrasePlaceholder: 'mot1 mot2 mot3 … mot12',
            warning:
                'Ne saisissez jamais votre phrase de récupération sur un site Web et ne la partagez avec personne. Cette application la traite entièrement hors ligne.',
        },
        step2: {
            badge: 'ÉTAPE 02 — NOUVEAU MOT DE PASSE',
            title: 'Définir un nouveau mot de passe',
            description:
                'Choisissez un mot de passe pour protéger l’accès à votre portefeuille sur cet appareil. Il n’a pas besoin de correspondre à votre mot de passe d’origine.',
            submit: 'Continuer',
            submitting: 'Traitement…',
        },
        step3: {
            badge: 'ÉTAPE 03 — DÉCOUVERTE DES COMPTES',
            title: 'Découvrir les comptes',
            description:
                'Nous analysons le réseau {{chain}} pour trouver automatiquement tous les comptes actifs dérivés de votre phrase de récupération.',
            scanning: 'Recherche de comptes actifs sur {{chain}}…',
            found: '{{count}} compte(s) découvert(s)',
            manualTitle: 'Ajouter un compte manuellement',
            manualDescription:
                'Ajouter un compte spécifique dérivé de votre phrase de récupération.',
            manualInputPlaceholder: '0x… (adresse) ou index du compte (ex. 1)',
            manualAddButton: 'Vérifier et ajouter',
            addNextButton: '+ Ajouter le compte {{index}}',
            addressNotDerived:
                'Adresse non valide : cette adresse n’est pas dérivée de votre phrase de récupération.',
            addressAlreadyAdded: 'Ce compte figure déjà dans la liste.',
            addressVerified:
                'Adresse vérifiée : dérivée au compte {{index}}.',
            submit: 'Restaurer le portefeuille ({{count}} comptes)',
            submitting: 'Restauration du portefeuille…',
            balanceLabel: 'Solde : {{balance}} {{symbol}}',
            activeBadge: 'Actif sur la chaîne',
            emptyBadge: 'Nouveau',
        },
        messages: {
            phraseInvalid: 'Entrez exactement 12 mots séparés par des espaces.',
        },
    },
    removeWallet: {
        title: 'Supprimer le portefeuille',
        description:
            'Cette action supprimera définitivement votre portefeuille de cet appareil. Vos fonds sont en sécurité — vous pouvez restaurer votre portefeuille à tout moment à l’aide de votre phrase de récupération de 12 mots.',
        warning:
            'Sans votre phrase de récupération, vous perdrez définitivement l’accès à vos fonds.',
        confirm:
            'J’ai sauvegardé ma phrase de récupération et je comprends que cette action est irréversible.',
        submit: 'Supprimer le portefeuille',
    },
    common: {
        close: 'Fermer',
        copy: 'Copier',
        copied: 'Copié',
        cancel: 'Annuler',
    },
    language: {
        label: 'Langue',
    },
    explorer: 'Explorateur',
    refresh: 'Actualiser',
    testnet: 'Réseau de test',
    accounts: {
        title: 'Comptes',
        label: 'Compte {{index}}',
        active: 'Actif',
        add: 'Ajouter un compte',
    },
    receive: {
        title: 'Recevoir',
        description: 'Scannez le code QR ou copiez l’adresse ci-dessous.',
        warning: 'Envoyez uniquement des actifs {{chain}} à cette adresse.',
        copy: 'Copier l’adresse',
    },
    send: {
        title: 'Envoyer',
        reviewTitle: 'Vérifier le transfert',
        confirmTitle: 'Confirmer le transfert',
        address: 'Adresse du destinataire',
        addressPlaceholder: '0x… (adresse du portefeuille)',
        amount: 'Montant',
        amountPlaceholder: '0.00',
        available: 'Disponible : {{amount}} {{symbol}}',
        max: 'Max',
        to: 'À',
        asset: 'Actif',
        network: 'Réseau',
        continue: 'Continuer',
        confirm: 'Confirmer',
        back: 'Retour',
        password: 'Mot de passe',
        passwordPlaceholder: 'Votre mot de passe',
        submit: 'Envoyer {{symbol}}',
        sending: 'Envoi en cours…',
        successTitle: 'Transaction envoyée',
        successDescription: 'Votre transfert a été diffusé sur le réseau.',
        view: 'Voir dans l’explorateur',
        done: 'Terminé',
        errors: {
            address: 'Adresse non valide.',
            amount: 'Montant non valide.',
            insufficient: 'Solde insuffisant.',
            password: 'Mot de passe incorrect. Réessayez.',
            generic: 'Impossible d’envoyer la transaction.',
        },
    },
    addAccount: {
        title: 'Ajouter un compte',
        description:
            'Entrez votre mot de passe pour dériver une nouvelle adresse à partir de votre phrase de récupération.',
        tabs: {
            next: 'Compte suivant',
            manual: 'Manuel (par adresse)',
            scan: 'Découvrir sur la chaîne',
        },
        addressLabel: 'Adresse ou index du compte',
        addressPlaceholder: '0x… ou index (ex. 1)',
        scanDescription:
            'Analyser {{chain}} pour détecter d’autres comptes dérivés de cette phrase ayant un solde ou des transactions.',
        scanButton: 'Analyser et importer',
        scanning: 'Analyse du réseau…',
        scanResults: '{{count}} nouveau(x) compte(s) trouvé(s) et importé(s).',
        scanNone: 'Aucun autre compte actif trouvé sur le réseau.',
        addressNotDerived:
            'Adresse non valide : cette adresse n’est pas dérivée de votre phrase de récupération.',
        addressAlreadyAdded: 'Cette adresse est déjà dans votre portefeuille.',
        addressAddedSuccess: 'Compte {{index}} vérifié et ajouté !',
        password: 'Mot de passe',
        placeholder: 'Votre mot de passe',
        submit: 'Ajouter un compte',
        incorrect: 'Mot de passe incorrect. Réessayez.',
    },
    empty: {
        title: 'Votre portefeuille, vos clés',
        description:
            'Ce portefeuille est auto-hébergé : votre phrase de récupération reste chiffrée sur cet appareil. Créez un portefeuille pour suivre soldes, cours et historique réel des transactions sur {{chain}}.',
        create: 'Créer un portefeuille',
        recover: 'Récupérer avec la phrase',
    },
    portfolio: {
        total: 'Solde total du portefeuille',
        past24h: 'dernières 24 heures',
        noData: 'Aucune donnée de prix sur 24h disponible',
    },
    assets: {
        title: 'Vos actifs',
        error: 'Impossible de charger les soldes de ce portefeuille.',
        empty: 'Aucun solde trouvé pour cette adresse.',
        faucet: 'Utilisez le <link>robinet Chiado</link> pour recevoir des jetons de test.',
    },
    activity: {
        title: 'Activité récente',
        window: 'Derniers {{days}} jours',
        loading: 'Chargement des transactions…',
        error: 'Impossible de charger l’historique de ce portefeuille.',
        empty: 'Aucune transaction récente pour cette adresse.',
        received: 'Reçu {{symbol}}',
        sent: 'Envoyé {{symbol}}',
        from: 'de',
        to: 'à',
        view: 'Voir',
    },
    address: {
        title: 'Adresse de votre portefeuille',
        copy: 'Copier l’adresse',
        remove: 'Supprimer de cet appareil',
    },
    create: {
        header: 'Nouveau portefeuille · Étape {{step}} sur {{total}}',
        back: 'Retour',
        continue: 'Continuer',
        step1: {
            badge: 'ÉTAPE 01 — SÉCURITÉ',
            title: 'Protégez votre portefeuille',
            description:
                'Créez un mot de passe pour protéger l’accès à votre portefeuille sur cet appareil.',
            password: 'Nouveau mot de passe',
            passwordPlaceholder: 'Au moins 8 caractères',
            confirm: 'Confirmer le mot de passe',
            confirmPlaceholder: 'Tapez-le à nouveau',
            notice: 'Votre mot de passe protège l’accès local. Il ne remplace pas votre phrase de récupération.',
            show: 'Afficher le mot de passe',
            hide: 'Masquer le mot de passe',
        },
        step2: {
            badge: 'ÉTAPE 02 — SAUVEGARDE',
            title: 'Enregistrez votre phrase secrète',
            description:
                'Ces 12 mots constituent la clé de récupération de votre portefeuille. Conservez-les dans l’ordre affiché.',
            copy: 'Copier la phrase de récupération',
            copied: 'Phrase copiée !',
            warningTitle: 'Ne partagez jamais votre phrase',
            warningText:
                'Toute personne ayant accès à ces mots peut contrôler vos fonds.',
            confirm:
                'Je comprends et j’ai stocké ma phrase de récupération dans un endroit sûr.',
        },
        step3: {
            badge: 'ÉTAPE 03 — VÉRIFICATION',
            title: 'Confirmez votre phrase',
            description:
                'Entrez les mots demandés pour confirmer que vous avez correctement sauvegardé votre phrase.',
            word: 'Mot numéro {{number}}',
            wordPlaceholder: 'Tapez le mot',
            incorrectWord: 'Mot incorrect.',
            submit: 'Créer le portefeuille',
            submitting: 'Création du portefeuille…',
        },
        step4: {
            title: 'Votre portefeuille est prêt !',
            description:
                'Votre portefeuille a été créé avec succès. Vous pouvez maintenant recevoir, envoyer et gérer vos actifs numériques.',
            access: 'Ouvrir mon portefeuille',
        },
        error: {
            title: 'Impossible de générer la phrase',
            retry: 'Réessayer',
        },
        messages: {
            passwordMin:
                'Le mot de passe doit comporter au moins {{count}} caractères.',
            passwordMismatch: 'Les mots de passe ne correspondent pas.',
            mnemonicGenerate:
                'Impossible de générer votre phrase de récupération.',
            copy: 'Impossible de copier automatiquement. Sélectionnez les mots manuellement.',
            backup: 'Confirmez que vous avez bien sauvegardé votre phrase de récupération.',
            verification:
                'Un ou plusieurs mots sont incorrects. Vérifiez votre phrase et réessayez.',
            keystore:
                'Impossible d’enregistrer votre portefeuille sur cet appareil.',
        },
    },
};
