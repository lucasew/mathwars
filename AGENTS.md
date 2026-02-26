# Project Conventions

## Project Structure
- `src/lib/components`: Shared Svelte components.
- `src/lib/game`: Game logic and domain models.
- `src/pages`: Top-level page components.
- `src/stores`: Svelte stores for state management.

## Code Style
- **Components:** `PascalCase.svelte`
- **Logic:** `camelCase.ts`
- **Naming:**
    - Use descriptive names.
    - Avoid abbreviations unless standard.
    - Event handlers: `handleEventName`.

## Error Handling
- **Centralized Reporting:** All unexpected errors MUST be reported via `src/lib/error.ts` (`reportError`).
- **No Console Logs:** Avoid `console.log` in production code. Use `console.debug` for development if necessary, but prefer removing them.
- **Catch Blocks:** Every `catch` block must call `reportError`.

## Tooling
- **Mise:** Use `mise` for tool management.
- **Pinning:** Tools in `mise.toml` must be pinned to specific versions.
