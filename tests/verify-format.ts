import assert from 'node:assert';

import { fmt } from '../src/utils/format.ts';

/**
 * Testes do utilitário de exibição `fmt`:
 * arredondamento (nunca trunca), sempre em BigInt, sem number/toFixed.
 */
function runFormatVerification() {
    console.log('--- Starting Format (fmt) Verification Tests ---');

    // Básicos
    assert.strictEqual(fmt(0n), '0.0000', '0 wei deve exibir 0.0000');
    assert.strictEqual(fmt(1n), '0.0000', '1 wei arredondado para 4 casas é 0.0000');

    // Caso central do bug: 50 xDAI menos 1 wei deve exibir 50.0000 (e não 49.9999)
    assert.strictEqual(
        fmt(49999999999999999999n),
        '50.0000',
        '49.999999999999999999 deve arredondar para 50.0000',
    );
    assert.strictEqual(fmt(50000000000000000000n), '50.0000', '50 exato é 50.0000');

    // Arredondamento para cima
    assert.strictEqual(
        fmt(123456789012345678n),
        '0.1235',
        '0.123456... arredonda para 0.1235',
    );
    assert.strictEqual(
        fmt(999950000000000000n, 4),
        '1.0000',
        '0.99995 arredonda para 1.0000',
    );

    // Valores grandes
    assert.strictEqual(
        fmt(10000000000000000000000n),
        '10000.0000',
        '10000 xDAI exibe 10000.0000',
    );

    // Preço da cota com 6 casas
    assert.strictEqual(
        fmt(1266726000000000000n, 6),
        '1.266726',
        'preço da cota com 6 casas',
    );

    // Casos de borda: casas >= decimais (ex.: USDC com 6 decimais exibido com 8 casas, ou 2 decimais com 4 casas)
    assert.strictEqual(
        fmt(1000000n, 8, 6),
        '1.00000000',
        'casas > decimais não pode lançar RangeError e deve preencher com zeros',
    );
    assert.strictEqual(
        fmt(123n, 4, 2),
        '1.2300',
        'token com 2 decimais exibido com 4 casas',
    );
    assert.strictEqual(
        fmt(100n, 0, 2),
        '1',
        'casas = 0 deve exibir apenas parte inteira',
    );

    // Valores negativos
    assert.strictEqual(
        fmt(-50000000000000000000n, 4, 18),
        '-50.0000',
        'valores negativos devem preservar o sinal',
    );

    console.log('✓ Todos os casos de arredondamento/formação e bordas passaram');
    console.log('ALL FORMAT VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runFormatVerification();
