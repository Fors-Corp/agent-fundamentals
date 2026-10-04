# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/): patch for fixes and wording, minor for new checklist content, sections or languages, major for changes that break how the Markdown or the build is used.

## [Unreleased]

### Added
- Support · 1,99 € link in the page footer (translated in all seven languages) and a README badge.

## [1.2.0] - 2026-10-04

### Added
- 22 checklist items on long-running and multi-session work, goals and loops, scheduling layers, unattended-run caps, completion-gate hooks, reviewer calibration and metric anchors, in all seven languages. A new sub-section, "Long-running and multi-session work", sits under Pro.
- Clauses on five existing items (CLAUDE.md length target and contradictions, fresh-context reviewers, harness ablation after model changes, approval requests), two Quick-reference rows (`/goal`, `claude --continue`) and three Sources entries.
- Every claim was checked against code.claude.com/docs and Anthropic Engineering posts; a claim that subagents cannot spawn subagents was found false and replaced by the documented default (three layers, `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`).

### Changed
- "Keep it short." now states the documented target of under 200 lines instead of "a few hundred".
- GitHub workflow: CODEOWNERS, Dependabot for pinned Action SHAs, CodeQL, Dependabot auto-merge, and PR-based deploys.

## [1.1.0] - 2026-10-02

### Added
- App icon: a checklist mark (two ticked rows, one open box) as `favicon.svg`, a 32px PNG favicon, an Apple touch icon and 192/512px icons.
- Web app manifest and light/dark `theme-color`, so the site can be installed and the browser chrome matches the page.
- `scripts/make-icons.sh` regenerates the PNGs from `assets/icon-square.svg`; the PNGs are committed, so builds never need it.

## [1.0.0] - 2026-10-02

### Added
- The checklist: Basics, Intermediate and Pro tiers, token economy with and without graft, model routing, chat and API habits, worked examples, house rules, quick reference.
- Seven languages (en, es, ca, fr, pt, it, de), each a static page, with a language switcher and `hreflang` alternates.
- Light, dark and system theme switch; progress saved per device, per account inside the claude.ai artifact viewer.
- Code blocks rendered as editor panes with line numbers, syntax highlighting and copy.
- Translation structure checker (`check-translation.mjs`) used as the build gate and in CI.
- Claude Code project configuration: CLAUDE.md, permissions and guard hooks, translator and reviewer agents, translate and release skills, graft index.

[1.2.0]: https://github.com/Fors-Corp/agent-fundamentals/releases/tag/v1.2.0
[1.1.0]: https://github.com/Fors-Corp/agent-fundamentals/releases/tag/v1.1.0
[1.0.0]: https://github.com/Fors-Corp/agent-fundamentals/releases/tag/v1.0.0
