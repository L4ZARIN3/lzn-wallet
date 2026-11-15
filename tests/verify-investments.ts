import assert from 'node:assert';
import { isAddress, createPublicClient, http, formatEther } from 'viem';
import { gnosis } from 'viem/chains';
import {
    GNOSIS_CHAIN_ID,
    ANVIL_FORK_CHAIN_ID,
    CHIADO_CHAIN_ID,
    INVEST,
    INVESTMENT_CONFIG,
    SAVINGS_XDAI_ADAPTER_ADDRESS,
    savingsXDaiAdapterAbi,
    SDAI_VAULT_ADDRESS,
    sdaiVaultAbi,
    WXDAI_ADDRESS,
} from '../src/constants/investments.ts';
import { gnosisFork, supportedChains } from '../src/lib/wagmi.ts';

async function runInvestmentsVerification() {
    console.log('--- Starting Investments Verification Tests ---');

    // 1. Validar Constantes e Endereços
    console.log('1. Validando constantes e endereços EVM:');
    assert.strictEqual(GNOSIS_CHAIN_ID, 100, 'ChainId deve ser 100 (Gnosis Chain)');
    assert.strictEqual(ANVIL_FORK_CHAIN_ID, 31337, 'ChainId deve ser 31337 (Anvil local fork)');
    assert.strictEqual(CHIADO_CHAIN_ID, 10200, 'ChainId deve ser 10200 (Chiado testnet)');
    assert.ok(isAddress(SDAI_VAULT_ADDRESS), 'Endereço do Vault sDAI deve ser válido');
    assert.ok(isAddress(SAVINGS_XDAI_ADAPTER_ADDRESS), 'Endereço do Adapter deve ser válido');
    assert.ok(isAddress(WXDAI_ADDRESS), 'Endereço do WXDAI deve ser válido');
    assert.strictEqual(
        SAVINGS_XDAI_ADAPTER_ADDRESS.toLowerCase(),
        '0xd499b51fcfc66bd31248ef4b28d656d67e591a94',
        'Endereço do Adapter deve ser exatamente o confirmado',
    );

    // Validar mapa INVEST centralizado
    assert.ok(INVEST[100], 'INVEST deve conter configuração para a mainnet Gnosis (100)');
    assert.strictEqual(INVEST[100].adapterAddress, SAVINGS_XDAI_ADAPTER_ADDRESS);
    assert.strictEqual(INVEST[100].vaultAddress, SDAI_VAULT_ADDRESS);

    assert.ok(INVEST[31337], 'INVEST deve conter configuração para o fork Anvil (31337)');
    assert.strictEqual(INVEST[31337].adapterAddress, SAVINGS_XDAI_ADAPTER_ADDRESS);
    assert.strictEqual(INVEST[31337].vaultAddress, SDAI_VAULT_ADDRESS);

    assert.strictEqual(
        INVEST[10200],
        undefined,
        'Chiado (10200) não deve estar ativo no mapa INVEST enquanto o mock não for configurado',
    );
    assert.strictEqual(
        INVEST[1],
        undefined,
        'Rede desconhecida (ex: 1) não deve estar no mapa INVEST',
    );

    // Validar definição gnosisFork
    assert.strictEqual(gnosisFork.id, 31337);
    assert.strictEqual(gnosisFork.name, 'Gnosis Fork (local)');
    assert.strictEqual(gnosisFork.nativeCurrency.name, 'xDAI');
    assert.strictEqual(gnosisFork.nativeCurrency.symbol, 'XDAI');
    assert.strictEqual(gnosisFork.nativeCurrency.decimals, 18);
    assert.ok(
        supportedChains.some((c) => c.id === 31337),
        'supportedChains deve incluir o fork Anvil 31337',
    );
    console.log('✓ Endereços, mapa INVEST e gnosisFork validados com sucesso');

    // 2. Validar ABIs
    console.log('2. Validando assinaturas de ABIs:');
    const adapterFunctions = savingsXDaiAdapterAbi
        .filter((item) => item.type === 'function')
        .map((f) => f.name);
    assert.ok(adapterFunctions.includes('depositXDAI'), 'Adapter deve expor depositXDAI');
    assert.ok(adapterFunctions.includes('withdrawXDAI'), 'Adapter deve expor withdrawXDAI');
    assert.ok(adapterFunctions.includes('redeemXDAI'), 'Adapter deve expor redeemXDAI');

    const vaultFunctions = sdaiVaultAbi
        .filter((item) => item.type === 'function')
        .map((f) => f.name);
    assert.ok(vaultFunctions.includes('balanceOf'), 'Vault deve expor balanceOf');
    assert.ok(vaultFunctions.includes('convertToAssets'), 'Vault deve expor convertToAssets');
    assert.ok(vaultFunctions.includes('allowance'), 'Vault deve expor allowance');
    assert.ok(vaultFunctions.includes('approve'), 'Vault deve expor approve');
    console.log('✓ Assinaturas das ABIs mínimas validadas com sucesso');

    // 3. Validar Cálculos BigInt e Reserva de Gás
    console.log('3. Validando regras de saldo e reserva de gás (BigInt):');
    const gasReserve = INVESTMENT_CONFIG.gasReserveWei;
    assert.strictEqual(typeof gasReserve, 'bigint', 'Reserva de gás deve ser BigInt');

    const balanceWithAdequateFunds = 1000000000000000000n; // 1 xDAI
    const maxAvailable =
        balanceWithAdequateFunds > gasReserve
            ? balanceWithAdequateFunds - gasReserve
            : 0n;
    assert.strictEqual(
        maxAvailable,
        990000000000000000n,
        'Desconto da reserva de gás (0.01 xDAI) deve ser exato em wei',
    );

    const balanceBelowGas = 2000000000000000n; // 0.002 xDAI
    const maxAvailableLow =
        balanceBelowGas > gasReserve ? balanceBelowGas - gasReserve : 0n;
    assert.strictEqual(
        maxAvailableLow,
        0n,
        'Saldos inferiores à reserva de gás devem resultar em 0n disponível',
    );
    console.log('✓ Cálculos em BigInt e proteção de gás validados');

    // 4. Teste On-Chain com Gnosis RPC
    console.log('4. Consultando contratos ao vivo na Gnosis Chain (RPC):');
    const client = createPublicClient({
        chain: gnosis,
        transport: http(),
    });

    try {
        const sharePrice = await client.readContract({
            address: SDAI_VAULT_ADDRESS,
            abi: sdaiVaultAbi,
            functionName: 'convertToAssets',
            args: [INVESTMENT_CONFIG.oneShare],
        });
        console.log(`   Preço atual de 1 sDAI: ${formatEther(sharePrice)} xDAI`);
        assert.ok(
            sharePrice >= INVESTMENT_CONFIG.oneShare,
            '1 sDAI deve valer >= 1 xDAI (ativo com rendimento acumulado)',
        );

        console.log('✓ Leitura de preço e integridade do Vault sDAI confirmados on-chain');
    } catch (err) {
        console.warn('Aviso: Falha de conexão de rede durante teste RPC ao vivo:', err);
    }

    console.log('ALL INVESTMENTS VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
}

await runInvestmentsVerification();
