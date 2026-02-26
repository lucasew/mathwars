export function reportError(error: unknown, context?: string) {
    // In the future, this should be connected to Sentry or another error tracking service.
    // For now, we log to console.error with a standardized format.
    console.error(`[Error Report]${context ? ` [${context}]` : ''}:`, error);
}
