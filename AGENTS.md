# Project Guidelines

## Centralized Error Reporting

The project mandates centralized error reporting. All unexpected errors must funnel through `reportError` in `src/lib/errorReporting.ts`, and silent failures (empty catch blocks) or raw `console.error` calls are strictly forbidden.

### Where to find things

- `src/main.ts` -> Entrypoint
- `src/pages/` -> Routes/Pages
- `src/lib/` -> Shared utilities, services and common components
- `src/stores/` -> Svelte stores
- `src/lib/errorReporting.ts` -> Centralized Error Reporting
