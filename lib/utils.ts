/**
 * Checks that a value looks like an MXIK (IKPU) code: exactly 17 digits.
 * Doesn't check that the code exists, use `mxik.get()` for that.
 */
export function isMxikCode(value: unknown): value is string {
  return typeof value === 'string' && /^\d{17}$/.test(value)
}
