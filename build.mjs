#!/usr/bin/env node
// Builds the Agent Fundamentals pages from Markdown.
//   claude-agent-fundamentals.md      English source of truth
//   i18n/<lang>.md                    translations (same structure; checked against English)
// Outputs:
//   claude-agent-fundamentals.html    English fragment for the claude.ai artifact
//   agent-fundamentals/index.html     English standalone page (Vercel root)
//   agent-fundamentals/<lang>/index.html  one standalone page per translation
// Edit the Markdown and re-run `node build.mjs`. A translation whose structure drifts
// from the English source fails the build (run `node check-translation.mjs <lang>`).

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown, compare } from "./lib/md.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const SRC_EN = join(here, "claude-agent-fundamentals.md");
const SITE_DIR = join(here, "agent-fundamentals");
const SITE_URL = "https://agent-fundamentals.vercel.app";
const REPO_URL = "https://github.com/Fors-Corp/agent-fundamentals";
const VERSION = JSON.parse(readFileSync(join(here, "package.json"), "utf8")).version; // SemVer, shown in the footer
const SUPPORT_URL = "https://marcfors.com/donate?from=agent-fundamentals";
const AUTHOR = { name: "Marc Fors", github: "https://github.com/marcfs31", linkedin: "https://www.linkedin.com/in/marc-fors", site: "https://marcfors.com" };

// Language list: code, native name, URL directory ("" = site root).
const LANGS = [
  { code: "en", name: "English", dir: "" },
  { code: "es", name: "Español", dir: "es" },
  { code: "ca", name: "Català", dir: "ca" },
  { code: "fr", name: "Français", dir: "fr" },
  { code: "pt", name: "Português", dir: "pt" },
  { code: "it", name: "Italiano", dir: "it" },
  { code: "de", name: "Deutsch", dir: "de" },
];

// Interface strings per language. {n}, {done}, {total} are filled at runtime.
const UI = {
  en: { builtBy: "Built by", support: "Support · 1,99 €", source: "Source on GitHub", copy: "Copy", copied: "Copied", skip: "Skip to content", brand: "Agent Fundamentals", hideDone: "Hide done", reset: "Reset progress", clearOne: "Clear 1 tick?", clearMany: "Clear {n} ticks?", clear: "Clear", keep: "Keep", statusAccount: "Progress saved to your account", statusDevice: "Progress saved on this device", statusNone: "Progress not saved in this view", ofDone: "{done} of {total} done", theme: "Theme", system: "System", light: "Light", dark: "Dark", language: "Language", houseRule: "House rule", sections: "Sections", progress: "Checklist progress", generatedFrom: "Generated from", on: "on", rebuild: "Edit the Markdown and rebuild with" },
  es: { builtBy: "Creado por", support: "Apoyar · 1,99 €", source: "Código en GitHub", copy: "Copiar", copied: "Copiado", skip: "Saltar al contenido", brand: "Fundamentos de agentes", hideDone: "Ocultar hechos", reset: "Reiniciar progreso", clearOne: "¿Borrar 1 marca?", clearMany: "¿Borrar {n} marcas?", clear: "Borrar", keep: "Mantener", statusAccount: "Progreso guardado en tu cuenta", statusDevice: "Progreso guardado en este dispositivo", statusNone: "El progreso no se guarda en esta vista", ofDone: "{done} de {total} hechos", theme: "Tema", system: "Sistema", light: "Claro", dark: "Oscuro", language: "Idioma", houseRule: "Regla de la casa", sections: "Secciones", progress: "Progreso de la lista", generatedFrom: "Generado a partir de", on: "el", rebuild: "Edita el Markdown y regenera con" },
  ca: { builtBy: "Creat per", support: "Donar suport · 1,99 €", source: "Codi a GitHub", copy: "Copia", copied: "Copiat", skip: "Salta al contingut", brand: "Fonaments d'agents", hideDone: "Amaga els fets", reset: "Reinicia el progrés", clearOne: "Vols esborrar 1 marca?", clearMany: "Vols esborrar {n} marques?", clear: "Esborra", keep: "Conserva", statusAccount: "Progrés desat al teu compte", statusDevice: "Progrés desat en aquest dispositiu", statusNone: "El progrés no es desa en aquesta vista", ofDone: "{done} de {total} fets", theme: "Tema", system: "Sistema", light: "Clar", dark: "Fosc", language: "Idioma", houseRule: "Regla de la casa", sections: "Seccions", progress: "Progrés de la llista", generatedFrom: "Generat a partir de", on: "el", rebuild: "Edita el Markdown i regenera amb" },
  fr: { builtBy: "Conçu par", support: "Soutenir · 1,99 €", source: "Code source sur GitHub", copy: "Copier", copied: "Copié", skip: "Aller au contenu", brand: "Fondamentaux des agents", hideDone: "Masquer les éléments faits", reset: "Réinitialiser la progression", clearOne: "Effacer 1 coche ?", clearMany: "Effacer {n} coches ?", clear: "Effacer", keep: "Conserver", statusAccount: "Progression enregistrée dans votre compte", statusDevice: "Progression enregistrée sur cet appareil", statusNone: "Progression non enregistrée dans cette vue", ofDone: "{done} sur {total} faits", theme: "Thème", system: "Système", light: "Clair", dark: "Sombre", language: "Langue", houseRule: "Règle maison", sections: "Sections", progress: "Progression de la liste", generatedFrom: "Généré à partir de", on: "le", rebuild: "Modifiez le Markdown et regénérez avec" },
  pt: { builtBy: "Criado por", support: "Apoiar · 1,99 €", source: "Código no GitHub", copy: "Copiar", copied: "Copiado", skip: "Saltar para o conteúdo", brand: "Fundamentos de agentes", hideDone: "Ocultar concluídos", reset: "Repor progresso", clearOne: "Limpar 1 marca?", clearMany: "Limpar {n} marcas?", clear: "Limpar", keep: "Manter", statusAccount: "Progresso guardado na sua conta", statusDevice: "Progresso guardado neste dispositivo", statusNone: "O progresso não é guardado nesta vista", ofDone: "{done} de {total} concluídos", theme: "Tema", system: "Sistema", light: "Claro", dark: "Escuro", language: "Idioma", houseRule: "Regra da casa", sections: "Secções", progress: "Progresso da lista", generatedFrom: "Gerado a partir de", on: "em", rebuild: "Edite o Markdown e volte a gerar com" },
  it: { builtBy: "Realizzato da", support: "Sostieni · 1,99 €", source: "Codice su GitHub", copy: "Copia", copied: "Copiato", skip: "Vai al contenuto", brand: "Fondamenti degli agenti", hideDone: "Nascondi completati", reset: "Azzera progressi", clearOne: "Cancellare 1 spunta?", clearMany: "Cancellare {n} spunte?", clear: "Cancella", keep: "Mantieni", statusAccount: "Progressi salvati nel tuo account", statusDevice: "Progressi salvati su questo dispositivo", statusNone: "Progressi non salvati in questa vista", ofDone: "{done} di {total} completati", theme: "Tema", system: "Sistema", light: "Chiaro", dark: "Scuro", language: "Lingua", houseRule: "Regola della casa", sections: "Sezioni", progress: "Avanzamento della lista", generatedFrom: "Generato da", on: "il", rebuild: "Modifica il Markdown e rigenera con" },
  de: { builtBy: "Erstellt von", support: "Unterstützen · 1,99 €", source: "Quellcode auf GitHub", copy: "Kopieren", copied: "Kopiert", skip: "Zum Inhalt springen", brand: "Agenten-Grundlagen", hideDone: "Erledigte ausblenden", reset: "Fortschritt zurücksetzen", clearOne: "1 Häkchen löschen?", clearMany: "{n} Häkchen löschen?", clear: "Löschen", keep: "Behalten", statusAccount: "Fortschritt in Ihrem Konto gespeichert", statusDevice: "Fortschritt auf diesem Gerät gespeichert", statusNone: "Fortschritt wird in dieser Ansicht nicht gespeichert", ofDone: "{done} von {total} erledigt", theme: "Design", system: "System", light: "Hell", dark: "Dunkel", language: "Sprache", houseRule: "Hausregel", sections: "Abschnitte", progress: "Fortschritt der Checkliste", generatedFrom: "Erzeugt aus", on: "am", rebuild: "Markdown bearbeiten und neu erzeugen mit" },
};

// ---------- helpers ----------
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[`*]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// FNV-1a over the English item's lead text: ids survive reordering and translation,
// and only change when the English wording of the lead changes.
function shortHash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36).padStart(7, "0").slice(0, 7);
}

function inline(src, ui) {
  const codes = [];
  let s = src.replace(/`([^`]+)`/g, (_, c) => { codes.push(`<code>${esc(c)}</code>`); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/\(House rule\)/g, `<span class="tag">${esc(ui.houseRule)}</span>`);
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/(^|[^\w"=>])(https?:\/\/[^\s<]+[^\s<.,)])/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>'); // ">" excluded: never autolink inside a link just made
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s.,;:)]|$)/g, "$1<em>$2</em>");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[+i]);
}

// ---------- load documents ----------
const enDoc = parseMarkdown(readFileSync(SRC_EN, "utf8"));
if (enDoc.intro.some((b) => b.type === "list" && b.items.some((it) => it.check))) {
  throw new Error("checklist items are not allowed before the first '## ' heading: they would have no section and no id");
}

// English ids, positional per section, so every language maps item k of section s to the same id.
const enSlugs = enDoc.sections.map((s) => slug(s.title));
const enIds = enDoc.sections.map((s, si) => {
  const ids = [];
  for (const b of s.blocks) if (b.type === "list") for (const it of b.items) if (it.check) {
    const lead = (it.text.match(/^\*\*([^*]+)\*\*/) || [, it.text])[1];
    ids.push(`${enSlugs[si].slice(0, 12)}-${shortHash(lead.trim().toLowerCase())}`);
  }
  return ids;
});
const totalItems = enIds.reduce((n, a) => n + a.length, 0);

const docs = {};
for (const L of LANGS) {
  if (L.code === "en") { docs.en = enDoc; continue; }
  const p = join(here, "i18n", `${L.code}.md`);
  if (!existsSync(p)) { console.warn(`! ${L.code}: i18n/${L.code}.md missing, skipping`); continue; }
  const d = parseMarkdown(readFileSync(p, "utf8"));
  const diffs = compare(enDoc, d, 3);
  if (diffs.length) {
    console.error(`! ${L.code}: structure differs from English (run: node check-translation.mjs ${L.code})`);
    for (const x of diffs) console.error(`    @${x.at}\n      en: ${x.en}\n      ${L.code}: ${x.other}`);
    process.exitCode = 1;
    continue;
  }
  docs[L.code] = d;
}

// ---------- render ----------
function renderBlock(b, ui, ctx) {
  switch (b.type) {
    case "h3": return `<h3 id="${ctx.sec}-${slug(b.text)}">${inline(b.text, ui)}</h3>`; // scoped: several sections repeat a subheading
    case "p": return `<p>${inline(b.text, ui)}</p>`;
    case "quote": return `<blockquote>${inline(b.text, ui)}</blockquote>`;
    case "code": {
      // Rendered as an editor pane: title bar with the file name, line-number gutter, copy button.
      const lang = b.lang || "text";
      const lines = b.text.split("\n");
      const gutter = lines.map((_, i) => i + 1).join("\n");
      const label = b.file ? esc(b.file) : (lang === "text" ? "" : esc(lang));
      const hl = lang === "text" ? "plaintext" : esc(lang);
      return `<figure class="editor" data-lang="${esc(lang)}"><figcaption class="editor-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="editor-title">${label}</span><button type="button" class="copy" data-copy data-copied="${esc(ui.copied)}">${esc(ui.copy)}</button></figcaption><div class="editor-body"><pre class="gutter" aria-hidden="true">${gutter}</pre><pre tabindex="0" role="region" aria-label="${label || esc(lang)}"><code class="language-${hl}">${esc(b.text)}</code></pre></div></figure>`;
    }
    case "table": {
      const th = b.head.map((c) => `<th>${inline(c, ui)}</th>`).join("");
      const tr = b.body.map((r) => `<tr>${r.map((c) => `<td>${inline(c, ui)}</td>`).join("")}</tr>`).join("\n");
      return `<div class="table-wrap"><table><thead><tr>${th}</tr></thead><tbody>\n${tr}\n</tbody></table></div>`;
    }
    case "list": {
      const anyCheck = b.items.some((it) => it.check);
      const lis = b.items.map((it) => {
        const subs = it.subs.length ? `<ul class="sub">${it.subs.map((s) => `<li>${inline(s, ui)}</li>`).join("")}</ul>` : "";
        if (it.check) {
          const id = ctx.ids[ctx.k++];
          return `<li class="item" data-id="${id}"><label class="row"><input class="chk" type="checkbox" id="chk-${id}" data-id="${id}"><span class="box" aria-hidden="true"></span><span class="body">${inline(it.text, ui)}${subs}</span></label></li>`;
        }
        return `<li class="plain">${inline(it.text, ui)}${subs}</li>`;
      }).join("\n");
      return `<ul class="${anyCheck ? "checklist" : "bullets"}">\n${lis}\n</ul>`;
    }
    default: return "";
  }
}

// Footer date: the last commit's date when building from git (reproducible), today otherwise.
let built = new Date().toISOString().slice(0, 10);
try { built = execSync("git log -1 --format=%cs", { cwd: here, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim() || built; } catch {}

/** Render one language. `absolute` makes language links point at the public site (for the artifact fragment). */
function renderPage(L, doc, { absolute }) {
  const ui = UI[L.code];
  const sectionIds = enSlugs; // section anchors stay English so links work across languages
  const nav = doc.sections.map((s, si) =>
    `<a href="#${sectionIds[si]}" data-sec="${sectionIds[si]}"><span class="nav-title">${inline(s.title, ui)}</span>${s.items ? `<span class="nav-count" data-count="${sectionIds[si]}">0/${s.items}</span>` : ""}</a>`
  ).join("\n");

  const body = doc.sections.map((s, si) => {
    const ctx = { ids: enIds[si], k: 0, sec: sectionIds[si] };
    return `
<section id="${sectionIds[si]}" data-items="${s.items}">
  <header class="sec-head">
    <h2>${inline(s.title, ui)}</h2>
    ${s.items ? `<div class="sec-progress" aria-hidden="true"><span class="sec-bar"><span class="sec-fill" data-fill="${sectionIds[si]}"></span></span><span class="sec-count" data-count="${sectionIds[si]}">0/${s.items}</span></div>` : ""}
  </header>
  ${s.blocks.map((b) => renderBlock(b, ui, ctx)).join("\n")}
</section>`;
  }).join("\n");

  const hrefFor = (X) => (absolute ? `${SITE_URL}/${X.dir ? X.dir + "/" : ""}` : (X.dir ? `/${X.dir}/` : "/"));
  const langLinks = LANGS.map((X) =>
    `<a href="${hrefFor(X)}" lang="${X.code}" hreflang="${X.code}" title="${esc(X.name)}"${X.code === L.code ? ' aria-current="page"' : ""}${absolute ? ' target="_blank" rel="noopener"' : ""}>${X.code.toUpperCase()}</a>`
  ).join("");
  const alternates = LANGS.map((X) => `<link rel="alternate" hreflang="${X.code}" href="${SITE_URL}/${X.dir ? X.dir + "/" : ""}">`).join("\n") +
    `\n<link rel="alternate" hreflang="x-default" href="${SITE_URL}/">`;

  const introHtml = doc.intro.map((b) => renderBlock(b, ui, { ids: [], k: 0, sec: "intro" })).join("\n");
  const description = doc.intro.length && doc.intro[0].type === "p" ? doc.intro[0].text.replace(/[`*]/g, "").slice(0, 300) : "";
  const mdName = L.code === "en" ? "claude-agent-fundamentals.md" : `${L.code}.md`;

  return `<title>${esc(ui.brand)}</title>
<meta name="description" content="${esc(description)}">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="author" content="${esc(AUTHOR.name)}">
<link rel="author" href="${AUTHOR.site}">
<link rel="icon" href="${absolute ? SITE_URL : ""}/favicon.svg" type="image/svg+xml">
<link rel="icon" href="${absolute ? SITE_URL : ""}/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="${absolute ? SITE_URL : ""}/apple-touch-icon.png">
<link rel="manifest" href="${absolute ? SITE_URL : ""}/manifest.webmanifest">
<meta name="theme-color" content="#f5f7f6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1514" media="(prefers-color-scheme: dark)">
<link rel="canonical" href="${SITE_URL}/${L.dir ? L.dir + "/" : ""}">
${alternates}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100,500..800&family=Source+Sans+3:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
${CSS}
</style>
<script>(function(){try{var t=localStorage.getItem("agent-fundamentals-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();</script>

<a class="skip" href="#main">${esc(ui.skip)}</a>
<div class="topbar">
  <div class="topbar-in">
    <span class="brand">${esc(ui.brand)}</span>
    <div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="${totalItems}" aria-valuenow="0" aria-label="${esc(ui.progress)}">
      <span class="bar"><span class="fill" id="fill"></span></span>
      <span class="count" id="count">${esc(ui.ofDone.replace("{done}", "0").replace("{total}", String(totalItems)))}</span>
    </div>
    <nav class="langs" aria-label="${esc(ui.language)}">${langLinks}</nav>
    <div class="seg" role="group" aria-label="${esc(ui.theme)}">
      <button type="button" data-theme-choice="system" aria-pressed="true">${esc(ui.system)}</button><button type="button" data-theme-choice="light" aria-pressed="false">${esc(ui.light)}</button><button type="button" data-theme-choice="dark" aria-pressed="false">${esc(ui.dark)}</button>
    </div>
  </div>
  <div class="topbar-in tools">
    <label class="toggle"><input type="checkbox" id="hide-done"> ${esc(ui.hideDone)}</label>
    <span id="reset-slot"><button type="button" id="reset" class="danger">${esc(ui.reset)}</button></span>
    <span class="status" id="status" aria-live="polite"></span>
  </div>
</div>

<div class="shell">
  <nav class="rail" aria-label="${esc(ui.sections)}">
${nav}
  </nav>
  <main id="main" tabindex="-1">
    <div class="intro">
      <h1>${esc(doc.title)}</h1>
${introHtml}
    </div>
${body}
  </main>
</div>
<footer>
  <p class="credit">${esc(ui.builtBy)} <a href="${AUTHOR.site}" target="_blank" rel="noopener author">${esc(AUTHOR.name)}</a>
    <span class="credit-links"><a href="${AUTHOR.github}" target="_blank" rel="noopener">GitHub</a> · <a href="${AUTHOR.linkedin}" target="_blank" rel="noopener">LinkedIn</a> · <a href="${AUTHOR.site}" target="_blank" rel="noopener">marcfors.com</a> · <a href="${REPO_URL}" target="_blank" rel="noopener">${esc(ui.source)}</a> · <a href="${SUPPORT_URL}" target="_blank" rel="noopener noreferrer">${esc(ui.support)}</a></span></p>
  <p>${esc(ui.generatedFrom)} <a href="${absolute ? SITE_URL + "/" : "/"}${mdName}">${mdName}</a> ${esc(ui.on)} ${built}. ${esc(ui.rebuild)} <code>node build.mjs</code>. <a href="${REPO_URL}/blob/main/CHANGELOG.md" target="_blank" rel="noopener">v${esc(VERSION)}</a> · MIT.</p>
</footer>

<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js" integrity="sha384-RH2xi4eIQ/gjtbs9fUXM68sLSi99C7ZWBRX1vDrVv6GQXRibxXLbwO2NGZB74MbU" crossorigin="anonymous"></script>
<script>
window.AF_UI = ${JSON.stringify(ui)};
${JS}
</script>
`;
}

// ---------- styles ----------
const CSS = `
/* Layout: a left rail of sections with per-section progress, a reading column of ~72ch, a sticky two-row header: identity, meter, language and theme on the first row; list tools on the second. Phone: the rail becomes a chip row. */
:root {
  --bg: #f5f7f6; --surface: #ffffff; --fg: #16201e; --muted: #54625f; --line: #d6dedb;
  --accent: #0d7a65; --accent-ink: #ffffff; --accent-soft: #dcefe9;
  --mark: #8f5612; --mark-soft: #f7e9d3; --code-bg: #eaefed;
  --editor-bg: #f0f3f1; --editor-bar: #e2e8e5; --gutter: #5d6c69;
  --c-key: #7a3e9d; --c-str: #0b6e4f; --c-num: #a35200; --c-cmt: #66746f; --c-fn: #1554a8; --c-attr: #8a3b12;
  --font-display: "Archivo", "Helvetica Neue", Arial, sans-serif;
  --font-body: "Source Sans 3", "Segoe UI", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0f1514; --surface: #161e1c; --fg: #e4ebe8; --muted: #94a5a1; --line: #2a3634;
    --accent: #3cbfa2; --accent-ink: #06201a; --accent-soft: #163a33;
    --mark: #e0a04a; --mark-soft: #3a2a12; --code-bg: #1c2624; color-scheme: dark;
    --editor-bg: #0b1211; --editor-bar: #1a2422; --gutter: #5d6c69;
    --c-key: #c792ea; --c-str: #7ed6a9; --c-num: #f0a65a; --c-cmt: #7f8f8b; --c-fn: #82b1ff; --c-attr: #f1b47a;
  }
}
:root[data-theme="dark"] {
  --bg: #0f1514; --surface: #161e1c; --fg: #e4ebe8; --muted: #94a5a1; --line: #2a3634;
  --accent: #3cbfa2; --accent-ink: #06201a; --accent-soft: #163a33;
  --mark: #e0a04a; --mark-soft: #3a2a12; --code-bg: #1c2624; color-scheme: dark;
  --editor-bg: #0b1211; --editor-bar: #1a2422; --gutter: #5d6c69;
  --c-key: #c792ea; --c-str: #7ed6a9; --c-num: #f0a65a; --c-cmt: #7f8f8b; --c-fn: #82b1ff; --c-attr: #f1b47a;
}
:root[data-theme="light"] { color-scheme: light; }
* { box-sizing: border-box; }
html, body { background: var(--bg); color: var(--fg); }
body { margin: 0; font-family: var(--font-body); font-size: 1.0625rem; line-height: 1.6; -webkit-font-smoothing: antialiased; }
@media (min-width: 900px) { body { font-size: 1.125rem; } }
.skip { position: absolute; left: 16px; top: -100px; z-index: 10; background: var(--accent); color: var(--accent-ink); padding: 0.5rem 0.9rem; border-radius: 6px; font-weight: 600; text-decoration: none; }
.skip:focus { top: calc(env(safe-area-inset-top, 0px) + 8px); outline: 2px solid var(--fg); outline-offset: 2px; }
main:focus { outline: none; }

/* Code shown as an editor pane */
.editor { margin: 0.6rem 0 1.5rem; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; background: var(--editor-bg); max-width: 92ch; }
.editor-bar { display: flex; align-items: center; gap: 0.7rem; padding: 0.45rem 0.7rem; background: var(--editor-bar); border-bottom: 1px solid var(--line); font-family: var(--font-mono); font-size: 0.78rem; color: var(--muted); }
.dots { display: inline-flex; gap: 5px; }
.dots i { width: 10px; height: 10px; border-radius: 50%; background: var(--line); display: inline-block; }
.dots i:nth-child(1) { background: #e5665a; } .dots i:nth-child(2) { background: #e0b03a; } .dots i:nth-child(3) { background: #4fbf6a; }
.editor-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.copy { font-family: var(--font-body); font-size: 0.78rem; padding: 0.2rem 0.6rem; background: var(--surface); }
.copy.ok { color: var(--accent); border-color: var(--accent); }
.editor-body { display: grid; grid-template-columns: auto minmax(0, 1fr); }
.editor-body pre { margin: 0; padding: 0.9rem 0; background: transparent; border-radius: 0; line-height: 1.55; font-size: 0.86rem; }
.editor-body pre.gutter { padding-inline: 0.9rem 0.7rem; color: var(--gutter); text-align: right; user-select: none; border-right: 1px solid var(--line); font-variant-numeric: tabular-nums; }
.editor-body pre:not(.gutter) { padding-inline: 1rem; overflow-x: auto; }
.editor-body pre:not(.gutter):focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
.editor-body code { background: none; padding: 0; white-space: pre; font-size: inherit; color: var(--fg); }
.hljs-comment, .hljs-quote { color: var(--c-cmt); font-style: italic; }
.hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-built_in, .hljs-meta .hljs-keyword { color: var(--c-key); }
.hljs-string, .hljs-addition, .hljs-regexp, .hljs-link { color: var(--c-str); }
.hljs-number, .hljs-symbol, .hljs-bullet, .hljs-meta { color: var(--c-num); }
.hljs-title, .hljs-title.function_, .hljs-section, .hljs-name { color: var(--c-fn); font-weight: 600; }
.hljs-attr, .hljs-attribute, .hljs-variable, .hljs-template-variable, .hljs-type, .hljs-params { color: var(--c-attr); }
.hljs-strong { font-weight: 700; } .hljs-emphasis { font-style: italic; }
.hljs-code { color: var(--c-str); }

@media (prefers-contrast: more) {
  :root { --line: #8a9894; --muted: #3f4b48; }
  :root[data-theme="dark"] { --line: #5d6c69; --muted: #c3cfcb; }
  .box { border-width: 2px; }
  .rail a.active { border-left-width: 3px; }
}
@media (prefers-contrast: more) and (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --line: #5d6c69; --muted: #c3cfcb; }
}
a { color: var(--accent); text-decoration-thickness: 1px; text-underline-offset: 2px; }
code, pre { font-family: var(--font-mono); font-size: 0.86em; }
code { background: var(--code-bg); padding: 0.1em 0.38em; border-radius: 4px; white-space: nowrap; }
pre { background: var(--code-bg); padding: 0.9rem 1rem; border-radius: 6px; overflow-x: auto; }
pre code { background: none; padding: 0; white-space: pre; }
h1, h2, h3 { font-family: var(--font-display); letter-spacing: -0.01em; text-wrap: balance; margin: 0; }
h1 { font-size: clamp(1.6rem, 1.1rem + 2.2vw, 2.6rem); font-weight: 800; line-height: 1.05; }
h2 { font-size: clamp(1.35rem, 1.1rem + 1vw, 1.8rem); font-weight: 700; line-height: 1.15; }
h3 { font-size: 1.05rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin-top: 2.2rem; margin-bottom: 0.6rem; }
p { margin: 0 0 1rem; max-width: 72ch; }
strong { font-weight: 600; }

.topbar { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: color-mix(in srgb, var(--bg) 88%, transparent); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
.topbar-in { max-width: 1180px; margin: 0 auto; padding: 0.55rem 16px 0.35rem; display: flex; align-items: center; gap: 0.9rem; flex-wrap: wrap; }
.topbar-in.tools { padding-top: 0; padding-bottom: 0.55rem; gap: 0.6rem; }
.brand { font-family: var(--font-display); font-weight: 700; font-size: 0.95rem; letter-spacing: 0.01em; white-space: nowrap; }
.meter { flex: 1 1 200px; display: flex; align-items: center; gap: 0.6rem; min-width: 0; }
.bar { flex: 1; height: 8px; background: var(--line); border-radius: 999px; overflow: hidden; }
.fill { display: block; height: 100%; width: 0; background: var(--accent); border-radius: 999px; transition: width 240ms ease; }
.count { font-variant-numeric: tabular-nums; font-size: 0.9rem; color: var(--muted); white-space: nowrap; }
.langs { display: flex; gap: 2px; font-family: var(--font-mono); font-size: 0.74rem; }
.langs a { color: var(--muted); text-decoration: none; padding: 0.22rem 0.42rem; border-radius: 5px; border: 1px solid transparent; }
.langs a:hover { color: var(--fg); background: var(--surface); }
.langs a[aria-current="page"] { color: var(--accent); border-color: var(--accent); background: var(--accent-soft); }
.seg { display: inline-flex; border: 1px solid var(--line); border-radius: 6px; overflow: hidden; background: var(--surface); }
.seg button { border: 0; border-radius: 0; background: transparent; color: var(--muted); font-size: 0.8rem; padding: 0.3rem 0.6rem; }
.seg button + button { border-left: 1px solid var(--line); }
.seg button[aria-pressed="true"] { background: var(--accent); color: var(--accent-ink); }
.seg button:hover:not([aria-pressed="true"]) { color: var(--fg); background: var(--code-bg); }
.toggle { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; color: var(--muted); cursor: pointer; user-select: none; }
.toggle input { accent-color: var(--accent); width: 1rem; height: 1rem; margin: 0; }
button { font: inherit; font-size: 0.88rem; color: var(--fg); background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 0.35rem 0.7rem; cursor: pointer; }
button:hover { border-color: var(--accent); }
button.danger { color: var(--mark); }
button:focus-visible, input:focus-visible + .box, .toggle input:focus-visible, a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.confirm { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; }
.status { font-size: 0.82rem; color: var(--muted); }

.shell { max-width: 1180px; margin: 0 auto; padding-block: 1.5rem 4rem; padding-inline: 16px; display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 2.5rem; }
.rail { position: sticky; top: calc(env(safe-area-inset-top, 0px) + 96px); align-self: start; max-height: calc(100vh - 112px); overflow: auto; padding-right: 0.5rem; }
.rail a { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem; padding: 0.45rem 0.6rem; border-radius: 6px; color: var(--fg); text-decoration: none; font-size: 0.93rem; border-left: 2px solid transparent; }
.rail a:hover { background: var(--surface); }
.rail a.active { border-left-color: var(--accent); background: var(--surface); }
.rail a.complete .nav-count { color: var(--accent); }
.nav-count { font-variant-numeric: tabular-nums; font-size: 0.8rem; color: var(--muted); font-family: var(--font-mono); }
main { min-width: 0; }
.intro { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--line); }
.intro h1 { margin-bottom: 1rem; }
.intro p { font-size: 1.05rem; }
.intro p:last-child { font-size: 0.92rem; color: var(--muted); }

section { padding-block: 2rem 1rem; border-bottom: 1px solid var(--line); scroll-margin-top: 112px; }
section:last-of-type { border-bottom: 0; }
.sec-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.9rem; }
.sec-progress { display: flex; align-items: center; gap: 0.5rem; min-width: 160px; }
.sec-bar { width: 110px; height: 6px; background: var(--line); border-radius: 999px; overflow: hidden; display: inline-block; }
.sec-fill { display: block; height: 100%; width: 0; background: var(--accent); transition: width 240ms ease; }
.sec-count { font-family: var(--font-mono); font-size: 0.8rem; color: var(--muted); font-variant-numeric: tabular-nums; }

ul.checklist { list-style: none; margin: 0 0 0.6rem; padding: 0; display: grid; gap: 0.45rem; max-width: 78ch; }
.item .row { display: grid; grid-template-columns: 1.35rem minmax(0, 1fr); gap: 0.8rem; align-items: start; padding: 0.65rem 0.7rem; border-radius: 8px; cursor: pointer; min-height: 44px; }
.item .row:has(input:focus-visible) { outline: 2px solid var(--accent); outline-offset: 1px; }
.item .row:hover { background: var(--surface); }
.item input.chk { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; pointer-events: none; }
.box { width: 1.35rem; height: 1.35rem; margin-top: 0.15rem; border: 1.5px solid var(--muted); border-radius: 5px; background: var(--surface); position: relative; transition: background 120ms ease, border-color 120ms ease; }
.box::after { content: ""; position: absolute; left: 0.42rem; top: 0.16rem; width: 0.32rem; height: 0.68rem; border: solid var(--accent-ink); border-width: 0 2px 2px 0; transform: rotate(45deg) scale(0); transition: transform 120ms ease; }
.item.done .box { background: var(--accent); border-color: var(--accent); }
.item.done .box::after { transform: rotate(45deg) scale(1); }
.item.done .body { color: var(--muted); }
.item.done .body strong { color: var(--muted); text-decoration: line-through; text-decoration-color: color-mix(in srgb, var(--muted) 60%, transparent); }
.body strong { font-weight: 600; color: var(--fg); }
.tag { display: inline-block; font-family: var(--font-display); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--mark); background: var(--mark-soft); padding: 0.1rem 0.45rem; border-radius: 999px; vertical-align: 0.1em; margin-left: 0.25rem; }
ul.sub { margin: 0.35rem 0 0; padding-left: 1.1rem; color: var(--muted); font-size: 0.95em; }
ul.bullets { margin: 0 0 1rem; padding-left: 1.2rem; max-width: 72ch; }
ul.bullets li { margin: 0.25rem 0; }
body.hide-done .item.done { display: none; }
body.hide-done section[data-items]:not([data-items="0"]) .checklist:not(:has(.item:not(.done))) { display: none; }

.table-wrap { overflow-x: auto; margin: 0.5rem 0 1.4rem; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }
table { border-collapse: collapse; width: 100%; font-size: 0.95rem; }
th, td { text-align: left; vertical-align: top; padding: 0.6rem 0.8rem; border-bottom: 1px solid var(--line); }
th { font-family: var(--font-display); font-weight: 700; font-size: 0.78rem; letter-spacing: 0.05em; text-transform: uppercase; color: var(--muted); background: color-mix(in srgb, var(--surface) 70%, var(--bg)); }
tr:last-child td { border-bottom: 0; }
td code { white-space: normal; }
blockquote { margin: 0 0 1rem; padding: 0.6rem 1rem; border-left: 3px solid var(--mark); background: var(--mark-soft); border-radius: 0 6px 6px 0; max-width: 72ch; }

footer { max-width: 1180px; margin: 0 auto; padding: 0 16px 3rem; color: var(--muted); font-size: 0.85rem; }
footer p { margin: 0.2rem 0; }
footer { border-top: 1px solid var(--line); padding-top: 1.2rem; }
.credit { color: var(--fg); font-size: 0.95rem; display: flex; flex-wrap: wrap; gap: 0.3rem 0.9rem; align-items: baseline; }
.credit > a { font-family: var(--font-display); font-weight: 700; text-decoration: none; }
.credit-links { color: var(--muted); font-size: 0.88rem; }

@media (max-width: 900px) {
  .shell { grid-template-columns: 1fr; gap: 1rem; }
  .rail { position: static; max-height: none; overflow: visible; display: flex; flex-wrap: wrap; gap: 0.35rem; padding: 0; }
  .rail a { border: 1px solid var(--line); border-left-width: 1px; border-radius: 999px; padding: 0.3rem 0.7rem; font-size: 0.85rem; background: var(--surface); }
  .rail a.active { border-color: var(--accent); }
  .nav-count { display: none; }
  .meter { flex-basis: 100%; order: 3; }
  section { scroll-margin-top: 130px; }
  .langs a, .seg button { padding-block: 0.45rem; }
  .editor-body pre.gutter { display: none; }
  .table-wrap { font-size: 0.92rem; }
}
@media (max-width: 600px) {
  .topbar { position: static; }
  section { scroll-margin-top: 12px; }
  .rail { top: auto; }
  h3 { font-size: 0.95rem; }
}
@media (min-width: 901px) and (max-width: 1100px) {
  .shell { grid-template-columns: 200px minmax(0, 1fr); gap: 1.6rem; }
}
@media (prefers-reduced-motion: reduce) { .fill, .sec-fill, .box, .box::after { transition: none; } }
`;

// ---------- runtime ----------
const JS = String.raw`
(() => {
  const UI = window.AF_UI;
  const KEY = "agent-fundamentals-progress-v1";
  const THEME_KEY = "agent-fundamentals-theme";
  const items = Array.from(document.querySelectorAll("input.chk"));
  const total = items.length;
  let state = {};
  let localOk = true;
  let dbDoc = null;
  let writing = false, dirty = false, writeTimer = null;

  const $ = (s) => document.querySelector(s);
  const fmt = (s, m) => s.replace(/\{(\w+)\}/g, (_, k) => String(m[k]));
  const statusEl = $("#status");
  const setStatus = (mode) => {
    statusEl.textContent = mode === "account" ? UI.statusAccount : mode === "device" ? UI.statusDevice : UI.statusNone;
  };

  function loadLocal() { try { const raw = localStorage.getItem(KEY); if (raw) state = JSON.parse(raw) || {}; } catch (e) { localOk = false; } }
  function saveLocal() { try { localStorage.setItem(KEY, JSON.stringify(state)); localOk = true; } catch (e) { localOk = false; } }

  const fills = {}, counts = {};
  document.querySelectorAll("[data-fill]").forEach((el) => (fills[el.dataset.fill] = el));
  document.querySelectorAll("[data-count]").forEach((el) => (counts[el.dataset.count] ||= []).push(el));

  function render() {
    let done = 0;
    const perSec = {};
    for (const el of items) {
      const on = !!state[el.dataset.id];
      el.checked = on;
      el.closest(".item").classList.toggle("done", on);
      const sec = el.closest("section").id;
      perSec[sec] ||= { done: 0, total: 0 };
      perSec[sec].total++;
      if (on) { done++; perSec[sec].done++; }
    }
    $("#fill").style.width = total ? (100 * done / total) + "%" : "0%";
    $("#count").textContent = fmt(UI.ofDone, { done, total });
    $(".meter").setAttribute("aria-valuenow", String(done));
    for (const [sec, c] of Object.entries(perSec)) {
      if (fills[sec]) fills[sec].style.width = (100 * c.done / c.total) + "%";
      (counts[sec] || []).forEach((el) => (el.textContent = c.done + "/" + c.total));
      const link = document.querySelector('.rail a[data-sec="' + sec + '"]');
      if (link) link.classList.toggle("complete", c.done === c.total);
    }
  }

  async function initStore() {
    if (!window.claude || typeof window.claude.use !== "function") return setStatus(localOk ? "device" : "none");
    let db = null, user = null;
    try { [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]); } catch (e) {}
    if (!db || !user) return setStatus(localOk ? "device" : "none");
    const uid = await user.id();
    if (!uid) return setStatus(localOk ? "device" : "none");
    let ref;
    try { ref = db.doc("data/users/" + uid + "/checklist"); } catch (e) { return setStatus(localOk ? "device" : "none"); }
    let first = true;
    ref.onSnapshot((snap) => {
      if (first) {
        first = false;
        dbDoc = ref;
        if (!snap.exists) { if (Object.keys(state).length) queueWrite(); setStatus("account"); return; }
      }
      if (snap.exists) {
        const d = snap.data();
        const checked = d && d.checked && typeof d.checked === "object" ? d.checked : {};
        state = Object.assign({}, checked);
        saveLocal();
        render();
      }
      setStatus("account");
    }, () => { dbDoc = null; setStatus(localOk ? "device" : "none"); });
  }
  function queueWrite() { if (!dbDoc) return; clearTimeout(writeTimer); writeTimer = setTimeout(flush, 450); }
  async function flush() {
    if (!dbDoc) return;
    if (writing) { dirty = true; return; }
    writing = true;
    try { await dbDoc.set({ checked: state, updatedAt: new Date().toISOString() }); setStatus("account"); }
    catch (e) {
      if (e && e.code === "unavailable") setTimeout(flush, 700 + Math.random() * 800);
      else { dbDoc = null; setStatus(localOk ? "device" : "none"); }
    } finally { writing = false; if (dirty) { dirty = false; flush(); } }
  }

  for (const el of items) {
    el.addEventListener("change", () => {
      if (el.checked) state[el.dataset.id] = true; else delete state[el.dataset.id];
      saveLocal(); render(); queueWrite();
    });
  }

  const hideDone = $("#hide-done");
  try { hideDone.checked = localStorage.getItem(KEY + ":hide") === "1"; } catch (e) {}
  document.body.classList.toggle("hide-done", hideDone.checked);
  hideDone.addEventListener("change", () => {
    document.body.classList.toggle("hide-done", hideDone.checked);
    try { localStorage.setItem(KEY + ":hide", hideDone.checked ? "1" : "0"); } catch (e) {}
  });

  const slot = $("#reset-slot");
  function armReset() {
    const n = Object.keys(state).length;
    const q = n === 1 ? UI.clearOne : fmt(UI.clearMany, { n });
    slot.innerHTML = "";
    const wrap = document.createElement("span"); wrap.className = "confirm";
    wrap.append(q + " ");
    const yes = document.createElement("button"); yes.type = "button"; yes.className = "danger"; yes.textContent = UI.clear;
    const no = document.createElement("button"); no.type = "button"; no.textContent = UI.keep;
    yes.addEventListener("click", () => { state = {}; saveLocal(); render(); queueWrite(); disarm(); });
    no.addEventListener("click", disarm);
    wrap.append(yes, " ", no);
    slot.append(wrap);
  }
  function disarm() {
    slot.innerHTML = "";
    const b = document.createElement("button"); b.type = "button"; b.id = "reset"; b.className = "danger"; b.textContent = UI.reset;
    b.addEventListener("click", armReset);
    slot.append(b);
  }
  $("#reset").addEventListener("click", armReset);

  // Theme: system (no attribute) / light / dark, stored per device and applied before paint by the inline script above.
  const root = document.documentElement;
  const segButtons = Array.from(document.querySelectorAll("[data-theme-choice]"));
  function reflectTheme() {
    let cur = "system";
    try { const t = localStorage.getItem(THEME_KEY); if (t === "light" || t === "dark") cur = t; } catch (e) {}
    segButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.themeChoice === cur)));
  }
  segButtons.forEach((b) => b.addEventListener("click", () => {
    const c = b.dataset.themeChoice;
    try { if (c === "system") localStorage.removeItem(THEME_KEY); else localStorage.setItem(THEME_KEY, c); } catch (e) {}
    if (c === "system") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", c);
    reflectTheme();
  }));
  reflectTheme();

  // Code panes: syntax highlighting when the library loaded, and a copy button with a selection fallback.
  if (window.hljs) document.querySelectorAll(".editor pre code").forEach((el) => { try { window.hljs.highlightElement(el); } catch (e) {} });
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const label = btn.textContent;
    btn.addEventListener("click", async () => {
      const code = btn.closest(".editor").querySelector("pre code");
      const text = code.textContent;
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
        const r = document.createRange(); r.selectNodeContents(code);
        const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
        try { ok = document.execCommand("copy"); } catch (e2) {}
      }
      if (ok) { btn.textContent = btn.dataset.copied; btn.classList.add("ok"); setTimeout(() => { btn.textContent = label; btn.classList.remove("ok"); }, 1600); }
    });
  });

  const links = Array.from(document.querySelectorAll(".rail a[data-sec]"));
  if ("IntersectionObserver" in window) {
    const seen = new Map();
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) seen.set(en.target.id, en.isIntersecting ? en.boundingClientRect.top : Infinity);
      let best = null, bestTop = Infinity;
      for (const [id, top] of seen) if (top < bestTop) { best = id; bestTop = top; }
      if (best) links.forEach((a) => a.classList.toggle("active", a.dataset.sec === best));
    }, { rootMargin: "-20% 0px -60% 0px" });
    document.querySelectorAll("main section").forEach((s) => io.observe(s));
  }

  loadLocal();
  render();
  setStatus(localOk ? "device" : "none");
  initStore();
})();
`;

// ---------- write outputs ----------
const BODY_START = '<a class="skip"'; // first body element of the fragment; everything before it belongs in <head>
const wrap = (L, fragment) =>
  `<!doctype html>\n<html lang="${L.code}">\n<head>\n<meta charset="utf-8">\n${fragment.slice(0, fragment.indexOf(BODY_START))}</head>\n<body>\n${fragment.slice(fragment.indexOf(BODY_START))}</body>\n</html>\n`;

/** Build-time self-check of a rendered page; throws on defects a browser would hide. */
function selfCheck(name, html) {
  const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  const problems = [];
  if (dup.length) problems.push(`duplicate ids: ${[...new Set(dup)].join(", ")}`);
  if (/data-id="undefined"/.test(html)) problems.push("checklist item without an id");
  if (/<a [^>]*>[^<]*<a /.test(html)) problems.push("nested links");
  if (html.indexOf(BODY_START) < 0) problems.push("skip link missing");
  if (problems.length) throw new Error(`${name}: ${problems.join("; ")}`);
}

mkdirSync(SITE_DIR, { recursive: true });
let pages = 0;
for (const L of LANGS) {
  const doc = docs[L.code];
  if (!doc) continue;
  const fragment = renderPage(L, doc, { absolute: false });
  const outDir = L.dir ? join(SITE_DIR, L.dir) : SITE_DIR;
  mkdirSync(outDir, { recursive: true });
  const page = wrap(L, fragment);
  selfCheck(`${L.code}/index.html`, page);
  writeFileSync(join(outDir, "index.html"), page);
  copyFileSync(L.code === "en" ? SRC_EN : join(here, "i18n", `${L.code}.md`), join(SITE_DIR, L.code === "en" ? "claude-agent-fundamentals.md" : `${L.code}.md`));
  pages++;
}
// Icons: the SVG is the favicon, the PNGs serve iOS and Android; assets/ is committed (see scripts/make-icons.sh).
const ICONS = { "icon.svg": "favicon.svg", "favicon-32.png": "favicon-32.png", "apple-touch-icon.png": "apple-touch-icon.png", "icon-192.png": "icon-192.png", "icon-512.png": "icon-512.png" };
for (const [from, to] of Object.entries(ICONS)) {
  const p = join(here, "assets", from);
  if (!existsSync(p)) throw new Error(`missing icon asset: assets/${from} (run scripts/make-icons.sh)`);
  copyFileSync(p, join(SITE_DIR, to));
}
writeFileSync(join(SITE_DIR, "manifest.webmanifest"), JSON.stringify({
  name: "Agent Fundamentals",
  short_name: "Agent Fundamentals",
  description: "A tiered checklist for working professionally with Claude and coding agents.",
  start_url: "/",
  scope: "/",
  display: "standalone",
  background_color: "#f5f7f6",
  theme_color: "#0d7a65",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
}, null, 2) + "\n");

// English fragment for the claude.ai artifact (language links point at the public site).
writeFileSync(join(here, "claude-agent-fundamentals.html"), renderPage(LANGS[0], enDoc, { absolute: true }));

console.log(`built ${pages} language page(s) in agent-fundamentals/ + the English artifact fragment: ${enDoc.sections.length} sections, ${totalItems} items per language`);
