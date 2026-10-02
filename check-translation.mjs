#!/usr/bin/env node
// Usage: node check-translation.mjs <lang>   (reads i18n/<lang>.md, compares its structure with the English source)
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown, compare } from "./lib/md.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const lang = process.argv[2];
if (!lang) { console.error("usage: node check-translation.mjs <lang>"); process.exit(2); }
const en = parseMarkdown(readFileSync(join(here, "claude-agent-fundamentals.md"), "utf8"));
const other = parseMarkdown(readFileSync(join(here, "i18n", `${lang}.md`), "utf8"));
const diffs = compare(en, other);
const enItems = en.sections.reduce((n, s) => n + s.items, 0);
const otherItems = other.sections.reduce((n, s) => n + s.items, 0);
console.log(`${lang}: ${other.sections.length} sections (en ${en.sections.length}), ${otherItems} items (en ${enItems})`);
if (diffs.length) {
  console.log(`STRUCTURE MISMATCH, first ${diffs.length} difference(s):`);
  for (const d of diffs) console.log(`  @${d.at}\n    en:    ${d.en}\n    ${lang}: ${d.other}`);
  process.exit(1);
}
console.log("OK: structure, code spans and markers match the English source");
