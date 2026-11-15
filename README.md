# LZN Wallet

> **Your keys. Your assets. Your control.**

Carteira não-custodial de desktop para a **Gnosis Chain**, construída com Tauri + React. A frase secreta (mnemônico BIP-39) é gerada localmente, criptografada com AES-GCM e armazenada apenas no dispositivo — nenhum servidor tem acesso às suas chaves.

---

## ✨ Funcionalidades

| Feature | Descrição |
|---|---|
| 🔑 **Self-custodial** | Chaves geradas e armazenadas localmente; sem back-end. |
| 🛡️ **Keystore criptografado** | AES-GCM + PBKDF2 protegem a frase secreta com a senha do usuário. |
| 👛 **Multi-conta** | Derive múltiplas contas (endereços) a partir de uma única frase secreta. |
| 📊 **Portfolio em tempo real** | Saldos nativos (xDAI) e ERC-20 consultados via wagmi/viem. |
| 💱 **Cotação USD** | Preços e variação de 24 h via CoinGecko. |
| 📤 **Enviar** | Fluxo de 3 etapas com estimativa de gas e confirmação por senha. |
| 📥 **Receber** | QR code + cópia do endereço. |
| 🕐 **Histórico de atividade** | Transferências recentes consultadas on-chain. |
| 🌐 **i18n** | 20 idiomas suportados com detecção automática e renderização RTL (Árabe, Urdu). |
| 🔄 **Recuperação & Discovery** | Restauração por seed com Account Discovery automático (BIP-44) e verificação criptográfica. |
| 🧪 **Testnet** | Suporte nativo à Gnosis Chiado (basta alterar uma flag). |
| 📈 **Investimentos (sDAI)** | Depósito e resgate de xDAI em Savings xDAI (ERC-4626) com rendimento automático e simulação prévia. |

---

## 🏗️ Stack

| Camada | Tecnologia |
|---|---|
| Desktop shell | [Tauri v2](https://tauri.app) (Rust) |
| UI | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Estilo | [Tailwind CSS v4](https://tailwindcss.com) |
| Blockchain | [viem](https://viem.sh) + [wagmi](https://wagmi.sh) |
| Roteamento | [wouter](https://github.com/molefrog/wouter) |
| i18n | [i18next](https://www.i18next.com) + react-i18next |
| QR Code | [qrcode.react](https://github.com/zpao/qrcode.react) |
| Ícones | [lucide-react](https://lucide.dev) |
| Build | [Vite](https://vitejs.dev) |

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org) ≥ 20
- [Rust](https://rustup.rs) (toolchain estável)
- Dependências de sistema do Tauri — veja o guia oficial: <https://tauri.app/start/prerequisites/>

---

## 🚀 Início Rápido

```bash
# 1. Clone o repositório
git clone https://github.com/laza-network/lzn-wallet.git
cd lzn-wallet

# 2. Instale as dependências JavaScript
npm install

# 3. Inicie o app em modo de desenvolvimento
npm run tauri dev
```

O Tauri compilará o back-end Rust e abrirá a janela do aplicativo com hot-reload do front-end.

---

## 📦 Build de Produção

```bash
npm run tauri build
```

Os instaladores (.deb, .AppImage, .dmg, .msi etc.) são gerados em `src-tauri/target/release/bundle/`.

---

## 🗂️ Estrutura do Projeto

```
lzn-wallet/
├── src/                        # Front-end React
│   ├── components/
│   │   ├── ui/                 # Primitivos reutilizáveis (Modal)
│   │   └── wallet/             # Componentes da carteira
│   │       ├── accounts-dialog.tsx   # Seleção/adição de contas
│   │       ├── activity-list.tsx     # Histórico de transferências
│   │       ├── address-card.tsx      # Exibição do endereço ativo
│   │       ├── assets-list.tsx       # Lista de ativos e saldos
│   │       ├── empty-wallet.tsx      # CTA para criar carteira
│   │       ├── portfolio-summary.tsx # Total + variação 24 h
│   │       ├── receive-dialog.tsx    # QR code para recebimento
│   │       ├── send-dialog.tsx       # Fluxo de envio
│   │       └── wallet-header.tsx     # Cabeçalho com rede e contas
│   ├── config/
│   │   └── chains.json         # Configuração central de redes/RPCs (Gnosis, Chiado, fork Anvil)
│   ├── lib/
│   │   ├── bip39.ts            # Geração de mnemônico BIP-39
│   │   ├── keystore.ts         # Criptografia AES-GCM / PBKDF2
│   │   ├── wagmi.ts            # Configuração wagmi (lê RPCs de src/config/chains.json)
│   │   ├── wallet.ts           # Hooks e lógica de portfolio/envio
│   │   ├── use-wallet.ts       # Hook de estado global da carteira
│   │   ├── use-copy.ts         # Hook de copiar para clipboard
│   │   ├── utils.ts            # Utilitários gerais
│   │   └── i18n/               # Internacionalização
│   │       └── locales/        # en, es, it, pt-br, zh-tw
│   └── pages/
│       ├── Home.tsx            # Dashboard principal
│       └── wallet/
│           └── CreateWallet.tsx # Fluxo de criação (4 etapas)
├── src-tauri/                  # Back-end Rust (Tauri)
│   ├── src/
│   │   ├── main.rs
│   │   └── lib.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── public/
└── package.json
```

---

## 🔐 Segurança

A carteira adota um modelo **totalmente local**:

1. **Geração de chaves** — o mnemônico BIP-39 é gerado via `crypto.getRandomValues` no browser context do Tauri.
2. **Criptografia em repouso** — a frase secreta é cifrada com AES-256-GCM. A chave de criptografia é derivada da senha do usuário via PBKDF2 (SHA-256, 600 000 iterações).
3. **Sem transmissão** — a frase secreta nunca sai do dispositivo. Durante o envio de transações, a chave privada é derivada em memória e descartada imediatamente após a assinatura.
4. **Sem dependência de servidor** — leituras on-chain usam os RPCs públicos da Gnosis Chain e CoinGecko diretamente do cliente.

> [!CAUTION]
> Guarde sua frase de recuperação de 12 palavras em local seguro e offline. Sem ela, **não é possível recuperar os fundos** caso você perca o acesso ao dispositivo ou esqueça a senha.

---

## 🔑 Derivação da Carteira (BIP-39 / BIP-44)

A LZN Wallet segue os padrões da indústria (**BIP-39**, **BIP-32** e **BIP-44**) para geração determinística e derivação de contas EVM:

### Caminho de Derivação (Derivation Path)

```text
m / 44' / 60' / {accountIndex}' / 0 / 0
```

| Nível | Valor | Descrição |
|---|:---:|---|
| **Purpose** | `44'` | Especificação BIP-44 para carteiras determinísticas hierárquicas (HD). |
| **Coin Type** | `60'` | Identificador padrão para moedas EVM (Ethereum e compatíveis, incluindo Gnosis Chain). |
| **Account** | `{accountIndex}'` | Índice da conta (`0'`, `1'`, `2'`, ...), permitindo gerenciar múltiplas contas a partir de uma única seed. |
| **Change** | `0` | Cadeia externa (endereços públicos para recebimento). |
| **Address Index** | `0` | Índice do endereço gerado dentro da conta. |

### Detalhes Técnicos de Implementação:

1. **Frase Secreta (BIP-39):**
   * Mnemônico de 12 palavras gerado com entropia criptográfica nativa (`crypto.getRandomValues`).
   * Compatível com a wordlist oficial BIP-39 em inglês.
2. **Derivação de Chaves:**
   * Implementada com [`viem/accounts`](https://viem.sh):
     ```ts
     import { mnemonicToAccount } from 'viem/accounts';

     // Deriva m/44'/60'/{accountIndex}'/0/0
     const account = mnemonicToAccount(mnemonic, { accountIndex });
     const address = account.address;
     ```
3. **Descoberta de Contas (BIP-44 Gap Limit):**
   * Na recuperação por frase secreta, a função `discoverAccounts` escaneia os índices sequencialmente com uma janela de *gap limit* de 5 contas vazias consecutivas.
   * Contas com saldo ou histórico de transações (`getTransactionCount > 0`) são importadas automaticamente, restaurando o estado completo do usuário.
4. **Interoperabilidade Total:**
   * A frase secreta de 12 palavras pode ser importada ou exportada diretamente para qualquer carteira padrão EVM (ex.: **MetaMask**, **Rabby**, **Frame**, **Ledger**, **Trezor**).

---

## 🌐 Redes Suportadas

Os RPCs e as redes são centralizados em [`src/config/chains.json`](src/config/chains.json). Para escolher a rede ativa, defina `VITE_ACTIVE_CHAIN` no arquivo [`.env`](.env) (ou `.env.local`) pelo **nome** ou pelo **id** da rede:

| Chave (nome) | Rede | Tipo | Chain ID | RPC padrão |
|---|---|---|:---:|---|
| `gnosis` | Gnosis Chain | Mainnet | 100 | `https://rpc.gnosischain.com` |
| `chiado` | Gnosis Chiado | Testnet | 10200 | `https://rpc.chiadochain.net` |
| `anvil-fork` | Fork local da Gnosis main via Anvil | Dev | 31337 | `http://127.0.0.1:8545` |

```bash
# Exemplos válidos (nome ou id produzem o mesmo resultado):
VITE_ACTIVE_CHAIN=gnosis      # Gnosis Chain mainnet (100)
VITE_ACTIVE_CHAIN=chiado      # Gnosis Chiado testnet (10200)
VITE_ACTIVE_CHAIN=anvil-fork  # Fork local do Anvil (31337) — teste do Savings xDAI em dev
VITE_ACTIVE_CHAIN=31337       # id também é aceito
```

---

## 🪙 Tokens Suportados

- **xDAI** — moeda nativa da Gnosis Chain
- **sDAI** — Savings xDAI (Vault ERC-4626 com rendimento lastreado em USDS/Sky Protocol)
- **WXDAI** — Wrapped xDAI (ERC-20)
- **GNO** — Gnosis Token
- **EURe** — Monerium EURe
- **LINK** — Chainlink
- *(e outros tokens ERC-20 rastreados por cadeia)*

---

## 🌍 Idiomas (20 idiomas)

A carteira conta com suporte completo a internacionalização, persistência de preferências em `localStorage`, detecção automática pelo navegador e suporte a direção de texto RTL (Right-to-Left):

| Código | Idioma | Nome Nativo | Direção |
|---|---|---|:---:|
| `pt-BR` | Português (Brasil) | Português | LTR |
| `en` | Inglês | English | LTR |
| `es` | Espanhol | Español | LTR |
| `it` | Italiano | Italiano | LTR |
| `de` | Alemão Padrão | Deutsch | LTR |
| `fr` | Francês | Français | LTR |
| `ru` | Russo | Русский | LTR |
| `zh-CN` | Chinês Mandarim (Simplificado) | 简体中文 | LTR |
| `zh-TW` | Chinês Tradicional | 繁體中文 | LTR |
| `ja` | Japonês | 日本語 | LTR |
| `hi` | Hindi | हिन्दी | LTR |
| `bn` | Bengali | বাংলা | LTR |
| `mr` | Marata (Marathi) | मराठी | LTR |
| `te` | Telugo (Telugu) | తెలుగు | LTR |
| `vi` | Vietnamita | Tiếng Việt | LTR |
| `id` | Indonésio | Bahasa Indonesia | LTR |
| `pcm` | Pidgin Nigeriano | Naijá | LTR |
| `ar` | Árabe Padrão Moderno | العربية | **RTL** |
| `arz` | Árabe Egípcio | عربي مصري | **RTL** |
| `ur` | Urdu | اردو | **RTL** |

---

## 📜 Licença

Este projeto é parte da **Laza Network**. Consulte o arquivo `LICENSE` para mais informações.
