/**
 * Copy text to the clipboard.
 *
 * Prefer the Clipboard API when available (secure contexts: HTTPS / localhost).
 * On non-secure pages (e.g. `vite --host` over http://LAN) `navigator.clipboard`
 * is often missing, so a bare `writeText` throws before any promise rejection
 * handler runs. Fall back to a temporary textarea + `document.execCommand('copy')`.
 */
export function copyText(text: string): Promise<void> {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(text)
    }
    return new Promise((resolve, reject) => {
        try {
            const ta = document.createElement('textarea')
            ta.value = text
            ta.setAttribute('readonly', '')
            ta.style.position = 'fixed'
            ta.style.left = '-9999px'
            document.body.appendChild(ta)
            ta.select()
            const ok = document.execCommand('copy')
            document.body.removeChild(ta)
            if (ok) resolve()
            else reject(new Error('copy failed'))
        } catch (err) {
            reject(err instanceof Error ? err : new Error('copy failed'))
        }
    })
}
