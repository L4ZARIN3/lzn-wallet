import type { Messages } from './en';

export const arz: Messages = {
    brand: {
        name: 'المحفظة',
        tagline: 'مفاتيحك. فلوسك. تحكّمك.',
    },
    recover: {
        header: 'استرجاع المحفظة · خطوة {{step}} من {{total}}',
        step1: {
            badge: 'خطوة 01 — كلمات الاسترداد',
            title: 'اكتب كلمات الاسترداد بتاعتك',
            description:
                'اكتب الـ 12 كلمة بتوع الاسترداد تحت وبيناتهم مسافات. ده هيرجع محفظتك على الجهاز ده.',
            phraseLabel: 'كلمات الاسترداد (12 كلمة)',
            phrasePlaceholder: 'كلمة1 كلمة2 كلمة3 … كلمة12',
            warning:
                'إياك تكتب كلمات الاسترداد في أي موقع أو تديهم لأي حد. التطبيق ده بيتعامل معاهم أوفلاين تماماً.',
        },
        step2: {
            badge: 'خطوة 02 — باسورد جديد',
            title: 'اعمل باسورد جديد',
            description:
                'اختار باسورد علشان تحمي دخولك للمحفظة على الجهاز ده. مش لازم يكون نفس الباسورد القديم.',
            submit: 'كمّل',
            submitting: 'بيحمل…',
        },
        step3: {
            badge: 'خطوة 03 — تدوير على الحسابات',
            title: 'اكتشف الحسابات',
            description:
                'بندور في شبكة {{chain}} علشان نلاقي كل الحسابات الشغالة اللي طالعة من كلمات الاسترداد بتاعتك أوتوماتيك.',
            scanning: 'بندور على الحسابات الشغالة على {{chain}}…',
            found: 'لقينا {{count}} حساب',
            manualTitle: 'ضيف حساب بإيدك',
            manualDescription:
                'ضيف حساب معين طالع من كلمات الاسترداد بتاعتك.',
            manualInputPlaceholder: '0x… (العنوان) أو رقم الحساب (مثلاً 1)',
            manualAddButton: 'اتأكد وضيف',
            addNextButton: '+ ضيف حساب {{index}}',
            addressNotDerived:
                'العنوان مش مظبوط: العنوان ده مش طالع من كلمات الاسترداد بتاعتك.',
            addressAlreadyAdded: 'الحساب ده موجود في القايمة أصلاً.',
            addressVerified: 'العنوان اتأكد: طالع من حساب {{index}}.',
            submit: 'رجع المحفظة ({{count}} حساب)',
            submitting: 'بنرجع المحفظة…',
            balanceLabel: 'الرصيد: {{balance}} {{symbol}}',
            activeBadge: 'شغال على الشبكة',
            emptyBadge: 'جديد',
        },
        messages: {
            phraseInvalid: 'اكتب الـ 12 كلمة بالظبط وبينهم مسافات.',
        },
    },
    removeWallet: {
        title: 'امسح المحفظة',
        description:
            'ده هيمسح المحفظة خالص من على الجهاز ده. فلوسك في أمان — تقدر ترجع محفظتك في أي وقت بالـ 12 كلمة بتوع الاسترداد.',
        warning:
            'من غير كلمات الاسترداد هتخسر فلوسك ومش هتعرف ترجعها أبداً.',
        confirm:
            'أنا حفظت كلمات الاسترداد وفاهم إن الخطوة دي مفيهاش رجوع.',
        submit: 'امسح المحفظة',
    },
    common: {
        close: 'قفل',
        copy: 'نسخ',
        copied: 'اتنسخ',
        cancel: 'إلغاء',
    },
    language: {
        label: 'اللغة',
    },
    explorer: 'المستكشف',
    refresh: 'تحديث',
    testnet: 'شبكة الاختبار',
    accounts: {
        title: 'الحسابات',
        label: 'حساب {{index}}',
        active: 'شغال',
        add: 'ضيف حساب',
    },
    receive: {
        title: 'استلام',
        description: 'امسح الـ QR كود أو انسخ العنوان اللي تحت.',
        warning: 'ابعت بس عملات {{chain}} على العنوان ده.',
        copy: 'انسخ العنوان',
    },
    send: {
        title: 'تحويل',
        reviewTitle: 'راجع التحويل',
        confirmTitle: 'أكد التحويل',
        address: 'عنوان المستلم',
        addressPlaceholder: '0x… (عنوان المحفظة)',
        amount: 'المبلغ',
        amountPlaceholder: '0.00',
        available: 'المتاح: {{amount}} {{symbol}}',
        max: 'أقصى حاجة',
        to: 'لـ',
        asset: 'العملة',
        network: 'الشبكة',
        continue: 'كمّل',
        confirm: 'تأكيد',
        back: 'رجوع',
        password: 'الباسورد',
        passwordPlaceholder: 'الباسورد بتاعك',
        submit: 'ابعت {{symbol}}',
        sending: 'بيبعت…',
        successTitle: 'العملية اتبعتت',
        successDescription: 'التحويل بتاعك اتبعت للشبكة خلاص.',
        view: 'شوف على المستكشف',
        done: 'خلصت',
        errors: {
            address: 'العنوان مش صح.',
            amount: 'المبلغ مش صح.',
            insufficient: 'الرصيد مش مكفي.',
            password: 'الباسورد غلط. جرب تاني.',
            generic: 'معرفناش نبعت التحويل.',
        },
    },
    addAccount: {
        title: 'ضيف حساب',
        description:
            'اكتب الباسورد بتاعك علشان تطلع عنوان جديد من كلمات الاسترداد.',
        tabs: {
            next: 'الحساب اللي بعده',
            manual: 'يدوي (بالعنوان)',
            scan: 'تدوير على الشبكة',
        },
        addressLabel: 'العنوان أو رقم الحساب',
        addressPlaceholder: '0x… أو الرقم (مثلاً 1)',
        scanDescription:
            'دور في {{chain}} على أي حسابات تانية طالعة من الكلمات دي وفيها رصيد أو حركات.',
        scanButton: 'دور واستورد',
        scanning: 'بندور على الشبكة…',
        scanResults: 'لقينا واستوردنا {{count}} حساب جديد.',
        scanNone: 'ملقيناش حسابات تانية شغالة على الشبكة.',
        addressNotDerived:
            'العنوان مش مظبوط: العنوان ده مش طالع من كلمات الاسترداد بتاعتك.',
        addressAlreadyAdded: 'العنوان ده موجود أصلاً في محفظتك.',
        addressAddedSuccess: 'حساب {{index}} اتأكد واتضاف خلاص!',
        password: 'الباسورد',
        placeholder: 'الباسورد بتاعك',
        submit: 'ضيف الحساب',
        incorrect: 'الباسورد غلط. جرب تاني.',
    },
    empty: {
        title: 'محفظتك، مفاتيحك',
        description:
            'المحفظة دي بتاعتك إنت وبس: كلمات الاسترداد متسجلة ومتشفرة على جهازك ده. اعمل محفظة علشان تتابع الرصيد والأسعار والعمليات على {{chain}}.',
        create: 'اعمل محفظة',
        recover: 'استرجع بالكلمات',
    },
    portfolio: {
        total: 'إجمالي رصيد المحفظة',
        past24h: 'آخر 24 ساعة',
        noData: 'مفيش بيانات أسعار لآخر 24 ساعة',
    },
    assets: {
        title: 'أصولك',
        error: 'معرفناش نجيب رصيد المحفظة دي.',
        empty: 'مفيش أي رصيد للعنوان ده.',
        faucet: 'استخدم <link>صنبور Chiado</link> علشان تاخد توكنز تجريبية.',
    },
    activity: {
        title: 'آخر العمليات',
        window: 'آخر {{days}} يوم',
        loading: 'بنحمل العمليات…',
        error: 'معرفناش نجيب سجل المحفظة دي.',
        empty: 'مفيش أي عمليات قريبة للعنوان ده.',
        received: 'استلمت {{symbol}}',
        sent: 'بعت {{symbol}}',
        from: 'من',
        to: 'لـ',
        view: 'عرض',
    },
    address: {
        title: 'عنوان محفظتك',
        copy: 'انسخ العنوان',
        remove: 'امسح من الجهاز ده',
    },
    create: {
        header: 'محفظة جديدة · خطوة {{step}} من {{total}}',
        back: 'رجوع',
        continue: 'كمّل',
        step1: {
            badge: 'خطوة 01 — الأمان',
            title: 'احمي محفظتك',
            description:
                'اعمل باسورد علشان تحمي دخولك للمحفظة على الجهاز ده.',
            password: 'باسورد جديد',
            passwordPlaceholder: '8 حروف على الأقل',
            confirm: 'أكد الباسورد',
            confirmPlaceholder: 'اكتبه تاني',
            notice: 'الباسورد ده بيحمي فتح التطبيق بس، وميغنيش عن كلمات الاسترداد.',
            show: 'إظهار الباسورد',
            hide: 'إخفاء الباسورد',
        },
        step2: {
            badge: 'خطوة 02 — الحفظ',
            title: 'احفظ كلماتك السرية',
            description:
                'الـ 12 كلمة دول هما مفتاح استرجاع محفظتك. احفظهم بنفس الترتيب المعروض.',
            copy: 'انسخ كلمات الاسترداد',
            copied: 'الكلمات اتنسخت!',
            warningTitle: 'إياك توري الكلمات دي لأي حد',
            warningText:
                'أي حد معاه الكلمات دي يقدر يتحكم في فلوسك.',
            confirm:
                'أنا فاهم وحفظت كلمات الاسترداد في مكان أمين.',
        },
        step3: {
            badge: 'خطوة 03 — التأكيد',
            title: 'أكد كلماتك',
            description:
                'اكتب الكلمات المطلوبة علشان نتأكد إنك حفظت كلماتك صح.',
            word: 'الكلمة رقم {{number}}',
            wordPlaceholder: 'اكتب الكلمة',
            incorrectWord: 'الكلمة مش صح.',
            submit: 'اعمل المحفظة',
            submitting: 'بيعمل المحفظة…',
        },
        step4: {
            title: 'محفظتك جاهزة!',
            description:
                'المحفظة اتعملت بنجاح. دلوقتي تقدر تستلم وتبعت وتدير أصولك الرقمية.',
            access: 'افتح محفظتي',
        },
        error: {
            title: 'معرفناش نعمل الكلمات',
            retry: 'جرب تاني',
        },
        messages: {
            passwordMin:
                'الباسورد لازم يكون {{count}} حروف على الأقل.',
            passwordMismatch: 'الباسورد مش متطابق.',
            mnemonicGenerate: 'معرفناش نعمل كلمات الاسترداد.',
            copy: 'معرفناش ننسخ أوتوماتيك. حدد الكلمات بإيدك وانسخها.',
            backup: 'أكد إنك حفظت كلمات الاسترداد بتاعتك.',
            verification:
                'فيه كلمة أو أكتر مش صح. راجع كلماتك وجرب تاني.',
            keystore: 'معرفناش نحفظ المحفظة على الجهاز ده.',
        },
    },
};
