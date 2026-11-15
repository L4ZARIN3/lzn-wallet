/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Rede/RPC ativa: nome ('gnosis', 'chiado', 'anvil-fork') ou id ('100', '10200', '31337'). */
    readonly VITE_ACTIVE_CHAIN?: string;
    readonly VITE_SDAI_VAULT_ADDRESS?: string;
    readonly VITE_SAVINGS_XDAI_ADAPTER_ADDRESS?: string;
    readonly VITE_WXDAI_ADDRESS?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
