import type { Messages } from './en';

export const ptBR: Messages = {
    brand: {
        name: 'Carteira',
        tagline: 'Suas chaves. Seus ativos. Seu controle.',
    },
    recover: {
        header: 'Recuperar carteira · Etapa {{step}} de {{total}}',
        step1: {
            badge: 'ETAPA 01 — FRASE DE RECUPERAÇÃO',
            title: 'Digite sua frase de recuperação',
            description:
                'Digite as 12 palavras da sua frase de recuperação abaixo, separadas por espaço. Isso restaurará sua carteira neste dispositivo.',
            phraseLabel: 'Frase de recuperação (12 palavras)',
            phrasePlaceholder: 'palavra1 palavra2 palavra3 … palavra12',
            warning:
                'Nunca insira sua frase de recuperação em um site ou compartilhe com ninguém. Este app processa tudo localmente.',
        },
        step2: {
            badge: 'ETAPA 02 — NOVA SENHA',
            title: 'Defina uma nova senha',
            description:
                'Escolha uma senha para proteger o acesso à sua carteira neste dispositivo. Não precisa ser igual à senha original.',
            submit: 'Continuar',
            submitting: 'Processando…',
        },
        step3: {
            badge: 'ETAPA 03 — DESCOBERTA DE CONTAS',
            title: 'Descobrir contas',
            description:
                'Buscamos na rede {{chain}} para encontrar automaticamente todas as contas ativas derivadas da sua frase de recuperação.',
            scanning: 'Buscando contas ativas na rede {{chain}}…',
            found: '{{count}} conta(s) encontrada(s)',
            manualTitle: 'Adicionar conta manualmente',
            manualDescription:
                'Adicione uma conta específica derivada da sua frase semente.',
            manualInputPlaceholder: '0x… (endereço) ou índice da conta (ex: 1)',
            manualAddButton: 'Verificar e adicionar',
            addNextButton: '+ Adicionar Conta {{index}}',
            addressNotDerived:
                'Endereço inválido: este endereço não deriva da sua frase de recuperação.',
            addressAlreadyAdded: 'Esta conta já foi adicionada.',
            addressVerified: 'Endereço verificado: deriva da Conta {{index}}.',
            submit: 'Restaurar carteira ({{count}} contas)',
            submitting: 'Restaurando carteira…',
            balanceLabel: 'Saldo: {{balance}} {{symbol}}',
            activeBadge: 'Ativa na rede',
            emptyBadge: 'Nova',
        },
        messages: {
            phraseInvalid: 'Digite exatamente 12 palavras separadas por espaço.',
        },
    },
    removeWallet: {
        title: 'Remover carteira',
        description:
            'Isso apagará permanentemente sua carteira deste dispositivo. Seus fundos estão seguros — você pode restaurar a qualquer momento com sua frase de recuperação de 12 palavras.',
        warning:
            'Sem a frase de recuperação você perderá o acesso aos seus fundos para sempre.',
        confirm: 'Guardei minha frase de recuperação e entendo que esta ação é irreversível.',
        submit: 'Remover carteira',
    },
    common: {
        close: 'Fechar',
        copy: 'Copiar',
        copied: 'Copiado',
        cancel: 'Cancelar',
    },
    language: {
        label: 'Idioma',
    },
    explorer: 'Explorador',
    refresh: 'Atualizar',
    testnet: 'Testnet',
    accounts: {
        title: 'Contas',
        label: 'Conta {{index}}',
        active: 'Ativa',
        add: 'Adicionar conta',
    },
    receive: {
        title: 'Receber',
        description: 'Escaneie o QR code ou copie o endereço abaixo.',
        warning: 'Envie apenas ativos da rede {{chain}} para este endereço.',
        copy: 'Copiar endereço',
    },
    send: {
        title: 'Enviar',
        reviewTitle: 'Revisar envio',
        confirmTitle: 'Confirmar envio',
        address: 'Endereço de destino',
        addressPlaceholder: '0x… (endereço da carteira)',
        amount: 'Valor',
        amountPlaceholder: '0,00',
        available: 'Disponível: {{amount}} {{symbol}}',
        max: 'Máximo',
        to: 'Para',
        asset: 'Ativo',
        network: 'Rede',
        continue: 'Continuar',
        confirm: 'Confirmar',
        back: 'Voltar',
        password: 'Senha',
        passwordPlaceholder: 'Sua senha',
        submit: 'Enviar {{symbol}}',
        sending: 'Enviando…',
        successTitle: 'Transação enviada',
        successDescription: 'Sua transferência foi transmitida para a rede.',
        view: 'Ver no explorador',
        done: 'Concluir',
        errors: {
            address: 'Endereço inválido.',
            amount: 'Valor inválido.',
            insufficient: 'Saldo insuficiente.',
            password: 'Senha incorreta. Tente novamente.',
            generic: 'Não foi possível enviar a transação.',
        },
    },
    addAccount: {
        title: 'Adicionar conta',
        description:
            'Digite sua senha para derivar um novo endereço a partir da sua frase secreta.',
        tabs: {
            next: 'Próxima conta',
            manual: 'Por endereço',
            scan: 'Descobrir na rede',
        },
        addressLabel: 'Endereço ou índice da conta',
        addressPlaceholder: '0x… ou índice (ex: 1)',
        scanDescription:
            'Varre a rede {{chain}} procurando outras contas derivadas desta frase que possuam saldo ou transações.',
        scanButton: 'Escanear e importar',
        scanning: 'Escaneando a rede…',
        scanResults: '{{count}} nova(s) conta(s) encontrada(s) e importada(s).',
        scanNone: 'Nenhuma conta ativa adicional encontrada na rede.',
        addressNotDerived:
            'Endereço inválido: este endereço não deriva da sua frase de recuperação.',
        addressAlreadyAdded: 'Este endereço já está na sua carteira.',
        addressAddedSuccess: 'Conta {{index}} verificada e adicionada!',
        password: 'Senha',
        placeholder: 'Sua senha',
        submit: 'Adicionar conta',
        incorrect: 'Senha incorreta. Tente novamente.',
    },
    empty: {
        title: 'Sua carteira, suas chaves',
        description:
            'Esta carteira é autocustodiada: sua frase secreta fica cifrada apenas neste dispositivo. Crie uma carteira para acompanhar saldos, cotações e o histórico real de transações na {{chain}}.',
        create: 'Criar carteira',
        recover: 'Recuperar com frase',
    },
    portfolio: {
        total: 'Saldo total da carteira',
        past24h: 'nas últimas 24 horas',
        noData: 'Sem dados de preço de 24h',
    },
    assets: {
        title: 'Seus ativos',
        error: 'Não foi possível carregar os saldos desta carteira.',
        empty: 'Nenhum saldo encontrado para este endereço.',
        faucet: 'Use o <link>faucet da Chiado</link> para receber tokens de teste.',
    },
    activity: {
        title: 'Atividade recente',
        window: 'Últimos {{days}} dias',
        loading: 'Carregando transações…',
        error: 'Não foi possível carregar o histórico desta carteira.',
        empty: 'Nenhuma transação recente para este endereço.',
        received: 'Recebido {{symbol}}',
        sent: 'Enviado {{symbol}}',
        from: 'de',
        to: 'para',
        view: 'Ver',
    },
    address: {
        title: 'Endereço da sua carteira',
        copy: 'Copiar endereço',
        remove: 'Remover deste dispositivo',
    },
    create: {
        header: 'Nova carteira · Etapa {{step}} de {{total}}',
        back: 'Voltar',
        continue: 'Continuar',
        step1: {
            badge: 'ETAPA 01 — SEGURANÇA',
            title: 'Proteja sua carteira',
            description:
                'Crie uma senha para proteger o acesso à sua carteira neste dispositivo.',
            password: 'Nova senha',
            passwordPlaceholder: 'Mínimo de 8 caracteres',
            confirm: 'Confirmar senha',
            confirmPlaceholder: 'Digite novamente',
            notice: 'Sua senha protege o acesso local. Ela não substitui sua frase de recuperação.',
            show: 'Mostrar senha',
            hide: 'Ocultar senha',
        },
        step2: {
            badge: 'ETAPA 02 — RECUPERAÇÃO',
            title: 'Guarde sua frase secreta',
            description:
                'Estas 12 palavras são a chave de recuperação da sua carteira. Guarde-as na ordem apresentada.',
            copy: 'Copiar frase de recuperação',
            copied: 'Frase copiada!',
            warningTitle: 'Nunca compartilhe sua frase',
            warningText:
                'Qualquer pessoa com estas palavras pode controlar seus fundos.',
            confirm:
                'Entendi e guardei minha frase de recuperação em um lugar seguro.',
        },
        step3: {
            badge: 'ETAPA 03 — VERIFICAÇÃO',
            title: 'Confirme sua frase',
            description:
                'Digite as palavras solicitadas para confirmar que guardou sua frase corretamente.',
            word: 'Palavra número {{number}}',
            wordPlaceholder: 'Digite a palavra',
            incorrectWord: 'Palavra incorreta.',
            submit: 'Criar carteira',
            submitting: 'Criando carteira…',
        },
        step4: {
            title: 'Sua carteira está pronta!',
            description:
                'Sua carteira foi criada com sucesso. Agora você pode receber, enviar e gerenciar seus ativos digitais.',
            access: 'Acessar minha carteira',
        },
        error: {
            title: 'Falha ao gerar a frase',
            retry: 'Tentar novamente',
        },
        messages: {
            passwordMin: 'A senha precisa ter pelo menos {{count}} caracteres.',
            passwordMismatch: 'As senhas não correspondem.',
            mnemonicGenerate:
                'Não foi possível gerar sua frase de recuperação.',
            copy: 'Não foi possível copiar automaticamente. Selecione as palavras manualmente.',
            backup: 'Confirme que guardou sua frase de recuperação.',
            verification:
                'Uma ou mais palavras estão incorretas. Confira sua frase e tente novamente.',
            keystore: 'Não foi possível salvar sua carteira neste dispositivo.',
        },
    },
};
