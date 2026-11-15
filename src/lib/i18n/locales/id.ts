import type { Messages } from './en';

export const id: Messages = {
    brand: {
        name: 'Dompet',
        tagline: 'Kunci Anda. Aset Anda. Kendali Anda.',
    },
    recover: {
        header: 'Pulihkan dompet · Langkah {{step}} dari {{total}}',
        step1: {
            badge: 'LANGKAH 01 — FRASE PEMULIHAN',
            title: 'Masukkan frase pemulihan Anda',
            description:
                'Ketik 12 kata frase pemulihan Anda di bawah ini, dipisahkan dengan spasi. Ini akan memulihkan dompet Anda di perangkat ini.',
            phraseLabel: 'Frase pemulihan (12 kata)',
            phrasePlaceholder: 'kata1 kata2 kata3 … kata12',
            warning:
                'Jangan pernah memasukkan frase pemulihan di situs web atau membagikannya dengan siapa pun. Aplikasi ini memprosesnya sepenuhnya secara offline.',
        },
        step2: {
            badge: 'LANGKAH 02 — KATA SANDI BARU',
            title: 'Atur kata sandi baru',
            description:
                'Pilih kata sandi untuk melindungi akses ke dompet Anda di perangkat ini. Tidak perlu sama dengan kata sandi asli Anda.',
            submit: 'Lanjutkan',
            submitting: 'Memproses…',
        },
        step3: {
            badge: 'LANGKAH 03 — PENEMUAN AKUN',
            title: 'Temukan akun',
            description:
                'Kami memindai jaringan {{chain}} untuk secara otomatis menemukan semua akun aktif yang diturunkan dari frase pemulihan Anda.',
            scanning: 'Mencari akun aktif di {{chain}}…',
            found: '{{count}} akun ditemukan',
            manualTitle: 'Tambah akun secara manual',
            manualDescription:
                'Tambahkan akun tertentu yang diturunkan dari seed phrase Anda.',
            manualInputPlaceholder: '0x… (alamat) atau indeks akun (cth. 1)',
            manualAddButton: 'Verifikasi & tambah',
            addNextButton: '+ Tambah Akun {{index}}',
            addressNotDerived:
                'Alamat tidak valid: alamat ini tidak diturunkan dari frase pemulihan Anda.',
            addressAlreadyAdded: 'Akun ini sudah ada di daftar.',
            addressVerified:
                'Alamat terverifikasi: diturunkan di Akun {{index}}.',
            submit: 'Pulihkan dompet ({{count}} akun)',
            submitting: 'Memulihkan dompet…',
            balanceLabel: 'Saldo: {{balance}} {{symbol}}',
            activeBadge: 'Aktif di rantai',
            emptyBadge: 'Baru',
        },
        messages: {
            phraseInvalid:
                'Masukkan tepat 12 kata yang dipisahkan dengan spasi.',
        },
    },
    removeWallet: {
        title: 'Hapus dompet',
        description:
            'Tindakan ini akan menghapus dompet Anda secara permanen dari perangkat ini. Dana Anda aman — Anda dapat memulihkan dompet kapan saja menggunakan 12 kata frase pemulihan.',
        warning:
            'Tanpa frase pemulihan, Anda akan kehilangan akses ke dana Anda selamanya.',
        confirm:
            'Saya telah menyimpan frase pemulihan dan memahami bahwa tindakan ini tidak dapat dibatalkan.',
        submit: 'Hapus dompet',
    },
    common: {
        close: 'Tutup',
        copy: 'Salin',
        copied: 'Disalin',
        cancel: 'Batal',
    },
    language: {
        label: 'Bahasa',
    },
    explorer: 'Penjelajah',
    refresh: 'Segarkan',
    testnet: 'Testnet',
    accounts: {
        title: 'Akun',
        label: 'Akun {{index}}',
        active: 'Aktif',
        add: 'Tambah akun',
    },
    receive: {
        title: 'Terima',
        description: 'Pindai kode QR atau salin alamat di bawah ini.',
        warning: 'Kirim hanya aset {{chain}} ke alamat ini.',
        copy: 'Salin alamat',
    },
    send: {
        title: 'Kirim',
        reviewTitle: 'Tinjau transfer',
        confirmTitle: 'Konfirmasi transfer',
        address: 'Alamat penerima',
        addressPlaceholder: '0x… (alamat dompet)',
        amount: 'Jumlah',
        amountPlaceholder: '0.00',
        available: 'Tersedia: {{amount}} {{symbol}}',
        max: 'Maks',
        to: 'Kepada',
        asset: 'Aset',
        network: 'Jaringan',
        continue: 'Lanjutkan',
        confirm: 'Konfirmasi',
        back: 'Kembali',
        password: 'Kata sandi',
        passwordPlaceholder: 'Kata sandi Anda',
        submit: 'Kirim {{symbol}}',
        sending: 'Mengirim…',
        successTitle: 'Transaksi terkirim',
        successDescription: 'Transfer Anda telah disiarkan ke jaringan.',
        view: 'Lihat di penjelajah',
        done: 'Selesai',
        errors: {
            address: 'Alamat tidak valid.',
            amount: 'Jumlah tidak valid.',
            insufficient: 'Saldo tidak mencukupi.',
            password: 'Kata sandi salah. Coba lagi.',
            generic: 'Kami tidak dapat mengirim transaksi.',
        },
    },
    addAccount: {
        title: 'Tambah akun',
        description:
            'Masukkan kata sandi untuk menurunkan alamat baru dari frase pemulihan Anda.',
        tabs: {
            next: 'Akun berikutnya',
            manual: 'Manual (berdasarkan alamat)',
            scan: 'Temukan di rantai',
        },
        addressLabel: 'Alamat atau indeks akun',
        addressPlaceholder: '0x… atau indeks (cth. 1)',
        scanDescription:
            'Pindai {{chain}} untuk mendeteksi akun lain dari frase ini yang memiliki saldo atau transaksi.',
        scanButton: 'Pindai dan impor',
        scanning: 'Memindai jaringan…',
        scanResults: 'Ditemukan dan diimpor {{count}} akun baru.',
        scanNone: 'Tidak ada akun aktif tambahan yang ditemukan di jaringan.',
        addressNotDerived:
            'Alamat tidak valid: alamat ini tidak diturunkan dari frase pemulihan Anda.',
        addressAlreadyAdded: 'Alamat ini sudah ada di dompet Anda.',
        addressAddedSuccess: 'Akun {{index}} terverifikasi dan ditambahkan!',
        password: 'Kata sandi',
        placeholder: 'Kata sandi Anda',
        submit: 'Tambah akun',
        incorrect: 'Kata sandi salah. Coba lagi.',
    },
    empty: {
        title: 'Dompet Anda, kunci Anda',
        description:
            'Dompet ini bersifat mandiri (self-custodial): frase pemulihan tetap terenkripsi di perangkat ini. Buat dompet untuk melacak saldo, harga, dan riwayat transaksi nyata di {{chain}}.',
        create: 'Buat dompet',
        recover: 'Pulihkan dengan frase',
    },
    portfolio: {
        total: 'Total saldo portofolio',
        past24h: '24 jam terakhir',
        noData: 'Data harga 24 jam tidak tersedia',
    },
    assets: {
        title: 'Aset Anda',
        error: 'Kami tidak dapat memuat saldo dompet ini.',
        empty: 'Tidak ada saldo ditemukan untuk alamat ini.',
        faucet: 'Gunakan <link>faucet Chiado</link> untuk menerima token uji coba.',
    },
    activity: {
        title: 'Aktivitas terkini',
        window: '{{days}} hari terakhir',
        loading: 'Memuat transaksi…',
        error: 'Kami tidak dapat memuat riwayat dompet ini.',
        empty: 'Tidak ada transaksi terkini untuk alamat ini.',
        received: 'Diterima {{symbol}}',
        sent: 'Terkirim {{symbol}}',
        from: 'dari',
        to: 'ke',
        view: 'Lihat',
    },
    address: {
        title: 'Alamat dompet Anda',
        copy: 'Salin alamat',
        remove: 'Hapus dari perangkat ini',
    },
    create: {
        header: 'Dompet baru · Langkah {{step}} dari {{total}}',
        back: 'Kembali',
        continue: 'Lanjutkan',
        step1: {
            badge: 'LANGKAH 01 — KEAMANAN',
            title: 'Lindungi dompet Anda',
            description:
                'Buat kata sandi untuk melindungi akses ke dompet Anda di perangkat ini.',
            password: 'Kata sandi baru',
            passwordPlaceholder: 'Minimal 8 karakter',
            confirm: 'Konfirmasi kata sandi',
            confirmPlaceholder: 'Ketik ulang kata sandi',
            notice: 'Kata sandi Anda melindungi akses lokal. Ini tidak menggantikan frase pemulihan.',
            show: 'Tampilkan kata sandi',
            hide: 'Sembunyikan kata sandi',
        },
        step2: {
            badge: 'LANGKAH 02 — PEMULIHAN',
            title: 'Simpan frase rahasia Anda',
            description:
                '12 kata ini adalah kunci pemulihan dompet Anda. Simpan sesuai urutan yang ditampilkan.',
            copy: 'Salin frase pemulihan',
            copied: 'Frase disalin!',
            warningTitle: 'Jangan pernah membagikan frase Anda',
            warningText:
                'Siapa pun yang memiliki kata-kata ini dapat mengontrol dana Anda.',
            confirm:
                'Saya memahami dan telah menyimpan frase pemulihan di tempat yang aman.',
        },
        step3: {
            badge: 'LANGKAH 03 — VERIFIKASI',
            title: 'Konfirmasi frase Anda',
            description:
                'Masukkan kata yang diminta untuk memastikan Anda telah menyimpan frase dengan benar.',
            word: 'Kata nomor {{number}}',
            wordPlaceholder: 'Ketik kata',
            incorrectWord: 'Kata salah.',
            submit: 'Buat dompet',
            submitting: 'Membuat dompet…',
        },
        step4: {
            title: 'Dompet Anda sudah siap!',
            description:
                'Dompet Anda berhasil dibuat. Anda sekarang dapat menerima, mengirim, dan mengelola aset digital.',
            access: 'Buka dompet saya',
        },
        error: {
            title: 'Tidak dapat menghasilkan frase',
            retry: 'Coba lagi',
        },
        messages: {
            passwordMin: 'Kata sandi minimal harus {{count}} karakter.',
            passwordMismatch: 'Kata sandi tidak cocok.',
            mnemonicGenerate:
                'Kami tidak dapat membuat frase pemulihan Anda.',
            copy: 'Tidak dapat menyalin secara otomatis. Pilih kata secara manual.',
            backup: 'Konfirmasikan bahwa Anda telah menyimpan frase pemulihan.',
            verification:
                'Satu kata atau lebih salah. Periksa frase Anda dan coba lagi.',
            keystore:
                'Kami tidak dapat menyimpan dompet Anda di perangkat ini.',
        },
    },
};
