---
description: Fetch a GitHub issue via the GitHub MCP server and implement the feature using parallel frontend and backend subagents. Invoke with /implement-issue <issue-number>.
---

# Implement Issue: $ARGUMENTS

## Phase 0 — Validate Input

Before doing anything else, check that `$ARGUMENTS` is a positive integer (digits only, no spaces, greater than zero).

If it is missing or invalid, stop immediately and tell the user:

```
Usage: /implement-issue <issue-number>
Example: /implement-issue 42

"$ARGUMENTS" is not a valid issue number. Please provide a positive integer.
```

Do not proceed to Phase 1 until this check passes.

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
- Whether E2E tests are explicitly requested (look for phrases like "e2e", "end-to-end", "playwright", "integration test", or a checklist item calling for automated tests)

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

## Phase 3 — Shared Types & API Contracts

Spawn the **architect agent** (subagent_type: architect) with the following prompt. Replace every `[…]` placeholder with the actual values from Phase 1 before sending — do not forward placeholder text.

```
Design the API contract and shared types for this feature.

Issue number: [replace with issue number]
Issue title: [replace with actual title from Phase 1]
Issue description: [replace with actual full body from Phase 1]

Feature analysis:
- Frontend work needed: [replace with your Phase 1 frontend analysis]
- Backend work needed: [replace with your Phase 1 backend analysis]

Acceptance criteria:
[replace with the acceptance criteria from the issue]
```

Wait for the architect agent to return before proceeding.

Verify the contract file was committed by running:
```
git log --oneline -- docs/api-contracts/issue-$ARGUMENTS.md
```
If the file is missing from the log, the architect did not reach its commit step — check whether `npx nx build track-shared` failed before the commit. Do not proceed to Phase 4 without it.

## Phase 4 — Parallel Implementation

Spawn **both agents at the same time in a single message** (this triggers parallel execution).

**Before sending the prompts below, replace every `[…]` placeholder with the actual values you retrieved in Phase 1 and the architect output from Phase 3.** Do not forward placeholder text — interpolate the real issue title, body, your analysis, acceptance criteria, and the full API contract inline.

**Frontend task** (subagent_type: frontend-dev):

```
Implement the frontend portion of this feature.

Issue title: [replace with actual title from Phase 1]
Issue description: [replace with actual full body from Phase 1]

Frontend work needed:
[replace with your analysis of frontend tasks]

Acceptance criteria:
[replace with the acceptance criteria from the issue]

API contract and shared types:
Read the file docs/api-contracts/issue-[replace with issue number].md for the full
contract defined by the architect. Import shared types from 'track-shared' — do not
redefine them inline.

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

API contract and shared types:
Read the file docs/api-contracts/issue-[replace with issue number].md for the full
contract defined by the architect. Import shared types from 'track-shared' — do not
redefine them inline.

When done, commit your work and return:
1. Your worktree branch name
2. A list of all files changed
3. All new/changed API endpoints (method, path, payload, response shape)
4. Any Prisma migrations that were run
5. Any open questions for the tester
```

Wait for both agents to return their summaries before proceeding.

## Phase 5 — Merge Worktrees

Every agent (frontend-dev, backend-dev) runs in an isolated worktree, so their branches always need to be merged back — even when only one agent was spawned.

1. Note the worktree branch name(s) from the agent summary/summaries
2. Ensure you are on the feature branch (not inside any worktree):

   ```
   git checkout <feature-branch>
   ```

3. If a **frontend** agent was spawned, merge its branch:

   ```
   git merge <frontend-worktree-branch> --no-ff -m "feat: frontend for #$ARGUMENTS"
   ```

4. If a **backend** agent was spawned, merge its branch:

   ```
   git merge <backend-worktree-branch> --no-ff -m "feat: backend for #$ARGUMENTS"
   ```

5. If there are conflicts in shared files (e.g. `tsconfig.base.json`, `package.json`, `nx.json`), resolve them by combining both sets of changes — do not discard either agent's modifications
6. Confirm the working tree is clean and all agents' changes are present before running checks:

   ```
   git status
   git log --oneline -5
   ```

   If the working tree is not clean or any agent's commits are missing, stop and investigate before proceeding.

7. Delete the local worktree branches (merging does not remove them):

   ```
   git branch -D <frontend-worktree-branch>   # if frontend agent was spawned
   git branch -D <backend-worktree-branch>    # if backend agent was spawned
   ```

8. Verify the merged state:

   ```
   npx nx run-many --target=lint --all
   npx nx run-many --target=test --all
   npx nx run-many --target=build --all
   ```

   For each failure:
   - If the fix is obvious and localised (e.g. a missing import, a type mismatch, a lint rule), fix it and re-run the failing check
   - If the failure is non-trivial, ambiguous, or requires understanding intent (e.g. a broken test with unclear expected behaviour, a migration conflict), **stop and ask the user** — do not guess or force a fix
   - Never skip or suppress checks (`--skip-nx-cache` is fine; `--no-verify`, `eslint-disable`, `@ts-ignore` are not)

9. Push the branch and open a pull request against `main` using the GitHub MCP tool `mcp__github__create_pull_request` with:
   - `owner`: `kal-a-1`
   - `repo`: `claude-code-ai-demo`
   - `title`: `feat: <short description> (closes #$ARGUMENTS)`
   - `body`: a summary of what was built (frontend + backend), what migrations were run, and any open questions from the agents
   - `head`: the current feature branch name
   - `base`: `main`

## Phase 6 — Parallel Test

**Accessibility tests always run** for any issue that includes frontend changes.

**E2E tests only run if explicitly requested** in the issue (e.g. the issue body mentions "e2e", "end-to-end", "playwright", or has a checklist item for automated tests). If E2E was not requested, skip the E2E tester agent entirely.

Spawn the applicable agent(s) at the same time in a single message. Each agent runs in an isolated worktree — instruct them only to commit and return their branch name. The orchestrator owns all merges.

**E2E tester task** — only if E2E was requested (subagent_type: tester, isolation: worktree):

```
Test the feature that was just implemented and merged.

Original GitHub issue:
[issue title and body from Phase 1]

Frontend dev summary:
[paste full frontend-dev output from Phase 4]

Backend dev summary:
[paste full backend-dev output from Phase 4]

When your tests are written and passing, commit them and return:
1. Your worktree branch name
2. A full structured test report.

Do NOT merge your branch — the orchestrator will handle that.
```

**Accessibility tester task** — always run for frontend changes (subagent_type: ally-tester, isolation: worktree):

```
Run accessibility tests for the feature that was just implemented and merged.

Original GitHub issue:
[issue title and body from Phase 1]

Frontend dev summary:
[paste full frontend-dev output from Phase 4]

When your tests are written and committed, return:
1. Your worktree branch name
2. A full structured accessibility report.

Do NOT merge your branch — the orchestrator will handle that.
```

Wait for all spawned agents to return before proceeding.

Once all agents have returned, merge each worktree branch back to the feature branch:

```
git checkout <feature-branch>
git merge <e2e-worktree-branch> --no-ff -m "test: e2e for #$ARGUMENTS"        # if E2E was spawned
git merge <ally-worktree-branch> --no-ff -m "test(a11y): a11y for #$ARGUMENTS" # if ally-tester was spawned
```

Then remove the worktrees and delete the local worktree branches:

```
git worktree remove <worktree-path> --force   # repeat for each spawned agent
git worktree prune
git branch -D <e2e-worktree-branch>           # if E2E was spawned
git branch -D <ally-worktree-branch>          # if ally-tester was spawned
```

Then push the feature branch to remote so the test commits are included in the PR:

```
git push origin <feature-branch>
```

## Phase 7 — Report

Present a summary to the user covering:

- **What was built** — combined frontend + backend summary from Phase 4
- **Tests** — whether E2E ran and the outcome (pass / fail / skipped); if failures, list them and suggest next steps
- **Accessibility** — violations found and any GitHub issues filed, or "No accessibility violations found.", or "Accessibility tests skipped" if no frontend changes
- **PR** — link to the pull request opened in Phase 5

Do not merge the PR. Merging is the user's decision.
