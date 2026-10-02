# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/): patch for fixes and wording, minor for new checklist content, sections or languages, major for changes that break how the Markdown or the build is used.

## [1.0.0] - 2026-10-02

### Added
- The checklist: Basics, Intermediate and Pro tiers, token economy with and without graft, model routing, chat and API habits, worked examples, house rules, quick reference.
- Seven languages (en, es, ca, fr, pt, it, de), each a static page, with a language switcher and `hreflang` alternates.
- Light, dark and system theme switch; progress saved per device, per account inside the claude.ai artifact viewer.
- Code blocks rendered as editor panes with line numbers, syntax highlighting and copy.
- Translation structure checker (`check-translation.mjs`) used as the build gate and in CI.
- Claude Code project configuration: CLAUDE.md, permissions and guard hooks, translator and reviewer agents, translate and release skills, graft index.

[1.0.0]: https://github.com/Fors-Corp/agent-fundamentals/releases/tag/v1.0.0
