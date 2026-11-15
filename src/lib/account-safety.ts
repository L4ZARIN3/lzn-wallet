import type { Address, PublicClient } from 'viem';

/**
 * Mensagem exibida quando o endereço ativo possui código de contrato na rede.
 *
 * Endereços "famosos" de teste (as contas padrão da Hardhat/Anvil, ex.:
 * 0xf39F... derivada do mnemônico "test test ... junk") estão delegados via
 * EIP-7702 a contratos drenadores na Gnosis Chain. Qualquer chamada COM VALOR
 * para esses endereços executa o código do contrato delegado, que varre todo o
 * saldo para o coletor do golpista — exatamente o que acontece quando um
 * protocolo paga resgates/rendimentos para a conta.
 */
export const CONTRACT_CODE_WARNING =
    'Este endereço possui código de contrato ativo na rede (delegação EIP-7702 ou similar). ' +
    'Endereços assim executam código ao receber chamadas e podem drenar todo o saldo. ' +
    'Use outra conta para operar.';

/**
 * Verifica se um endereço possui código on-chain (contrato, delegação EIP-7702
 * ou container EOF). Um EOA puro retorna código vazio (0x).
 */
export async function addressHasCode(
    client: PublicClient,
    address: Address,
): Promise<boolean> {
    const code = await client.getCode({ address });

    return Boolean(code && code !== '0x');
}
