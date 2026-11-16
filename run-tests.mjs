import { createJiti } from 'jiti';
import path from 'path';

// Mock browser globals
const storage = new Map();
globalThis.window = {
    localStorage: {
        getItem: (k) => storage.get(k) ?? null,
        setItem: (k, v) => storage.set(k, v),
        removeItem: (k) => storage.delete(k),
        clear: () => storage.clear(),
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
};
globalThis.document = {
    documentElement: {
        dir: 'ltr',
        lang: 'pt-BR',
    },
};

const jiti = createJiti(import.meta.url, {
  alias: {
    '@/assets/xdai.svg': path.resolve('./tests/mock-asset.js'),
    '@': path.resolve('./src'),
  },
  fsCache: false,
  moduleCache: false,
});

// Mock Vite import.meta.env for Node test runner
if (!import.meta.env) {
    import.meta.env = {
        VITE_ACTIVE_CHAIN: 'gnosis',
        VITE_SDAI_VAULT_ADDRESS: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
        VITE_SAVINGS_XDAI_ADAPTER_ADDRESS: '0xD499b51fcFc66bd31248ef4b28d656d67E591A94',
        VITE_WXDAI_ADDRESS: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
    };
}

// Mock SVG loading
const Module = await import('module');
const origRequire = Module.createRequire(import.meta.url);
const extensions = origRequire.extensions || {};
extensions['.svg'] = (module) => {
  module.exports = 'mock-svg';
};

await jiti.import('./tests/verify-discovery.ts');
await jiti.import('./tests/verify-locales.ts');
await jiti.import('./tests/verify-investments.ts');
await jiti.import('./tests/verify-format.ts');
await jiti.import('./tests/verify-safety-and-crypto.ts');
