/**
 * Utilitário seguro para abertura de links externos no navegador padrão do sistema.
 *
 * Em ambiente desktop (Tauri), direciona a chamada para o plugin-opener nativo,
 * impedindo que o WebKitGTK / WebView2 navegue internamente e quebre o contexto
 * ou as diretivas de CSP da carteira. Em navegadores convencionais, utiliza
 * window.open com isolamento (noopener, noreferrer).
 */
export async function openExternalUrl(
    url: string | undefined | null,
    event?: React.MouseEvent,
): Promise<void> {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (!url) {
        return;
    }

    try {
        if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
            const { openUrl } = await import('@tauri-apps/plugin-opener');
            await openUrl(url);
            return;
        }
    } catch {
        // Fallback para ambiente web/browser
    }

    if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}
