export function reportError(error: unknown, context?: Record<string, any>) {
    console.error("Centralized Error Report:", error, context ? "Context: " + JSON.stringify(context) : "");
    // If Sentry was available, we would call Sentry.captureException(error, { extra: context }) here
}
