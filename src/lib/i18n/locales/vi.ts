import type { Messages } from './en';

export const vi: Messages = {
    brand: {
        name: 'Ví',
        tagline: 'Khóa của bạn. Tài sản của bạn. Quyền kiểm soát của bạn.',
    },
    recover: {
        header: 'Khôi phục ví · Bước {{step}} trên {{total}}',
        step1: {
            badge: 'BƯỚC 01 — CỤM TỪ KHÔI PHỤC',
            title: 'Nhập cụm từ khôi phục của bạn',
            description:
                'Nhập cụm từ khôi phục gồm 12 từ của bạn vào bên dưới, cách nhau bằng dấu cách. Thao tác này sẽ khôi phục ví của bạn trên thiết bị này.',
            phraseLabel: 'Cụm từ khôi phục (12 từ)',
            phrasePlaceholder: 'từ1 từ2 từ3 … từ12',
            warning:
                'Không bao giờ nhập cụm từ khôi phục trên bất kỳ trang web nào hoặc chia sẻ với bất kỳ ai. Ứng dụng này xử lý hoàn toàn ngoại tuyến.',
        },
        step2: {
            badge: 'BƯỚC 02 — MẬT KHẨU MỚI',
            title: 'Thiết lập mật khẩu mới',
            description:
                'Chọn mật khẩu để bảo vệ quyền truy cập vào ví trên thiết bị này. Mật khẩu không cần phải khớp với mật khẩu ban đầu của bạn.',
            submit: 'Tiếp tục',
            submitting: 'Đang xử lý…',
        },
        step3: {
            badge: 'BƯỚC 03 — KHÁM PHÁ TÀI KHOẢN',
            title: 'Khám phá tài khoản',
            description:
                'Chúng tôi quét mạng {{chain}} để tự động tìm tất cả các tài khoản đang hoạt động được dẫn xuất từ cụm từ khôi phục của bạn.',
            scanning: 'Đang tìm kiếm tài khoản hoạt động trên {{chain}}…',
            found: 'Đã tìm thấy {{count}} tài khoản',
            manualTitle: 'Thêm tài khoản thủ công',
            manualDescription:
                'Thêm một tài khoản cụ thể được dẫn xuất từ cụm từ hạt giống của bạn.',
            manualInputPlaceholder: '0x… (địa chỉ) hoặc chỉ số tài khoản (ví dụ: 1)',
            manualAddButton: 'Xác minh & thêm',
            addNextButton: '+ Thêm Tài khoản {{index}}',
            addressNotDerived:
                'Địa chỉ không hợp lệ: địa chỉ này không được dẫn xuất từ cụm từ khôi phục của bạn.',
            addressAlreadyAdded: 'Tài khoản này đã có trong danh sách.',
            addressVerified:
                'Địa chỉ đã xác minh: dẫn xuất tại Tài khoản {{index}}.',
            submit: 'Khôi phục ví ({{count}} tài khoản)',
            submitting: 'Đang khôi phục ví…',
            balanceLabel: 'Số dư: {{balance}} {{symbol}}',
            activeBadge: 'Hoạt động trên chuỗi',
            emptyBadge: 'Mới',
        },
        messages: {
            phraseInvalid: 'Nhập chính xác 12 từ được phân tách bằng dấu cách.',
        },
    },
    removeWallet: {
        title: 'Xóa ví',
        description:
            'Thao tác này sẽ xóa vĩnh viễn ví của bạn khỏi thiết bị này. Tiền của bạn vẫn an toàn — bạn có thể khôi phục ví bất kỳ lúc nào bằng cụm từ khôi phục 12 từ.',
        warning:
            'Nếu không có cụm từ khôi phục, bạn sẽ mất quyền truy cập vào tiền của mình mãi mãi.',
        confirm:
            'Tôi đã lưu cụm từ khôi phục và hiểu rằng hành động này không thể hoàn tác.',
        submit: 'Xóa ví',
    },
    common: {
        close: 'Đóng',
        copy: 'Sao chép',
        copied: 'Đã sao chép',
        cancel: 'Hủy',
    },
    language: {
        label: 'Ngôn ngữ',
    },
    explorer: 'Trình khám phá',
    refresh: 'Làm mới',
    testnet: 'Mạng thử nghiệm',
    accounts: {
        title: 'Tài khoản',
        label: 'Tài khoản {{index}}',
        active: 'Hoạt động',
        add: 'Thêm tài khoản',
    },
    receive: {
        title: 'Nhận',
        description: 'Quét mã QR hoặc sao chép địa chỉ bên dưới.',
        warning: 'Chỉ gửi tài sản mạng {{chain}} đến địa chỉ này.',
        copy: 'Sao chép địa chỉ',
    },
    send: {
        title: 'Gửi',
        reviewTitle: 'Xem lại giao dịch',
        confirmTitle: 'Xác nhận giao dịch',
        address: 'Địa chỉ người nhận',
        addressPlaceholder: '0x… (địa chỉ ví)',
        amount: 'Số tiền',
        amountPlaceholder: '0.00',
        available: 'Khả dụng: {{amount}} {{symbol}}',
        max: 'Tối đa',
        to: 'Đến',
        asset: 'Tài sản',
        network: 'Mạng',
        continue: 'Tiếp tục',
        confirm: 'Xác nhận',
        back: 'Quay lại',
        password: 'Mật khẩu',
        passwordPlaceholder: 'Mật khẩu của bạn',
        submit: 'Gửi {{symbol}}',
        sending: 'Đang gửi…',
        successTitle: 'Giao dịch đã được gửi',
        successDescription: 'Giao dịch chuyển khoản của bạn đã được phát sóng lên mạng.',
        view: 'Xem trong trình khám phá',
        done: 'Xong',
        errors: {
            address: 'Địa chỉ không hợp lệ.',
            amount: 'Số tiền không hợp lệ.',
            insufficient: 'Số dư không đủ.',
            password: 'Mật khẩu không chính xác. Vui lòng thử lại.',
            generic: 'Không thể gửi giao dịch.',
        },
    },
    addAccount: {
        title: 'Thêm tài khoản',
        description:
            'Nhập mật khẩu của bạn để dẫn xuất địa chỉ mới từ cụm từ khôi phục.',
        tabs: {
            next: 'Tài khoản tiếp theo',
            manual: 'Thủ công (theo địa chỉ)',
            scan: 'Khám phá trên chuỗi',
        },
        addressLabel: 'Địa chỉ hoặc chỉ số tài khoản',
        addressPlaceholder: '0x… hoặc chỉ số (ví dụ: 1)',
        scanDescription:
            'Quét {{chain}} để phát hiện các tài khoản khác được dẫn xuất từ cụm từ này có số dư hoặc giao dịch.',
        scanButton: 'Quét và nhập',
        scanning: 'Đang quét mạng…',
        scanResults: 'Đã tìm thấy và nhập {{count}} tài khoản mới.',
        scanNone: 'Không tìm thấy thêm tài khoản hoạt động nào trên mạng.',
        addressNotDerived:
            'Địa chỉ không hợp lệ: địa chỉ này không được dẫn xuất từ cụm từ khôi phục của bạn.',
        addressAlreadyAdded: 'Địa chỉ này đã có trong ví của bạn.',
        addressAddedSuccess: 'Tài khoản {{index}} đã được xác minh và thêm thành công!',
        password: 'Mật khẩu',
        placeholder: 'Mật khẩu của bạn',
        submit: 'Thêm tài khoản',
        incorrect: 'Mật khẩu không chính xác. Vui lòng thử lại.',
    },
    empty: {
        title: 'Ví của bạn, khóa của bạn',
        description:
            'Ví này hoàn toàn tự quản lý: cụm từ khôi phục của bạn được lưu mã hóa trên thiết bị này. Hãy tạo ví để theo dõi số dư, giá và lịch sử giao dịch thực tế trên {{chain}}.',
        create: 'Tạo ví',
        recover: 'Khôi phục bằng cụm từ',
    },
    portfolio: {
        total: 'Tổng số dư danh mục',
        past24h: '24 giờ qua',
        noData: 'Không có dữ liệu giá 24 giờ',
    },
    assets: {
        title: 'Tài sản của bạn',
        error: 'Không thể tải số dư ví này.',
        empty: 'Không tìm thấy số dư cho địa chỉ này.',
        faucet: 'Sử dụng <link>vòi Chiado</link> để nhận mã thông báo thử nghiệm.',
    },
    activity: {
        title: 'Hoạt động gần đây',
        window: '{{days}} ngày qua',
        loading: 'Đang tải giao dịch…',
        error: 'Không thể tải lịch sử ví này.',
        empty: 'Không có giao dịch gần đây cho địa chỉ này.',
        received: 'Đã nhận {{symbol}}',
        sent: 'Đã gửi {{symbol}}',
        from: 'từ',
        to: 'đến',
        view: 'Xem',
    },
    address: {
        title: 'Địa chỉ ví của bạn',
        copy: 'Sao chép địa chỉ',
        remove: 'Xóa khỏi thiết bị này',
    },
    create: {
        header: 'Ví mới · Bước {{step}} trên {{total}}',
        back: 'Quay lại',
        continue: 'Tiếp tục',
        step1: {
            badge: 'BƯỚC 01 — BẢO MẬT',
            title: 'Bảo vệ ví của bạn',
            description:
                'Tạo mật khẩu để bảo vệ quyền truy cập vào ví của bạn trên thiết bị này.',
            password: 'Mật khẩu mới',
            passwordPlaceholder: 'Ít nhất 8 ký tự',
            confirm: 'Xác nhận mật khẩu',
            confirmPlaceholder: 'Nhập lại mật khẩu',
            notice: 'Mật khẩu bảo vệ quyền truy cập cục bộ. Nó không thay thế cụm từ khôi phục của bạn.',
            show: 'Hiện mật khẩu',
            hide: 'Ẩn mật khẩu',
        },
        step2: {
            badge: 'BƯỚC 02 — SAO LƯU',
            title: 'Lưu cụm từ bí mật của bạn',
            description:
                '12 từ này là khóa khôi phục ví của bạn. Hãy giữ chúng theo đúng thứ tự hiển thị.',
            copy: 'Sao chép cụm từ khôi phục',
            copied: 'Đã sao chép cụm từ!',
            warningTitle: 'Không bao giờ chia sẻ cụm từ của bạn',
            warningText:
                'Bất kỳ ai có được những từ này đều có thể kiểm soát tiền của bạn.',
            confirm:
                'Tôi hiểu và đã lưu cụm từ khôi phục của mình ở nơi an toàn.',
        },
        step3: {
            badge: 'BƯỚC 03 — XÁC MINH',
            title: 'Xác nhận cụm từ của bạn',
            description:
                'Nhập các từ được yêu cầu để xác nhận bạn đã lưu cụm từ của mình chính xác.',
            word: 'Từ số {{number}}',
            wordPlaceholder: 'Nhập từ',
            incorrectWord: 'Từ không đúng.',
            submit: 'Tạo ví',
            submitting: 'Đang tạo ví…',
        },
        step4: {
            title: 'Ví của bạn đã sẵn sàng!',
            description:
                'Ví của bạn đã được tạo thành công. Bây giờ bạn có thể nhận, gửi và quản lý tài sản kỹ thuật số.',
            access: 'Mở ví của tôi',
        },
        error: {
            title: 'Không thể tạo cụm từ',
            retry: 'Thử lại',
        },
        messages: {
            passwordMin: 'Mật khẩu phải có ít nhất {{count}} ký tự.',
            passwordMismatch: 'Mật khẩu không khớp.',
            mnemonicGenerate: 'Không thể tạo cụm từ khôi phục của bạn.',
            copy: 'Không thể sao chép tự động. Hãy chọn và sao chép thủ công.',
            backup: 'Vui lòng xác nhận rằng bạn đã lưu cụm từ khôi phục.',
            verification:
                'Một hoặc nhiều từ không đúng. Vui lòng kiểm tra lại cụm từ và thử lại.',
            keystore: 'Không thể lưu ví của bạn trên thiết bị này.',
        },
    },
};
