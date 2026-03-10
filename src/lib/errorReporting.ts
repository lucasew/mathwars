export function reportError(error: unknown, context?: Record<string, any>) {
    console.error("Centralized Error Report:", error, context);
    // If Sentry was available, it would be called here: Sentry.captureException(error, { extra: context })
}
