---
description: Run NX lint, test, and build across all projects. If any step fails, attempt to fix the issues and re-run. Invoke with /nx-validate.
---

# NX Validate

Run lint, test, and build for all projects in the monorepo. Automatically attempt to fix failures before reporting.

## Phase 1 — Lint

Run lint across all projects:

```
npx nx run-many --target=lint --all
```

Capture the output. Note which projects failed and what errors were reported.

**If lint fails:**
- Fix only ESLint errors — do not edit `.eslintrc.*`, `eslint.config.*`, `.prettierrc.*`, or `prettier.config.*` files.
- Common fixable issues: unused imports, missing return types, `any` types that can be narrowed, import ordering.
- Never add `// eslint-disable` or `@ts-ignore` to suppress errors — fix the root cause.
- After fixes, re-run lint:

  ```
  npx nx run-many --target=lint --all
  ```

- If lint still fails after one fix attempt for a project, record it as **unresolved** and move on — do not loop indefinitely.

## Phase 2 — Test

Run tests across all projects:

```
npx nx run-many --target=test --all
```

Capture the output. Note which projects failed and what test failures were reported.

**If tests fail:**
- Read the failing test files to understand what behaviour is expected.
- Fix the **source code** if the implementation is wrong, or fix the **test** only if the test itself has a clear bug (e.g. wrong assertion, stale snapshot, wrong mock setup).
- Never delete or skip failing tests — do not add `.skip`, `xit`, `xtest`, or `xdescribe`.
- After fixes, re-run only the failing projects:

  ```
  npx nx test <project-name>
  ```

- If tests still fail after one fix attempt for a project, record it as **unresolved** and move on.

## Phase 3 — Build

Run build across all projects:

```
npx nx run-many --target=build --all
```

Capture the output. Note which projects failed and what errors were reported.

**If build fails:**
- Fix TypeScript type errors, missing imports, or misconfigured paths.
- If the shared library (`track-shared`) changed, rebuild it first:

  ```
  npx nx build track-shared
  ```

  Then retry the full build:

  ```
  npx nx run-many --target=build --all
  ```

- Never use `@ts-ignore`, `@ts-expect-error`, or `as any` to silence type errors — fix the root cause.
- After fixes, re-run only the failing projects:

  ```
  npx nx build <project-name>
  ```

- If build still fails after one fix attempt for a project, record it as **unresolved** and move on.

## Phase 4 — Report

Present a concise summary table to the user:

| Step  | Status | Projects Failed | Fixed | Unresolved |
|-------|--------|-----------------|-------|------------|
| Lint  | ✅ / ❌ | list or — | count or — | count or — |
| Test  | ✅ / ❌ | list or — | count or — | count or — |
| Build | ✅ / ❌ | list or — | count or — | count or — |

Follow the table with:

- **Fixed issues** — for each fix applied, one line: what file was changed and why.
- **Unresolved issues** — for each unresolved failure, paste the exact error and explain why it was not auto-fixed (e.g. ambiguous expected behaviour, requires architectural decision, missing env variable).

If everything passed with no fixes needed, say: "All checks passed — lint, test, and build are green."

Do not commit any fixes unless the user explicitly asks.
