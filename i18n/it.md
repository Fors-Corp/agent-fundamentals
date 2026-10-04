# Lavorare da professionisti con Claude e i coding agent

Una checklist delle abitudini che separano l'uso occasionale di Claude da quello professionale. Copre Claude Code (CLI e app desktop), l'interfaccia di chat di claude.ai e la creazione di agenti propri con la Claude API e l'Agent SDK. Le prime tre sezioni sono livelli: Basics, Intermedio, Pro. Le sezioni successive sono temi trasversali ai livelli: economia dei token, instradamento dei modelli, chat, API e le regole della casa con cui lavora questo team.

Come usarla: spunta ciò che già fai con costanza. Ciò che resta senza spunta è la tua prossima competenza da costruire. Gli elementi contrassegnati come **Regola della casa** provengono dalle regole di lavoro di Marc, che gli agenti caricano da `~/.claude/CLAUDE.md`; sono riportate per intero nella sezione Regole della casa, così il team legge lo stesso testo degli agenti. Tutto il resto è pratica generale.

Ultima revisione 2026-10-04. Verificata con Claude Code 2.1, graft 0.21.1, CodeGraph 1.6.1, Vercel CLI 62.2 e la gamma di modelli della Claude API di settembre 2026.

## Basics

Le abitudini che contano fin dalla prima sessione. Nessuna richiede configurazione.

### Prima di scrivere

- [ ] **Scrivi il compito come un ticket.** Indica obiettivo, vincoli e cosa significa "fatto" in un unico messaggio. Gli agenti colmano i vuoti a intuito, e i criteri di accettazione che ometti sono proprio quelli che vengono indovinati male.
- [ ] **Indica il contesto invece di incollarlo.** Nomina file, funzioni, messaggi di errore o URL. L'agente li legge da sé con meno token rispetto a un muro di testo incollato, e legge la versione attuale anziché una copia obsoleta.
- [ ] **Di' cosa non va toccato.** File fuori ambito, interfacce pubbliche, migrazioni, qualsiasi cosa con una dipendenza di deploy. Una frase sull'ambito fa risparmiare un'ora di rimedi.
- [ ] **Chiedi prima un piano per tutto ciò che non è banale.** In Claude Code passa alla modalità piano con Shift+Tab; l'agente legge e propone ma non modifica nulla finché non approvi. In chat, chiedi uno schema prima della risposta completa.
- [ ] **Un compito per conversazione.** Ricomincia da zero (`/clear`) per lavori non correlati. Il contesto residuo del compito precedente si paga a ogni turno e induce il modello a sbagliare ciò che conta ora.
- [ ] **Sappi su quale superficie ti trovi.** La chat per ragionare, redigere e analizzare materiale incollato. Claude Code per tutto ciò che tocca file, un repository, un terminale o un browser. L'API quando vuoi il comportamento dentro il tuo prodotto.

### Durante la sessione

- [ ] **Leggi ciò che dice l'agente prima di rispondere.** Quando dichiara un'assunzione, correggila subito. Confermare tardi significa rifare il lavoro costruito su una premessa sbagliata.
- [ ] **Rispondi alle domande con decisioni.** Se l'agente si ferma a chiedere, gli serve una decisione che solo tu puoi prendere. Dagliela e lascialo proseguire; non rispondere a una domanda con un'altra domanda.
- [ ] **Interrompi presto.** Escape ferma il turno in corso. Se al secondo passo sta andando nella direzione sbagliata, non aspettare il nono.
- [ ] **Fagli eseguire i propri controlli.** Chiedi di lanciare test, type checker e linter e di mostrarne l'output. "I test passano" senza output è un'affermazione, non una prova.
- [ ] **Tieni i segreti fuori dalla conversazione.** Non incollare mai chiavi, password o token. Nomina la variabile d'ambiente, tieni `.env` in `.gitignore` e di' all'agente di non leggerlo. Tutto ciò che l'agente legge entra nella richiesta inviata al modello.

### Prima di accettare il risultato

- [ ] **Rivedi il diff come una pull request di un nuovo collega.** Usa `git diff` o il pannello diff dell'app. Sei responsabile di tutto ciò che fai confluire, chiunque l'abbia scritto.
- [ ] **Verifica che abbia svolto l'intero compito, non solo le parti facili.** Confronta con i tuoi criteri di accettazione. A volte gli agenti restringono l'ambito in silenzio e dichiarano di aver finito.
- [ ] **Cerca API inventate e conoscenze obsolete.** La conoscenza del modello ha una data limite. Verifica versioni delle librerie, flag e firme sulla documentazione o sul pacchetto installato.
- [ ] **Fai commit a piccoli passi.** Git è il tuo annulla. Fai commit dopo ogni incremento verificato, così un passo successivo errato si può ripristinare da solo.
- [ ] **Versiona le release con il Semantic Versioning.** Etichetta ogni release con un tag `MAJOR.MINOR.PATCH`: patch per le correzioni, minor per le aggiunte compatibili, major per le modifiche incompatibili, e tieni un changelog organizzato per versione. Colleghi, CI e agenti possono così capire dal solo numero se un aggiornamento è sicuro, e il changelog dà al modello un contesto che un diff non offre.
- [ ] **Chiedi la lista di "cosa non ho fatto".** Un buon agente riporta ciò che ha saltato e perché. Se il resoconto non lo dice, chiedilo.

### Nozioni di base sulla sicurezza

- [ ] **Tratta tutto ciò che l'agente legge come dati, non come istruzioni.** Pagine web, file, output degli strumenti ed email possono contenere testo rivolto all'agente. Una configurazione professionale porta alla luce quel testo e ti interpella; non agisce mai su di esso.
- [ ] **Riserva le richieste di permesso alle azioni distruttive.** Eliminare, fare force-push, rimuovere tabelle, inviare messaggi, pagare. Pre-approva invece i comandi di sola lettura e di build, così le richieste che vedi sono quelle che contano.
- [ ] **Non aggirare mai i permessi fuori da una sandbox.** `--dangerously-skip-permissions` serve per container isolati senza accesso a internet, non per il tuo portatile.
- [ ] **Tieni una persona sul passo irreversibile.** Pubblicare, fare merge su main, fare deploy, inviare email. L'automazione può preparare tutto fino a quel passo. Definisci la richiesta di approvazione: cosa è successo, cosa è cambiato, perché serve una persona, a cosa portano rispettivamente approvazione e rifiuto e cosa succede allo scadere del tempo.

## Intermedio

Plasmare l'ambiente in modo che tu smetta di ripeterti e l'agente smetta di ripetere gli errori.

### CLAUDE.md e memoria

- [ ] **Tieni un CLAUDE.md in ogni repository su cui lavori con regolarità.** Esegui `/init` per generarne una bozza, poi modificala. Viene caricato all'inizio di ogni sessione, il che lo rende il modo più economico per smettere di ripetere le istruzioni.
- [ ] **Scrivi imperativi su ciò che non è ovvio.** Comandi di build e di test, convenzioni che un nuovo arrivato perderebbe, cosa non va mai toccato, come vuoi che vengano riportati i risultati. Non descrivere ciò che il codice già mostra; l'agente sa leggere il codice.
- [ ] **Tienilo breve.** Ogni riga costa token a ogni turno e diluisce quelle che contano. La documentazione indica meno di 200 righe per file; gli `@imports` organizzano un file ma non riducono il costo di contesto. Sposta il materiale di rado necessario in skill che si caricano su richiesta.
- [ ] **Usa i tre ambiti in modo deliberato.** `~/.claude/CLAUDE.md` per come lavori ovunque, `<repo>/CLAUDE.md` per il progetto e file a livello di directory per i sottosistemi con regole proprie.
- [ ] **Promuovi la terza correzione.** La terza volta che correggi lo stesso comportamento in chat, il suo posto è in CLAUDE.md o in un hook. Elimina le regole obsolete o in contraddizione tra loro: con due righe in conflitto Claude può seguire l'una o l'altra, e `/doctor prompt-audit` le trova. Anche la skill `claude-md-improver` rivede il file alla ricerca di righe obsolete o contraddittorie.
- [ ] **Lascia alla memoria i fatti, non le regole.** La memoria automatica di Claude Code registra fatti e preferenze di progetto tra una sessione e l'altra. Elimina le voci che diventano obsolete; una memoria sbagliata è peggio di nessuna.
- [ ] **Esegui un test a sessione nuova sul tuo repository.** Apri una sessione nuova senza alcun contesto verbale e fai cinque domande: cos'è questo sistema, come è organizzato, come si esegue, come si verifica, a che punto siamo. Ogni domanda a cui non sa rispondere dal solo repository è una lacuna in CLAUDE.md o nella documentazione a cui rimanda.
- [ ] **Tieni le preferenze personali di progetto in CLAUDE.local.md e mettilo in gitignore.** URL di sandbox, dati di test preferiti, percorsi locali. Viene caricato insieme al CLAUDE.md del progetto e trattato allo stesso modo; le regole del team restano nel file versionato, e la policy gestita si carica sopra entrambi.
- [ ] **Riduci a una riga le voci dell'indice della memoria automatica.** Di MEMORY.md si caricano per sessione solo le prime 200 righe o 25KB; il dettaglio va nei file per argomento che Claude legge su richiesta. Non lasciare che memorizzi ciò che il repository già mostra.

### Gestione del contesto

- [ ] **Controlla il contesto come un budget.** `/context` mostra cosa sta riempiendo la finestra. Output voluminosi degli strumenti, log incollati e schemi di strumenti MCP caricati sono i soliti colpevoli.
- [ ] **Compatta ai confini tra le fasi, non quando sei costretto.** Esegui `/compact` con una nota su cosa conservare: dopo l'esplorazione e prima dell'implementazione, oppure dopo una correzione e prima della verifica. La compattazione automatica in un punto arbitrario perde i dettagli che ti servivano di più.
- [ ] **Non incollare mai i log; indicali.** Salva l'output in un file e lascia che l'agente lo esamini con `grep` o `tail`. Un log incollato una volta si paga a ogni turno successivo.
- [ ] **Non rileggere un file appena modificato.** Lo strumento di modifica fallisce in modo esplicito se il bersaglio è cambiato, quindi rileggere per "verificare" è puro costo.
- [ ] **Preferisci il testo agli screenshot.** In un browser, leggere il testo della pagina o l'albero di accessibilità è più economico e più preciso di uno screenshot. Fai uno screenshot solo per il layout.
- [ ] **Sfoltisci i server MCP collegati.** Gli schemi degli strumenti di ogni server possono entrare nel contesto. Collega ciò che serve al compito e disattiva il resto; il caricamento differito degli strumenti aiuta, ma meno server aiutano di più.
- [ ] **Passa il testimone a una sessione nuova prima che la finestra si riempia.** Per il lavoro che dura più di una sessione, scrivi il file di avanzamento e le decisioni prese, poi riparti da zero leggendolo per primo, invece di compattare ancora e ancora. La compattazione conserva ciò che è stato fatto e tende a perdere il perché; una sessione nuova ha solo ciò che hai messo per iscritto.

### Skill, hook e permessi

- [ ] **Trasforma le procedure ripetute in skill.** Un `SKILL.md` sotto `~/.claude/skills/<name>/` o dentro il repository si carica con `/<name>` o quando la sua descrizione corrisponde al compito. Passaggi di deploy, checklist di revisione e flussi di lavoro specifici del repo vanno tutti qui.
- [ ] **Usa gli hook per ciò che deve accadere sempre.** Le istruzioni sono probabilistiche; gli hook sono deterministici. Formattare al salvataggio, bloccare `git push --force`, richiedere una dichiarazione di fatti prima dei comandi di shell. Vivono in `settings.json`.
- [ ] **Costruisci una allowlist dei permessi.** Pre-approva i comandi di sola lettura (`git status`, `ls`, il test runner) in `.claude/settings.json`, così le richieste compaiono solo per le azioni che le meritano. `/fewer-permission-prompts` analizza la tua cronologia e propone l'elenco.
- [ ] **Usa i worktree per il lavoro in parallelo.** Un git worktree per compito o per agente evita che le modifiche collidano. I subagent accettano `isolation: "worktree"`; anche la tua sessione può entrarvi.
- [ ] **Impara la tastiera.** Shift+Tab alterna le modalità di permesso e la modalità piano; Escape interrompe; `/model`, `/cost`, `/clear`, `/compact` e `/context` coprono la maggior parte delle operazioni quotidiane. Imposta l'effort con il flag `--effort` o con i controlli del modello nell'app.

### Delega ai subagent

- [ ] **Delega le ricerche che richiedono molta lettura.** Avvia un agente esploratore in sola lettura per passare in rassegna molti file e restituire una conclusione con riferimenti `file:line`. Gli scarichi di file restano nel suo contesto, non nel tuo.
- [ ] **Dai ai subagent un brief completo.** Non vedono la tua conversazione. Includi l'obiettivo, i file, i criteri di accettazione, i gate da eseguire e l'istruzione di non fare domande né restituire il compito.
- [ ] **Dimensiona il modello sul compito.** Haiku per le scansioni meccaniche, Sonnet per l'implementazione circoscritta, il modello di punta per il giudizio. Indica ogni volta il modello e il motivo. (House rule)
- [ ] **Avvia gli agenti indipendenti in un unico messaggio.** Lanciarli in serie spreca tempo reale. Gli agenti che non condividono file possono girare insieme e finire insieme.
- [ ] **Definisci gli agenti riutilizzabili una sola volta.** I file degli agenti in `.claude/agents/*.md` riportano modello, effort e strumenti nel frontmatter, così l'unica cosa che varia è il brief.
- [ ] **Sintetizza prima di delegare.** Leggi i risultati dell'esploratore e scrivi all'implementatore una specifica precisa: quale dei tre flussi, quale approccio, cosa restituire. "In base ai tuoi risultati, correggilo" affida il ragionamento più difficile a chi ha meno contesto.
- [ ] **Mantieni la delega a un solo livello, salvo diversa intenzione.** Per impostazione predefinita un subagent può avviare a sua volta subagent fino a tre livelli più in basso, ciascuno con un contesto nuovo che paghi e non vedi. Imposta `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1`, oppure ometti `Agent` dagli `tools` di un worker, così le richieste di aiuto tornano all'orchestratore.

### Modello ed effort

- [ ] **Conosci la gamma e i prezzi.** Vedi la tabella dei modelli nella sezione API. Sono i rapporti di prezzo a guidare l'instradamento: il modello di punta costa cinque volte Sonnet per token di output.
- [ ] **Regola l'effort prima di cambiare modello.** L'effort (da `low` a `max`) scambia accuratezza con token all'interno di uno stesso modello. `xhigh` è il default di Claude Code per il coding; `low` si adatta al lavoro meccanico e alla maggior parte dei subagent.
- [ ] **Orchestratore forte, braccia economiche.** La sessione che tiene il compito e prende le decisioni di giudizio gira sul modello di punta; gli agenti che svolgono lavoro circoscritto girano su modelli più economici.
- [ ] **La modalità fast è lo stesso modello a un prezzo maggiorato.** `/fast` aumenta la velocità di output, non la capacità. Usala per le sessioni interattive in cui la latenza pesa, non per il lavoro batch.

### Abitudini di verifica

- [ ] **Test propri mentre lavori, suite completa una sola volta alla fine.** Esegui solo i file di test che coprono ciò che stai modificando; esegui l'intera suite come gate finale, e di nuovo solo se quell'esecuzione è fallita e hai cambiato qualcosa. (House rule)
- [ ] **Chiedi una prova nel messaggio finale.** Output dei test, uno screenshot, il risultato di un `curl`. Verificato e finito sono stati diversi; fai dire all'agente quale ha raggiunto.
- [ ] **Fai una revisione di seconda opinione.** `/code-review` sul diff per i bug, `/simplify` per la pulizia, `/security-review` prima di fare merge di qualsiasi cosa che tocchi input, autenticazione o segreti.
- [ ] **Scrivi una definizione di "fatto" che l'agente possa eseguire, in ordine.** Controlli statici, poi test unitari e di integrazione, poi un'esecuzione del flusso reale (avvia l'app, chiama l'endpoint, mostra l'output). Test unitari con mock verdi non dimostrano una modifica che attraversa più componenti; una modifica non è finita finché non ha superato l'ultimo livello che le serve.
- [ ] **Separa l'autore dal revisore.** Rivedi in una sessione nuova o con un agente diverso. Chi ha scritto il codice condivide i suoi stessi punti ciechi, e un subagent parte con un contesto nuovo, motivo per cui è un revisore migliore della sessione che ha scritto il codice.

## Pro

Orchestrazione, automazione e governance. Questi elementi presuppongono che tu faccia già tutto quanto sopra.

### Workflow multi-agente

- [ ] **Produttore più verificatore indipendente, sempre.** Una fase produce, una fase separata attacca il risultato e ripara ciò che trova. Non lasciare mai che il produttore controlli il proprio lavoro. (House rule)
- [ ] **Preferisci un oracolo deterministico a un giudice basato su modello.** Test, round-trip, baseline byte per byte, un'implementazione di riferimento. Quando la correttezza è decidibile, lascia decidere al codice e assegna un modello economico al lavoro. (House rule)
- [ ] **Apri ogni prompt di agente con un preambolo di "settled".** L'harness inoltra il tuo ultimo messaggio di chat ai subagent; senza il preambolo un agente legge un messaggio colloquiale e si ferma a chiedere. Indica cosa non deve fare e quali gate deve eseguire. (House rule)
- [ ] **Proteggiti dai risultati segnaposto.** Un agente il cui output strutturato viene rifiutato può rinviare uno stub valido ma vuoto, che il runtime conta come successo. Convalida la sostanza nello script e leggi il journal prima di pagare per una nuova esecuzione. (House rule)
- [ ] **Un worktree per ogni traccia parallela.** Le tracce girano in parallelo solo se non condividono file né misurazioni sensibili alla CPU; altrimenti una si accoda al merge dell'altra. (House rule)
- [ ] **Dimensiona in base al budget, non all'ambizione.** Controlla la quota prima di avviare, di' quanto costerà l'esecuzione, riporta la spesa rispetto al tetto alla fine. Un workflow ben dimensionato vale più di tre sottili. (House rule)
- [ ] **Riporta le decisioni come prove.** Quando una fase porta alla luce una decisione per il responsabile, presenta la misurazione che la risolve e le opzioni con le relative conseguenze. Registra la risposta e le affermazioni che non hanno superato la verifica. (House rule)
- [ ] **Usa lo strumento Workflow per l'orchestrazione deterministica.** Uno script con chiamate `pipeline`, `parallel` e `agent`, fasi e output validati da schema. Si esegue solo se l'utente lo sceglie, perché può consumare token pari a decine di agenti.
- [ ] **Concorda un contratto breve prima di una build lunga.** Prima di scrivere codice, chi costruisce e chi rivede concordano per iscritto cosa significa "fatto" per questo blocco: ambito, come si verifica ogni parte e cosa è fuori ambito. Il revisore valuta sulla stessa lista, così nulla viene respinto per un motivo prevedibile.
- [ ] **Dai al revisore un criterio di valutazione e tarala sul tuo giudizio.** Categorie fisse (correttezza, prova che i controlli sono stati eseguiti, disciplina sull'ambito, tenuta a un riavvio, prontezza al passaggio di consegne) e un verdetto tra accetta, rivedi o blocca. Gli agenti a cui si chiede di valutare il lavoro tendono a lodarlo; un revisore può indicare un problema reale e poi convincersi ad approvare. Leggi le sue trascrizioni, trova dove il verdetto si è discostato dal tuo e rafforza il suo prompt per quel caso.

### Lavoro di lunga durata e su più sessioni

- [ ] **Esegui il setup come sessione a sé prima del lavoro sulle funzionalità.** La prima sessione rende il progetto solo eseguibile e verificabile: le dipendenze si installano, un test passa, uno script di init contiene i comandi di avvio e verifica, il lavoro è suddiviso in un elenco di funzionalità ed esiste un commit di baseline pulito. Lo scaffolding e la prima funzionalità non condividono una sessione.
- [ ] **Tieni un elenco di funzionalità leggibile dalle macchine per il lavoro su più sessioni.** Un unico file JSON nel repository in cui ogni voce riporta il comportamento visibile all'utente, i passi di verifica esatti, uno stato (non iniziata, in corso, bloccata, superata) e un campo per le prove. L'agente sceglie da lì la voce successiva; è il file, non la chat, a dire cosa è fatto. JSON anziché Markdown: il modello è meno incline a riscriverlo.
- [ ] **Non lasciare che l'agente si valuti da solo sull'elenco di funzionalità.** Per risultare superata, la verifica registrata deve essere stata eseguita, con l'output allegato. Digli che lo stato cambia solo dopo il controllo e che eliminare, indebolire o riscrivere test o voci dell'elenco per nascondere lavoro incompleto è inaccettabile; dove puoi, metti test e script di eval dietro una regola `permissions.deny` così l'agente che lavora non può modificare il giudice.
- [ ] **Limita il lavoro in corso a una sola funzionalità.** Scrivilo in CLAUDE.md: termina e verifica la funzionalità corrente prima di iniziare la successiva e non rifattorizzare altro nel frattempo. Davanti a un brief ampio, un agente tende ad avviare più cose insieme e a lasciarle tutte a metà.
- [ ] **Tieni un file di avanzamento che la sessione successiva legge per primo.** Un breve file nel repository con lo stato verificato, cosa è cambiato, cosa è rotto o non verificato, il prossimo passo migliore e i comandi esatti di avvio e verifica. CLAUDE.md dice all'agente di leggerlo all'inizio e di aggiornarlo e committarlo prima di fermarsi; nulla lo aggiorna in automatico. Anche un'esecuzione pianificata che parte da un clone nuovo ha bisogno dello stesso file.
- [ ] **Dai all'agente una routine fissa di inizio sessione.** In CLAUDE.md: `pwd`, leggere il file di avanzamento e l'elenco di funzionalità, `git log --oneline -5`, eseguire lo script di init, eseguire un controllo rapido. Se la baseline è già rotta, risolvi quello prima di qualsiasi nuovo lavoro.

### Esecuzioni headless e pianificate

- [ ] **Usa la modalità print per le esecuzioni da script.** `claude -p "<prompt>"` non è interattivo; aggiungi `--output-format json` per risultati leggibili da macchina, `--allowedTools` per limitare e `--bare` per esecuzioni CI minimali senza hook né sincronizzazione dei plugin.
- [ ] **Pianifica routine per il lavoro ricorrente.** Gli agenti pianificati nel cloud (`/schedule`) gestiscono report notturni e controlli delle dipendenze. `/loop` interroga a intervalli uno stato esterno lento all'interno di una sessione; non serve per compiti una tantum.
- [ ] **Dai agli agenti CI solo gli strumenti che servono.** Allowlist, token in sola lettura e nessun diritto di push, a meno che il push sia il loro compito.
- [ ] **Registra ogni esecuzione.** Trascrizione, costo, esito. Rivedi i fallimenti ogni settimana: sono la fonte più economica di miglioramenti a CLAUDE.md e agli hook.
- [ ] **Scegli tra goal e loop chiedendoti se il lavoro ha una fine.** Un traguardo (tutti i test in `test/auth` passano, il backlog è vuoto) è un `/goal`: un piccolo modello separato verifica la condizione dopo ogni turno e la sessione continua a lavorare finché non è soddisfatta o ritenuta impossibile. Qualcosa che devi solo tenere d'occhio (la CI è verde) è un `/loop` a intervalli. Entrambi sono limitati alla sessione.
- [ ] **Scrivi un goal che il valutatore possa leggere dalla trascrizione.** Un unico stato finale misurabile, il comando che lo dimostra (`npm test` termina con 0, `git status` è pulito), i vincoli che devono valere lungo il percorso e un limite come "oppure fermati dopo 20 turni". Il valutatore non esegue comandi né legge file; giudica solo ciò che l'agente ha reso visibile, quindi fai stampare all'agente la prova.
- [ ] **Metti un tetto a ogni esecuzione non presidiata.** In modalità print, `--max-turns` e `--max-budget-usd` fermano una sessione fuori controllo, e la spesa dei subagent conta nel budget; in un `/goal`, metti il limite di turni o di tempo nella condizione; un `/loop` ricorrente scade dopo sette giorni per progetto. Un loop senza tetto trasforma un test bloccato in un conto da notte intera.
- [ ] **Abbina il livello di pianificazione a quanto il lavoro deve sopravvivere.** `/loop` richiede la sessione aperta, gira con un minimo di un minuto e scade dopo sette giorni; un'attività pianificata del desktop gira finché il tuo computer è acceso, anch'essa fino a un minuto; una routine nel cloud (`/schedule`) gira a computer spento da un clone nuovo, con un minimo di un'ora, avviata da una pianificazione, da una chiamata API o da un evento GitHub.

### Hook come gate

- [ ] **Codifica gli invarianti come hook bloccanti.** Un hook PreToolUse che rifiuta git distruttivo, richiede una dichiarazione di fatti prima dei comandi di shell o impone un'esecuzione dei test prima di un commit non si può aggirare a parole.
- [ ] **Non disattivare mai un gate per sbloccarti.** Dichiara i fatti che richiede e ripeti la chiamata identica. Un gate che puoi spegnere sotto pressione non è un gate. (House rule)
- [ ] **Tieni gli hook veloci e specifici.** Un hook lento grava su ogni chiamata di strumento; uno vago abitua tutti ad aggirarlo.
- [ ] **Usa un hook Stop come gate di completamento.** Si esegue quando l'agente dichiara di aver finito; il codice di uscita 2 o `{"decision":"block","reason":...}` rifiuta l'arresto e il motivo torna all'agente come istruzione successiva. Un hook PostToolUse non può bloccare, ma il suo stderr con uscita 2 raggiunge l'agente dopo ogni modifica. `/goal` è questo meccanismo con un modello come giudice.
- [ ] **Scrivi gli errori di hook, lint e test per l'agente, con la correzione inclusa.** Cosa è fallito, perché la regola esiste e la prossima azione esatta ("Blocked: run `pnpm vitest run src/billing` and paste the output before committing") vale più di "denied". Il `reason` o lo stderr di un hook bloccante è il prossimo input dell'agente; un messaggio che dice solo "violation" produce un nuovo tentativo alla cieca.

### Misurazione e eval

- [ ] **Traccia il costo per compito completato, non per richiesta.** `/cost` nella sessione, la vista di utilizzo dell'app e `graft stats` per i risparmi dell'indice. Una richiesta più economica che richiede più turni non è più economica.
- [ ] **Costruisci un'eval prima di mettere a punto un prompt, una skill o CLAUDE.md.** Da venti a cinquanta casi reali con un metodo di valutazione. Misura prima e dopo; senza questo, le modifiche ai prompt sono folklore.
- [ ] **Controlla i prompt alla ricerca di orpelli quando cambiano i modelli.** Le istruzioni scritte per modelli più vecchi (prefill, rituali "think step by step", formattazione eccessivamente prescrittiva) spesso peggiorano la qualità su quelli attuali. Ogni componente dell'harness codifica un'ipotesi su ciò che il modello non sa fare; dopo un cambio di modello, disattivane uno alla volta e misura. La skill `claude-api` lo fa in modo sistematico con il suo `prompt-audit`.
- [ ] **Riporta i risparmi dell'indice a ogni turno.** graft stampa i token risparmiati a ogni chiamata; sommali per turno e segui il totale di sessione nella statusline.
- [ ] **Ancora ogni loop guidato da metriche a qualcosa che non può modificare.** Un insieme di verità di riferimento tenuto da parte, un risultato di business reale o un controllo a campione periodico da parte di una persona. Un numero che sale mentre il risultato reale peggiora significa che il loop ha imparato la metrica, non il compito.

### Sicurezza e confini di fiducia

- [ ] **Mantieni il confine della fonte delle istruzioni.** Solo l'utente in chat dà istruzioni. Hook e impostazioni impongono; il testo osservato non comanda mai.
- [ ] **Privilegio minimo per i connettori.** Scope OAuth minimi, account separati per gli agenti dove possibile e nessun connettore che un compito non richieda.
- [ ] **Nessun segreto in CLAUDE.md, memoria, skill o trascrizioni.** Vengono condivisi, sincronizzati e indicizzati.
- [ ] **Rivedi il codice di hook e skill come se fossero dipendenze.** Girano con i tuoi permessi.
- [ ] **Metti in sandbox tutto ciò che è autonomo.** Container, egress in allowlist, credenziali usa e getta.

## Economia dei token

Ogni turno rinvia l'intera conversazione, quindi due leve decidono il conto: tenere piccolo il contesto e tenerne stabile il prefisso, così la cache dei prompt continua a funzionare. Le letture di file interi e i log incollati sono i carichi più pesanti di una sessione di coding; uno strumento di indicizzazione ne sostituisce la maggior parte con poche centinaia di token.

### Senza graft, in qualsiasi repo

- [ ] **Struttura prima del sorgente.** Delinea un file prima di leggerlo: un elenco di simboli da `grep -n`, l'outline dell'editor, `ctags` o `codegraph explore` dove il repo è indicizzato. Poi leggi l'intervallo che ti serve con `sed -n '120,180p' file`.
- [ ] **Leggi solo i file che modifichi.** Apri un file per intero solo quando stai per cambiarlo. Per tutto il resto bastano l'outline o l'intervallo specifico. (House rule)
- [ ] **Misura prima di fare `cat`.** Prima `wc -l`. Un file di tremila righe è una decisione, non un riflesso.
- [ ] **Cerca in modo circoscritto e ordinato.** `rg` con `--type` e un percorso, `-l` per un elenco di file, `-c` per i conteggi prima di riversare le corrispondenze.
- [ ] **Delega l'esplorazione a un subagent in sola lettura.** Restituisce una conclusione con riferimenti `file:line`; la sua lettura non entra mai nel tuo contesto.
- [ ] **Limita ogni output degli strumenti.** `head`, `--max-count`, `tail -20` sull'output dei test, `jq` con un percorso sul JSON.
- [ ] **Mantieni stabile il prefisso stabile.** Il prompt di sistema (incluso CLAUDE.md) è il prefisso in cache. Modificarlo o cambiare modello a metà sessione azzera la cache per il resto della sessione.
- [ ] **Test propri mentre lavori, suite completa una sola volta.** Una suite completa lanciata a metà compito sono token spesi su un output che non leggerai. (House rule)
- [ ] **Compatta con uno scopo.** Indica cosa tenere e cosa scartare. Una compattazione che conserva il piano e scarta l'esplorazione vale più di una che conserva tutto, ricordato a metà.
- [ ] **Evita i cicli di screenshot.** Uno screenshot per orientarti, poi estrazione del testo. Screenshot ripetuti della stessa pagina sono il modo più costoso di leggerla.

### Con graft

graft mantiene una directory `graft/` alla radice del repo: un grafo precostruito di ogni simbolo con il suo intervallo `file:line`, di chi chiama cosa e di brevi schede in prosa per area. Ogni query costa poche centinaia di token, non richiede chiave API, risponde in meno di un secondo e si aggiorna da sola prima di rispondere, così descrive sempre il codice com'è adesso, comprese le modifiche non committate.

- [ ] **Installa una volta per repo.** `npm i -g @nanonets/graft@latest`, poi `graft init` nel repo. Con npm 12 e successivi, le installazioni globali bloccano per default gli script di build nativi, il che impedisce a graft di caricare i suoi parser; riesegui l'installazione con `--allow-scripts=` elencando i pacchetti che npm indica nell'avviso. Per Claude Code scrive il file di istruzioni, gli hook, la statusline e la configurazione del server MCP; `graft build` costruisce il grafo di collegamento gratuito. `--deep` aggiunge una mappa dei concetti via LLM; saltalo a meno che non ti venga chiesto.
- [ ] **Una chiamata per domanda; scegli lo strumento adatto.** Usa la tabella qui sotto. La maggior parte dei compiti richiede esattamente una chiamata a graft; concatenare strumenti "sperando di ottenere di più" è il modo principale di sprecare i risparmi.
- [ ] **`graft ask "<question>" --source` è la scelta predefinita.** Risultati ordinati con il nucleo di ogni definizione inline, così ottieni il codice che ti serve senza una lettura successiva. `--in <path>` restringe l'ambito; `--full` solo quando il nucleo è troppo piccolo per agire.
- [ ] **`graft grep "<pattern>"` quando ti servono tutte le occorrenze.** Risultati raggruppati per simbolo contenitore e ordinati per accoppiamento. Cerca un nome semplice, non una firma ipotizzata; se non trova nulla, allarga il pattern prima di ripiegare sul grep grezzo.
- [ ] **`graft skeleton <file>` prima di toccare un file.** Solo le firme, circa 200 token, grosso modo dieci volte più economico che leggere il file.
- [ ] **`graft callers <symbol> --depth 2` prima di cambiare una firma.** Archi precalcolati, non una ricerca testuale. `--depth all` prima di qualsiasi refactoring o modifica su più file; `--direction out` per ciò da cui un simbolo dipende.
- [ ] **`graft map` per orientarti in un repo sconosciuto.** Poi leggi le schede hub che indica. Non fare skeleton né domande su ogni sottosistema elencato.
- [ ] **Non incanalare mai graft in `head`, `tail` o `sed -n`.** L'output è già limitato e dichiara cosa ha omesso. Tagliarlo fa perdere risultati e la riga dei risparmi da cui viene ricavato il totale della statusline.
- [ ] **Fidati degli intervalli.** L'elenco `covers:` di un nodo è generato dal sorgente ed è autorevole. Non riaprire i file per ricontrollarlo.
- [ ] **Riporta cosa ha risparmiato graft, a ogni turno.** Ogni strumento si apre con `[graft] tokens saved ≈ N`. Sommali nella risposta; `graft stats` mostra la composizione della sessione.
- [ ] **Collegalo alla CI.** `graft check` fallisce quando l'indice è obsoleto; `graft blast --format markdown` pubblica il raggio d'impatto di un diff come commento sulla PR, con un diagramma.
- [ ] **Nei worktree, interroga dal checkout principale.** L'indice vive lì. Gli agenti lo usano in sola lettura e modificano la propria copia. (House rule)
- [ ] **In un monorepo, delimita con `--in <scope>/`.** I risultati portano un'etichetta di scope; l'ordinamento è equo tra i sotto-progetti, ma restringere fa comunque risparmiare token.
- [ ] **Tieni graft aggiornato.** `graft version` confronta la build installata con npm; `graft upgrade` la applica. Riavvia l'agente dopo l'aggiornamento. CodeGraph si aggiorna con `codegraph upgrade`, poi `codegraph sync` in ogni repo indicizzato.

| Quando stai... | Usa | Chiamate |
|---|---|---|
| Facendo onboarding, "spiegami questa codebase" | `graft map`, poi leggi le schede hub che indica | 1 |
| Capendo un flusso, "come funziona X" | `graft ask "<flow>" --source` | 1 |
| Cercando dove va una modifica | `graft ask "where is <behaviour>" --source` | 1 |
| Modificando un simbolo che sai già nominare | `graft grep "<symbol>"`, modifica al `file:line` | 1 |
| Rinominando, eliminando, cambiando una firma | prima `graft callers <sym> --depth 2` | 1 |
| Refactoring o modifica su più file | `graft callers <sym> --depth all` prima di modificare | 1 |
| "Da cosa dipende questo?" | `graft callers <sym> --direction out` | 1 |
| Ogni occorrenza di un pattern | `graft grep "<literal>"` | 1 |
| "Qual è l'API di questo file?" | `graft skeleton <file>` | 1 |
| Facendo debug di un errore nell'area X | `graft ask "<symptom>" --source`, poi `callers` sul sospetto | da 1 a 2 |
| Valutando il rischio di un diff prima del merge | `graft callers <changed sym> --depth 2` | 1 per simbolo |

Quando il server MCP di graft è connesso, gli stessi strumenti compaiono come `graft_find_code`, `graft_find_all`, `graft_file_api`, `graft_trace_calls`, `graft_repo_map` e `graft_check_freshness`. Caricali con una sola chiamata `ToolSearch`, mai uno alla volta.

### CodeGraph come altro indice

- [ ] **Se esiste `.codegraph/`, usalo prima di grep.** `codegraph explore "<question>"` restituisce in una sola chiamata il sorgente dei simboli rilevanti più i percorsi di chiamata tra loro; `callers`, `callees`, `impact` e `affected` coprono il resto. Non eseguire `codegraph init` sul repo di qualcun altro; indicizzare è una decisione del proprietario.
- [ ] **Scegli un solo indice primario per repo.** Entrambi gli strumenti offrono la struttura prima del sorgente; usarli insieme raddoppia gli schemi degli strumenti nel contesto.

## Ottimizzazione dell'uso dei modelli

Tre leve, in ordine: dimensione del contesto (la sezione precedente), effort, livello del modello. Giudica in base al costo per compito completato. Un modello più economico che richiede più turni, più tentativi o una correzione umana non è più economico.

### Instradamento per tipo di compito

| Tipo di compito | Modello | Effort | Perché |
|---|---|---|---|
| Scansioni con grep, lettura di log, applicazione di una rinomina da una mappa nota, formattazione, boilerplate, estrazione di fatti da un file noto | Haiku 4.5 | low | Alto volume, basso giudizio; gli errori costano poco e si vedono |
| Un componente o un test da una specifica, un passo di migrazione documentato, aggiornamenti della documentazione, riepiloghi di changelog, revisione di primo passaggio | Sonnet 5.5 | medium (default) | Criteri di accettazione chiari limitano il danno di una risposta sbagliata |
| Decisioni di architettura e di design, migrazioni ambigue, debug della causa radice, revisione di sicurezza, verifica avversariale, giudizio finale sull'output di altri agenti | Opus 5.5, oppure il modello di punta della sessione quando la quota lo permette | high o xhigh | Una risposta sbagliata è costosa da individuare e da annullare |
| La sessione interattiva che tiene l'intero compito | Il miglior modello disponibile | xhigh (default di Claude Code) | Prende le decisioni di giudizio e scrive i brief per tutti gli altri |

### Senza graft

- [ ] **Orchestratore forte, braccia economiche.** La sessione o lo script che tiene il compito gira sul modello di punta; tutto ciò che è circoscritto gira su Sonnet o Haiku.
- [ ] **Stringi il brief perché un modello più economico non debba esplorare.** L'esplorazione è dove i modelli economici bruciano turni e sbagliano. Con riferimenti `file:line` e criteri di accettazione, Sonnet fa ciò che farebbe Opus.
- [ ] **Abbassa l'effort prima di abbassare il livello.** Misura su un campione di compiti reali. Il modello più recente a effort basso spesso eguaglia uno più vecchio a effort alto.
- [ ] **Non declassare mai il verificatore.** La verifica è il punto in cui le risposte sbagliate costano di più. Eseguila sul modello più forte che la tua quota consente e controlla l'utilizzo prima di avviare. (House rule)
- [ ] **Evita le cascate che dividono la cache.** Le cache dei prompt sono per modello. Una cascata multi-modello in un'app API rinuncia al riuso della cache tra i suoi modelli; un solo modello con effort calibrato di solito vince.
- [ ] **Eredita il modello della sessione solo quando il compito richiede il livello massimo.** Imposta le fasi su ciò di cui hanno bisogno, non su ciò che sta eseguendo il workflow. (House rule)

### Con graft

- [ ] **Lascia che graft esplori, poi scendi di un livello.** `graft ask --source` restituisce intervalli esatti con il nucleo inline, così un agente Sonnet può modificare ciò che prima richiedeva Opus per essere trovato.
- [ ] **Dai a Haiku la mappa, non la ricerca.** `graft callers <sym> --depth all` è l'elenco completo dei punti di una rinomina. Passa quell'elenco a un agente Haiku perché lo applichi meccanicamente; non chiedergli di scoprirlo.
- [ ] **Abbassa l'effort sulle ricerche supportate da graft.** Servono meno chiamate agli strumenti, quindi una deliberazione in più rende poco.
- [ ] **Mantieni piccoli i risultati degli strumenti per tenere calda la cache.** Gli output di graft sono limitati; le letture di file interi sono i carichi pesanti che spingono fuori dalla finestra il contesto stabile.
- [ ] **Spendi i risparmi in verifica.** Se graft fa risparmiare decine di migliaia di token a sessione, quello è il budget per un verificatore più forte, non per più esplorazione.

## Chat di claude.ai e Projects

- [ ] **Un Project per dominio.** Le istruzioni del Project portano il contesto permanente; la knowledge del Project porta i documenti. Entrambe si caricano senza doverle incollare in ogni chat.
- [ ] **Prima lo schema, poi espandi sezione per sezione.** Le risposte lunghe in un colpo solo nascondono i problemi strutturali fino alla fine.
- [ ] **Mostra l'output che vuoi.** Un breve esempio di formato, tono o tabella vale più di tre paragrafi che lo descrivono.
- [ ] **Chiedi le fonti e verificale.** Per fatti, date e cifre, chiedi da dove provengono e verifica prima di riutilizzarli.
- [ ] **Usa gli artifact per tutto ciò che riutilizzerai o condividerai.** Documenti, pagine, diagrammi e piccoli strumenti stanno meglio come artifact che come testo in chat.
- [ ] **Passa a Claude Code quando il compito tocca i file.** Repository, terminali, browser e tutto ciò che va verificato eseguendolo appartengono a Code, non alla chat.
- [ ] **Usa memoria e stili in modo deliberato.** La memoria dovrebbe contenere fatti stabili su di te e sul tuo lavoro; gli stili dovrebbero codificare la voce che continui a chiedere.
- [ ] **Avvia una nuova chat quando cambia l'argomento.** Le chat lunghe hanno lo stesso costo di contesto delle sessioni lunghe.

## Sviluppare con l'API e gli SDK

Per i team che integrano Claude nel proprio prodotto. Tutto passa da un unico endpoint, `POST /v1/messages`; strumenti, output strutturati e caching sono funzionalità di quell'endpoint. La skill `claude-api` in Claude Code contiene il riferimento aggiornato; gli elementi qui sotto sono le abitudini.

### Scegli il livello più semplice

- [ ] **Chiamata singola, poi workflow, poi agente.** Classificazione, estrazione e riassunto sono una sola richiesta. Le pipeline a più passi con logica controllata dal codice sono un workflow che orchestri tu. Solo l'uso aperto di strumenti guidato dal modello è un agente.
- [ ] **Quattro criteri prima di costruire un agente.** Complessità (a più passi e difficile da specificare in anticipo), valore (vale il costo e la latenza), fattibilità (Claude è capace in questo compito), costo dell'errore (si può individuare e recuperare). Un "no" su uno qualsiasi significa restare più semplici.
- [ ] **Conosci i quattro modi di costruire un agente.** Un ciclo manuale che gestisci tu; il Tool Runner dell'SDK che cicla sugli strumenti che definisci; Managed Agents, dove Anthropic esegue il ciclo e ospita la sandbox; e il Claude Agent SDK, che è Claude Code come libreria con strumenti integrati. Il primo, il secondo e il quarto lasciano il deployment a te.

### Igiene delle richieste

- [ ] **Usa per default l'Opus attuale con adaptive thinking.** `claude-opus-5-5` a meno che l'utente indichi un altro modello. Il thinking resta attivo; controlla la profondità con `output_config.effort` e impostalo in modo esplicito, perché il default su Opus 5.5 è `medium`.
- [ ] **Usa lo streaming per tutto ciò che è lungo.** Non sottostimare `max_tokens`: circa 16k senza streaming, 64k con streaming. Usa l'helper dell'SDK per il messaggio finale quando non servono i singoli eventi.
- [ ] **Niente prefill né scelta forzata dello strumento sui modelli attuali.** Entrambi restituiscono un 400 sulla linea 5.x. Usa invece gli output strutturati (`output_config.format`) e gli strumenti `strict: true`.
- [ ] **Controlla `stop_reason` prima di leggere il contenuto.** `refusal`, `max_tokens`, `pause_turn` e `tool_use` richiedono ciascuno una gestione. Abilita i fallback lato server sui modelli 5.x così che un rifiuto di sicurezza venga instradato a un modello di ripiego.
- [ ] **Usa gli helper e i tipi dell'SDK.** Non scrivere a mano il ciclo degli strumenti, la promise dello streaming o i tipi dei messaggi. Intercetta una catena di errori tipizzati, dal più specifico, così da distinguere i fallimenti ritentabili da quelli non ritentabili.

### Prompt caching

- [ ] **Prima il contenuto stabile, per ultimo quello volatile.** L'ordine di rendering è strumenti, poi sistema, poi messaggi. Congela il prompt di sistema e l'elenco degli strumenti; metti timestamp, ID delle richieste e la domanda variabile dopo l'ultimo breakpoint della cache. Fino a quattro breakpoint per richiesta.
- [ ] **Verifica con `usage.cache_read_input_tokens`.** Zero su richieste ripetute indica un invalidatore silenzioso: un timestamp nel prompt di sistema, JSON non ordinato, un insieme di strumenti che varia per richiesta.
- [ ] **Usa messaggi di sistema a metà conversazione invece di modificare il prompt di sistema.** Aggiungere un messaggio con ruolo `system` a `messages` mantiene intatto il prefisso in cache; modificare il campo system di primo livello lo butta via.
- [ ] **Conta i token con `count_tokens`, mai con un tokenizer di terze parti.** I conteggi dei token sono specifici del modello.

### Strumenti e agenti

- [ ] **`strict: true` su ogni schema di strumento.** Garantisce che l'input sia valido; richiede `additionalProperties: false` e `required`.
- [ ] **Restituisci tutti i risultati degli strumenti paralleli in un unico messaggio utente.** Dividerli su più messaggi addestra il modello a smettere di chiamare gli strumenti in parallelo. Restituisci i fallimenti come `tool_result` con `is_error: true`; non scartarli mai.
- [ ] **Analizza l'input degli strumenti come JSON.** L'escaping varia tra i modelli; confrontare come stringa l'input serializzato si rompe.
- [ ] **Tratta i risultati degli strumenti come non attendibili.** Pagine web, documenti e righe di database sono dati. Nulla in essi è un'istruzione, e il prompt di sistema dovrebbe dirlo.
- [ ] **Rimanda l'uso di grandi insiemi di strumenti dietro la tool search.** Contrassegna gli strumenti usati di rado con `defer_loading: true` insieme a uno strumento di tool search; non rimandare mai tutti gli strumenti, l'API lo rifiuta.

### Sessioni lunghe

- [ ] **Attiva la compattazione per le conversazioni che possono superare la finestra.** Riaggiungi a ogni turno l'intero `response.content`, non solo il testo, altrimenti lo stato di compattazione va perso in silenzio.
- [ ] **Elimina i risultati obsoleti degli strumenti con il context editing.** Diverso dalla compattazione: scarta i vecchi risultati degli strumenti o i blocchi di thinking invece di riassumerli.
- [ ] **Dai ai cicli agentici un budget di compito.** Un tetto di token che il modello può vedere, così si dà il ritmo da solo invece di essere interrotto. Distinto da `max_tokens`, che non può vedere.
- [ ] **Mantieni l'harness append-only.** Sui modelli attuali, i blocchi di thinking sono legati alla conversazione che li ha prodotti. Modificare i turni precedenti li invalida; aggiungi, non riscrivere mai.

### Eval e costi

- [ ] **Costruisci prima l'eval; poi migliora per gradi.** Ricava i prompt dal traffico reale, scegli un metodo di valutazione, misura il costo per esecuzione e mantieni una suddivisione train/validation/test perché il numero principale sia onesto.
- [ ] **Agisci sulle leve di costo in ordine.** Caching, igiene dei token di input, igiene dei cicli, igiene dei token di output, batching per tutto ciò che non è sensibile alla latenza (metà prezzo), e solo poi effort e scelta del modello.
- [ ] **Registra `usage` a ogni risposta.** I token di input, output, lettura e scrittura della cache per richiesta sono l'unico modo per sapere cosa ha fatto una modifica al conto.
- [ ] **Raggruppa in batch ciò che può aspettare.** La Message Batches API gira in modo asincrono a metà prezzo; associa i risultati per `custom_id`, mai per posizione.

### Modelli attuali

| Modello | ID | Contesto | Input per MTok | Output per MTok |
|---|---|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` | 1M | $10.00 | $50.00 |
| Claude Opus 5.5 | `claude-opus-5-5` | 1M | $4.00 | $20.00 |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | 1M | $2.00 | $10.00 |
| Claude Haiku 4.5 | `claude-haiku-4-5` | 200K | $1.00 | $5.00 |

Tariffe dell'API di prima parte a settembre 2026. Le letture dalla cache sui modelli attuali costano una piccola frazione del prezzo di input (dal 2,5% al 10%), ed è per questo che un prefisso stabile conta più di ogni altra leva. Usa gli ID esatti qui sopra, senza suffissi di data.

## Regole della casa

Le regole di lavoro che Marc ha stabilito per gli agenti, conservate in `~/.claude/CLAUDE.md` così che ogni sessione e ogni subagent le carichi. Sono riportate qui perché il team legga lo stesso testo. Le date indicano quando ciascuna regola è stata stabilita.

### Selezione del modello per agenti e workflow avviati (2026-09-09, rafforzata il 2026-09-17)

- [ ] **Non sprecare risorse sui workflow; è una regola ferrea.** Scegli modello ed effort per tipo di compito. Non usare mai un modello eccessivo per un compito semplice, non sottodimensionare mai uno difficile.
- [ ] **Dimensiona ogni fase su ciò di cui ha bisogno.** Non impostare mai tutte le fasi sul modello dell'orchestratore o sull'effort massimo solo perché è ciò che sta eseguendo il workflow.
- [ ] **Haiku, effort low** per il lavoro meccanico, ad alto volume e a basso giudizio: scansioni con grep, lettura di log, applicazione di una rinomina da una mappa nota, formattazione, boilerplate, estrazione di fatti da un file noto.
- [ ] **Sonnet, effort di default** per implementazione e ricerca circoscritte con criteri di accettazione chiari: un componente o un test da una specifica, un passo di migrazione documentato, aggiornamenti della documentazione, riepiloghi di changelog, revisione di primo passaggio.
- [ ] **Opus o il modello di punta della sessione, effort high** dove una risposta sbagliata è costosa: decisioni di architettura e di design, migrazioni ambigue, debug della causa radice, revisione di sicurezza, verifica avversariale, giudizio finale sull'output di altri agenti.
- [ ] **Indica il modello e il motivo per ogni fase e ogni subagent.** Nessuna eccezione.

### Come distribuire i workflow (2026-09-20)

- [ ] **Produttore più verificatore indipendente, sempre.** Il verificatore ripara ciò che trova invece di limitarsi a segnalarlo. Il verificatore gira su Fable quando la quota lo permette, altrimenti su Opus; controlla `mcp__ccd_session_mgmt__get_usage` prima di avviare e non lasciare mai una fase sul modello di default quando il modello della sessione è vicino al limite.
- [ ] **Preferisci un oracolo deterministico a un verificatore basato su modello.** Un assemblatore, un'implementazione di riferimento, un round-trip, una baseline byte per byte. Le tracce supportate da un oracolo non richiedono alcuna fase di verifica costosa.
- [ ] **Ogni prompt di produttore si apre con un preambolo SETTLED.** I messaggi recenti dell'utente sono rivolti all'orchestratore; non fare domande, non attendere, non restituire il compito; non eseguire mai `gh`, `git commit`, `git push` o `git checkout`; non disattivare mai l'hook GateGuard; nessuna nuova dipendenza di terze parti; esegui i gate finali indicati e riporta con onestà.
- [ ] **Proteggiti dai risultati segnaposto.** Di' agli agenti: se la chiamata strutturata viene rifiutata, correggi il JSON e rinvia il risultato completo, mai un segnaposto. Convalida la sostanza nello script, ad esempio `if (!r || r.summary.length < 120) throw`. Prima di pagare per una nuova esecuzione, leggi `journal.jsonl` e la trascrizione dell'agente; i primi 2 KB di un payload fallito sopravvivono in `__unparsedToolInput.raw`.
- [ ] **Un git worktree per ogni traccia parallela.** `git worktree add -b <branch> <path> origin/main`; ogni agente scrive solo nel proprio. Gli strumenti di indicizzazione vivono nel checkout principale e vengono usati da lì in sola lettura.
- [ ] **Fai merge tramite l'API mentre un workflow occupa il checkout principale.** `gh api -X PUT repos/<o>/<r>/pulls/N/merge -f merge_method=rebase`; `gh pr merge` cambia il branch locale. Non concatenare mai l'eliminazione di un branch dopo un comando di merge. Con controlli di stato rigorosi, i merge sono seriali: porta dentro main e attendi il successivo giro di controlli; non fare mai rebase né force-push di una PR che il monitor CI sta osservando.
- [ ] **Dimensiona in base al budget, non all'ambizione.** Controlla prima la quota settimanale e di' quanto costerà l'esecuzione. Riporta la spesa rispetto al tetto alla fine di ogni esecuzione e riporta i risparmi di token di graft o CodeGraph.
- [ ] **Riporta le decisioni come prove, non come domande.** Presenta la misurazione che la risolve e le opzioni con le relative conseguenze; registra la risposta e le affermazioni che non hanno superato la verifica.

### Economia di contesto e test (2026-09-19)

- [ ] **Struttura prima del sorgente.** Nei repo indicizzati da graft, `graft skeleton <file>`, `graft grep` e `graft callers` prima di aprire qualsiasi cosa. Dove graft è assente, CodeGraph se indicizzato, altrimenti un grep mirato sul simbolo; mai file interi per orientarsi.
- [ ] **Leggi solo i file che modifichi.** Apri un file per intero solo quando stai per cambiarlo. Non rileggere un file appena modificato.
- [ ] **Test propri mentre lavori, suite completa una sola volta.** Esegui solo i file di test che coprono ciò che stai modificando; la suite completa una sola volta alla fine come gate finale, e di nuovo solo se quell'esecuzione è fallita e hai cambiato qualcosa.
- [ ] **Dichiara queste abitudini in ogni prompt di subagent e di workflow.** Alcuni tipi di agente integrati non caricano CLAUDE.md.

### Strumenti di indicizzazione

- [ ] **CodeGraph prima di grep dove esiste `.codegraph/`.** `codegraph_explore` via MCP o `codegraph explore "<question>"` nella shell. Dove non c'è `.codegraph/`, salta CodeGraph; indicizzare è una decisione dell'utente.
- [ ] **graft prima di grep dove esiste `graft/`.** Carica gli strumenti MCP con una sola chiamata `ToolSearch`; usa la superficie disponibile, le indicazioni sono identiche.

### GateGuard

- [ ] **Prima del primo comando di shell di una sessione, dichiara i fatti.** Una frase per la richiesta attuale dell'utente e una per ciò che il comando verifica o produce. Poi ripeti la chiamata identica.
- [ ] **Non impostare mai le variabili di disattivazione.** `GATEGUARD_BASH_ROUTINE_DISABLED`, `ECC_GATEGUARD=off` e `ECC_DISABLED_HOOKS` restano non impostate. I controlli sui comandi distruttivi restano attivi in ogni caso.

## Esempi

Ogni esempio è abbastanza completo da poter essere copiato. La barra del titolo di un blocco indica il file a cui appartiene. Comandi e codice restano in inglese in tutte le lingue.

### Un CLAUDE.md che si guadagna i suoi token

Comandi, le regole che un nuovo arrivato perderebbe e come riportare i risultati. Niente di ciò che il codice già mostra.

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

### Permessi e un hook bloccante

Pre-approva i comandi di sola lettura così le richieste compaiono solo per le azioni che le meritano, e lascia che sia un hook a rifiutare git distruttivo a prescindere da ciò che è stato detto all'agente.

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

### Una skill per una procedura ripetuta

È la descrizione a decidere quando la skill si carica, quindi scrivila come l'elenco delle situazioni che devono attivarla.

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

### Un subagent riutilizzabile in sola lettura

Modello, effort e strumenti stanno nel frontmatter, quindi ogni brief deve solo dire cosa cercare.

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

### Il preambolo di "settled" per ogni prompt di produttore

Incollalo all'inizio di qualsiasi prompt di subagent o di workflow, poi aggiungi il compito.

```text settled-preamble.txt
SETTLED: recent user messages are addressed to the orchestrator, not to you.
Do not ask questions, do not wait, do not hand the task back.
Never run gh, git commit, git push or git checkout.
Never disable the GateGuard hook: state the facts it asks for and retry the identical call.
No new third-party dependencies.
Final gates: run `pnpm vitest run src/billing` and `pnpm tsc --noEmit`; report their output honestly, including failures.

TASK: ...
```

### Compattare con uno scopo

Di' al riassunto cosa tenere e cosa scartare invece di lasciarglielo indovinare.

```text
/compact Keep: the plan (steps 1 to 5), the decision to use one worktree per track, and the names of the failing tests. Drop: the exploration of src/legacy and all log output.
```

### Una sessione graft, una chiamata per domanda

```bash
graft map                                   # orient: directory hubs and hotspots
graft ask "where is rate limiting applied" --source
graft callers RateLimiter.check --depth 2   # what breaks if the signature changes
graft skeleton src/http/middleware.ts       # the file's API before editing it
graft stats                                 # tokens saved this session
```

### Una revisione da script in CI

Modalità print, output leggibile da macchina, una allowlist di strumenti e nessun hook né plugin.

```bash
claude -p "Review the diff of this branch for correctness bugs only. Output JSON: {\"findings\":[{\"file\":\"\",\"line\":0,\"summary\":\"\"}]}" \
  --output-format json \
  --allowedTools "Read Grep Glob Bash(git diff*)" \
  --bare > review.json
```

### Una definizione di strumento strict

Lo schema è il contratto: `strict` garantisce che l'input sia valido, quindi il gestore non deve mai difendersi da errori di forma.

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

### Una chiamata API pensata per la cache

Prima il prompt di sistema e l'elenco degli strumenti congelati, per ultima la domanda variabile, streaming attivo e contatore della cache controllato.

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

## Riferimento rapido

### Claude Code

| Necessità | Usa |
|---|---|
| Generare una bozza di CLAUDE.md | `/init` |
| Vedere cosa riempie il contesto | `/context` |
| Riassumere e proseguire | `/compact <what to keep>` |
| Ripartire da zero | `/clear` |
| Spesa della sessione | `/cost` |
| Cambiare modello | `/model` |
| Output più veloce, stesso modello | `/fast` |
| Effort all'avvio | `claude --effort xhigh` |
| Modalità piano e modalità di permesso | Shift+Tab |
| Fermare il turno in corso | Escape |
| Rivedere il diff per i bug | `/code-review` |
| Ripulire il diff | `/simplify` |
| Passaggio di sicurezza sul branch | `/security-review` |
| Meno richieste di permesso | `/fewer-permission-prompts` |
| Esecuzione da script | `claude -p "<prompt>" --output-format json --allowedTools "Read Grep"` |
| Esecuzione ricorrente nel cloud | `/schedule` |
| Interrogare a intervalli uno stato esterno lento | `/loop` |
| Continuare a lavorare finché vale una condizione | `/goal <condition>` |
| Riaprire qui l'ultima sessione | `claude --continue` (o `/resume`) |

### graft

| Necessità | Usa |
|---|---|
| Installare e collegare al repo | `npm i -g @nanonets/graft@latest` then `graft init` |
| Orientarsi in un repo sconosciuto | `graft map` |
| Capire o localizzare | `graft ask "<question>" --source` |
| Ogni occorrenza | `graft grep "<name>"` |
| L'API di un file | `graft skeleton <file>` |
| Chi chiama, raggio d'impatto | `graft callers <sym> --depth 2`, `--depth all`, `--direction out` |
| Gate di aggiornamento in CI | `graft check` |
| Commento di rischio sulla PR | `graft blast --format markdown` |
| Risparmi della sessione | `graft stats` |

### CodeGraph

| Necessità | Usa |
|---|---|
| Simboli più percorsi di chiamata in una sola chiamata | `codegraph explore "<question>"` |
| Un simbolo o un file con numeri di riga | `codegraph node <name>` |
| Chiamanti, chiamati, impatto | `codegraph callers <sym>`, `codegraph callees <sym>`, `codegraph impact <sym>` |
| Test coinvolti dai file modificati | `codegraph affected <files>` |

### Parametri dell'API da ricordare

| Necessità | Usa |
|---|---|
| Profondità del thinking | `output_config.effort`: `low`, `medium`, `high`, `xhigh`, `max` |
| JSON strutturato in output | `output_config.format` |
| Input dello strumento validato | `strict: true` sullo strumento |
| Breakpoint della cache | `cache_control: {type: "ephemeral"}` (max 4) |
| Istruzione dell'operatore a metà conversazione | `{role: "system", content: ...}` dentro `messages` |
| Conversazioni lunghe | beta di compattazione `compact-2026-01-12` |
| Cicli di agenti con ritmo | `output_config.task_budget` con beta `task-budgets-2026-03-13` |
| Lavoro asincrono a metà prezzo | Message Batches API |

## Fonti

- Documentazione di Claude Code: https://code.claude.com/docs
- Documentazione della Claude API: https://docs.anthropic.com
- Obiettivi, loop e routine di Claude Code: https://code.claude.com/docs/en/goal, https://code.claude.com/docs/en/scheduled-tasks, https://code.claude.com/docs/en/routines
- Anthropic Engineering, Effective harnesses for long-running agents (2025-11-26): https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Anthropic Engineering, Harness design for long-running application development (2026-03-24): https://www.anthropic.com/engineering/harness-design-long-running-apps
- graft: https://www.npmjs.com/package/@nanonets/graft (la skill installata in `~/.claude/skills/graft/SKILL.md` è il riferimento operativo)
- CodeGraph: `codegraph --help` e le istruzioni del server MCP `codegraph`
- Regole di lavoro di Marc: `~/.claude/CLAUDE.md`
