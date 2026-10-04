# Working Professionally with Claude and Coding Agents

A checklist of the habits that separate casual use of Claude from professional use. It covers Claude Code (CLI and desktop app), the claude.ai chat surface, and building your own agents on the Claude API and Agent SDK. The first three sections are tiers: Basics, Intermediate, Pro. The sections after them are topics that cut across tiers: token economy, model routing, chat, the API, and the house rules this team works by.

How to use it: tick what you already do consistently. Whatever stays unticked is your next skill to build. Items marked **House rule** come from Marc's working rules, which agents load from `~/.claude/CLAUDE.md`; they are restated in full in the House rules section so the team reads the same text the agents do. Everything else is general practice.

Last revised 2026-10-04. Verified against Claude Code 2.1, graft 0.21.1, CodeGraph 1.6.1, Vercel CLI 62.2, and the Claude API model lineup of September 2026.

## Basics

The habits that matter from the first session. None of them need configuration.

### Before you type

- [ ] **Write the task like a ticket.** State the goal, the constraints, and what "done" looks like in one message. Agents fill gaps with guesses, and the acceptance criteria you leave out are the ones that get guessed wrong.
- [ ] **Point to context instead of pasting it.** Name the files, functions, error messages, or URLs. The agent reads them itself for fewer tokens than a pasted wall of text, and it reads the current version instead of a stale copy.
- [ ] **Say what not to touch.** Out-of-scope files, public interfaces, migrations, anything with a deploy dependency. One sentence of scope saves an hour of unwinding.
- [ ] **Ask for a plan first on anything non-trivial.** In Claude Code, cycle into plan mode with Shift+Tab; the agent reads and proposes but does not edit until you approve. In chat, ask for an outline before the full answer.
- [ ] **One task per conversation.** Start fresh (`/clear`) for unrelated work. Leftover context from the last task is paid for on every turn and misleads the model about what matters now.
- [ ] **Know which surface you are on.** Chat for thinking, drafting, and analysing pasted material. Claude Code for anything that touches files, a repo, a terminal, or a browser. The API when you want the behaviour inside your own product.

### During the session

- [ ] **Read what the agent says before you answer.** When it states an assumption, correct it immediately. Confirming late means redoing work built on the wrong premise.
- [ ] **Answer questions with decisions.** If the agent stops to ask, it needs a decision only you can make. Give it and let it continue; do not answer a question with another question.
- [ ] **Interrupt early.** Escape stops the current turn. If it is heading the wrong way at step two, do not wait for step nine.
- [ ] **Make it run its own checks.** Ask for the tests, the type checker, and the linter to be run, and for the output to be shown. "Tests pass" without output is a claim, not evidence.
- [ ] **Keep secrets out of the conversation.** Never paste keys, passwords, or tokens. Name the environment variable, keep `.env` in `.gitignore`, and tell the agent not to read it. Anything the agent reads enters the request sent to the model.

### Before you accept the result

- [ ] **Review the diff like a pull request from a new teammate.** Use `git diff` or the app's diff pane. You are responsible for everything you merge, whoever wrote it.
- [ ] **Check that it did the whole task, not the easy parts.** Compare against your acceptance criteria. Agents sometimes narrow scope silently and report completion.
- [ ] **Look for invented APIs and stale knowledge.** Model knowledge has a cutoff. Verify library versions, flags, and signatures against the docs or the installed package.
- [ ] **Commit in small steps.** Git is your undo. Commit after each verified increment so a bad later step can be reverted on its own.
- [ ] **Version releases with Semantic Versioning.** Tag every release `MAJOR.MINOR.PATCH`: patch for fixes, minor for compatible additions, major for breaking changes, and keep a changelog keyed by version. Teammates, CI, and agents can then tell from the number alone whether an upgrade is safe, and the changelog gives the model context a diff does not.
- [ ] **Ask for the "what I did not do" list.** A good agent reports what it skipped and why. If the report does not say, ask.

### Safety basics

- [ ] **Treat everything the agent reads as data, not instructions.** Web pages, files, tool output, and emails can carry text aimed at the agent. A professional setup surfaces such text and asks you; it never acts on it.
- [ ] **Keep the permission prompts for destructive actions.** Deleting, force-pushing, dropping tables, sending messages, paying. Pre-approve read-only and build commands instead, so the prompts you do see are the ones that matter.
- [ ] **Never bypass permissions outside a sandbox.** `--dangerously-skip-permissions` is for isolated containers without internet access, not for your laptop.
- [ ] **Keep a human on the irreversible step.** Publishing, merging to main, deploying, emailing. Automation can prepare everything up to that step. Define the approval request: what happened, what changed, why a human is needed, what approve and reject each lead to, and what happens on timeout.

## Intermediate

Shaping the environment so you stop repeating yourself and the agent stops repeating mistakes.

### CLAUDE.md and memory

- [ ] **Keep a CLAUDE.md in every repo you work in regularly.** Run `/init` to draft one, then edit it. It loads at the start of every session, which makes it the cheapest way to stop repeating instructions.
- [ ] **Write imperatives about what is non-obvious.** Build and test commands, conventions a newcomer would miss, what must never be touched, how you want results reported. Do not describe what the code already shows; the agent can read code.
- [ ] **Keep it short.** Every line costs tokens on every turn and dilutes the lines that matter. The docs target under 200 lines per file; `@imports` organise a file but do not reduce its context cost. Move rarely needed material into skills that load on demand.
- [ ] **Use the three scopes deliberately.** `~/.claude/CLAUDE.md` for how you work everywhere, `<repo>/CLAUDE.md` for the project, and directory-level files for subsystems with their own rules.
- [ ] **Promote the third correction.** The third time you correct the same behaviour in chat, it belongs in CLAUDE.md or a hook. Delete rules that are stale or contradict each other: with two conflicting lines Claude may follow either, and `/doctor prompt-audit` finds them. The `claude-md-improver` skill also reviews the file for stale or contradictory lines.
- [ ] **Let memory hold facts, not rules.** Claude Code's auto-memory records project facts and preferences across sessions. Prune entries that go stale; a wrong memory is worse than none.
- [ ] **Run a fresh-session test on your repo.** Open a new session with no verbal context and ask five questions: what is this system, how is it organised, how do I run it, how do I verify it, where are we now. Every question it cannot answer from the repo alone is a gap in CLAUDE.md or the docs it points to.
- [ ] **Keep personal project preferences in CLAUDE.local.md and gitignore it.** Sandbox URLs, preferred test data, local paths. It loads alongside the project CLAUDE.md and is treated the same way; team rules stay in the committed file, and managed policy loads above both.
- [ ] **Keep auto-memory index entries to one line.** Only the first 200 lines or 25KB of MEMORY.md load per session; detail belongs in topic files Claude reads on demand. Do not let it store what the repo already shows.

### Context management

- [ ] **Watch context like a budget.** `/context` shows what is filling the window. Large tool outputs, pasted logs, and loaded MCP tool schemas are the usual culprits.
- [ ] **Compact at phase boundaries, not when forced.** Run `/compact` with a note of what to keep: after exploration and before implementation, or after a fix lands and before verification. Auto-compaction at an arbitrary point loses the details you needed most.
- [ ] **Never paste logs; point to them.** Save output to a file and let the agent `grep` or `tail` it. A log pasted once is paid for on every later turn.
- [ ] **Do not re-read a file you just edited.** The edit tool fails loudly if its target changed, so a re-read to "verify" is pure cost.
- [ ] **Prefer text over screenshots.** In a browser, reading the page text or accessibility tree is cheaper and more precise than a screenshot. Screenshot only for layout.
- [ ] **Prune connected MCP servers.** Each server's tool schemas can enter the context. Connect what the task needs and disable the rest; deferred tool loading helps, but fewer servers helps more.
- [ ] **Hand off to a fresh session before the window is full.** For work that outlasts one session, write the progress file and the decisions taken, then start clean and read it first, rather than compacting again and again. Compaction keeps what was done and tends to drop why; a fresh session has only what you wrote down.

### Skills, hooks, and permissions

- [ ] **Turn repeated procedures into skills.** A `SKILL.md` under `~/.claude/skills/<name>/` or inside the repo loads on `/<name>` or when its description matches the task. Deploy steps, review checklists, and repo-specific workflows all belong here.
- [ ] **Use hooks for things that must always happen.** Instructions are probabilistic; hooks are deterministic. Format on save, block `git push --force`, require a fact statement before shell commands. They live in `settings.json`.
- [ ] **Build a permission allowlist.** Pre-approve read-only commands (`git status`, `ls`, the test runner) in `.claude/settings.json` so prompts appear only for actions that deserve one. `/fewer-permission-prompts` scans your history and proposes the list.
- [ ] **Use worktrees for parallel work.** One git worktree per task or agent keeps edits from colliding. Subagents take `isolation: "worktree"`; your own session can enter one too.
- [ ] **Learn the keyboard.** Shift+Tab cycles permission modes and plan mode; Escape interrupts; `/model`, `/cost`, `/clear`, `/compact`, and `/context` cover most daily operations. Set effort with the `--effort` flag or the app's model controls.

### Delegation to subagents

- [ ] **Delegate reading-heavy searches.** Spawn a read-only explorer agent to sweep many files and return a conclusion with `file:line` pointers. The file dumps stay in its context, not yours.
- [ ] **Give subagents a complete brief.** They do not see your conversation. Include the goal, the files, the acceptance criteria, the gates to run, and the instruction not to ask questions or hand the task back.
- [ ] **Size the model to the task.** Haiku for mechanical sweeps, Sonnet for bounded implementation, the top model for judgment. State the model and the reason each time. (House rule)
- [ ] **Launch independent agents in one message.** Serial spawning wastes wall-clock time. Agents that share no files can run together and finish together.
- [ ] **Define reusable agents once.** Agent files in `.claude/agents/*.md` carry model, effort, and tools in their frontmatter, so the brief is the only thing that varies.
- [ ] **Synthesise before you delegate.** Read the explorer's findings and write the implementer a precise spec: which of the three flows, which approach, what to return. "Based on your findings, fix it" hands the hardest thinking to a worker with the least context.
- [ ] **Keep delegation one level deep unless you mean otherwise.** By default a subagent can spawn its own subagents three layers down, each with a fresh context you pay for and cannot see. Set `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1`, or omit `Agent` from a worker's `tools`, so help requests come back to the orchestrator.

### Model and effort

- [ ] **Know the lineup and the prices.** See the model table in the API section. Price ratios drive routing: the top model costs five times Sonnet per output token.
- [ ] **Turn effort before switching models.** Effort (`low` to `max`) trades thoroughness for tokens within one model. `xhigh` is the Claude Code default for coding; `low` suits mechanical work and most subagents.
- [ ] **Strong orchestrator, cheap hands.** The session that holds the task and makes judgment calls runs on the top model; the agents that do bounded work run cheaper.
- [ ] **Fast mode is the same model at a premium.** `/fast` raises output speed, not capability. Use it for interactive sessions where latency hurts, not for batch work.

### Verification habits

- [ ] **Own tests while working, full suite once at the end.** Run only the test files that cover what you are changing; run the whole suite as the final gate, and again only if that run failed and you changed something. (House rule)
- [ ] **Ask for proof in the final message.** Test output, a screenshot, a `curl` result. Verified and done are different states; make the agent say which one it reached.
- [ ] **Run a second-opinion review.** `/code-review` on the diff for bugs, `/simplify` for cleanup, `/security-review` before merging anything that touches input, auth, or secrets.
- [ ] **Write a definition of done the agent can execute, in order.** Static checks, then unit and integration tests, then one run of the real flow (start the app, hit the endpoint, show the output). Green mocked unit tests do not prove a cross-component change; a change is not done until the last level it needs has passed.
- [ ] **Separate the author from the reviewer.** Review in a fresh session or with a different agent. The one that wrote the code shares its blind spots, and a subagent starts with a fresh context, which is why it makes a better reviewer than the session that wrote the code.

## Pro

Orchestration, automation, and governance. These items assume you already do everything above.

### Multi-agent workflows

- [ ] **Producer plus independent verifier, always.** One stage produces, a separate stage attacks the result and repairs what it finds. Never let the producer check its own work. (House rule)
- [ ] **Prefer a deterministic oracle over a model judge.** Tests, round-trips, byte-exact baselines, a reference implementation. When correctness is decidable, let code decide and put a cheap model on the work. (House rule)
- [ ] **Open every agent prompt with a settled preamble.** The harness relays your latest chat message to subagents; without the preamble an agent reads a conversational message and stops to ask. State what it must not do and which gates it must run. (House rule)
- [ ] **Guard against placeholder results.** An agent whose structured output is rejected may resend a valid but empty stub, which the runtime counts as success. Validate substance in the script, and read the journal before paying for a re-run. (House rule)
- [ ] **One worktree per parallel track.** Tracks run in parallel only if they share no files and no CPU-sensitive measurement; otherwise one queues behind the other's merge. (House rule)
- [ ] **Scope by budget, not by ambition.** Check the quota before launching, say what the run will cost, report spend against the ceiling at the end. One well-scoped workflow beats three thin ones. (House rule)
- [ ] **Bring decisions back as evidence.** When a stage surfaces a decision for the owner, present the measurement that settles it and the options with consequences. Record the answer and the claims that failed verification. (House rule)
- [ ] **Use the Workflow tool for deterministic orchestration.** A script with `pipeline`, `parallel`, and `agent` calls, phases, and schema-checked outputs. It runs only when the user opts in, because it can spend dozens of agents' worth of tokens.
- [ ] **Agree a short contract before a long build.** Before code is written, the builder and the reviewer agree in text what "done" means for this chunk: scope, how each part is verified, and what is out of scope. The reviewer scores against the same list, so nothing is rejected for a foreseeable reason.
- [ ] **Give the reviewer agent a rubric and calibrate it against your own judgment.** Fixed categories (correctness, evidence that checks ran, scope discipline, survives a restart, handoff readiness) and a verdict of accept, revise or block. Agents asked to grade work praise it; a reviewer may name a real issue and then talk itself into approving. Read its transcripts, find where its verdict diverged from yours, and tighten its prompt for that case.

### Long-running and multi-session work

- [ ] **Run setup as its own session before feature work.** The first session only makes the project runnable and verifiable: dependencies install, one test passes, an init script holds the start and verify commands, the work is broken into a feature list, and a clean baseline commit exists. Scaffolding and the first feature do not share a session.
- [ ] **Keep a machine-readable feature list for multi-session work.** One JSON file in the repo where each item has the user-visible behaviour, the exact verification steps, a status (not started, in progress, blocked, passing) and an evidence field. The agent picks the next item from it; the file, not the chat, says what is done. JSON over Markdown: the model is less likely to rewrite it.
- [ ] **Do not let the agent grade itself on the feature list.** Passing requires the recorded verification to have run, with the output attached. Tell it that status changes only after the check, and that deleting, weakening or rewriting tests or feature entries to hide unfinished work is unacceptable; where you can, put tests and eval scripts behind a `permissions.deny` rule so the working agent cannot edit the judge.
- [ ] **Limit work in progress to one feature.** Write it into CLAUDE.md: finish and verify the current feature before starting the next, and do not refactor something else on the side. Given a broad brief, an agent tends to start several things at once and leave all of them half done.
- [ ] **Keep a progress file the next session reads first.** A short repo file with the verified state, what changed, what is broken or unverified, the next best step and the exact start and verify commands. CLAUDE.md tells the agent to read it at the start and to update and commit it before it stops; nothing updates it automatically. A scheduled run that starts from a fresh clone needs the same file.
- [ ] **Give the agent a fixed start-of-session routine.** In CLAUDE.md: `pwd`, read the progress file and the feature list, `git log --oneline -5`, run the init script, run a smoke check. If the baseline is already broken, fix that before any new work.

### Headless and scheduled runs

- [ ] **Use print mode for scripted runs.** `claude -p "<prompt>"` is non-interactive; add `--output-format json` for machine-readable results, `--allowedTools` to constrain, and `--bare` for minimal CI runs without hooks or plugin sync.
- [ ] **Schedule routines for recurring work.** Cloud scheduled agents (`/schedule`) handle nightly reports and dependency checks. `/loop` polls a slow external state within a session; it is not for one-off tasks.
- [ ] **Give CI agents only the tools they need.** Allowlists, read-only tokens, and no push rights unless pushing is the job.
- [ ] **Log every run.** Transcript, cost, outcome. Review the failures weekly; they are the cheapest source of CLAUDE.md and hook improvements.
- [ ] **Choose between a goal and a loop by asking whether the work has an end.** A finish line (all tests in `test/auth` pass, the backlog is empty) is a `/goal`: a separate small model checks the condition after every turn and the session keeps working until it is met or judged impossible. Something you only need to keep watching (is CI green) is a `/loop` on an interval. Both are session-scoped.
- [ ] **Write a goal the evaluator can read off the transcript.** One measurable end state, the command that proves it (`npm test` exits 0, `git status` is clean), the constraints that must hold on the way, and a bound such as "or stop after 20 turns". The evaluator does not run commands or read files; it judges only what the agent has surfaced, so make the agent print the proof.
- [ ] **Cap every unattended run.** In print mode, `--max-turns` and `--max-budget-usd` stop a runaway session, and subagent spend counts toward the budget; in a `/goal`, put the turn or time bound in the condition; a recurring `/loop` expires after seven days by design. A loop with no cap turns one stuck test into an all-night bill.
- [ ] **Match the schedule layer to how long the work must survive.** `/loop` needs the session open, runs at a one-minute minimum and expires after seven days; a desktop scheduled task runs while your machine is on, also down to one minute; a cloud routine (`/schedule`) runs with your machine off from a fresh clone, one hour minimum, triggered by a schedule, an API call, or a GitHub event.

### Hooks as gates

- [ ] **Encode invariants as blocking hooks.** A PreToolUse hook that refuses destructive git, demands a fact statement before shell commands, or requires a test run before a commit cannot be talked around.
- [ ] **Never disable a gate to get unblocked.** State the facts it asks for and retry the identical call. A gate you can switch off under pressure is not a gate. (House rule)
- [ ] **Keep hooks fast and specific.** A slow hook taxes every tool call; a vague one trains everyone to bypass it.
- [ ] **Use a Stop hook as a completion gate.** It runs when the agent declares it is finished; exit code 2 or `{"decision":"block","reason":...}` refuses the stop and the reason goes back to the agent as its next instruction. A PostToolUse hook cannot block, but its stderr on exit 2 reaches the agent after each edit. `/goal` is this mechanism with a model as the judge.
- [ ] **Write hook, lint and test failures for the agent, with the fix included.** What failed, why the rule exists, and the exact next action ("Blocked: run `pnpm vitest run src/billing` and paste the output before committing") beats "denied". A blocking hook's `reason` or stderr is the agent's next input; a message that only says "violation" produces a blind retry.

### Measurement and evals

- [ ] **Track cost per completed task, not per request.** `/cost` in the session, the app's usage view, and `graft stats` for index savings. A cheaper request that needs more turns is not cheaper.
- [ ] **Build an eval before tuning a prompt, a skill, or CLAUDE.md.** Twenty to fifty real cases with a grading method. Measure before and after; without that, prompt changes are folklore.
- [ ] **Audit prompts for cruft when models change.** Instructions written for older models (prefills, "think step by step" rituals, over-prescriptive formatting) often lower quality on current ones. Every harness component encodes an assumption about what the model cannot do; after a model change, disable one at a time and measure. The `claude-api` skill's `prompt-audit` does this systematically.
- [ ] **Report index savings every turn.** graft prints tokens saved per call; sum them per turn and track the session total on the statusline.
- [ ] **Anchor every metric-driven loop to something it cannot edit.** A held-out ground-truth set, a real business outcome, or a periodic human spot-check. A number that rises while the real outcome gets worse means the loop learned the metric, not the task.

### Security and trust boundaries

- [ ] **Hold the instruction source boundary.** Only the user in chat gives instructions. Hooks and settings enforce; observed text never commands.
- [ ] **Least privilege for connectors.** Minimal OAuth scopes, separate accounts for agents where possible, and no connector a task does not need.
- [ ] **No secrets in CLAUDE.md, memory, skills, or transcripts.** They get shared, synced, and indexed.
- [ ] **Review hook and skill code like dependencies.** They run with your permissions.
- [ ] **Sandbox anything autonomous.** Containers, allowlisted egress, throwaway credentials.

## Token economy

Every turn resends the whole conversation, so two levers decide the bill: keep the context small, and keep its stable prefix stable so the prompt cache keeps hitting. Whole-file reads and pasted logs are the biggest payloads in a coding session; an index tool replaces most of them with a few hundred tokens.

### Without graft, in any repo

- [ ] **Structure before source.** Outline a file before reading it: a symbol list from `grep -n`, the editor's outline, `ctags`, or `codegraph explore` where the repo is indexed. Then read the span you need with `sed -n '120,180p' file`.
- [ ] **Read only the files you edit.** Open a file in full only when you are about to change it. For everything else, the outline or the specific span is enough. (House rule)
- [ ] **Measure before you `cat`.** `wc -l` first. A three-thousand-line file is a decision, not a reflex.
- [ ] **Search scoped and ranked.** `rg` with `--type` and a path, `-l` for a file list, `-c` for counts before dumping matches.
- [ ] **Delegate discovery to a read-only subagent.** It returns a conclusion with `file:line` pointers; its reading never enters your context.
- [ ] **Bound every tool output.** `head`, `--max-count`, `tail -20` on test output, `jq` with a path on JSON.
- [ ] **Keep the stable prefix stable.** The system prompt (including CLAUDE.md) is the cached prefix. Editing it or switching models mid-session resets the cache for the rest of the session.
- [ ] **Own tests while working, full suite once.** A full suite run mid-task is tokens spent on output you will not read. (House rule)
- [ ] **Compact with intent.** State what to keep and what to drop. A compaction that keeps the plan and drops the exploration is worth more than one that keeps everything half-remembered.
- [ ] **Avoid screenshot loops.** One screenshot to orient, then text extraction. Repeated screenshots of the same page are the most expensive way to read it.

### With graft

graft keeps a `graft/` directory at the repo root: a prebuilt graph of every symbol with its `file:line` span, who calls what, and short prose cards per area. Each query costs a few hundred tokens, needs no API key, returns in under a second, and refreshes itself before answering so it always describes the code as it is right now, uncommitted edits included.

- [ ] **Install once per repo.** `npm i -g @nanonets/graft@latest`, then `graft init` in the repo. On npm 12 and later, global installs block native build scripts by default, which leaves graft unable to load its parsers; rerun the install with `--allow-scripts=` listing the packages npm names in its warning. For Claude Code it writes the instruction file, hooks, statusline, and MCP server wiring; `graft build` builds the free wiring graph. `--deep` adds an LLM concept map; skip it unless asked.
- [ ] **One call per question; pick the tool that fits.** Use the table below. Most tasks need exactly one graft call; chaining tools "hoping for more" is the main way to waste the savings.
- [ ] **`graft ask "<question>" --source` is the default.** Ranked hits with the crux of each definition inlined, so the result is the code you need with no follow-up read. `--in <path>` scopes; `--full` only when the crux is too small to act on.
- [ ] **`graft grep "<pattern>"` when you need every occurrence.** Hits grouped by enclosing symbol and ranked by coupling. Search a bare name, not a guessed signature; if it misses, loosen the pattern before falling back to raw grep.
- [ ] **`graft skeleton <file>` before touching a file.** Signatures only, about 200 tokens, roughly ten times cheaper than reading the file.
- [ ] **`graft callers <symbol> --depth 2` before changing a signature.** Precomputed edges, not a text search. `--depth all` before any refactor or multi-file change; `--direction out` for what a symbol depends on.
- [ ] **`graft map` to orient in a cold repo.** Then read the hub cards it names. Do not skeleton or ask your way through every subsystem it lists.
- [ ] **Never pipe graft through `head`, `tail`, or `sed -n`.** Output is already capped and says what it dropped. Clipping it loses hits and the savings line the statusline total is parsed from.
- [ ] **Trust the spans.** A node's `covers:` list is generated from source and authoritative. Do not re-open files to double-check it.
- [ ] **Report what graft saved, every turn.** Each tool opens with `[graft] tokens saved ≈ N`. Sum them in the reply; `graft stats` shows the session mix.
- [ ] **Wire it into CI.** `graft check` fails when the index is stale; `graft blast --format markdown` posts the blast radius of a diff as a PR comment with a diagram.
- [ ] **In worktrees, query from the main checkout.** The index lives there. Agents use it read-only and edit their own copy. (House rule)
- [ ] **In a monorepo, scope with `--in <scope>/`.** Hits carry a scope label; ranking is fair across sub-projects, but narrowing still saves tokens.
- [ ] **Keep graft current.** `graft version` compares the installed build with npm; `graft upgrade` applies it. Restart the agent after upgrading. CodeGraph upgrades with `codegraph upgrade`, then `codegraph sync` in each indexed repo.

| When you are... | Reach for | Calls |
|---|---|---|
| Onboarding, "explain this codebase" | `graft map`, then read the hub cards it names | 1 |
| Understanding a flow, "how does X work" | `graft ask "<flow>" --source` | 1 |
| Finding where a change belongs | `graft ask "where is <behaviour>" --source` | 1 |
| Editing a symbol you can already name | `graft grep "<symbol>"`, edit at the `file:line` | 1 |
| Renaming, deleting, changing a signature | `graft callers <sym> --depth 2` first | 1 |
| Refactor or multi-file change | `graft callers <sym> --depth all` before editing | 1 |
| "What does this depend on?" | `graft callers <sym> --direction out` | 1 |
| Every occurrence of a pattern | `graft grep "<literal>"` | 1 |
| "What is the API of this file?" | `graft skeleton <file>` | 1 |
| Debugging a failure in area X | `graft ask "<symptom>" --source`, then `callers` on the suspect | 1 to 2 |
| Judging a diff's risk before merge | `graft callers <changed sym> --depth 2` | 1 per symbol |

When the graft MCP server is connected, the same tools appear as `graft_find_code`, `graft_find_all`, `graft_file_api`, `graft_trace_calls`, `graft_repo_map`, and `graft_check_freshness`. Load them in one `ToolSearch` call, never one at a time.

### CodeGraph as the other index

- [ ] **If `.codegraph/` exists, use it before grep.** `codegraph explore "<question>"` returns the relevant symbols' source plus the call paths between them in one call; `callers`, `callees`, `impact`, and `affected` cover the rest. Do not run `codegraph init` on someone else's repo; indexing is the owner's decision.
- [ ] **Pick one primary index per repo.** Both tools give structure before source; running both doubles the tool schemas in context.

## Model usage optimization

Three levers, in order: context size (the previous section), effort, model tier. Judge by cost per completed task. A cheaper model that needs more turns, more retries, or a human fix is not cheaper.

### Routing by task kind

| Task kind | Model | Effort | Why |
|---|---|---|---|
| Grep sweeps, log scanning, applying a rename from a known map, formatting, boilerplate, extracting facts from one known file | Haiku 4.5 | low | High volume, low judgment; errors are cheap and visible |
| A component or test to a spec, a documented migration step, doc updates, changelog summaries, first-pass review | Sonnet 5.5 | medium (default) | Clear acceptance criteria bound the damage of a wrong answer |
| Architecture and design decisions, ambiguous migrations, root-cause debugging, security review, adversarial verification, final judgment over other agents' output | Opus 5.5, or the session's top model when quota allows | high or xhigh | A wrong answer is expensive to detect and undo |
| The interactive session that holds the whole task | The top model available | xhigh (Claude Code default) | It makes the judgment calls and writes the briefs for everyone else |

### Without graft

- [ ] **Strong orchestrator, cheap hands.** The session or script that holds the task runs on the top model; everything bounded runs on Sonnet or Haiku.
- [ ] **Tighten the brief so a cheaper model does not have to explore.** Exploration is where cheap models burn turns and go wrong. With `file:line` pointers and acceptance criteria, Sonnet does what Opus would.
- [ ] **Lower effort before lowering tier.** Measure on a sample of real tasks. The newest model at low effort often matches an older one at high.
- [ ] **Never downshift the verifier.** Verification is where wrong answers cost the most. Run it on the strongest model your quota allows, and check usage before launching. (House rule)
- [ ] **Avoid cascades that split the cache.** Prompt caches are per model. A multi-model cascade in an API app forfeits cache reuse across its models; one model at tuned effort usually wins.
- [ ] **Inherit the session model only when the task needs the top tier.** Default stages to what they need, not to what is running the workflow. (House rule)

### With graft

- [ ] **Let graft do the exploration, then route down a tier.** `graft ask --source` returns exact spans with the crux inlined, so a Sonnet agent can edit what previously needed Opus to find.
- [ ] **Hand Haiku the map, not the search.** `graft callers <sym> --depth all` is the complete list of sites for a rename. Give that list to a Haiku agent to apply mechanically; do not ask it to discover the list.
- [ ] **Lower effort on graft-backed lookups.** Fewer tool calls are needed, so extra deliberation buys little.
- [ ] **Keep tool results small to keep the cache warm.** graft outputs are capped; whole-file reads are the large payloads that push stable context out of the window.
- [ ] **Spend the savings on verification.** If graft saves tens of thousands of tokens a session, that is the budget for a stronger verifier, not for more exploration.

## Claude.ai chat and Projects

- [ ] **One Project per domain.** Project instructions carry the standing context; project knowledge carries the documents. Both load without being pasted into every chat.
- [ ] **Outline first, then expand section by section.** Long single-shot answers hide structural problems until the end.
- [ ] **Show the output you want.** A short example of the format, tone, or table beats three paragraphs describing it.
- [ ] **Ask for sources and check them.** For facts, dates, and figures, ask where they come from and verify before reuse.
- [ ] **Use artifacts for anything you will reuse or share.** Documents, pages, diagrams, and small tools are better as artifacts than as chat text.
- [ ] **Move to Claude Code when the task touches files.** Repos, terminals, browsers, and anything that must be verified by running it belong in Code, not chat.
- [ ] **Use memory and styles deliberately.** Memory should hold stable facts about you and your work; styles should encode the voice you keep asking for.
- [ ] **Start a new chat when the topic changes.** Long chats carry the same context cost as long sessions.

## Building with the API and SDKs

For teams that put Claude inside their own product. Everything goes through one endpoint, `POST /v1/messages`; tools, structured outputs, and caching are features of that endpoint. The `claude-api` skill in Claude Code holds the current reference; the items below are the habits.

### Choose the simplest tier

- [ ] **Single call, then workflow, then agent.** Classification, extraction, and summarisation are one request. Multi-step pipelines with code-controlled logic are a workflow you orchestrate. Only open-ended, model-driven tool use is an agent.
- [ ] **Four criteria before building an agent.** Complexity (multi-step and hard to specify up front), value (worth the cost and latency), viability (Claude is capable at this task), cost of error (can it be caught and recovered). A "no" on any of them means stay simpler.
- [ ] **Know the four ways to build an agent.** A manual loop you own; the SDK Tool Runner that loops over tools you define; Managed Agents, where Anthropic runs the loop and hosts the sandbox; and the Claude Agent SDK, which is Claude Code as a library with built-in tools. The first, second, and fourth leave deployment to you.

### Request hygiene

- [ ] **Default to the current Opus with adaptive thinking.** `claude-opus-5-5` unless the user names another model. Thinking stays on; control depth with `output_config.effort`, and set it explicitly, because the default on Opus 5.5 is `medium`.
- [ ] **Stream anything long.** Do not lowball `max_tokens`: around 16k for non-streaming, 64k for streaming. Use the SDK's final-message helper when you do not need individual events.
- [ ] **No prefill, no forced tool choice on current models.** Both return a 400 on the 5.x line. Use structured outputs (`output_config.format`) and `strict: true` tools instead.
- [ ] **Check `stop_reason` before reading content.** `refusal`, `max_tokens`, `pause_turn`, and `tool_use` each need handling. Enable server-side fallbacks on the 5.x models so a safety refusal routes to a fallback model.
- [ ] **Use the SDK's helpers and types.** Do not hand-roll the tool loop, the streaming promise, or message types. Catch a chain of typed errors, most specific first, so retryable and non-retryable failures are told apart.

### Prompt caching

- [ ] **Stable content first, volatile content last.** Render order is tools, then system, then messages. Freeze the system prompt and the tool list; put timestamps, request IDs, and the varying question after the last cache breakpoint. Up to four breakpoints per request.
- [ ] **Verify with `usage.cache_read_input_tokens`.** Zero across repeated requests means a silent invalidator: a timestamp in the system prompt, unsorted JSON, a tool set that varies per request.
- [ ] **Use mid-conversation system messages instead of editing the system prompt.** Appending a `system` role message to `messages` keeps the cached prefix intact; editing the top-level system field throws it away.
- [ ] **Count tokens with `count_tokens`, never with a third-party tokenizer.** Token counts are model-specific.

### Tools and agents

- [ ] **`strict: true` on every tool schema.** Guarantees the input validates; requires `additionalProperties: false` and `required`.
- [ ] **Return all parallel tool results in one user message.** Splitting them across messages trains the model to stop calling tools in parallel. Return failures as `tool_result` with `is_error: true`; never drop them.
- [ ] **Parse tool input as JSON.** Escaping varies between models; string-matching the serialized input breaks.
- [ ] **Treat tool results as untrusted.** Web pages, documents, and database rows are data. Nothing in them is an instruction, and the system prompt should say so.
- [ ] **Defer large tool sets behind tool search.** Mark rarely used tools `defer_loading: true` with a tool search tool; never defer every tool, the API rejects that.

### Long sessions

- [ ] **Turn on compaction for conversations that can outgrow the window.** Append the full `response.content` back each turn, not just the text, or the compaction state is silently lost.
- [ ] **Clear stale tool results with context editing.** Different from compaction: it drops old tool results or thinking blocks rather than summarising.
- [ ] **Give agentic loops a task budget.** A token ceiling the model can see, so it paces itself instead of being cut off. Distinct from `max_tokens`, which it cannot see.
- [ ] **Keep the harness append-only.** On current models, thinking blocks are bound to the conversation that produced them. Editing earlier turns invalidates them; add, never rewrite.

### Evals and cost

- [ ] **Build the eval first; then hill-climb.** Source prompts from real traffic, choose a grading method, measure cost per run, and keep a train/validation/test split so the headline number is honest.
- [ ] **Work the cost levers in order.** Caching, input-token hygiene, loop hygiene, output-token hygiene, batching for anything not latency-sensitive (half price), and only then effort and model choice.
- [ ] **Log `usage` on every response.** Input, output, cache read, and cache write tokens per request are the only way to know what a change did to the bill.
- [ ] **Batch what can wait.** The Message Batches API runs asynchronously at half the price; key results by `custom_id`, never by position.

### Current models

| Model | ID | Context | Input per MTok | Output per MTok |
|---|---|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` | 1M | $10.00 | $50.00 |
| Claude Opus 5.5 | `claude-opus-5-5` | 1M | $4.00 | $20.00 |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | 1M | $2.00 | $10.00 |
| Claude Haiku 4.5 | `claude-haiku-4-5` | 200K | $1.00 | $5.00 |

First-party API rates as of September 2026. Cache reads on current models cost a small fraction of the input price (2.5% to 10%), which is why a stable prefix matters more than any other lever. Use the exact IDs above without date suffixes.

## House rules

The working rules Marc set for agents, kept in `~/.claude/CLAUDE.md` so every session and subagent loads them. They are restated here so the team reads the same text. Dates are when each rule was set.

### Model selection for spawned agents and workflows (2026-09-09, reinforced 2026-09-17)

- [ ] **Do not overspend on workflows; this is a hard rule.** Pick model and effort per task kind. Never overkill a simple task, never under-power a hard one.
- [ ] **Size every stage to what that stage needs.** Never default every stage to the orchestrator's model or to top effort because that is what is running the workflow.
- [ ] **Haiku, low effort** for mechanical, high-volume, low-judgment work: grep sweeps, log scanning, applying a rename from a known map, formatting, boilerplate, extracting facts from one known file.
- [ ] **Sonnet, default effort** for bounded implementation and research with clear acceptance criteria: a component or test to a spec, a documented migration step, doc updates, changelog summaries, first-pass review.
- [ ] **Opus or the session's top model, high effort** where a wrong answer is expensive: architecture and design decisions, ambiguous migrations, root-cause debugging, security review, adversarial verification, final judgment over other agents' output.
- [ ] **State the model and the reason for every stage and every subagent.** No exceptions.

### How to deploy workflows (2026-09-20)

- [ ] **Producer plus independent verifier, always.** The verifier repairs what it finds rather than only reporting. The verifier runs on Fable when quota allows, Opus otherwise; check `mcp__ccd_session_mgmt__get_usage` before launching, and never leave a stage on the default model when the session model is near its limit.
- [ ] **Prefer a deterministic oracle over a model verifier.** An assembler, a reference implementation, a round-trip, a byte-exact baseline. Oracle-backed tracks need no expensive verification stage.
- [ ] **Every producer prompt opens with a SETTLED preamble.** Recent user messages are addressed to the orchestrator; do not ask questions, do not wait, do not hand the task back; never run `gh`, `git commit`, `git push`, or `git checkout`; never disable the GateGuard hook; no new third-party dependencies; run the named final gates and report honestly.
- [ ] **Guard against placeholder results.** Tell agents: if the structured call is rejected, fix the JSON and resend the full result, never a placeholder. Validate substance in the script, for example `if (!r || r.summary.length < 120) throw`. Before paying for a re-run, read `journal.jsonl` and the agent transcript; a failed payload's first 2 KB survives in `__unparsedToolInput.raw`.
- [ ] **One git worktree per parallel track.** `git worktree add -b <branch> <path> origin/main`; each agent writes only inside its own. Index tools live in the main checkout and are used read-only from there.
- [ ] **Merge through the API while a workflow holds the main checkout.** `gh api -X PUT repos/<o>/<r>/pulls/N/merge -f merge_method=rebase`; `gh pr merge` switches the local branch. Never chain a branch delete after a merge command. Under strict status checks, merging is serial: merge main in and wait for the next check round; never rebase or force-push a PR the CI monitor is watching.
- [ ] **Scope by budget, not by ambition.** Check the weekly quota first and say what the run will cost. Report spend against the ceiling at the end of every run, and report the graft or CodeGraph token savings.
- [ ] **Bring decisions back as evidence, not as questions.** Present the measurement that settles it and the options with consequences; record the answer and the claims that failed verification.

### Context and test economy (2026-09-19)

- [ ] **Structure before source.** In graft-indexed repos, `graft skeleton <file>`, `graft grep`, and `graft callers` before opening anything. Where graft is absent, CodeGraph if indexed, otherwise a targeted grep for the symbol; never whole files to orient.
- [ ] **Read only the files you edit.** Open a file in full only when you are about to change it. Do not re-read a file you just edited.
- [ ] **Own tests while working, full suite once.** Run only the test files that cover what you are changing; the full suite once at the end as the final gate, and again only if that run failed and you changed something.
- [ ] **State these habits in every subagent and workflow prompt.** Some built-in agent types do not load CLAUDE.md.

### Index tools

- [ ] **CodeGraph before grep where `.codegraph/` exists.** `codegraph_explore` via MCP or `codegraph explore "<question>"` in the shell. Where there is no `.codegraph/`, skip CodeGraph; indexing is the user's decision.
- [ ] **graft before grep where `graft/` exists.** Load the MCP tools in one `ToolSearch` call; use whichever surface is available, the guidance is identical.

### GateGuard

- [ ] **Before the first shell command of a session, state the facts.** One sentence for the current user request, and one for what the command verifies or produces. Then retry the identical call.
- [ ] **Never set the disable variables.** `GATEGUARD_BASH_ROUTINE_DISABLED`, `ECC_GATEGUARD=off`, and `ECC_DISABLED_HOOKS` stay unset. Destructive-command checks remain active regardless.

## Examples

Each example is complete enough to copy. The title bar of a block names the file it belongs in. Commands and code stay in English in every language.

### A CLAUDE.md that earns its tokens

Commands, the rules a newcomer would miss, and how to report. Nothing the code already shows.

```markdown CLAUDE.md
# Project: billing-api

## Commands
- Test one file: `pnpm vitest run <path>`. Full suite only as the final gate: `pnpm test`.
- Typecheck: `pnpm tsc --noEmit`.

## Rules
- Never edit files under `migrations/`; propose a new migration instead.
- Public API types live in `src/api/types.ts`; changing them needs a CHANGELOG entry.
- Report results with the command you ran and its output, not a summary.
```

### Permissions and a blocking hook

Pre-approve read-only commands so prompts only appear for actions that deserve one, and let a hook refuse destructive git regardless of what the agent was told.

```json .claude/settings.json
{
  "permissions": {
    "allow": ["Read", "Grep", "Glob", "Bash(git status*)", "Bash(git diff*)", "Bash(pnpm vitest*)"],
    "deny": ["Bash(git push --force*)", "Bash(rm -rf*)"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "node .claude/hooks/block-destructive.mjs" }]
      }
    ]
  }
}
```

```javascript .claude/hooks/block-destructive.mjs
// A PreToolUse hook reads the tool call as JSON on stdin.
// Exit code 2 blocks the call and shows stderr to the agent as feedback.
let raw = "";
process.stdin.on("data", (chunk) => (raw += chunk)).on("end", () => {
  const command = JSON.parse(raw).tool_input?.command ?? "";
  if (/git push\s+(-f|--force)|git reset --hard|drop table/i.test(command)) {
    console.error("Blocked: destructive command. Explain why it is needed and ask the user to run it.");
    process.exit(2);
  }
});
```

### A skill for a repeated procedure

The description decides when the skill loads, so write it as the situations that should trigger it.

```markdown ~/.claude/skills/release-check/SKILL.md
---
name: release-check
description: Pre-release checklist for this repo. Use before tagging a release or when asked to "check the release".
---

1. Run `pnpm test` and `pnpm tsc --noEmit`. Stop and report if either fails.
2. Confirm CHANGELOG.md has an entry for the version in package.json.
3. Run `graft blast --format markdown` and include the blast radius in the report.
4. Report the commands run, their output, and anything skipped.
```

### A reusable read-only subagent

Model, effort and tools live in the frontmatter, so each brief only has to say what to find.

```markdown .claude/agents/explorer.md
---
name: explorer
description: Read-only code explorer. Returns conclusions with file:line pointers, never file dumps.
model: sonnet
effort: low
tools: Read, Grep, Glob, Bash
---

You answer "where is X" and "how does Y work" questions.
When a graft/ directory exists, use `graft ask "<question>" --source` and `graft callers <symbol>` before reading files.
Reply in at most 15 lines: the answer, the file:line spans that prove it, and what you did not check.
```

### The settled preamble for every producer prompt

Paste this at the top of any subagent or workflow prompt, then the task.

```text settled-preamble.txt
SETTLED: recent user messages are addressed to the orchestrator, not to you.
Do not ask questions, do not wait, do not hand the task back.
Never run gh, git commit, git push or git checkout.
Never disable the GateGuard hook: state the facts it asks for and retry the identical call.
No new third-party dependencies.
Final gates: run `pnpm vitest run src/billing` and `pnpm tsc --noEmit`; report their output honestly, including failures.

TASK: ...
```

### Compacting with intent

Tell the summary what to keep and what to drop instead of letting it guess.

```text
/compact Keep: the plan (steps 1 to 5), the decision to use one worktree per track, and the names of the failing tests. Drop: the exploration of src/legacy and all log output.
```

### A graft session, one call per question

```bash
graft map                                   # orient: directory hubs and hotspots
graft ask "where is rate limiting applied" --source
graft callers RateLimiter.check --depth 2   # what breaks if the signature changes
graft skeleton src/http/middleware.ts       # the file's API before editing it
graft stats                                 # tokens saved this session
```

### A scripted review in CI

Print mode, machine-readable output, a tool allowlist, and no hooks or plugins.

```bash
claude -p "Review the diff of this branch for correctness bugs only. Output JSON: {\"findings\":[{\"file\":\"\",\"line\":0,\"summary\":\"\"}]}" \
  --output-format json \
  --allowedTools "Read Grep Glob Bash(git diff*)" \
  --bare > review.json
```

### A strict tool definition

The schema is the contract: `strict` guarantees the input validates, so the handler never defends against shape errors.

```json tools/get_invoice.json
{
  "name": "get_invoice",
  "description": "Fetch one invoice by id. Use when the user names an invoice number.",
  "strict": true,
  "input_schema": {
    "type": "object",
    "properties": {
      "invoice_id": { "type": "string", "description": "Format INV-000000" }
    },
    "required": ["invoice_id"],
    "additionalProperties": false
  }
}
```

### An API call built for the cache

Frozen system prompt and tool list first, the varying question last, streaming on, and the cache counter checked.

```python cached_client.py
import anthropic

client = anthropic.Anthropic()
SYSTEM = open("system_prompt.md").read()                 # frozen text: no timestamps, no request ids
TOOLS = sorted(load_tools(), key=lambda t: t["name"])    # stable order means stable bytes


def ask(question: str):
    with client.messages.stream(
        model="claude-opus-5-5",
        max_tokens=64000,
        output_config={"effort": "high"},
        system=[{"type": "text", "text": SYSTEM, "cache_control": {"type": "ephemeral"}}],
        tools=TOOLS,
        messages=[{"role": "user", "content": question}],  # the volatile part comes last
    ) as stream:
        message = stream.get_final_message()

    if message.stop_reason == "refusal":
        raise RuntimeError(message.stop_details)
    print("cache read tokens:", message.usage.cache_read_input_tokens)  # zero on repeats means a silent invalidator
    return message
```

## Quick reference

### Claude Code

| Need | Use |
|---|---|
| Draft a CLAUDE.md | `/init` |
| See what fills the context | `/context` |
| Summarise and continue | `/compact <what to keep>` |
| Fresh start | `/clear` |
| Session spend | `/cost` |
| Switch model | `/model` |
| Faster output, same model | `/fast` |
| Effort at launch | `claude --effort xhigh` |
| Plan mode and permission modes | Shift+Tab |
| Stop the current turn | Escape |
| Review the diff for bugs | `/code-review` |
| Clean up the diff | `/simplify` |
| Security pass on the branch | `/security-review` |
| Fewer permission prompts | `/fewer-permission-prompts` |
| Scripted run | `claude -p "<prompt>" --output-format json --allowedTools "Read Grep"` |
| Recurring cloud run | `/schedule` |
| Poll a slow external state | `/loop` |
| Keep working until a condition holds | `/goal <condition>` |
| Reopen the last session here | `claude --continue` (or `/resume`) |

### graft

| Need | Use |
|---|---|
| Install and wire into the repo | `npm i -g @nanonets/graft@latest` then `graft init` |
| Orient in a cold repo | `graft map` |
| Understand or locate | `graft ask "<question>" --source` |
| Every occurrence | `graft grep "<name>"` |
| A file's API | `graft skeleton <file>` |
| Who calls, blast radius | `graft callers <sym> --depth 2`, `--depth all`, `--direction out` |
| CI freshness gate | `graft check` |
| PR risk comment | `graft blast --format markdown` |
| Session savings | `graft stats` |

### CodeGraph

| Need | Use |
|---|---|
| Symbols plus call paths in one call | `codegraph explore "<question>"` |
| One symbol or a file with line numbers | `codegraph node <name>` |
| Callers, callees, impact | `codegraph callers <sym>`, `codegraph callees <sym>`, `codegraph impact <sym>` |
| Tests affected by changed files | `codegraph affected <files>` |

### API parameters worth remembering

| Need | Use |
|---|---|
| Thinking depth | `output_config.effort`: `low`, `medium`, `high`, `xhigh`, `max` |
| Structured JSON out | `output_config.format` |
| Validated tool input | `strict: true` on the tool |
| Cache breakpoint | `cache_control: {type: "ephemeral"}` (max 4) |
| Operator instruction mid-conversation | `{role: "system", content: ...}` inside `messages` |
| Long conversations | compaction beta `compact-2026-01-12` |
| Paced agent loops | `output_config.task_budget` with beta `task-budgets-2026-03-13` |
| Half-price async work | Message Batches API |

## Sources

- Claude Code documentation: https://code.claude.com/docs
- Claude API documentation: https://docs.anthropic.com
- Claude Code goals, loops and routines: https://code.claude.com/docs/en/goal, https://code.claude.com/docs/en/scheduled-tasks, https://code.claude.com/docs/en/routines
- Anthropic Engineering, Effective harnesses for long-running agents (2025-11-26): https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Anthropic Engineering, Harness design for long-running application development (2026-03-24): https://www.anthropic.com/engineering/harness-design-long-running-apps
- graft: https://www.npmjs.com/package/@nanonets/graft (the installed skill at `~/.claude/skills/graft/SKILL.md` is the operational reference)
- CodeGraph: `codegraph --help` and the `codegraph` MCP server instructions
- Marc's working rules: `~/.claude/CLAUDE.md`
