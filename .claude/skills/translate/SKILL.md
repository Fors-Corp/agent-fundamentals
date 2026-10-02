---
name: translate
description: Re-sync all six translations after the English checklist changed, or add a new language. Use when claude-agent-fundamentals.md was edited, when npm run check fails, or when asked to "update the translations".
---

1. Diff the English change: `git diff -- claude-agent-fundamentals.md` (or the agent's own edit). Identify the exact blocks that changed.
2. For each of `es ca fr pt it de`, spawn the `translator` agent (Sonnet, default effort: bounded work with a deterministic gate) with: the language, the changed English blocks quoted in full, where they sit (the surrounding headings), and the rule to touch nothing else. Spawn all six in one message.
3. Gate: `npm run check` must print `OK:` for every language. A `STRUCTURE MISMATCH` names the position; hand it back to that language's translator.
4. `npm run build`, then spot-check one translated page's new block in `agent-fundamentals/<lang>/index.html`.
5. Report: which blocks changed, the check output, and the build line. Do not commit or push unless asked; the `release` skill does that.

New language: add `{ code, name, dir }` to `LANGS` and a full `UI` entry in `build.mjs`, have the translator produce `i18n/<code>.md` from the whole English file, then steps 3 to 5.
