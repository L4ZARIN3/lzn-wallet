import { formatUnits } from 'viem';

/**
 * Formata um valor em BigInt para EXIBIÇÃO, com arredondamento (nunca trunca).
 *
 * - Tudo em BigInt: nenhuma conversão para number/parseFloat/toFixed.
 * - O valor exato em wei continua sendo usado em transações; esta função é
 *   apenas para exibir valores na interface.
 */
export function fmt(valor: bigint, casas = 4, decimais = 18): string {
  const passo = 10n ** BigInt(decimais - casas)
  const arredondado = ((valor + passo / 2n) / passo) * passo
  const [int, frac = ''] = formatUnits(arredondado, decimais).split('.')
  return casas > 0 ? `${int}.${frac.padEnd(casas, '0').slice(0, casas)}` : int
}
