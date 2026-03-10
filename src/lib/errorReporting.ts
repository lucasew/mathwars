export function reportError(error: unknown): void {
  // In the future, this function can be wired up to Sentry or other error reporting backends.
  console.error('[Error Reporter]', error);
}
