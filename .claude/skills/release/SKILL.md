---
name: release
description: Verify, commit and ship the checklist site. Use when asked to release, publish, deploy, or "ship it".
---

1. Gates, in order; stop and report on the first failure: `npm run check`, `npm run build`, `git status --short` (only intended files changed; never generated output).
2. Version: decide the SemVer bump from the changes (patch: fixes and wording; minor: new content, sections or languages; major: breaking changes to the Markdown format or build). Update `version` in `package.json` and add the entry to CHANGELOG.md under that version with today's date.
3. Commit with a message that names what changed for readers (content) and for maintainers (build), no attribution lines.
4. `git tag v<version>` then `git push origin main --tags`. Vercel's Git integration builds and deploys; it runs `node build.mjs` and publishes `agent-fundamentals/`.
5. Verify live, not from the build log: `curl -sS -o /dev/null -w "%{http_code}" https://agent-fundamentals.vercel.app/` must be 200, and one translated path (for example `/de/`) must return `<html lang="de"`.
6. If the claude.ai artifact copy is in use, republish `claude-agent-fundamentals.html` to the same artifact URL from a session that has it.
7. Report the commit, the tag, the live check output, and anything skipped.
