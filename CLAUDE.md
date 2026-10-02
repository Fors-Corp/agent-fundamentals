# Agent Fundamentals

Static, multilingual checklist site generated from Markdown. No runtime dependencies; Node 24 only.

## Commands
- Check every translation against the English structure: `npm run check` (one language: `node check-translation.mjs <lang>`)
- Build all pages into `agent-fundamentals/`: `npm run build`
- Preview locally: the `checklist` entry in `.claude/launch.json` serves the folder on port 8765
- Deploy: push to `main`; Vercel runs `node build.mjs` and publishes `agent-fundamentals/`

## Structure
- `claude-agent-fundamentals.md` is the English source of truth. `i18n/<lang>.md` are translations with the same structure.
- `lib/md.mjs` holds the parser and the structural signature; `check-translation.mjs` compares a translation to English; `build.mjs` renders.
- `agent-fundamentals/` and `claude-agent-fundamentals.html` are generated. Never edit them; edit the Markdown or `build.mjs` and rebuild.
- `graft/` is this repo's context graph (local, git-ignored). Use `graft ask`, `graft skeleton`, `graft callers` before reading source.

## Rules
- Any change to the English Markdown must be mirrored in all six `i18n/*.md` files before building; `npm run check` must pass. Use the `translate` skill.
- Checklist items stay one line: `- [ ] **Lead.** rest`. Keep the literal `(House rule)` marker in every language; the build localises it.
- Code fences read ```` ```lang path/to/file ````. Code, commands, URLs and model ids stay in English in every language.
- Item ids are hashed from the English lead; rewording a lead resets readers' ticks for that item, so reword deliberately.
- Interface strings live in the `UI` table in `build.mjs`; add every new key to all seven languages.
- Never commit secrets or `.env*`; the site has none and needs none.
- Versioning is Semantic Versioning. Bump `version` in `package.json` (patch: fixes and wording; minor: new content, sections or languages; major: breaking changes to the Markdown format or build), add a CHANGELOG.md entry, and tag `v<version>` on release. The footer shows the version.
- Report results with the command run and its output, not a summary.
