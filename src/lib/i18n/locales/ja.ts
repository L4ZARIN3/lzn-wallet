import type { Messages } from './en';

export const ja: Messages = {
    brand: {
        name: 'ウォレット',
        tagline: 'あなたの秘密鍵。あなたの資産。あなたの管理。',
    },
    recover: {
        header: 'ウォレットの復元 · ステップ {{step}} / {{total}}',
        step1: {
            badge: 'ステップ 01 — リカバリーフレーズ',
            title: 'リカバリーフレーズを入力',
            description:
                '12語のリカバリーフレーズをスペースで区切って下に入力してください。このデバイス上でウォレットが復元されます。',
            phraseLabel: 'リカバリーフレーズ（12語）',
            phrasePlaceholder: '単語1 単語2 単語3 … 単語12',
            warning:
                'リカバリーフレーズをウェブサイトに入力したり、誰かと共有したり絶対にしないでください。このアプリは完全にオフラインで処理します。',
        },
        step2: {
            badge: 'ステップ 02 — 新しいパスワード',
            title: '新しいパスワードを設定',
            description:
                'このデバイスでウォレットへのアクセスを保護するためのパスワードを設定します。元のパスワードと一致する必要はありません。',
            submit: '次へ',
            submitting: '処理中…',
        },
        step3: {
            badge: 'ステップ 03 — アカウントの検出',
            title: 'アカウントを検出',
            description:
                '{{chain}} ネットワークをスキャンして、リカバリーフレーズから派生したすべてのアクティブなアカウントを自動検出します。',
            scanning: '{{chain}} 上のアクティブなアカウントを検索中…',
            found: '{{count}} 件のアカウントが見つかりました',
            manualTitle: '手動でアカウントを追加',
            manualDescription:
                'シードフレーズから派生した特定のアカウントを追加します。',
            manualInputPlaceholder: '0x… (アドレス) または アカウントインデックス (例: 1)',
            manualAddButton: '確認して追加',
            addNextButton: '+ アカウント {{index}} を追加',
            addressNotDerived:
                '無効なアドレス: このアドレスはリカバリーフレーズから派生したものではありません。',
            addressAlreadyAdded: 'このアカウントは既にリストに存在します。',
            addressVerified: 'アドレス確認済み: アカウント {{index}} に派生。',
            submit: 'ウォレットを復元（{{count}} 件のアカウント）',
            submitting: 'ウォレットを復元中…',
            balanceLabel: '残高: {{balance}} {{symbol}}',
            activeBadge: 'チェーン上でアクティブ',
            emptyBadge: '新規',
        },
        messages: {
            phraseInvalid: 'スペースで区切られた正確な12語を入力してください。',
        },
    },
    removeWallet: {
        title: 'ウォレットを削除',
        description:
            'このデバイスからウォレットが完全に削除されます。資金は安全です — 12語のリカバリーフレーズを使用していつでもウォレットを復元できます。',
        warning:
            'リカバリーフレーズがないと、資金へのアクセスを永久に失うことになります。',
        confirm:
            'リカバリーフレーズを保存済みであり、この操作が取り消せないことを理解しています。',
        submit: 'ウォレットを削除',
    },
    common: {
        close: '閉じる',
        copy: 'コピー',
        copied: 'コピー完了',
        cancel: 'キャンセル',
    },
    language: {
        label: '言語',
    },
    explorer: 'エクスプローラー',
    refresh: '更新',
    testnet: 'テストネット',
    accounts: {
        title: 'アカウント',
        label: 'アカウント {{index}}',
        active: 'アクティブ',
        add: 'アカウントを追加',
    },
    receive: {
        title: '受取',
        description: 'QRコードをスキャンするか、以下のアドレスをコピーしてください。',
        warning: 'このアドレスには {{chain}} の資産のみを送金してください。',
        copy: 'アドレスをコピー',
    },
    send: {
        title: '送金',
        reviewTitle: '送金内容の確認',
        confirmTitle: '送金の確定',
        address: '受取先アドレス',
        addressPlaceholder: '0x… (ウォレットアドレス)',
        amount: '金額',
        amountPlaceholder: '0.00',
        available: '利用可能: {{amount}} {{symbol}}',
        max: '最大',
        to: '宛先',
        asset: '資産',
        network: 'ネットワーク',
        continue: '次へ',
        confirm: '確認',
        back: '戻る',
        password: 'パスワード',
        passwordPlaceholder: 'パスワード',
        submit: '{{symbol}} を送金',
        sending: '送金中…',
        successTitle: 'トランザクション送信完了',
        successDescription: '送金がネットワークにブロードキャストされました。',
        view: 'エクスプローラーで表示',
        done: '完了',
        errors: {
            address: '無効なアドレスです。',
            amount: '無効な金額です。',
            insufficient: '残高が不足しています。',
            password: 'パスワードが正しくありません。再試行してください。',
            generic: 'トランザクションを送信できませんでした。',
        },
    },
    addAccount: {
        title: 'アカウントを追加',
        description:
            'パスワードを入力して、リカバリーフレーズから新しいアドレスを派生させます。',
        tabs: {
            next: '次のアカウント',
            manual: '手動（アドレス指定）',
            scan: 'チェーン上で検出',
        },
        addressLabel: 'アドレスまたはアカウントインデックス',
        addressPlaceholder: '0x… またはインデックス (例: 1)',
        scanDescription:
            '{{chain}} をスキャンして、このフレーズから派生した残高やトランザクションのある他のアカウントを検出します。',
        scanButton: 'スキャンしてインポート',
        scanning: 'ネットワークをスキャン中…',
        scanResults: '{{count}} 件の新しいアカウントを検出してインポートしました。',
        scanNone: 'ネットワーク上に追加のアクティブアカウントは見つかりませんでした。',
        addressNotDerived:
            '無効なアドレス: このアドレスはリカバリーフレーズから派生したものではありません。',
        addressAlreadyAdded: 'このアドレスは既にウォレットに存在します。',
        addressAddedSuccess: 'アカウント {{index}} を確認し、追加しました！',
        password: 'パスワード',
        placeholder: 'パスワード',
        submit: 'アカウントを追加',
        incorrect: 'パスワードが正しくありません。再試行してください。',
    },
    empty: {
        title: 'あなたのウォレット、あなたの秘密鍵',
        description:
            'このウォレットは自己管理型です。リカバリーフレーズはこのデバイス上に暗号化されて保存されます。ウォレットを作成して、{{chain}} 上の残高、価格、実際の取引履歴を確認しましょう。',
        create: 'ウォレットを作成',
        recover: 'フレーズから復元',
    },
    portfolio: {
        total: '総ポートフォリオ残高',
        past24h: '過去24時間',
        noData: '24時間の価格データがありません',
    },
    assets: {
        title: '保有資産',
        error: 'このウォレットの残高を読み込めませんでした。',
        empty: 'このアドレスの残高が見つかりませんでした。',
        faucet: 'テストトークンを取得するには <link>Chiado フォーセット</link> を使用してください。',
    },
    activity: {
        title: '最近のアクティビティ',
        window: '過去 {{days}} 日間',
        loading: 'トランザクションを読み込み中…',
        error: 'このウォレットの履歴を読み込めませんでした。',
        empty: 'このアドレスの最近のトランザクションはありません。',
        received: '{{symbol}} を受取',
        sent: '{{symbol}} を送金',
        from: '送信元',
        to: '送信先',
        view: '表示',
    },
    address: {
        title: 'ウォレットアドレス',
        copy: 'アドレスをコピー',
        remove: 'このデバイスから削除',
    },
    create: {
        header: '新規ウォレット · ステップ {{step}} / {{total}}',
        back: '戻る',
        continue: '次へ',
        step1: {
            badge: 'ステップ 01 — セキュリティ',
            title: 'ウォレットを保護',
            description:
                'このデバイスでのウォレットへのアクセスを保護するパスワードを作成します。',
            password: '新しいパスワード',
            passwordPlaceholder: '8文字以上',
            confirm: 'パスワードの確認',
            confirmPlaceholder: 'もう一度入力',
            notice: 'パスワードはローカルアクセスを保護します。リカバリーフレーズの代わりにはなりません。',
            show: 'パスワードを表示',
            hide: 'パスワードを非表示',
        },
        step2: {
            badge: 'ステップ 02 — バックアップ',
            title: '秘密のフレーズを保存',
            description:
                'この12語はウォレットの復元キーです。表示されている順序のまま大切に保管してください。',
            copy: 'リカバリーフレーズをコピー',
            copied: 'フレーズをコピーしました！',
            warningTitle: 'フレーズを他人に教えないでください',
            warningText:
                'これらの単語を知っている人は誰でもあなたの資金を操作できます。',
            confirm:
                '理解しました。リカバリーフレーズを安全な場所に保存しました。',
        },
        step3: {
            badge: 'ステップ 03 — 確認',
            title: 'フレーズの確認',
            description:
                'フレーズが正しく保存されていることを確認するため、指定された単語を入力してください。',
            word: '{{number}} 番目の単語',
            wordPlaceholder: '単語を入力',
            incorrectWord: '単語が正しくありません。',
            submit: 'ウォレットを作成',
            submitting: 'ウォレットを作成中…',
        },
        step4: {
            title: 'ウォレットの準備が完了しました！',
            description:
                'ウォレットが正常に作成されました。デジタル資産の受取、送金、管理ができるようになりました。',
            access: 'ウォレットを開く',
        },
        error: {
            title: 'フレーズを生成できませんでした',
            retry: '再試行',
        },
        messages: {
            passwordMin: 'パスワードは {{count}} 文字以上である必要があります。',
            passwordMismatch: 'パスワードが一致しません。',
            mnemonicGenerate:
                'リカバリーフレーズを生成できませんでした。',
            copy: '自動コピーに失敗しました。手動で単語を選択してコピーしてください。',
            backup: 'リカバリーフレーズを保存したことを確認してください。',
            verification:
                '1つ以上の単語が間違っています。フレーズを確認して再試行してください。',
            keystore:
                'このデバイスにウォレットを保存できませんでした。',
        },
    },
};
