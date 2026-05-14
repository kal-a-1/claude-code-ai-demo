---
name: code-review
description: >
  Performs a structured code review of the current git branch compared to main.
  Use this skill whenever the user asks for a code review, PR review, branch review,
  or wants feedback on their changes. Also trigger when the user says things like
  "review my code", "check my branch", "what do you think of my changes", or
  "review this against main". Supports four review modes: friendly (encouraging,
  minor issues only), ruthless (exhaustive, no mercy), security (focused on
  vulnerabilities and risk), and a11y (focused on accessibility standards and
  inclusive design). Default to friendly if no mode is specified.
---

# Code Review Skill

Perform a thorough code review of the current branch's changes against `main`.
The review style is driven by the **mode** argument — read it carefully before
starting, because it shapes tone, depth, and what you look for.

---

## Step 0 — Guard: check current branch

Run:

```bash
git rev-parse --abbrev-ref HEAD
```

If the output is `main`, stop immediately and tell the user:

> You're already on `main`. Switch to a feature branch and re-run the review.

Do not proceed further.

---

## Step 1 — Determine the mode

Check the user's request for one of these mode keywords:

| Mode | Alias(es) | Intent |
|---|---|---|
| `friendly` | easy-going, chill, light, quick | Encouraging tone, flag only meaningful issues, skip nitpicks |
| `ruthless` | strict, brutal, thorough | Exhaustive, no sugar-coating, every issue surfaced |
| `security` | sec, audit | Laser-focused on vulnerabilities, secrets, attack surface |
| `a11y` | accessibility, wcag | Focused on inclusive design, ARIA, keyboard nav, contrast |

If no mode is given, **default to `friendly`** and tell the user.

---

## Step 2 — Gather the diff

Run the following to get the changes on the current branch vs main:

```bash
git fetch origin main 2>/dev/null || git fetch 2>/dev/null; \
git diff $(git merge-base HEAD origin/main 2>/dev/null || git merge-base HEAD main) HEAD
```

If that fails, fall back to:

```bash
git diff main...HEAD
```

Also get the list of changed files for context:

```bash
git diff --name-status $(git merge-base HEAD origin/main 2>/dev/null || git merge-base HEAD main) HEAD
```

And the commit log for intent:

```bash
git log main..HEAD --oneline
```

If the diff is empty, tell the user there are no changes compared to `main` and stop.

---

## Step 3 — Perform the review

Analyse the diff through the lens of the active mode. Use the guidelines below.

### friendly mode
- Lead with what's working well — be genuine, not sycophantic
- Only raise issues that would cause bugs, data loss, or major confusion
- Skip style nitpicks, minor naming opinions, and micro-optimisations
- Tone: friendly peer, not a gatekeeper
- End with an overall "looks good to me" or "one or two things to address"

### ruthless mode
- Leave no stone unturned: logic, naming, structure, duplication, performance, error handling, tests, types, comments
- Call out anything that would make you pause in a real PR
- Don't soften criticism — be direct but professional
- Group issues by severity: 🔴 Blocker / 🟡 Should Fix / 🔵 Suggestion
- End with an honest overall verdict

### security mode
Focus exclusively on:
- Secrets, tokens, API keys accidentally committed
- Input validation and sanitisation (XSS, SQLi, path traversal, etc.)
- Authentication and authorisation gaps
- Insecure dependencies or imports
- Unsafe use of `eval`, `exec`, `innerHTML`, dynamic queries, etc.
- Over-permissive CORS, headers, or file permissions
- Sensitive data in logs, errors, or responses
- Rate limiting and abuse vectors

Use severity: 🔴 Critical / 🟡 Medium / 🔵 Low
Skip non-security issues entirely.

### a11y mode
Focus exclusively on:
- Missing or incorrect ARIA roles, labels, and descriptions
- Keyboard navigation (focus order, trap, visible focus ring)
- Colour contrast (WCAG AA minimum 4.5:1 for text)
- Images missing `alt` text; decorative images without `alt=""`
- Form inputs missing associated `<label>` or `aria-label`
- Interactive elements that aren't reachable by keyboard
- Dynamic content not announced to screen readers
- Motion/animation respecting `prefers-reduced-motion`
- Semantic HTML usage (headings hierarchy, landmark regions)

Reference WCAG 2.1 level AA as the baseline.
Skip non-accessibility issues entirely.

---

## Step 4 — Output format

Start with a header block:

```
## Code Review — [mode] mode
Branch: <current branch name>
Base:   main
Files:  <N changed> | +<additions> -<deletions>
Commits: <one-line list>
```

Then structure findings using this template (adapt headings to the mode):

```
### Summary
<2–3 sentence overall impression>

### Findings

#### [File or area name]
- **[Severity icon] Issue title**
  Description of the problem and why it matters.
  ```
  // relevant code snippet (keep short)
  ```
  Suggestion: what to do instead (if applicable)

### Overall verdict
<honest, mode-appropriate conclusion>
```

For **friendly**: keep findings concise, lead with positives.
For **ruthless**: be thorough, use all three severity tiers.
For **security / a11y**: group by severity, omit unrelated findings.

---

## Tips

- If the diff is very large (>1000 lines), tell the user and focus on the most
  impactful files rather than exhaustively listing every line.
- If you can't determine the base branch, ask the user before proceeding.
- When suggesting fixes, show the corrected code where it adds clarity.
- Don't invent issues — only raise things visible in the diff or inferable from
  clear context (e.g. a missing null check on a value you can see is nullable).
