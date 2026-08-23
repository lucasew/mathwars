/** Coerce unknown to a finite number, else fallback. Shared by form clamps. */
export function finiteNumberOr(value: unknown, fallback: number): number {
    const n = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(n) ? n : fallback
}
