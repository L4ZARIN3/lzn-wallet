#!/usr/bin/env bash
set -e
export PATH="$HOME/.foundry/bin:$PATH"

RPC_PUBLICO="https://rpc.gnosischain.com"
PORTA=8545
RPC="http://127.0.0.1:$PORTA"

command -v anvil >/dev/null || { echo "Foundry não encontrado. Instale: curl -L https://foundry.paradigm.xyz | bash && foundryup"; exit 1; }

# 1. Gera uma carteira nova e aleatória (frase + conta 0)
SAIDA=$(cast wallet new-mnemonic)
FRASE=$(echo "$SAIDA" | awk '/Phrase:/ {getline; print; exit}')
ENDERECO=$(echo "$SAIDA" | awk '/Address:/ {print $2; exit}')
CHAVE=$(echo "$SAIDA" | awk '/Private key:/ {print $3; exit}')

if [ -z "$FRASE" ] || [ -z "$ENDERECO" ] || [ -z "$CHAVE" ]; then
  echo "Não consegui ler a saída do cast wallet new-mnemonic:"
  echo "$SAIDA"
  exit 1
fi

# 2. Sobe o fork da Gnosis já com essa conta financiada (10.000 xDAI)
anvil --fork-url "$RPC_PUBLICO" --chain-id 31337 --port $PORTA \
  --mnemonic "$FRASE" --accounts 1 --balance 10000 --silent &
ANVIL_PID=$!
trap 'kill $ANVIL_PID 2>/dev/null' EXIT

# 3. Espera o nó responder
for i in $(seq 1 30); do
  cast block-number --rpc-url "$RPC" >/dev/null 2>&1 && break
  sleep 1
done

# 4. Confere saldo e que a conta está limpa
SALDO=$(cast balance "$ENDERECO" --ether --rpc-url "$RPC")
CODIGO=$(cast code "$ENDERECO" --rpc-url "$RPC")
[ "$CODIGO" = "0x" ] || { echo "Conta com código delegado, rode de novo."; exit 1; }

cat <<EOF

=========== FORK DA GNOSIS PRONTO (chainId 31337) ===========
RPC:           $RPC
Endereço:      $ENDERECO
Palavras:      $FRASE
Chave privada: $CHAVE
Saldo:         $SALDO xDAI
Código:        limpo (0x)
==============================================================
Importe SÓ numa carteira de TESTE. Ctrl+C encerra o fork.

EOF

wait $ANVIL_PID