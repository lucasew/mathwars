## IGNORE: Unintended `bun.lock` modifications

**- Pattern:** PRs including changes to `bun.lock` that only bump `"configVersion": 0` or reflect different tooling environments.
**- Justification:** Indicates `bun install` was run with an unpinned or mismatched version of Bun compared to the project's setup, causing lockfile thrashing without actual dependency changes.
**- Files Affected:** `bun.lock`

## IGNORE: Docs PRs altering executable logic

**- Pattern:** 'Docs' agent PRs modifying runtime code, adding non-null assertions, runtime type checks, or modifying tool configuration.
**- Justification:** Docs changes must strictly not alter executable logic. Their scope is limited to comments, JSDoc, and markdown documentation.
**- Files Affected:** `src/main.ts`, `src/lib/user.ts`, `mise.toml`, `src/lib/problemgen.ts`

## IGNORE: TypeScript non-null assertions to bypass checks

**- Pattern:** Using the `!` operator (e.g., `document.getElementById('app')!`) or `as unknown as type` casting to bypass TypeScript strict null checks.
**- Justification:** Masks potential runtime null reference errors instead of handling them safely with proper condition checks or fallbacks.
**- Files Affected:** `src/main.ts`, `src/pages/QuickMatch.svelte`, `src/pages/PlayStatsPage.svelte`, `src/lib/DoomFire.svelte`

## IGNORE: Re-introducing `any` types in new utilities

**- Pattern:** Creating new files (e.g., `src/lib/errorReporting.ts`) using `Record<string, any>` or explicit `any` types in signatures.
**- Justification:** The project enforces strict typing and previously removed `any` types. New code must use `unknown` or precise generic types to prevent implicit typing errors.
**- Files Affected:** `src/lib/errorReporting.ts`, `src/lib/ProblemQuestion.svelte`

## IGNORE: Bundling unrelated objectives (Scope Creep)

**- Pattern:** Combining distinct agent responsibilities into a single PR (e.g., refactoring Svelte store syntax AND adding centralized error reporting, or moving files AND fixing types).
**- Justification:** Violates strict scope discipline. Changes must be atomic and execute only the explicitly requested outcome to ensure safe and reviewable diffs.
**- Files Affected:** Multiple files across different domains

## IGNORE: Replacing CI workflow files

**- Pattern:** Deleting `update-deps.yml` and replacing it with `autorelease.yml` or altering the CI workflow name.
**- Justification:** The repository explicitly expects the CI workflow to be located at `.github/workflows/update-deps.yml`. `autorelease.yml` is an incorrect assumption.
**- Files Affected:** `.github/workflows/update-deps.yml`, `.github/workflows/autorelease.yml`
