---
description: Fetch a GitHub issue via the GitHub MCP server and implement the feature using parallel frontend and backend subagents. Invoke with /implement-issue <issue-number>.
---

# Implement Issue: $ARGUMENTS

## Phase 1 — Fetch and Analyse the Issue

Fetch the issue using the GitHub MCP server tool `mcp__github__get_issue` with:

- `owner`: `kal-a-1`
- `repo`: `claude-code-ai-demo`
- `issue_number`: $ARGUMENTS (as an integer)

If the MCP tool call fails (server not configured or token missing), fall back to the GitHub REST API via `WebFetch`:
`https://api.github.com/repos/kal-a-1/claude-code-ai-demo/issues/$ARGUMENTS`

Read the issue carefully and identify:

- What frontend changes are needed (UI, components, routing, state)
- What backend changes are needed (endpoints, Prisma schema, business logic)
- Acceptance criteria / definition of done

If the issue is purely frontend or purely backend, only spawn the relevant agent.

## Phase 2 — Create Branch

Before spawning any agents, determine the branch type from the issue labels or content:

- Default to `feat` unless the issue is clearly a `fix`, `chore`, `refactor`, `test`, or `docs`

Create and check out the feature branch:

```
git checkout -b <type>/issue-$ARGUMENTS-<short-description>
```

Where `<short-description>` is a 2–4 word kebab-case summary of the issue title (e.g. `add-task-assignments`).

Confirm the branch is active before spawning any agents.

## Phase 3 — Shared Types

Before spawning any agents, review the issue analysis from Phase 1 and identify any types or interfaces that will be shared between frontend and backend (e.g. request/response shapes, enums, DTO contracts).

For each shared type:

1. Add it to `libs/track-shared/src/` (following existing conventions in that lib)
2. Export it from the lib's barrel file (`index.ts`)
3. Rebuild the shared library:
   ```
   npx nx build track-shared
   ```
4. Commit the shared types on the current feature branch before spawning agents

Brief the agents (in Phase 4) that these types already exist in `track-shared` and should be imported rather than redefined.

If the issue does not introduce any cross-boundary types, skip this phase and proceed directly to Phase 4.

## Phase 4 — Parallel Implementation

Spawn **both agents at the same time in a single message** (this triggers parallel execution).

**Before sending the prompts below, replace every `[…]` placeholder with the actual values you retrieved in Phase 1.** Do not forward placeholder text — interpolate the real issue title, body, your analysis, and the acceptance criteria inline.

**Frontend task** (subagent_type: frontend-dev):

```
Implement the frontend portion of this feature.

Issue title: [replace with actual title from Phase 1]
Issue description: [replace with actual full body from Phase 1]

Frontend work needed:
[replace with your analysis of frontend tasks]

Acceptance criteria:
[replace with the acceptance criteria from the issue]

When done, commit your work and return:
1. Your worktree branch name
2. A list of all files changed
3. A description of what was implemented
4. Any open questions for the tester
```

**Backend task** (subagent_type: backend-dev):

```
Implement the backend portion of this feature.

Issue title: [replace with actual title from Phase 1]
Issue description: [replace with actual full body from Phase 1]

Backend work needed:
[replace with your analysis of backend tasks]

Acceptance criteria:
[replace with the acceptance criteria from the issue]

When done, commit your work and return:
1. Your worktree branch name
2. A list of all files changed
3. All new/changed API endpoints (method, path, payload, response shape)
4. Any Prisma migrations that were run
5. Any open questions for the tester
```

Wait for both agents to return their summaries before proceeding.

## Phase 5 — Merge Worktrees

Once both agents have returned:

1. Note the branch names from each summary
2. Ensure you are on the feature branch (not inside either worktree):

   ```
   git checkout <feature-branch>
   ```

3. Merge the frontend branch:

   ```
   git merge <frontend-worktree-branch> --no-ff -m "feat: frontend for #$ARGUMENTS"
   ```

4. Merge the backend branch:

   ```
   git merge <backend-worktree-branch> --no-ff -m "feat: backend for #$ARGUMENTS"
   ```

5. If there are conflicts in shared files (e.g. `tsconfig.base.json`, `package.json`, `nx.json`), resolve them by combining both sets of changes — do not discard either agent's modifications
6. Confirm the working tree is clean and both agents' changes are present before running checks:

   ```
   git status
   git log --oneline -5
   ```

   If the working tree is not clean or either agent's commits are missing, stop and investigate before proceeding.

7. Verify the merged state:

   ```
   npx nx run-many --target=lint --all
   npx nx run-many --target=test --all
   npx nx run-many --target=build --all
   ```

   For each failure:
   - If the fix is obvious and localised (e.g. a missing import, a type mismatch, a lint rule), fix it and re-run the failing check
   - If the failure is non-trivial, ambiguous, or requires understanding intent (e.g. a broken test with unclear expected behaviour, a migration conflict), **stop and ask the user** — do not guess or force a fix
   - Never skip or suppress checks (`--skip-nx-cache` is fine; `--no-verify`, `eslint-disable`, `@ts-ignore` are not)

8. Push the branch and open a pull request against `main` using the GitHub MCP tool `mcp__github__create_pull_request` with:
   - `owner`: `kal-a-1`
   - `repo`: `claude-code-ai-demo`
   - `title`: `feat: <short description> (closes #$ARGUMENTS)`
   - `body`: a summary of what was built (frontend + backend), what migrations were run, and any open questions from the agents
   - `head`: the current feature branch name
   - `base`: `main`

## Phase 6 — Parallel Test

Spawn **both agents at the same time in a single message** (this triggers parallel execution). Each agent runs in an isolated worktree and must merge its work back to the feature branch when done.

**E2E tester task** (subagent_type: tester, isolation: worktree):

```
Test the feature that was just implemented and merged.

Original GitHub issue:
[issue title and body from Phase 1]

Frontend dev summary:
[paste full frontend-dev output from Phase 4]

Backend dev summary:
[paste full backend-dev output from Phase 4]

You are running in an isolated worktree. When your tests are written and committed:
1. Note your worktree branch name
2. Merge it back to the feature branch:
   git checkout <feature-branch>
   git merge <worktree-branch> --no-ff -m "test: e2e for #$ARGUMENTS"
3. Return a full structured test report.
```

**Accessibility tester task** (subagent_type: ally-tester, isolation: worktree):

```
Run accessibility tests for the feature that was just implemented and merged.

Original GitHub issue:
[issue title and body from Phase 1]

Frontend dev summary:
[paste full frontend-dev output from Phase 4]

You are running in an isolated worktree. When your tests are written and committed:
1. Note your worktree branch name
2. Merge it back to the feature branch:
   git checkout <feature-branch>
   git merge <worktree-branch> --no-ff -m "test(a11y): accessibility tests for #$ARGUMENTS"
3. Return a full structured accessibility report.
```

Wait for both agents to return before proceeding.

Once both agents have returned and merged their branches back, remove the test worktrees:

```
git worktree remove <tester-worktree-path> --force
git worktree remove <ally-tester-worktree-path> --force
git worktree prune
```

Then push the feature branch to remote so the test commits are included in the PR:

```
git push origin <feature-branch>
```

## Phase 7 — Merge

Review the reports from both agents:

- If the **E2E report is clean** (no test failures):
  1. Merge the PR using the GitHub MCP tool `mcp__github__merge_pull_request` with:
     - `owner`: `kal-a-1`
     - `repo`: `claude-code-ai-demo`
     - `pull_number`: the PR number opened in Phase 5
     - `merge_method`: `squash`
  2. Close the original issue using `mcp__github__update_issue` with:
     - `owner`: `kal-a-1`
     - `repo`: `claude-code-ai-demo`
     - `issue_number`: $ARGUMENTS
     - `state`: `closed`
  3. Report to the user: what was built, that E2E checks passed, and that the PR was merged and the issue closed.
     - If the accessibility report found violations: note the GitHub issue(s) filed and confirm they do not block the merge.
     - If the accessibility report found no violations: note that explicitly ("No accessibility violations found.").

- If the **E2E report has failures**:
  1. Do not merge
  2. Present to the user:
     - What was built (combined frontend + backend summary)
     - Which E2E tests failed and why
     - Any accessibility violations and GitHub issues filed
     - Recommended next steps to unblock the merge
