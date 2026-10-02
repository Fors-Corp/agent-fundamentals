# Agent Fundamentals

[![Support · 1,99 €](https://img.shields.io/badge/Support-1%2C99_%E2%82%AC-2f855a)](https://marcfors.com/donate?from=agent-fundamentals)

A tiered checklist for working professionally with Claude and coding agents: basics, intermediate and pro habits, token economy with and without [graft](https://www.npmjs.com/package/@nanonets/graft), model routing, Claude API habits, worked examples, and the house rules this team works by.

**Live:** https://agent-fundamentals.vercel.app (English), also in [Español](https://agent-fundamentals.vercel.app/es/), [Català](https://agent-fundamentals.vercel.app/ca/), [Français](https://agent-fundamentals.vercel.app/fr/), [Português](https://agent-fundamentals.vercel.app/pt/), [Italiano](https://agent-fundamentals.vercel.app/it/) and [Deutsch](https://agent-fundamentals.vercel.app/de/).

Tick what you already do; whatever stays unticked is the next skill to build. Progress is saved in the browser. The page has a light/dark/system theme switch and a language switcher.

## How it is built

The Markdown is the source of truth; the site is generated from it with no dependencies beyond Node.

| Path | Role |
|---|---|
| `claude-agent-fundamentals.md` | English source |
| `i18n/<lang>.md` | Translations, one file per language, same structure as the English source |
| `lib/md.mjs` | Shared Markdown parser and the structural signature used to compare translations |
| `check-translation.mjs` | Fails when a translation's structure, code spans or markers drift from the English source |
| `build.mjs` | Renders one static page per language into `agent-fundamentals/` (ignored by git; Vercel builds it) |
| `vercel.json` | Build command and output directory for Vercel |

Code fences may carry a file name after the language (```` ```json .claude/settings.json ````); they render as editor panes with line numbers, a copy button and syntax highlighting.

## Editing

```bash
# edit claude-agent-fundamentals.md, then mirror the change in each i18n/<lang>.md
npm run check     # every translation must match the English structure
npm run build     # writes agent-fundamentals/ (open agent-fundamentals/index.html)
```

Item ids are a hash of each English item's bold lead, assigned to translations by position, so ticks carry across languages and survive reordering within a section (moving an item to another section changes its id). Rewording an English lead resets that one item's ticks.

## Deploying

Pushes to `main` deploy through Vercel's Git integration. A manual production deploy from a checkout:

```bash
vercel deploy --prod
```

## Built by

**Marc Fors** · [GitHub](https://github.com/marcfs31) · [LinkedIn](https://www.linkedin.com/in/marc-fors) · [marcfors.com](https://marcfors.com)

## Versioning

Releases follow [Semantic Versioning](https://semver.org/) and are tagged `vMAJOR.MINOR.PATCH`; see [CHANGELOG.md](CHANGELOG.md). The current version is read from `package.json` and shown in the page footer.

## Licence

[MIT](LICENSE) © 2026 Marc Fors

If this project is useful to you, you can [support it with 1,99 €](https://marcfors.com/donate?from=agent-fundamentals).
