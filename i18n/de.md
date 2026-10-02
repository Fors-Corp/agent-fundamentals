# Professionell mit Claude und Coding-Agenten arbeiten

Eine Checkliste der Gewohnheiten, die den gelegentlichen vom professionellen Einsatz von Claude unterscheiden. Sie deckt Claude Code (CLI und Desktop-App), die Chat-Oberfläche claude.ai und den Bau eigener Agenten mit der Claude API und dem Agent SDK ab. Die ersten drei Abschnitte sind Stufen: Basics, Fortgeschritten, Profi. Die darauffolgenden Abschnitte sind stufenübergreifende Themen: Token-Ökonomie, Modell-Routing, Chat, die API und die Hausregeln, nach denen dieses Team arbeitet.

So nutzen Sie die Liste: Haken Sie ab, was Sie bereits konsequent tun. Alles, was offen bleibt, ist Ihre nächste Fähigkeit zum Aufbauen. Mit **Hausregel** markierte Punkte stammen aus Marcs Arbeitsregeln, die Agenten aus `~/.claude/CLAUDE.md` laden; sie sind im Abschnitt Hausregeln vollständig wiedergegeben, damit das Team denselben Text liest wie die Agenten. Alles andere ist allgemeine Praxis.

Zuletzt überarbeitet am 2026-10-02. Geprüft gegen Claude Code 2.1, graft 0.21.1, CodeGraph 1.6.1, Vercel CLI 62.2 und das Modellangebot der Claude API vom September 2026.

## Basics

Die Gewohnheiten, auf die es ab der ersten Sitzung ankommt. Keine davon erfordert Konfiguration.

### Bevor Sie tippen

- [ ] **Formulieren Sie die Aufgabe wie ein Ticket.** Nennen Sie Ziel, Randbedingungen und das Kriterium für „fertig“ in einer einzigen Nachricht. Agenten füllen Lücken mit Vermutungen, und die Abnahmekriterien, die Sie weglassen, werden am häufigsten falsch geraten.
- [ ] **Verweisen Sie auf Kontext, statt ihn einzufügen.** Nennen Sie Dateien, Funktionen, Fehlermeldungen oder URLs. Der Agent liest sie selbst, mit weniger Tokens als eine eingefügte Textwand, und er liest den aktuellen Stand statt einer veralteten Kopie.
- [ ] **Sagen Sie, was tabu ist.** Dateien außerhalb des Scopes, öffentliche Schnittstellen, Migrationen, alles mit Deploy-Abhängigkeit. Ein Satz zum Scope erspart eine Stunde Rückbau.
- [ ] **Verlangen Sie bei allem Nicht-Trivialen zuerst einen Plan.** In Claude Code wechseln Sie mit Shift+Tab in den Plan-Modus; der Agent liest und macht Vorschläge, ändert aber nichts, bevor Sie zustimmen. Im Chat bitten Sie vor der vollständigen Antwort um eine Gliederung.
- [ ] **Eine Aufgabe pro Unterhaltung.** Beginnen Sie für unzusammenhängende Arbeit neu (`/clear`). Restkontext der letzten Aufgabe wird bei jedem Turn mitbezahlt und täuscht das Modell darüber, was jetzt wichtig ist.
- [ ] **Wissen Sie, auf welcher Oberfläche Sie arbeiten.** Chat zum Nachdenken, Entwerfen und Analysieren eingefügten Materials. Claude Code für alles, was Dateien, ein Repo, ein Terminal oder einen Browser berührt. Die API, wenn das Verhalten in Ihrem eigenen Produkt stecken soll.

### Während der Sitzung

- [ ] **Lesen Sie, was der Agent sagt, bevor Sie antworten.** Wenn er eine Annahme nennt, korrigieren Sie sie sofort. Wer spät bestätigt, muss Arbeit wiederholen, die auf der falschen Prämisse aufbaut.
- [ ] **Beantworten Sie Fragen mit Entscheidungen.** Wenn der Agent anhält und fragt, braucht er eine Entscheidung, die nur Sie treffen können. Treffen Sie sie und lassen Sie ihn weiterarbeiten; beantworten Sie keine Frage mit einer Gegenfrage.
- [ ] **Unterbrechen Sie früh.** Escape stoppt den aktuellen Turn. Wenn der Agent bei Schritt zwei in die falsche Richtung läuft, warten Sie nicht bis Schritt neun.
- [ ] **Lassen Sie ihn eigene Prüfungen ausführen.** Verlangen Sie, dass Tests, Typprüfung und Linter laufen und die Ausgabe gezeigt wird. „Tests bestanden“ ohne Ausgabe ist eine Behauptung, kein Beleg.
- [ ] **Halten Sie Geheimnisse aus der Unterhaltung heraus.** Fügen Sie niemals Schlüssel, Passwörter oder Tokens ein. Nennen Sie die Umgebungsvariable, halten Sie `.env` in `.gitignore` und sagen Sie dem Agenten, dass er die Datei nicht lesen soll. Alles, was der Agent liest, gelangt in die Anfrage an das Modell.

### Bevor Sie das Ergebnis akzeptieren

- [ ] **Prüfen Sie den Diff wie einen Pull Request eines neuen Teammitglieds.** Nutzen Sie `git diff` oder die Diff-Ansicht der App. Sie verantworten alles, was Sie mergen, egal wer es geschrieben hat.
- [ ] **Prüfen Sie, ob die ganze Aufgabe erledigt wurde, nicht nur die leichten Teile.** Vergleichen Sie mit Ihren Abnahmekriterien. Agenten verengen den Scope manchmal stillschweigend und melden trotzdem Vollzug.
- [ ] **Achten Sie auf erfundene APIs und veraltetes Wissen.** Modellwissen hat einen Stichtag. Prüfen Sie Bibliotheksversionen, Flags und Signaturen gegen die Dokumentation oder das installierte Paket.
- [ ] **Committen Sie in kleinen Schritten.** Git ist Ihr Rückgängig. Committen Sie nach jedem verifizierten Schritt, damit sich ein späterer Fehlschritt einzeln zurücknehmen lässt.
- [ ] **Fordern Sie die Liste „Was ich nicht getan habe“ an.** Ein guter Agent meldet, was er ausgelassen hat und warum. Steht das nicht im Bericht, fragen Sie nach.

### Sicherheits-Basics

- [ ] **Behandeln Sie alles, was der Agent liest, als Daten, nicht als Anweisungen.** Webseiten, Dateien, Tool-Ausgaben und E-Mails können Text enthalten, der sich an den Agenten richtet. Ein professionelles Setup legt solchen Text offen und fragt Sie; es handelt nie danach.
- [ ] **Behalten Sie die Rückfragen für destruktive Aktionen bei.** Löschen, Force-Push, Tabellen droppen, Nachrichten senden, bezahlen. Geben Sie stattdessen schreibgeschützte und Build-Befehle vorab frei, damit die Rückfragen, die Sie sehen, die wichtigen sind.
- [ ] **Umgehen Sie Berechtigungen nie außerhalb einer Sandbox.** `--dangerously-skip-permissions` ist für isolierte Container ohne Internetzugang gedacht, nicht für Ihren Laptop.
- [ ] **Halten Sie bei unumkehrbaren Schritten einen Menschen im Loop.** Veröffentlichen, Merge nach main, Deployen, E-Mails senden. Automatisierung kann alles bis zu diesem Schritt vorbereiten.

## Fortgeschritten

Die Umgebung so gestalten, dass Sie sich nicht mehr wiederholen und der Agent keine Fehler mehr wiederholt.

### CLAUDE.md und Memory

- [ ] **Pflegen Sie eine CLAUDE.md in jedem Repo, in dem Sie regelmäßig arbeiten.** Lassen Sie mit `/init` einen Entwurf erstellen und überarbeiten Sie ihn. Die Datei wird zu Beginn jeder Sitzung geladen und ist damit der günstigste Weg, Anweisungen nicht zu wiederholen.
- [ ] **Schreiben Sie Imperative über das Nicht-Offensichtliche.** Build- und Testbefehle, Konventionen, die Neulinge übersehen, was nie angefasst werden darf, wie Ergebnisse berichtet werden sollen. Beschreiben Sie nicht, was der Code ohnehin zeigt; der Agent kann Code lesen.
- [ ] **Halten Sie sie kurz.** Jede Zeile kostet bei jedem Turn Tokens und verwässert die Zeilen, auf die es ankommt. Einige hundert Zeilen sind die Obergrenze. Verlagern Sie selten benötigtes Material in Skills, die bei Bedarf geladen werden.
- [ ] **Nutzen Sie die drei Geltungsbereiche bewusst.** `~/.claude/CLAUDE.md` für Ihre Arbeitsweise überall, `<repo>/CLAUDE.md` für das Projekt und Dateien auf Verzeichnisebene für Subsysteme mit eigenen Regeln.
- [ ] **Befördern Sie die dritte Korrektur.** Wenn Sie im Chat zum dritten Mal dasselbe Verhalten korrigieren, gehört es in die CLAUDE.md oder in einen Hook. Der Skill `claude-md-improver` prüft die Datei auf veraltete oder widersprüchliche Zeilen.
- [ ] **Lassen Sie Memory Fakten halten, keine Regeln.** Das Auto-Memory von Claude Code speichert Projektfakten und Präferenzen über Sitzungen hinweg. Räumen Sie veraltete Einträge auf; eine falsche Erinnerung ist schlimmer als keine.

### Kontextverwaltung

- [ ] **Behandeln Sie den Kontext wie ein Budget.** `/context` zeigt, was das Fenster füllt. Große Tool-Ausgaben, eingefügte Logs und geladene MCP-Tool-Schemas sind die üblichen Verursacher.
- [ ] **Komprimieren Sie an Phasengrenzen, nicht unter Zwang.** Führen Sie `/compact` mit einem Hinweis aus, was erhalten bleiben soll: nach der Erkundung und vor der Umsetzung oder nachdem ein Fix steht und bevor die Verifikation beginnt. Automatische Komprimierung an beliebiger Stelle verliert genau die Details, die Sie am meisten brauchten.
- [ ] **Fügen Sie Logs nie ein, verweisen Sie darauf.** Speichern Sie die Ausgabe in einer Datei und lassen Sie den Agenten sie mit `grep` oder `tail` auswerten. Ein einmal eingefügtes Log wird bei jedem späteren Turn mitbezahlt.
- [ ] **Lesen Sie eine soeben bearbeitete Datei nicht erneut.** Das Edit-Tool schlägt laut fehl, wenn sich sein Ziel geändert hat; ein erneutes Lesen zur „Kontrolle“ ist reine Verschwendung.
- [ ] **Bevorzugen Sie Text gegenüber Screenshots.** Im Browser ist das Lesen des Seitentexts oder des Accessibility-Baums günstiger und präziser als ein Screenshot. Screenshots nur für das Layout.
- [ ] **Räumen Sie verbundene MCP-Server auf.** Die Tool-Schemas jedes Servers können in den Kontext gelangen. Verbinden Sie, was die Aufgabe braucht, und deaktivieren Sie den Rest; verzögertes Laden von Tools hilft, aber weniger Server helfen mehr.

### Skills, Hooks und Berechtigungen

- [ ] **Machen Sie wiederkehrende Abläufe zu Skills.** Eine `SKILL.md` unter `~/.claude/skills/<name>/` oder im Repo wird über `/<name>` geladen oder wenn ihre Beschreibung zur Aufgabe passt. Deploy-Schritte, Review-Checklisten und repo-spezifische Workflows gehören hierher.
- [ ] **Setzen Sie Hooks für alles ein, was immer geschehen muss.** Anweisungen sind probabilistisch, Hooks deterministisch. Formatieren beim Speichern, `git push --force` blockieren, vor Shell-Befehlen eine Faktenangabe verlangen. Hooks liegen in `settings.json`.
- [ ] **Bauen Sie eine Berechtigungs-Allowlist.** Geben Sie schreibgeschützte Befehle (`git status`, `ls`, den Test-Runner) in `.claude/settings.json` vorab frei, damit Rückfragen nur bei Aktionen erscheinen, die eine verdienen. `/fewer-permission-prompts` wertet Ihren Verlauf aus und schlägt die Liste vor.
- [ ] **Nutzen Sie Worktrees für parallele Arbeit.** Ein Git-Worktree pro Aufgabe oder Agent verhindert, dass sich Änderungen in die Quere kommen. Subagenten akzeptieren `isolation: "worktree"`; auch Ihre eigene Sitzung kann in einen wechseln.
- [ ] **Lernen Sie die Tastatur.** Shift+Tab wechselt zwischen Berechtigungsmodi und Plan-Modus; Escape unterbricht; `/model`, `/cost`, `/clear`, `/compact` und `/context` decken die meisten täglichen Vorgänge ab. Den Effort setzen Sie mit dem Flag `--effort` oder in den Modellreglern der App.

### Delegation an Subagenten

- [ ] **Delegieren Sie leseintensive Suchen.** Starten Sie einen schreibgeschützten Explorer-Agenten, der viele Dateien durchkämmt und ein Fazit mit `file:line`-Verweisen zurückgibt. Die Dateiinhalte bleiben in seinem Kontext, nicht in Ihrem.
- [ ] **Geben Sie Subagenten ein vollständiges Briefing.** Sie sehen Ihre Unterhaltung nicht. Nennen Sie Ziel, Dateien, Abnahmekriterien, die auszuführenden Gates und die Anweisung, keine Fragen zu stellen und die Aufgabe nicht zurückzugeben.
- [ ] **Dimensionieren Sie das Modell passend zur Aufgabe.** Haiku für mechanische Durchläufe, Sonnet für abgegrenzte Implementierung, das Top-Modell für Urteilsvermögen. Nennen Sie jedes Mal Modell und Begründung. (House rule)
- [ ] **Starten Sie unabhängige Agenten in einer Nachricht.** Serielles Starten verschwendet Wartezeit. Agenten, die keine Dateien teilen, können gemeinsam laufen und gemeinsam fertig werden.
- [ ] **Definieren Sie wiederverwendbare Agenten einmal.** Agentendateien in `.claude/agents/*.md` tragen Modell, Effort und Tools im Frontmatter, sodass nur noch das Briefing variiert.

### Modell und Effort

- [ ] **Kennen Sie das Modellangebot und die Preise.** Siehe die Modelltabelle im API-Abschnitt. Preisverhältnisse bestimmen das Routing: Das Top-Modell kostet pro Ausgabe-Token das Zehnfache von Sonnet.
- [ ] **Drehen Sie am Effort, bevor Sie das Modell wechseln.** Der Effort (`low` bis `max`) tauscht Gründlichkeit gegen Tokens innerhalb eines Modells. `xhigh` ist der Standard von Claude Code für Coding; `low` passt zu mechanischer Arbeit und den meisten Subagenten.
- [ ] **Starker Orchestrator, günstige Hände.** Die Sitzung, die die Aufgabe hält und Urteile fällt, läuft auf dem Top-Modell; die Agenten für abgegrenzte Arbeit laufen günstiger.
- [ ] **Der Fast-Modus ist dasselbe Modell mit Aufpreis.** `/fast` erhöht die Ausgabegeschwindigkeit, nicht die Leistungsfähigkeit. Nutzen Sie ihn für interaktive Sitzungen, in denen Latenz stört, nicht für Batch-Arbeit.

### Verifikationsgewohnheiten

- [ ] **Eigene Tests während der Arbeit, die volle Suite einmal am Ende.** Führen Sie nur die Testdateien aus, die abdecken, was Sie ändern; die gesamte Suite läuft als letztes Gate und danach nur erneut, wenn dieser Lauf fehlschlug und Sie etwas geändert haben. (House rule)
- [ ] **Verlangen Sie einen Nachweis in der Abschlussnachricht.** Testausgabe, ein Screenshot, ein `curl`-Ergebnis. „Verifiziert“ und „fertig“ sind verschiedene Zustände; der Agent soll sagen, welchen er erreicht hat.
- [ ] **Holen Sie ein Review als zweite Meinung ein.** `/code-review` auf den Diff für Bugs, `/simplify` fürs Aufräumen, `/security-review` vor dem Merge von allem, was Eingaben, Authentifizierung oder Geheimnisse berührt.
- [ ] **Trennen Sie Autor und Reviewer.** Reviewen Sie in einer frischen Sitzung oder mit einem anderen Agenten. Wer den Code geschrieben hat, teilt dessen blinde Flecken.

## Profi

Orchestrierung, Automatisierung und Governance. Diese Punkte setzen voraus, dass Sie bereits alles Obige tun.

### Multi-Agent-Workflows

- [ ] **Immer Produzent plus unabhängiger Verifizierer.** Eine Stufe produziert, eine getrennte Stufe greift das Ergebnis an und repariert, was sie findet. Lassen Sie den Produzenten nie seine eigene Arbeit prüfen. (House rule)
- [ ] **Bevorzugen Sie ein deterministisches Orakel gegenüber einem Modell als Richter.** Tests, Round-Trips, byte-genaue Baselines, eine Referenzimplementierung. Wo Korrektheit entscheidbar ist, lassen Sie Code entscheiden und setzen ein günstiges Modell auf die Arbeit. (House rule)
- [ ] **Eröffnen Sie jeden Agenten-Prompt mit einer SETTLED-Präambel.** Der Harness reicht Ihre letzte Chat-Nachricht an Subagenten weiter; ohne die Präambel liest ein Agent eine Gesprächsnachricht und hält an, um zu fragen. Legen Sie fest, was er nicht tun darf und welche Gates er ausführen muss. (House rule)
- [ ] **Schützen Sie sich vor Platzhalter-Ergebnissen.** Ein Agent, dessen strukturierte Ausgabe abgelehnt wird, sendet womöglich einen gültigen, aber leeren Stub erneut, den die Laufzeit als Erfolg zählt. Validieren Sie den Inhalt im Skript und lesen Sie das Journal, bevor Sie für einen Neulauf zahlen. (House rule)
- [ ] **Ein Worktree pro paralleler Spur.** Spuren laufen nur parallel, wenn sie keine Dateien und keine CPU-sensitive Messung teilen; andernfalls reiht sich eine hinter dem Merge der anderen ein. (House rule)
- [ ] **Planen Sie nach Budget, nicht nach Ehrgeiz.** Prüfen Sie vor dem Start das Kontingent, nennen Sie die erwarteten Kosten des Laufs und berichten Sie am Ende die Ausgaben gegen die Obergrenze. Ein gut abgegrenzter Workflow schlägt drei dünne. (House rule)
- [ ] **Bringen Sie Entscheidungen als Evidenz zurück.** Wenn eine Stufe eine Entscheidung für den Verantwortlichen aufwirft, legen Sie die Messung vor, die sie klärt, und die Optionen samt Konsequenzen. Halten Sie die Antwort fest und ebenso die Behauptungen, die die Verifikation nicht bestanden haben. (House rule)
- [ ] **Nutzen Sie das Workflow-Tool für deterministische Orchestrierung.** Ein Skript mit `pipeline`-, `parallel`- und `agent`-Aufrufen, Phasen und schemageprüften Ausgaben. Es läuft nur, wenn der Nutzer zustimmt, weil es Tokens im Wert von Dutzenden Agenten verbrauchen kann.

### Headless- und geplante Läufe

- [ ] **Nutzen Sie den Print-Modus für Skriptläufe.** `claude -p "<prompt>"` ist nicht interaktiv; ergänzen Sie `--output-format json` für maschinenlesbare Ergebnisse, `--allowedTools` zur Einschränkung und `--bare` für minimale CI-Läufe ohne Hooks oder Plugin-Sync.
- [ ] **Planen Sie Routinen für wiederkehrende Arbeit.** Geplante Cloud-Agenten (`/schedule`) übernehmen nächtliche Berichte und Abhängigkeitsprüfungen. `/loop` fragt innerhalb einer Sitzung einen langsamen externen Zustand ab; es ist nicht für einmalige Aufgaben gedacht.
- [ ] **Geben Sie CI-Agenten nur die Tools, die sie brauchen.** Allowlists, schreibgeschützte Tokens und keine Push-Rechte, es sei denn, Pushen ist die Aufgabe.
- [ ] **Protokollieren Sie jeden Lauf.** Transkript, Kosten, Ergebnis. Werten Sie die Fehlschläge wöchentlich aus; sie sind die günstigste Quelle für Verbesserungen an CLAUDE.md und Hooks.

### Hooks als Gates

- [ ] **Bilden Sie Invarianten als blockierende Hooks ab.** Ein PreToolUse-Hook, der destruktives Git verweigert, vor Shell-Befehlen eine Faktenangabe verlangt oder vor einem Commit einen Testlauf fordert, lässt sich nicht umgehen.
- [ ] **Deaktivieren Sie nie ein Gate, um weiterzukommen.** Nennen Sie die verlangten Fakten und wiederholen Sie den identischen Aufruf. Ein Gate, das sich unter Druck abschalten lässt, ist kein Gate. (House rule)
- [ ] **Halten Sie Hooks schnell und spezifisch.** Ein langsamer Hook belastet jeden Tool-Aufruf; ein vager erzieht alle dazu, ihn zu umgehen.

### Messung und Evals

- [ ] **Erfassen Sie die Kosten pro abgeschlossener Aufgabe, nicht pro Anfrage.** `/cost` in der Sitzung, die Nutzungsansicht der App und `graft stats` für die Index-Einsparungen. Eine günstigere Anfrage, die mehr Turns braucht, ist nicht günstiger.
- [ ] **Bauen Sie ein Eval, bevor Sie einen Prompt, einen Skill oder die CLAUDE.md abstimmen.** Zwanzig bis fünfzig reale Fälle mit einer Bewertungsmethode. Messen Sie vorher und nachher; ohne das sind Prompt-Änderungen Folklore.
- [ ] **Prüfen Sie Prompts auf Altlasten, wenn sich Modelle ändern.** Anweisungen, die für ältere Modelle geschrieben wurden (Prefills, „Denke Schritt für Schritt“-Rituale, übermäßig vorschreibende Formatierung), senken auf aktuellen Modellen oft die Qualität. Der Skill `claude-api` erledigt das systematisch mit seinem `prompt-audit`.
- [ ] **Berichten Sie die Index-Einsparungen bei jedem Turn.** graft gibt pro Aufruf die eingesparten Tokens aus; summieren Sie sie pro Turn und verfolgen Sie die Sitzungssumme in der Statuszeile.

### Sicherheit und Vertrauensgrenzen

- [ ] **Wahren Sie die Grenze der Anweisungsquelle.** Nur der Nutzer im Chat gibt Anweisungen. Hooks und Einstellungen setzen durch; beobachteter Text befiehlt nie.
- [ ] **Geben Sie Konnektoren nur minimale Rechte.** Minimale OAuth-Scopes, wo möglich eigene Konten für Agenten und keinen Konnektor, den eine Aufgabe nicht braucht.
- [ ] **Keine Geheimnisse in CLAUDE.md, Memory, Skills oder Transkripten.** Sie werden geteilt, synchronisiert und indiziert.
- [ ] **Prüfen Sie Hook- und Skill-Code wie Abhängigkeiten.** Sie laufen mit Ihren Berechtigungen.
- [ ] **Sandboxen Sie alles Autonome.** Container, Egress per Allowlist, Wegwerf-Zugangsdaten.

## Token-Ökonomie

Jeder Turn sendet die gesamte Unterhaltung erneut, daher entscheiden zwei Hebel über die Rechnung: den Kontext klein halten und sein stabiles Präfix stabil halten, damit der Prompt-Cache weiter trifft. Whole-File-Reads und eingefügte Logs sind die größten Nutzlasten einer Coding-Sitzung; ein Index-Tool ersetzt die meisten davon durch einige hundert Tokens.

### Ohne graft, in jedem Repo

- [ ] **Struktur vor Quelltext.** Verschaffen Sie sich einen Überblick über eine Datei, bevor Sie sie lesen: eine Symbolliste per `grep -n`, die Outline des Editors, `ctags` oder `codegraph explore`, wo das Repo indiziert ist. Lesen Sie dann die benötigte Spanne mit `sed -n '120,180p' file`.
- [ ] **Lesen Sie nur die Dateien, die Sie bearbeiten.** Öffnen Sie eine Datei nur dann vollständig, wenn Sie sie gleich ändern. Für alles andere genügen die Outline oder die konkrete Spanne. (House rule)
- [ ] **Messen Sie, bevor Sie `cat` ausführen.** Zuerst `wc -l`. Eine Datei mit dreitausend Zeilen ist eine Entscheidung, kein Reflex.
- [ ] **Suchen Sie eingegrenzt und sortiert.** `rg` mit `--type` und Pfad, `-l` für eine Dateiliste, `-c` für Zählungen, bevor Sie Treffer ausgeben.
- [ ] **Delegieren Sie die Erkundung an einen schreibgeschützten Subagenten.** Er liefert ein Fazit mit `file:line`-Verweisen; sein Lesen gelangt nie in Ihren Kontext.
- [ ] **Begrenzen Sie jede Tool-Ausgabe.** `head`, `--max-count`, `tail -20` bei Testausgaben, `jq` mit Pfad bei JSON.
- [ ] **Halten Sie das stabile Präfix stabil.** Der System-Prompt (einschließlich CLAUDE.md) ist das gecachte Präfix. Ihn zu ändern oder mitten in der Sitzung das Modell zu wechseln, setzt den Cache für den Rest der Sitzung zurück.
- [ ] **Eigene Tests während der Arbeit, die volle Suite einmal.** Ein voller Suite-Lauf mitten in der Aufgabe verbrennt Tokens für Ausgaben, die Sie nicht lesen werden. (House rule)
- [ ] **Komprimieren Sie mit Absicht.** Legen Sie fest, was bleibt und was wegfällt. Eine Komprimierung, die den Plan behält und die Erkundung verwirft, ist mehr wert als eine, die alles nur halb erinnert behält.
- [ ] **Vermeiden Sie Screenshot-Schleifen.** Ein Screenshot zur Orientierung, danach Textextraktion. Wiederholte Screenshots derselben Seite sind die teuerste Art, sie zu lesen.

### Mit graft

graft pflegt im Repo-Stammverzeichnis ein Verzeichnis `graft/`: einen vorab gebauten Graphen aller Symbole mit ihrer `file:line`-Spanne, wer was aufruft, und kurze Prosa-Karten je Bereich. Jede Abfrage kostet einige hundert Tokens, braucht keinen API-Schlüssel, antwortet in unter einer Sekunde und aktualisiert sich vor der Antwort selbst, sodass sie den Code immer so beschreibt, wie er genau jetzt ist, einschließlich nicht committeter Änderungen.

- [ ] **Einmal pro Repo installieren.** `npm i -g @nanonets/graft@latest`, dann `graft init` im Repo. Ab npm 12 blockieren globale Installationen native Build-Skripte standardmäßig, sodass graft seine Parser nicht laden kann; wiederholen Sie die Installation mit `--allow-scripts=` und den Paketen, die npm in seiner Warnung nennt. Für Claude Code schreibt es die Anweisungsdatei, Hooks, Statuszeile und die MCP-Server-Anbindung; `graft build` baut den kostenlosen Verdrahtungsgraphen. `--deep` ergänzt eine LLM-Konzeptkarte; lassen Sie sie weg, sofern nicht verlangt.
- [ ] **Ein Aufruf pro Frage; wählen Sie das passende Tool.** Nutzen Sie die Tabelle unten. Die meisten Aufgaben brauchen genau einen graft-Aufruf; Tools zu verketten, „in der Hoffnung auf mehr“, ist der häufigste Weg, die Einsparung zu verschwenden.
- [ ] **`graft ask "<question>" --source` ist der Standard.** Gerankte Treffer mit dem Kern jeder Definition inline, sodass das Ergebnis der benötigte Code ist, ohne Nachlesen. `--in <path>` grenzt ein; `--full` nur, wenn der Kern zu klein ist, um darauf zu handeln.
- [ ] **`graft grep "<pattern>"`, wenn Sie jedes Vorkommen brauchen.** Treffer gruppiert nach umschließendem Symbol und nach Kopplung gerankt. Suchen Sie einen bloßen Namen, keine geratene Signatur; bei einem Fehlschlag lockern Sie das Muster, bevor Sie auf rohes grep zurückfallen.
- [ ] **`graft skeleton <file>`, bevor Sie eine Datei anfassen.** Nur Signaturen, etwa 200 Tokens, grob zehnmal günstiger als das Lesen der Datei.
- [ ] **`graft callers <symbol> --depth 2`, bevor Sie eine Signatur ändern.** Vorberechnete Kanten, keine Textsuche. `--depth all` vor jedem Refactoring oder jeder Änderung über mehrere Dateien; `--direction out` für das, wovon ein Symbol abhängt.
- [ ] **`graft map`, um sich in einem unbekannten Repo zu orientieren.** Lesen Sie danach die Hub-Karten, die es nennt. Gehen Sie nicht jedes aufgelistete Subsystem per Skeleton oder Frage durch.
- [ ] **Leiten Sie graft nie durch `head`, `tail` oder `sed -n`.** Die Ausgabe ist bereits begrenzt und sagt, was sie weggelassen hat. Sie zu beschneiden verliert Treffer und die Einsparungszeile, aus der die Summe der Statuszeile gelesen wird.
- [ ] **Vertrauen Sie den Spannen.** Die `covers:`-Liste eines Knotens wird aus dem Quelltext erzeugt und ist maßgeblich. Öffnen Sie Dateien nicht erneut, um sie gegenzuprüfen.
- [ ] **Berichten Sie bei jedem Turn, was graft gespart hat.** Jedes Tool beginnt mit `[graft] tokens saved ≈ N`. Summieren Sie diese Werte in der Antwort; `graft stats` zeigt die Mischung der Sitzung.
- [ ] **Binden Sie es in die CI ein.** `graft check` schlägt fehl, wenn der Index veraltet ist; `graft blast --format markdown` postet den Wirkungsradius eines Diffs als PR-Kommentar mit Diagramm.
- [ ] **Fragen Sie in Worktrees vom Haupt-Checkout aus ab.** Dort liegt der Index. Agenten nutzen ihn nur lesend und bearbeiten ihre eigene Kopie. (House rule)
- [ ] **Grenzen Sie in einem Monorepo mit `--in <scope>/` ein.** Treffer tragen ein Scope-Label; das Ranking ist über Teilprojekte hinweg fair, aber das Eingrenzen spart trotzdem Tokens.
- [ ] **Halten Sie graft aktuell.** `graft version` vergleicht den installierten Build mit npm; `graft upgrade` spielt ihn ein. Starten Sie den Agenten nach dem Upgrade neu. CodeGraph aktualisieren Sie mit `codegraph upgrade`, danach `codegraph sync` in jedem indizierten Repo.

| Wenn Sie ... | Greifen Sie zu | Aufrufe |
|---|---|---|
| Onboarding, „erkläre diese Codebasis“ | `graft map`, danach die genannten Hub-Karten lesen | 1 |
| Einen Ablauf verstehen, „wie funktioniert X“ | `graft ask "<flow>" --source` | 1 |
| Die richtige Stelle für eine Änderung finden | `graft ask "where is <behaviour>" --source` | 1 |
| Ein Symbol bearbeiten, das Sie schon benennen können | `graft grep "<symbol>"`, an der `file:line` bearbeiten | 1 |
| Umbenennen, Löschen, eine Signatur ändern | zuerst `graft callers <sym> --depth 2` | 1 |
| Refactoring oder Änderung über mehrere Dateien | `graft callers <sym> --depth all` vor dem Bearbeiten | 1 |
| „Wovon hängt das ab?“ | `graft callers <sym> --direction out` | 1 |
| Jedes Vorkommen eines Musters | `graft grep "<literal>"` | 1 |
| „Wie sieht die API dieser Datei aus?“ | `graft skeleton <file>` | 1 |
| Einen Fehler in Bereich X debuggen | `graft ask "<symptom>" --source`, danach `callers` auf den Verdächtigen | 1 bis 2 |
| Das Risiko eines Diffs vor dem Merge beurteilen | `graft callers <changed sym> --depth 2` | 1 pro Symbol |

Wenn der graft-MCP-Server verbunden ist, erscheinen dieselben Tools als `graft_find_code`, `graft_find_all`, `graft_file_api`, `graft_trace_calls`, `graft_repo_map` und `graft_check_freshness`. Laden Sie sie in einem einzigen `ToolSearch`-Aufruf, nie einzeln.

### CodeGraph als der andere Index

- [ ] **Wenn `.codegraph/` existiert, nutzen Sie es vor grep.** `codegraph explore "<question>"` liefert den Quelltext der relevanten Symbole plus die Aufrufpfade dazwischen in einem Aufruf; `callers`, `callees`, `impact` und `affected` decken den Rest ab. Führen Sie `codegraph init` nicht in fremden Repos aus; die Indizierung ist Sache des Eigentümers.
- [ ] **Wählen Sie pro Repo einen primären Index.** Beide Tools liefern Struktur vor Quelltext; beide parallel zu betreiben verdoppelt die Tool-Schemas im Kontext.

## Optimierung der Modellnutzung

Drei Hebel, in dieser Reihenfolge: Kontextgröße (der vorige Abschnitt), Effort, Modellstufe. Beurteilen Sie nach Kosten pro abgeschlossener Aufgabe. Ein günstigeres Modell, das mehr Turns, mehr Wiederholungen oder eine menschliche Korrektur braucht, ist nicht günstiger.

### Routing nach Aufgabenart

| Aufgabenart | Modell | Effort | Warum |
|---|---|---|---|
| Grep-Durchläufe, Log-Sichtung, Umbenennung nach bekannter Zuordnung, Formatierung, Boilerplate, Fakten aus einer bekannten Datei extrahieren | Haiku 4.5 | low | Hohes Volumen, wenig Urteilsvermögen; Fehler sind billig und sichtbar |
| Eine Komponente oder ein Test nach Spezifikation, ein dokumentierter Migrationsschritt, Doku-Updates, Changelog-Zusammenfassungen, Erst-Review | Sonnet 5.5 | medium (Standard) | Klare Abnahmekriterien begrenzen den Schaden einer falschen Antwort |
| Architektur- und Designentscheidungen, mehrdeutige Migrationen, Ursachenanalyse beim Debugging, Sicherheitsreview, adversariale Verifikation, Schlussurteil über die Ausgabe anderer Agenten | Opus 5.5 oder das Top-Modell der Sitzung, wenn das Kontingent es zulässt | high oder xhigh | Eine falsche Antwort ist teuer zu entdecken und zurückzunehmen |
| Die interaktive Sitzung, die die gesamte Aufgabe hält | Das beste verfügbare Modell | xhigh (Standard von Claude Code) | Sie fällt die Urteile und schreibt die Briefings für alle anderen |

### Ohne graft

- [ ] **Starker Orchestrator, günstige Hände.** Die Sitzung oder das Skript, das die Aufgabe hält, läuft auf dem Top-Modell; alles Abgegrenzte läuft auf Sonnet oder Haiku.
- [ ] **Schärfen Sie das Briefing, damit ein günstigeres Modell nicht erkunden muss.** Beim Erkunden verbrennen günstige Modelle Turns und gehen in die Irre. Mit `file:line`-Verweisen und Abnahmekriterien leistet Sonnet, was sonst Opus leisten würde.
- [ ] **Senken Sie den Effort, bevor Sie die Stufe senken.** Messen Sie an einer Stichprobe realer Aufgaben. Das neueste Modell bei niedrigem Effort erreicht oft ein älteres bei hohem.
- [ ] **Stufen Sie den Verifizierer nie herab.** Bei der Verifikation kosten falsche Antworten am meisten. Lassen Sie sie auf dem stärksten Modell laufen, das Ihr Kontingent erlaubt, und prüfen Sie die Nutzung vor dem Start. (House rule)
- [ ] **Vermeiden Sie Kaskaden, die den Cache zersplittern.** Prompt-Caches gelten pro Modell. Eine Multi-Modell-Kaskade in einer API-App verschenkt die Cache-Wiederverwendung zwischen ihren Modellen; ein Modell mit abgestimmtem Effort gewinnt meist.
- [ ] **Erben Sie das Sitzungsmodell nur, wenn die Aufgabe die Top-Stufe braucht.** Setzen Sie Stufen auf das, was sie brauchen, nicht auf das, was den Workflow gerade ausführt. (House rule)

### Mit graft

- [ ] **Lassen Sie graft die Erkundung übernehmen und routen Sie dann eine Stufe tiefer.** `graft ask --source` liefert exakte Spannen mit eingeblendetem Kern, sodass ein Sonnet-Agent bearbeiten kann, wofür früher Opus zum Finden nötig war.
- [ ] **Geben Sie Haiku die Karte, nicht die Suche.** `graft callers <sym> --depth all` ist die vollständige Liste der Stellen für eine Umbenennung. Geben Sie diese Liste einem Haiku-Agenten zur mechanischen Anwendung; lassen Sie ihn die Liste nicht selbst ermitteln.
- [ ] **Senken Sie den Effort bei graft-gestützten Lookups.** Es sind weniger Tool-Aufrufe nötig, daher bringt zusätzliches Abwägen wenig.
- [ ] **Halten Sie Tool-Ergebnisse klein, um den Cache warm zu halten.** graft-Ausgaben sind begrenzt; Whole-File-Reads sind die großen Nutzlasten, die stabilen Kontext aus dem Fenster verdrängen.
- [ ] **Investieren Sie die Einsparungen in Verifikation.** Wenn graft pro Sitzung zehntausende Tokens spart, ist das das Budget für einen stärkeren Verifizierer, nicht für mehr Erkundung.

## Claude.ai-Chat und Projects

- [ ] **Ein Project pro Fachgebiet.** Project-Anweisungen tragen den dauerhaften Kontext; das Project-Wissen trägt die Dokumente. Beides wird geladen, ohne in jeden Chat eingefügt zu werden.
- [ ] **Erst gliedern, dann Abschnitt für Abschnitt ausarbeiten.** Lange Antworten in einem Zug verbergen strukturelle Probleme bis zum Schluss.
- [ ] **Zeigen Sie die gewünschte Ausgabe.** Ein kurzes Beispiel für Format, Ton oder Tabelle schlägt drei Absätze Beschreibung.
- [ ] **Fragen Sie nach Quellen und prüfen Sie sie.** Bei Fakten, Daten und Zahlen fragen Sie, woher sie stammen, und verifizieren vor der Wiederverwendung.
- [ ] **Nutzen Sie Artifacts für alles, was Sie wiederverwenden oder teilen.** Dokumente, Seiten, Diagramme und kleine Tools sind als Artifacts besser aufgehoben als als Chat-Text.
- [ ] **Wechseln Sie zu Claude Code, sobald die Aufgabe Dateien berührt.** Repos, Terminals, Browser und alles, was durch Ausführen verifiziert werden muss, gehören in Code, nicht in den Chat.
- [ ] **Setzen Sie Memory und Styles bewusst ein.** Memory sollte stabile Fakten über Sie und Ihre Arbeit enthalten; Styles sollten die Stimme festhalten, um die Sie immer wieder bitten.
- [ ] **Beginnen Sie einen neuen Chat, wenn das Thema wechselt.** Lange Chats verursachen dieselben Kontextkosten wie lange Sitzungen.

## Entwickeln mit der API und den SDKs

Für Teams, die Claude in ihr eigenes Produkt einbauen. Alles läuft über einen Endpunkt, `POST /v1/messages`; Tools, strukturierte Ausgaben und Caching sind Funktionen dieses Endpunkts. Der Skill `claude-api` in Claude Code hält die aktuelle Referenz; die Punkte unten sind die Gewohnheiten.

### Wählen Sie die einfachste Stufe

- [ ] **Erst ein einzelner Aufruf, dann Workflow, dann Agent.** Klassifikation, Extraktion und Zusammenfassung sind eine einzige Anfrage. Mehrstufige Pipelines mit codegesteuerter Logik sind ein Workflow, den Sie orchestrieren. Nur offene, modellgesteuerte Tool-Nutzung ist ein Agent.
- [ ] **Vier Kriterien, bevor Sie einen Agenten bauen.** Komplexität (mehrstufig und vorab schwer zu spezifizieren), Wert (die Kosten und Latenz wert), Machbarkeit (Claude beherrscht diese Aufgabe) und Fehlerkosten (lässt sich ein Fehler erkennen und beheben). Ein „Nein“ bei einem davon heißt: einfacher bleiben.
- [ ] **Kennen Sie die vier Wege, einen Agenten zu bauen.** Eine selbst geführte manuelle Schleife; der SDK Tool Runner, der über von Ihnen definierte Tools iteriert; Managed Agents, bei denen Anthropic die Schleife ausführt und die Sandbox hostet; und das Claude Agent SDK, also Claude Code als Bibliothek mit eingebauten Tools. Beim ersten, zweiten und vierten Weg bleibt das Deployment bei Ihnen.

### Hygiene bei Anfragen

- [ ] **Nehmen Sie standardmäßig das aktuelle Opus mit adaptivem Thinking.** `claude-opus-5-5`, sofern der Nutzer kein anderes Modell nennt. Thinking bleibt an; steuern Sie die Tiefe über `output_config.effort` und setzen Sie den Wert ausdrücklich, denn der Standard bei Opus 5.5 ist `medium`.
- [ ] **Streamen Sie alles Lange.** Setzen Sie `max_tokens` nicht zu knapp an: etwa 16k ohne Streaming, 64k mit Streaming. Nutzen Sie den Final-Message-Helper des SDK, wenn Sie einzelne Events nicht brauchen.
- [ ] **Kein Prefill und keine erzwungene Tool-Wahl bei aktuellen Modellen.** Beides liefert in der 5.x-Reihe einen 400-Fehler. Nutzen Sie stattdessen strukturierte Ausgaben (`output_config.format`) und `strict: true`-Tools.
- [ ] **Prüfen Sie `stop_reason`, bevor Sie den Inhalt lesen.** `refusal`, `max_tokens`, `pause_turn` und `tool_use` erfordern jeweils eine eigene Behandlung. Aktivieren Sie serverseitige Fallbacks bei den 5.x-Modellen, damit eine Sicherheitsablehnung an ein Ausweichmodell geleitet wird.
- [ ] **Nutzen Sie die Helfer und Typen des SDK.** Bauen Sie die Tool-Schleife, das Streaming-Promise oder die Nachrichtentypen nicht selbst. Fangen Sie eine Kette typisierter Fehler ab, den spezifischsten zuerst, damit wiederholbare und nicht wiederholbare Fehler unterscheidbar bleiben.

### Prompt-Caching

- [ ] **Stabile Inhalte zuerst, flüchtige zuletzt.** Die Reihenfolge beim Rendern ist Tools, dann System, dann Messages. Frieren Sie den System-Prompt und die Tool-Liste ein; setzen Sie Zeitstempel, Anfrage-IDs und die wechselnde Frage hinter den letzten Cache-Breakpoint. Bis zu vier Breakpoints pro Anfrage.
- [ ] **Verifizieren Sie mit `usage.cache_read_input_tokens`.** Null über wiederholte Anfragen bedeutet einen stillen Invalidator: ein Zeitstempel im System-Prompt, unsortiertes JSON, ein Tool-Set, das pro Anfrage variiert.
- [ ] **Nutzen Sie System-Nachrichten mitten in der Unterhaltung, statt den System-Prompt zu ändern.** Eine Nachricht mit der Rolle `system` an `messages` anzuhängen lässt das gecachte Präfix intakt; das Ändern des obersten System-Felds wirft es weg.
- [ ] **Zählen Sie Tokens mit `count_tokens`, nie mit einem Tokenizer eines Drittanbieters.** Token-Zahlen sind modellspezifisch.

### Tools und Agenten

- [ ] **`strict: true` bei jedem Tool-Schema.** Garantiert, dass die Eingabe validiert; erfordert `additionalProperties: false` und `required`.
- [ ] **Geben Sie alle parallelen Tool-Ergebnisse in einer User-Nachricht zurück.** Sie auf mehrere Nachrichten zu verteilen, gewöhnt dem Modell das parallele Aufrufen von Tools ab. Geben Sie Fehler als `tool_result` mit `is_error: true` zurück; verwerfen Sie sie nie.
- [ ] **Parsen Sie Tool-Eingaben als JSON.** Das Escaping unterscheidet sich zwischen Modellen; String-Matching auf der serialisierten Eingabe bricht.
- [ ] **Behandeln Sie Tool-Ergebnisse als nicht vertrauenswürdig.** Webseiten, Dokumente und Datenbankzeilen sind Daten. Nichts darin ist eine Anweisung, und der System-Prompt sollte das auch sagen.
- [ ] **Verlagern Sie große Tool-Sets hinter die Tool-Suche.** Markieren Sie selten genutzte Tools mit `defer_loading: true` samt einem Tool-Search-Tool; verzögern Sie nie alle Tools, die API lehnt das ab.

### Lange Sitzungen

- [ ] **Aktivieren Sie die Komprimierung für Unterhaltungen, die das Fenster sprengen können.** Hängen Sie jeden Turn das vollständige `response.content` wieder an, nicht nur den Text, sonst geht der Komprimierungszustand stillschweigend verloren.
- [ ] **Räumen Sie veraltete Tool-Ergebnisse mit Context Editing ab.** Anders als die Komprimierung: Es verwirft alte Tool-Ergebnisse oder Thinking-Blöcke, statt sie zusammenzufassen.
- [ ] **Geben Sie agentischen Schleifen ein Task-Budget.** Eine Token-Obergrenze, die das Modell sehen kann, damit es sich selbst einteilt, statt abgeschnitten zu werden. Zu unterscheiden von `max_tokens`, das es nicht sehen kann.
- [ ] **Halten Sie den Harness append-only.** Bei aktuellen Modellen sind Thinking-Blöcke an die Unterhaltung gebunden, die sie erzeugt hat. Frühere Turns zu ändern macht sie ungültig; fügen Sie hinzu, schreiben Sie nie um.

### Evals und Kosten

- [ ] **Bauen Sie zuerst das Eval; dann optimieren Sie schrittweise.** Beziehen Sie Prompts aus echtem Traffic, wählen Sie eine Bewertungsmethode, messen Sie die Kosten pro Lauf und behalten Sie eine Train-/Validierungs-/Test-Aufteilung, damit die Kennzahl ehrlich bleibt.
- [ ] **Arbeiten Sie die Kostenhebel der Reihe nach ab.** Caching, Hygiene bei Eingabe-Tokens, Hygiene in der Schleife, Hygiene bei Ausgabe-Tokens, Batching für alles, was nicht latenzkritisch ist (halber Preis), und erst dann Effort und Modellwahl.
- [ ] **Protokollieren Sie `usage` bei jeder Antwort.** Eingabe-, Ausgabe-, Cache-Lese- und Cache-Schreib-Tokens pro Anfrage sind die einzige Möglichkeit, zu wissen, was eine Änderung mit der Rechnung gemacht hat.
- [ ] **Bündeln Sie, was warten kann.** Die Message Batches API läuft asynchron zum halben Preis; ordnen Sie Ergebnisse über `custom_id` zu, nie über die Position.

### Aktuelle Modelle

| Modell | ID | Kontext | Eingabe pro MTok | Ausgabe pro MTok |
|---|---|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` | 1M | $10.00 | $50.00 |
| Claude Opus 5.5 | `claude-opus-5-5` | 1M | $4.00 | $20.00 |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | 1M | $2.00 | $10.00 |
| Claude Haiku 4.5 | `claude-haiku-4-5` | 200K | $1.00 | $5.00 |

Preise der First-Party-API, Stand September 2026. Cache-Lesezugriffe kosten bei aktuellen Modellen nur einen kleinen Bruchteil des Eingabepreises (2,5 % bis 10 %), weshalb ein stabiles Präfix wichtiger ist als jeder andere Hebel. Verwenden Sie genau die obigen IDs ohne Datumssuffix.

## Hausregeln

Die Arbeitsregeln, die Marc für Agenten festgelegt hat, in `~/.claude/CLAUDE.md` abgelegt, damit jede Sitzung und jeder Subagent sie lädt. Sie sind hier wiedergegeben, damit das Team denselben Text liest. Die Daten nennen, wann die jeweilige Regel festgelegt wurde.

### Modellwahl für gestartete Agenten und Workflows (2026-09-09, bekräftigt am 2026-09-17)

- [ ] **Geben Sie bei Workflows nicht zu viel aus; das ist eine harte Regel.** Wählen Sie Modell und Effort je Aufgabenart. Überdimensionieren Sie nie eine einfache Aufgabe, unterdimensionieren Sie nie eine schwere.
- [ ] **Dimensionieren Sie jede Stufe nach dem, was sie braucht.** Setzen Sie nie jede Stufe auf das Modell des Orchestrators oder auf maximalen Effort, nur weil das gerade den Workflow ausführt.
- [ ] **Haiku, niedriger Effort** für mechanische, hochvolumige Arbeit mit wenig Urteilsvermögen: Grep-Durchläufe, Log-Sichtung, Umbenennung nach bekannter Zuordnung, Formatierung, Boilerplate, Fakten aus einer bekannten Datei extrahieren.
- [ ] **Sonnet, Standard-Effort** für abgegrenzte Implementierung und Recherche mit klaren Abnahmekriterien: eine Komponente oder ein Test nach Spezifikation, ein dokumentierter Migrationsschritt, Doku-Updates, Changelog-Zusammenfassungen, Erst-Review.
- [ ] **Opus oder das Top-Modell der Sitzung, hoher Effort**, wo eine falsche Antwort teuer ist: Architektur- und Designentscheidungen, mehrdeutige Migrationen, Ursachenanalyse beim Debugging, Sicherheitsreview, adversariale Verifikation, Schlussurteil über die Ausgabe anderer Agenten.
- [ ] **Nennen Sie für jede Stufe und jeden Subagenten Modell und Begründung.** Keine Ausnahmen.

### Wie Workflows eingesetzt werden (2026-09-20)

- [ ] **Immer Produzent plus unabhängiger Verifizierer.** Der Verifizierer repariert, was er findet, statt nur zu berichten. Er läuft auf Fable, wenn das Kontingent es erlaubt, sonst auf Opus; prüfen Sie `mcp__ccd_session_mgmt__get_usage` vor dem Start und lassen Sie nie eine Stufe auf dem Standardmodell, wenn das Sitzungsmodell nahe an seinem Limit ist.
- [ ] **Bevorzugen Sie ein deterministisches Orakel gegenüber einem Modell als Verifizierer.** Ein Assembler, eine Referenzimplementierung, ein Round-Trip, eine byte-genaue Baseline. Orakelgestützte Spuren brauchen keine teure Verifikationsstufe.
- [ ] **Jeder Produzenten-Prompt beginnt mit einer SETTLED-Präambel.** Aktuelle Nutzernachrichten richten sich an den Orchestrator; keine Fragen stellen, nicht warten, die Aufgabe nicht zurückgeben; nie `gh`, `git commit`, `git push` oder `git checkout` ausführen; den GateGuard-Hook nie deaktivieren; keine neuen Drittanbieter-Abhängigkeiten; die genannten Abschluss-Gates ausführen und ehrlich berichten.
- [ ] **Schützen Sie sich vor Platzhalter-Ergebnissen.** Sagen Sie den Agenten: Wird der strukturierte Aufruf abgelehnt, korrigieren Sie das JSON und senden das vollständige Ergebnis erneut, nie einen Platzhalter. Validieren Sie den Inhalt im Skript, zum Beispiel `if (!r || r.summary.length < 120) throw`. Lesen Sie vor einem bezahlten Neulauf `journal.jsonl` und das Agententranskript; die ersten 2 KB einer fehlgeschlagenen Nutzlast bleiben in `__unparsedToolInput.raw` erhalten.
- [ ] **Ein Git-Worktree pro paralleler Spur.** `git worktree add -b <branch> <path> origin/main`; jeder Agent schreibt nur in seinen eigenen. Index-Tools liegen im Haupt-Checkout und werden von dort nur lesend genutzt.
- [ ] **Mergen Sie über die API, solange ein Workflow den Haupt-Checkout hält.** `gh api -X PUT repos/<o>/<r>/pulls/N/merge -f merge_method=rebase`; `gh pr merge` wechselt den lokalen Branch. Hängen Sie nie ein Branch-Löschen an einen Merge-Befehl an. Bei strikten Statusprüfungen läuft das Mergen seriell: main hineinmergen und die nächste Prüfrunde abwarten; rebasen oder force-pushen Sie nie einen PR, den der CI-Monitor beobachtet.
- [ ] **Planen Sie nach Budget, nicht nach Ehrgeiz.** Prüfen Sie zuerst das Wochenkontingent und nennen Sie die erwarteten Kosten des Laufs. Berichten Sie am Ende jedes Laufs die Ausgaben gegen die Obergrenze sowie die Token-Einsparungen durch graft oder CodeGraph.
- [ ] **Bringen Sie Entscheidungen als Evidenz zurück, nicht als Fragen.** Legen Sie die Messung vor, die sie klärt, und die Optionen samt Konsequenzen; halten Sie die Antwort fest und die Behauptungen, die die Verifikation nicht bestanden haben.

### Kontext- und Test-Ökonomie (2026-09-19)

- [ ] **Struktur vor Quelltext.** In graft-indizierten Repos `graft skeleton <file>`, `graft grep` und `graft callers`, bevor Sie irgendetwas öffnen. Wo graft fehlt, CodeGraph, falls indiziert, sonst ein gezieltes grep nach dem Symbol; nie ganze Dateien zur Orientierung.
- [ ] **Lesen Sie nur die Dateien, die Sie bearbeiten.** Öffnen Sie eine Datei nur dann vollständig, wenn Sie sie gleich ändern. Lesen Sie eine soeben bearbeitete Datei nicht erneut.
- [ ] **Eigene Tests während der Arbeit, die volle Suite einmal.** Führen Sie nur die Testdateien aus, die abdecken, was Sie ändern; die volle Suite einmal am Ende als letztes Gate und danach nur erneut, wenn dieser Lauf fehlschlug und Sie etwas geändert haben.
- [ ] **Nennen Sie diese Gewohnheiten in jedem Subagenten- und Workflow-Prompt.** Manche eingebauten Agententypen laden die CLAUDE.md nicht.

### Index-Tools

- [ ] **CodeGraph vor grep, wo `.codegraph/` existiert.** `codegraph_explore` über MCP oder `codegraph explore "<question>"` in der Shell. Wo es kein `.codegraph/` gibt, lassen Sie CodeGraph aus; die Indizierung ist Sache des Nutzers.
- [ ] **graft vor grep, wo `graft/` existiert.** Laden Sie die MCP-Tools in einem `ToolSearch`-Aufruf; nutzen Sie die jeweils verfügbare Oberfläche, die Vorgaben sind identisch.

### GateGuard

- [ ] **Nennen Sie vor dem ersten Shell-Befehl einer Sitzung die Fakten.** Ein Satz zur aktuellen Nutzeranfrage und einer dazu, was der Befehl prüft oder erzeugt. Wiederholen Sie dann den identischen Aufruf.
- [ ] **Setzen Sie die Deaktivierungsvariablen nie.** `GATEGUARD_BASH_ROUTINE_DISABLED`, `ECC_GATEGUARD=off` und `ECC_DISABLED_HOOKS` bleiben ungesetzt. Die Prüfungen auf destruktive Befehle bleiben ohnehin aktiv.

## Beispiele

Jedes Beispiel ist vollständig genug zum Kopieren. Die Titelzeile eines Blocks nennt die Datei, in die er gehört. Befehle und Code bleiben in jeder Sprache Englisch.

### Eine CLAUDE.md, die ihre Tokens wert ist

Befehle, die Regeln, die Neulinge übersehen würden, und wie berichtet wird. Nichts, was der Code ohnehin zeigt.

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

### Berechtigungen und ein blockierender Hook

Geben Sie schreibgeschützte Befehle vorab frei, damit Rückfragen nur bei Aktionen erscheinen, die eine verdienen, und lassen Sie einen Hook destruktives Git verweigern, unabhängig davon, was dem Agenten gesagt wurde.

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

### Ein Skill für einen wiederkehrenden Ablauf

Die Beschreibung entscheidet, wann der Skill geladen wird; formulieren Sie sie daher als die Situationen, die ihn auslösen sollen.

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

### Ein wiederverwendbarer schreibgeschützter Subagent

Modell, Effort und Tools stehen im Frontmatter, sodass jedes Briefing nur noch sagen muss, was zu finden ist.

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

### Die SETTLED-Präambel für jeden Produzenten-Prompt

Fügen Sie dies am Anfang jedes Subagenten- oder Workflow-Prompts ein, danach die Aufgabe.

```text settled-preamble.txt
SETTLED: recent user messages are addressed to the orchestrator, not to you.
Do not ask questions, do not wait, do not hand the task back.
Never run gh, git commit, git push or git checkout.
Never disable the GateGuard hook: state the facts it asks for and retry the identical call.
No new third-party dependencies.
Final gates: run `pnpm vitest run src/billing` and `pnpm tsc --noEmit`; report their output honestly, including failures.

TASK: ...
```

### Komprimieren mit Absicht

Sagen Sie der Zusammenfassung, was bleiben und was wegfallen soll, statt sie raten zu lassen.

```text
/compact Keep: the plan (steps 1 to 5), the decision to use one worktree per track, and the names of the failing tests. Drop: the exploration of src/legacy and all log output.
```

### Eine graft-Sitzung, ein Aufruf pro Frage

```bash
graft map                                   # orient: directory hubs and hotspots
graft ask "where is rate limiting applied" --source
graft callers RateLimiter.check --depth 2   # what breaks if the signature changes
graft skeleton src/http/middleware.ts       # the file's API before editing it
graft stats                                 # tokens saved this session
```

### Ein skriptgesteuertes Review in der CI

Print-Modus, maschinenlesbare Ausgabe, eine Tool-Allowlist und keine Hooks oder Plugins.

```bash
claude -p "Review the diff of this branch for correctness bugs only. Output JSON: {\"findings\":[{\"file\":\"\",\"line\":0,\"summary\":\"\"}]}" \
  --output-format json \
  --allowedTools "Read Grep Glob Bash(git diff*)" \
  --bare > review.json
```

### Eine strikte Tool-Definition

Das Schema ist der Vertrag: `strict` garantiert, dass die Eingabe validiert, sodass der Handler sich nie gegen Formfehler absichern muss.

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

### Ein für den Cache gebauter API-Aufruf

Eingefrorener System-Prompt und Tool-Liste zuerst, die wechselnde Frage zuletzt, Streaming an und der Cache-Zähler geprüft.

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

## Kurzreferenz

### Claude Code

| Bedarf | Befehl |
|---|---|
| Eine CLAUDE.md entwerfen | `/init` |
| Sehen, was den Kontext füllt | `/context` |
| Zusammenfassen und weitermachen | `/compact <what to keep>` |
| Neuanfang | `/clear` |
| Ausgaben der Sitzung | `/cost` |
| Modell wechseln | `/model` |
| Schnellere Ausgabe, gleiches Modell | `/fast` |
| Effort beim Start | `claude --effort xhigh` |
| Plan-Modus und Berechtigungsmodi | Shift+Tab |
| Den aktuellen Turn stoppen | Escape |
| Den Diff auf Bugs prüfen | `/code-review` |
| Den Diff aufräumen | `/simplify` |
| Sicherheitsdurchgang über den Branch | `/security-review` |
| Weniger Berechtigungsabfragen | `/fewer-permission-prompts` |
| Skriptlauf | `claude -p "<prompt>" --output-format json --allowedTools "Read Grep"` |
| Wiederkehrender Cloud-Lauf | `/schedule` |
| Einen langsamen externen Zustand abfragen | `/loop` |

### graft

| Bedarf | Befehl |
|---|---|
| Installieren und im Repo einbinden | `npm i -g @nanonets/graft@latest` dann `graft init` |
| In einem unbekannten Repo orientieren | `graft map` |
| Verstehen oder lokalisieren | `graft ask "<question>" --source` |
| Jedes Vorkommen | `graft grep "<name>"` |
| Die API einer Datei | `graft skeleton <file>` |
| Wer ruft auf, Wirkungsradius | `graft callers <sym> --depth 2`, `--depth all`, `--direction out` |
| CI-Gate für Aktualität | `graft check` |
| PR-Risikokommentar | `graft blast --format markdown` |
| Einsparungen der Sitzung | `graft stats` |

### CodeGraph

| Bedarf | Befehl |
|---|---|
| Symbole plus Aufrufpfade in einem Aufruf | `codegraph explore "<question>"` |
| Ein Symbol oder eine Datei mit Zeilennummern | `codegraph node <name>` |
| Aufrufer, Aufgerufene, Auswirkung | `codegraph callers <sym>`, `codegraph callees <sym>`, `codegraph impact <sym>` |
| Von geänderten Dateien betroffene Tests | `codegraph affected <files>` |

### API-Parameter, die man sich merken sollte

| Bedarf | Parameter |
|---|---|
| Thinking-Tiefe | `output_config.effort`: `low`, `medium`, `high`, `xhigh`, `max` |
| Strukturierte JSON-Ausgabe | `output_config.format` |
| Validierte Tool-Eingabe | `strict: true` am Tool |
| Cache-Breakpoint | `cache_control: {type: "ephemeral"}` (max. 4) |
| Operator-Anweisung mitten in der Unterhaltung | `{role: "system", content: ...}` in `messages` |
| Lange Unterhaltungen | Compaction-Beta `compact-2026-01-12` |
| Getaktete Agentenschleifen | `output_config.task_budget` mit Beta `task-budgets-2026-03-13` |
| Asynchrone Arbeit zum halben Preis | Message Batches API |

## Quellen

- Claude-Code-Dokumentation: https://code.claude.com/docs
- Claude-API-Dokumentation: https://docs.anthropic.com
- graft: https://www.npmjs.com/package/@nanonets/graft (der installierte Skill unter `~/.claude/skills/graft/SKILL.md` ist die operative Referenz)
- CodeGraph: `codegraph --help` und die Anweisungen des MCP-Servers `codegraph`
- Marcs Arbeitsregeln: `~/.claude/CLAUDE.md`
