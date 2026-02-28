export function reportError(error: unknown, context?: Record<string, any>) {
    console.error("Centralized Error Reporter:", error, context);
    // Future: Add Sentry or other analytics here
}
