export function reportError(error: any, context?: Record<string, any>) {
    // A centralized error reporting function.
    // Funnels unexpected errors through here.
    console.error('[Error Reporter]', error, context);
    // Here we would potentially call Sentry.captureException(error, { extra: context }) if it were installed
}
