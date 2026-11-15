import type { Messages } from './en';

export const es: Messages = {
    brand: {
        name: 'Cartera',
        tagline: 'Tus llaves. Tus activos. Tu control.',
    },
    recover: {
        header: 'Recuperar cartera · Paso {{step}} de {{total}}',
        step1: {
            badge: 'PASO 01 — FRASE DE RECUPERACIÓN',
            title: 'Introduce tu frase de recuperación',
            description:
                'Escribe las 12 palabras de tu frase de recuperación a continuación, separadas por espacios. Esto restaurará tu cartera en este dispositivo.',
            phraseLabel: 'Frase de recuperación (12 palabras)',
            phrasePlaceholder: 'palabra1 palabra2 palabra3 … palabra12',
            warning:
                'Nunca introduzcas tu frase de recuperación en un sitio web ni la compartas con nadie. Esta app la procesa completamente sin conexión.',
        },
        step2: {
            badge: 'PASO 02 — NUEVA CONTRASEÑA',
            title: 'Establece una nueva contraseña',
            description:
                'Elige una contraseña para proteger el acceso a tu cartera en este dispositivo. No tiene que coincidir con tu contraseña original.',
            submit: 'Continuar',
            submitting: 'Procesando…',
        },
        step3: {
            badge: 'PASO 03 — DESCUBRIMIENTO DE CUENTAS',
            title: 'Descubrir cuentas',
            description:
                'Buscamos en la red {{chain}} para encontrar automáticamente todas las cuentas activas derivadas de tu frase de recuperación.',
            scanning: 'Buscando cuentas activas en la red {{chain}}…',
            found: '{{count}} cuenta(s) descubierta(s)',
            manualTitle: 'Añadir cuenta manualmente',
            manualDescription:
                'Añade una cuenta específica derivada de tu frase semilla.',
            manualInputPlaceholder: '0x… (dirección) o índice de cuenta (ej: 1)',
            manualAddButton: 'Verificar y añadir',
            addNextButton: '+ Añadir Cuenta {{index}}',
            addressNotDerived:
                'Dirección inválida: esta dirección no se deriva de tu frase de recuperación.',
            addressAlreadyAdded: 'Esta cuenta ya está en la lista.',
            addressVerified: 'Dirección verificada: derivada en la Cuenta {{index}}.',
            submit: 'Restaurar cartera ({{count}} cuentas)',
            submitting: 'Restaurando cartera…',
            balanceLabel: 'Saldo: {{balance}} {{symbol}}',
            activeBadge: 'Activa en la red',
            emptyBadge: 'Nueva',
        },
        messages: {
            phraseInvalid: 'Introduce exactamente 12 palabras separadas por espacios.',
        },
    },
    removeWallet: {
        title: 'Eliminar cartera',
        description:
            'Esto eliminará permanentemente tu cartera de este dispositivo. Tus fondos están seguros — puedes restaurarla en cualquier momento con tu frase de recuperación de 12 palabras.',
        warning:
            'Sin tu frase de recuperación perderás el acceso a tus fondos para siempre.',
        confirm: 'He guardado mi frase de recuperación y entiendo que esta acción es irreversible.',
        submit: 'Eliminar cartera',
    },
    common: {
        close: 'Cerrar',
        copy: 'Copiar',
        copied: 'Copiado',
        cancel: 'Cancelar',
    },
    language: {
        label: 'Idioma',
    },
    explorer: 'Explorador',
    refresh: 'Actualizar',
    testnet: 'Testnet',
    accounts: {
        title: 'Cuentas',
        label: 'Cuenta {{index}}',
        active: 'Activa',
        add: 'Añadir cuenta',
    },
    receive: {
        title: 'Recibir',
        description: 'Escanea el código QR o copia la dirección de abajo.',
        warning: 'Envía solo activos de la red {{chain}} a esta dirección.',
        copy: 'Copiar dirección',
    },
    send: {
        title: 'Enviar',
        reviewTitle: 'Revisar envío',
        confirmTitle: 'Confirmar envío',
        address: 'Dirección de destino',
        addressPlaceholder: '0x… (dirección de la cartera)',
        amount: 'Cantidad',
        amountPlaceholder: '0,00',
        available: 'Disponible: {{amount}} {{symbol}}',
        max: 'Máximo',
        to: 'Para',
        asset: 'Activo',
        network: 'Red',
        continue: 'Continuar',
        confirm: 'Confirmar',
        back: 'Atrás',
        password: 'Contraseña',
        passwordPlaceholder: 'Tu contraseña',
        submit: 'Enviar {{symbol}}',
        sending: 'Enviando…',
        successTitle: 'Transacción enviada',
        successDescription: 'Tu transferencia se transmitió a la red.',
        view: 'Ver en el explorador',
        done: 'Listo',
        errors: {
            address: 'Dirección no válida.',
            amount: 'Cantidad no válida.',
            insufficient: 'Saldo insuficiente.',
            password: 'Contraseña incorrecta. Inténtalo de nuevo.',
            generic: 'No pudimos enviar la transacción.',
        },
    },
    addAccount: {
        title: 'Añadir cuenta',
        description:
            'Introduce tu contraseña para derivar una nueva dirección a partir de tu frase de recuperación.',
        tabs: {
            next: 'Siguiente cuenta',
            manual: 'Por dirección',
            scan: 'Descubrir en la red',
        },
        addressLabel: 'Dirección o índice de cuenta',
        addressPlaceholder: '0x… o índice (ej: 1)',
        scanDescription:
            'Escanea la red {{chain}} para detectar otras cuentas derivadas de esta frase con saldo o transacciones.',
        scanButton: 'Escanear e importar',
        scanning: 'Escaneando la red…',
        scanResults: 'Se encontraron e importaron {{count}} nueva(s) cuenta(s).',
        scanNone: 'No se encontraron cuentas activas adicionales en la red.',
        addressNotDerived:
            'Dirección inválida: esta dirección no se deriva de tu frase de recuperación.',
        addressAlreadyAdded: 'Esta dirección ya está en tu cartera.',
        addressAddedSuccess: '¡Cuenta {{index}} verificada y añadida!',
        password: 'Contraseña',
        placeholder: 'Tu contraseña',
        submit: 'Añadir cuenta',
        incorrect: 'Contraseña incorrecta. Inténtalo de nuevo.',
    },
    empty: {
        title: 'Tu cartera, tus llaves',
        description:
            'Esta cartera es autocustodiada: tu frase de recuperación permanece cifrada en este dispositivo. Crea una cartera para seguir saldos, precios e historial real de transacciones en {{chain}}.',
        create: 'Crear cartera',
        recover: 'Recuperar con frase',
    },
    portfolio: {
        total: 'Saldo total de la cartera',
        past24h: 'últimas 24 horas',
        noData: 'No hay datos de precio de 24h disponibles',
    },
    assets: {
        title: 'Tus activos',
        error: 'No pudimos cargar los saldos de esta cartera.',
        empty: 'No se encontraron saldos para esta dirección.',
        faucet: 'Usa el <link>faucet de Chiado</link> para recibir tokens de prueba.',
    },
    activity: {
        title: 'Actividad reciente',
        window: 'Últimos {{days}} días',
        loading: 'Cargando transacciones…',
        error: 'No pudimos cargar el historial de esta cartera.',
        empty: 'No hay transacciones recientes para esta dirección.',
        received: 'Recibido {{symbol}}',
        sent: 'Enviado {{symbol}}',
        from: 'de',
        to: 'a',
        view: 'Ver',
    },
    address: {
        title: 'Dirección de tu cartera',
        copy: 'Copiar dirección',
        remove: 'Eliminar de este dispositivo',
    },
    create: {
        header: 'Nueva cartera · Paso {{step}} de {{total}}',
        back: 'Atrás',
        continue: 'Continuar',
        step1: {
            badge: 'PASO 01 — SEGURIDAD',
            title: 'Protege tu cartera',
            description:
                'Crea una contraseña para proteger el acceso a tu cartera en este dispositivo.',
            password: 'Nueva contraseña',
            passwordPlaceholder: 'Mínimo 8 caracteres',
            confirm: 'Confirmar contraseña',
            confirmPlaceholder: 'Escríbela de nuevo',
            notice: 'Tu contraseña protege el acceso local. No sustituye tu frase de recuperación.',
            show: 'Mostrar contraseña',
            hide: 'Ocultar contraseña',
        },
        step2: {
            badge: 'PASO 02 — RECUPERACIÓN',
            title: 'Guarda tu frase secreta',
            description:
                'Estas 12 palabras son la clave de recuperación de tu cartera. Consérvalas en el orden mostrado.',
            copy: 'Copiar frase de recuperación',
            copied: '¡Frase copiada!',
            warningTitle: 'Nunca compartas tu frase',
            warningText:
                'Cualquier persona con estas palabras puede controlar tus fondos.',
            confirm:
                'Entiendo y guardé mi frase de recuperación en un lugar seguro.',
        },
        step3: {
            badge: 'PASO 03 — VERIFICACIÓN',
            title: 'Confirma tu frase',
            description:
                'Introduce las palabras solicitadas para confirmar que guardaste tu frase correctamente.',
            word: 'Palabra número {{number}}',
            wordPlaceholder: 'Escribe la palabra',
            incorrectWord: 'Palabra incorrecta.',
            submit: 'Crear cartera',
            submitting: 'Creando cartera…',
        },
        step4: {
            title: '¡Tu cartera está lista!',
            description:
                'Tu cartera se creó correctamente. Ahora puedes recibir, enviar y gestionar tus activos digitales.',
            access: 'Abrir mi cartera',
        },
        error: {
            title: 'No se pudo generar la frase',
            retry: 'Intentar de nuevo',
        },
        messages: {
            passwordMin:
                'La contraseña debe tener al menos {{count}} caracteres.',
            passwordMismatch: 'Las contraseñas no coinciden.',
            mnemonicGenerate: 'No pudimos generar tu frase de recuperación.',
            copy: 'No pudimos copiar automáticamente. Selecciona las palabras manualmente.',
            backup: 'Confirma que guardaste tu frase de recuperación.',
            verification:
                'Una o más palabras son incorrectas. Revisa tu frase e inténtalo de nuevo.',
            keystore: 'No pudimos guardar tu cartera en este dispositivo.',
        },
    },
};
