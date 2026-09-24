/** Query keys for a quick-match setup link. Shared by the form and "try again". */
export const quickMatchQuery = {
    maxNumber: 'maxNumber',
    ops: 'ops',
    plays: 'plays',
} as const

export function setQuickMatchQuery(
    url: URL,
    settings: { maxNumber: number; ops: string; plays: number },
): void {
    url.searchParams.set(quickMatchQuery.maxNumber, String(settings.maxNumber))
    url.searchParams.set(quickMatchQuery.ops, settings.ops)
    url.searchParams.set(quickMatchQuery.plays, String(settings.plays))
}
