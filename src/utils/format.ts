import { formatUnits } from 'viem';

/**
 * Formata um valor em BigInt para EXIBIÇÃO, com arredondamento (nunca trunca).
 *
 * - Tudo em BigInt: nenhuma conversão para number/parseFloat/toFixed.
 * - O valor exato em wei continua sendo usado em transações; esta função é
 *   apenas para exibir valores na interface.
 */
export function fmt(valor: bigint, casas = 4, decimais = 18): string {
  const safeCasas = Math.max(0, casas);
  const safeDecimais = Math.max(0, decimais);

  if (safeCasas >= safeDecimais) {
    const [int, frac = ''] = formatUnits(valor, safeDecimais).split('.');
    return safeCasas > 0
      ? `${int}.${frac.padEnd(safeCasas, '0').slice(0, safeCasas)}`
      : int;
  }

  const passo = 10n ** BigInt(safeDecimais - safeCasas);
  const arredondado =
    valor >= 0n
      ? ((valor + passo / 2n) / passo) * passo
      : ((valor - passo / 2n) / passo) * passo;

  const [int, frac = ''] = formatUnits(arredondado, safeDecimais).split('.');
  return safeCasas > 0
    ? `${int}.${frac.padEnd(safeCasas, '0').slice(0, safeCasas)}`
    : int;
}
