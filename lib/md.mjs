// Shared Markdown parser for the checklist (subset: see build.mjs header) and a
// structural signature used to verify that every translation mirrors the English source.

export function parseMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const sections = [];
  const intro = [];
  let title = "Checklist";
  let cur = null;
  const target = () => (cur ? cur.blocks : intro);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) { i++; continue; }
    if (/^# /.test(line)) { title = line.slice(2).trim(); i++; continue; }
    if (/^## /.test(line)) {
      const t = line.slice(3).trim();
      cur = { title: t, blocks: [], items: 0 };
      sections.push(cur);
      i++; continue;
    }
    if (/^### /.test(line)) { target().push({ type: "h3", text: line.slice(4).trim() }); i++; continue; }
    if (/^```/.test(line)) {
      const info = line.slice(3).trim();
      const [lang = "", ...rest] = info.split(/\s+/);
      const file = rest.join(" ");
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      target().push({ type: "code", lang, file, text: buf.join("\n") });
      continue;
    }
    if (/^\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      target().push({ type: "table", head: cells(rows[0]), body: rows.slice(2).map(cells) });
      continue;
    }
    if (/^> /.test(line)) {
      const buf = [];
      while (i < lines.length && /^> /.test(lines[i])) buf.push(lines[i++].slice(2));
      target().push({ type: "quote", text: buf.join(" ") });
      continue;
    }
    if (/^- /.test(line)) {
      const list = { type: "list", items: [] };
      while (i < lines.length && /^- /.test(lines[i])) {
        const raw = lines[i].slice(2);
        const m = raw.match(/^\[( |x|X)\] (.*)$/);
        const item = m ? { check: true, text: m[2], subs: [] } : { check: false, text: raw, subs: [] };
        i++;
        while (i < lines.length && /^\s{2,}- /.test(lines[i])) { item.subs.push(lines[i].replace(/^\s+- /, "")); i++; }
        if (item.check && cur) cur.items++;
        list.items.push(item);
      }
      target().push(list);
      continue;
    }
    const buf = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,3} |```|\||> |- )/.test(lines[i])) buf.push(lines[i++]);
    target().push({ type: "p", text: buf.join(" ") });
  }
  return { title, intro, sections };
}

/** FNV-1a hash of a string: fenced code must be byte-identical across languages. */
export function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); }

/** Code spans in a piece of inline text, in order. Commands must survive translation verbatim. */
export const codeSpans = (s) => (s.match(/`[^`]+`/g) || []);

/** One line per structural element; two documents with equal signatures have the same shape. */
export function signature(doc) {
  const out = [];
  const block = (b, where) => {
    switch (b.type) {
      case "h3": out.push(`${where} h3 code=${codeSpans(b.text).join(" ")}`); break;
      case "p": out.push(`${where} p code=${codeSpans(b.text).join(" ")}`); break;
      case "quote": out.push(`${where} quote`); break;
      case "code": out.push(`${where} code ${b.lang} file=${b.file || ""} lines=${b.text.split("\n").length} hash=${fnv(b.text)}`); break;
      case "table": out.push(`${where} table cols=${b.head.length} rows=${b.body.length} code=${b.body.map((r) => r.map((c) => codeSpans(c).join(" ")).join("|")).join("||")}`); break;
      case "list":
        b.items.forEach((it, k) => out.push(`${where} ${it.check ? "item" : "bullet"}#${k} subs=${it.subs.length} bold=${/^\*\*[^*]+\*\*/.test(it.text) ? 1 : 0} house=${/\(House rule\)/.test(it.text) ? 1 : 0} code=${codeSpans(it.text).join(" ")}`));
        break;
    }
  };
  doc.intro.forEach((b, k) => block(b, `intro/${k}`));
  doc.sections.forEach((s, si) => { out.push(`section#${si} items=${s.items}`); s.blocks.forEach((b, k) => block(b, `s${si}/${k}`)); });
  return out;
}

/** Human-readable list of the first differences between the English and a translation. */
export function compare(enDoc, otherDoc, max = 12) {
  const a = signature(enDoc), b = signature(otherDoc);
  const diffs = [];
  const n = Math.max(a.length, b.length);
  for (let k = 0; k < n && diffs.length < max; k++) {
    if (a[k] !== b[k]) diffs.push({ at: k, en: a[k] || "(missing)", other: b[k] || "(missing)" });
  }
  return diffs;
}
