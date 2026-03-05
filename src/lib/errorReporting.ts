export function reportError(error: unknown, context?: Record<string, unknown>) {
    // Centralized error reporting function.
    // In the future this can be wired up to Sentry or another service.
    console.error("An unexpected error occurred:", error, context);
}
