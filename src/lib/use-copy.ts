import { useCallback, useEffect, useRef, useState } from 'react';

/** Tempo que o feedback "copiado" permanece visível. */
const RESET_DELAY = 2000;

/**
 * Copia texto para a área de transferência e expõe um estado `copied`
 * temporário para feedback visual.
 */
export function useCopyToClipboard() {
    const [copied, setCopied] = useState(false);
    const timeout = useRef<number | null>(null);

    useEffect(
        () => () => {
            if (timeout.current !== null) {
                window.clearTimeout(timeout.current);
            }
        },
        [],
    );

    const copy = useCallback(async (value: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(value);
        } catch {
            setCopied(false);

            return false;
        }

        setCopied(true);

        if (timeout.current !== null) {
            window.clearTimeout(timeout.current);
        }

        timeout.current = window.setTimeout(
            () => setCopied(false),
            RESET_DELAY,
        );

        return true;
    }, []);

    return { copied, copy };
}
