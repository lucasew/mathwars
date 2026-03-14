# Project Conventions & Guidelines (AGENTS.md)

Welcome. This is the source of truth for repository constraints, conventions, and operational memory. Any rules inside `CLAUDE.md` must be consolidated into this file, as this file takes precedence.

## 1. Tooling and Runtime Requirements

- **Package Manager:** We strictly use Bun as our package manager.
- **Mise for Tool Management:** `mise` is non-negotiable. Always pin mise tools (never "latest" or "lts"). Use pinned version for bun in `mise.toml`.
- **Hosting:** The project is deployed on Vercel (`vercel.json` exists).

## 2. Coding Practices

- **Svelte Store Syntax:** Idiomatic Svelte reactive store syntax (`$storeName`) is strictly preferred over manual `.subscribe()` calls. This prevents memory leaks, reduces boilerplate, and prevents implicit 'any' type errors.
- **Rule of Three:** Code reuse strictly follows the Rule of Three. Do not abstract logic until duplication occurs at least three times.
- **Error Handling:** Centralized error reporting is mandatory. All unexpected errors must funnel through the centralized reporting function (`reportError` in `src/lib/errorReporting.ts` if it exists). Silent failures (empty catch blocks) are strictly forbidden. If an error is caught but is out of scope for recovery, report it and move on.
- **Refactoring:** Refactoring extraction changes (e.g., Extract Method/Class) require academic justification citing Fowler, Martin, or GoF. Positional changes (moving files) require a clear rationale but no citations. PR titles for refactoring must be prefixed with `🛠️ Refactor: [Description]`.
- **Security PRs:** For security-focused tasks ('Sentinel' agent), PR titles must strictly follow the format `🛡️ Sentinel: [Severity] [Description]`. Fixes must be documented with a one-line journal entry appended to `.jules/sentinel.md`.

## 3. Pull Request Requirements

- **Git & Commits:**
  - Forbidden paths for commits: `install-mise.sh`, `bin/**`, `tmp/**`, `.github/workflows/**`, `package.json`, `mise.toml`. Tooling/bootstrap artifacts downloaded during execution must never be committed.
  - Check staged files before committing: `git diff --name-only` and `git diff --cached --name-only`. Unstage/revert out-of-scope changes.
  - Maintain small, atomic diffs. Split into smaller checkpoints if PR exceeds limits (e.g. 10 files or 280 lines).
- **Mandatory PR Body Sections:**
  Every Pull Request must include the following sections to allow human reviewers to pivot direction:
  - `Assumptions`
  - `Alternatives Not Chosen`
  - `How To Pivot` (Describe the smallest concrete change needed to redirect the PR to another valid path)
  - `Next Knobs` (List 2-4 explicit levers—files, flags, parameters, or steps—to steer direction without redoing all work)

## 4. Where to find things

- `src/main.ts` -> Entrypoint for the Vite/Svelte frontend.
- `src/App.svelte` -> Root Svelte component controlling layout and page navigation.
- `src/lib/problemgen.ts` -> Core math generation algorithms and difficulty scalers.
- `src/lib/match.ts` -> Centralized state types for handling match payloads.
- `src/lib/ntfy.ts` -> Network boundary bridging our frontend and ntfy.sh messaging for real-time pub/sub features.
- `src/lib/user.ts` -> Persistent identity bindings mapping `localStorage` to reactive stores.
- `src/stores/location.ts` -> Custom router store wrapping the browser History API for reactive path changes.
- `src/pages/` -> Route-specific layouts and screens.
- `vite.config.ts` -> Vite runtime build configuration.
- `.github/workflows/update-deps.yml` -> CI workflow for automated updates.

## 5. Prior History / Ignored Work

- Before planning work, consult `.jules/CONSISTENTLY_IGNORED.md`. If your intended change matches a pattern previously rejected by human reviewers, do NOT proceed with it. Pivot to a different issue instead.
