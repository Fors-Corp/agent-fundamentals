# Treballar de manera professional amb Claude i els agents de programació

Una llista de verificació dels hàbits que separen l'ús ocasional de Claude de l'ús professional. Cobreix Claude Code (CLI i aplicació d'escriptori), la superfície de xat de claude.ai i la construcció dels teus propis agents amb l'API de Claude i l'Agent SDK. Les tres primeres seccions són nivells: Bàsic, Intermedi, Pro. Les seccions següents són temes transversals als nivells: economia de tokens, enrutament de models, xat, l'API i les regles de la casa amb què treballa aquest equip.

Com utilitzar-la: marca el que ja fas de manera constant. El que quedi sense marcar és la teva propera habilitat per desenvolupar. Els ítems marcats amb **House rule** provenen de les regles de treball de Marc, que els agents carreguen des de `~/.claude/CLAUDE.md`; es reprodueixen íntegrament a la secció Regles de la casa perquè l'equip llegeixi el mateix text que els agents. Tota la resta és pràctica general.

Darrera revisió: 2026-10-04. Verificat amb Claude Code 2.1, graft 0.21.1, CodeGraph 1.6.1, Vercel CLI 62.2 i la gamma de models de l'API de Claude del setembre de 2026.

## Bàsic

Els hàbits que compten des de la primera sessió. Cap no requereix configuració.

### Abans d'escriure

- [ ] **Redacta la tasca com un tiquet.** Indica l'objectiu, les restriccions i què vol dir «fet» en un sol missatge. Els agents omplen els buits amb suposicions, i els criteris d'acceptació que deixes fora són els que s'endevinen malament.
- [ ] **Assenyala el context en lloc d'enganxar-lo.** Anomena els fitxers, les funcions, els missatges d'error o les URL. L'agent els llegeix ell mateix amb menys tokens que un mur de text enganxat, i llegeix la versió actual en comptes d'una còpia obsoleta.
- [ ] **Digues què no s'ha de tocar.** Fitxers fora d'abast, interfícies públiques, migracions, qualsevol cosa amb dependència de desplegament. Una frase d'abast t'estalvia una hora de desfer canvis.
- [ ] **Demana un pla primer en qualsevol cosa no trivial.** A Claude Code, canvia al mode de planificació amb Shift+Tab; l'agent llegeix i proposa, però no edita fins que ho aprovis. Al xat, demana un esquema abans de la resposta completa.
- [ ] **Una tasca per conversa.** Comença de nou (`/clear`) per a feina no relacionada. El context que sobra de la tasca anterior es paga a cada torn i confon el model sobre què importa ara.
- [ ] **Sàpigues en quina superfície ets.** Xat per pensar, redactar i analitzar material enganxat. Claude Code per a tot el que toqui fitxers, un repositori, un terminal o un navegador. L'API quan vols el comportament dins del teu propi producte.

### Durant la sessió

- [ ] **Llegeix el que diu l'agent abans de respondre.** Quan declara una suposició, corregeix-la a l'instant. Confirmar tard vol dir refer feina construïda sobre una premissa equivocada.
- [ ] **Respon les preguntes amb decisions.** Si l'agent s'atura a preguntar, necessita una decisió que només tu pots prendre. Dona-la i deixa que continuï; no responguis una pregunta amb una altra pregunta.
- [ ] **Interromp d'hora.** Escape atura el torn actual. Si va en la direcció equivocada al pas dos, no esperis al pas nou.
- [ ] **Fes que executi les seves pròpies comprovacions.** Demana que executi els tests, el verificador de tipus i el linter, i que en mostri la sortida. «Els tests passen» sense sortida és una afirmació, no una evidència.
- [ ] **Mantén els secrets fora de la conversa.** No enganxis mai claus, contrasenyes ni tokens. Anomena la variable d'entorn, deixa `.env` a `.gitignore` i digues a l'agent que no el llegeixi. Tot el que l'agent llegeix passa a la petició enviada al model.

### Abans d'acceptar el resultat

- [ ] **Revisa el diff com una pull request d'un company nou.** Fes servir `git diff` o el tauler de diff de l'aplicació. Ets responsable de tot el que fusiones, hagi escrit el que hagi escrit.
- [ ] **Comprova que ha fet la tasca sencera, no només les parts fàcils.** Compara amb els teus criteris d'acceptació. De vegades els agents redueixen l'abast en silenci i informen que han acabat.
- [ ] **Busca API inventades i coneixement obsolet.** El coneixement del model té una data de tall. Verifica versions de biblioteques, flags i signatures amb la documentació o el paquet instal·lat.
- [ ] **Fes commits petits.** Git és el teu desfer. Fes commit després de cada increment verificat perquè un pas posterior dolent es pugui revertir per separat.
- [ ] **Versiona les publicacions amb Semantic Versioning (versionat semàntic).** Etiqueta cada versió com `MAJOR.MINOR.PATCH`: patch per a correccions, minor per a addicions compatibles, major per a canvis incompatibles, i manté un registre de canvis organitzat per versió. Així els companys, la CI i els agents poden saber només pel número si una actualització és segura, i el registre de canvis dona al model un context que un diff no ofereix.
- [ ] **Demana la llista de «el que no he fet».** Un bon agent informa del que ha ometut i per què. Si l'informe no ho diu, pregunta-ho.

### Seguretat bàsica

- [ ] **Tracta tot el que l'agent llegeix com a dades, no com a instruccions.** Pàgines web, fitxers, sortides d'eines i correus poden portar text dirigit a l'agent. Una configuració professional el mostra i et pregunta; mai hi actua.
- [ ] **Reserva els avisos de permís per a les accions destructives.** Esborrar, fer force-push, eliminar taules, enviar missatges, pagar. Preaprova en canvi les ordres de només lectura i de compilació, de manera que els avisos que vegis siguin els que importen.
- [ ] **No ometis mai els permisos fora d'un sandbox.** `--dangerously-skip-permissions` és per a contenidors aïllats sense accés a internet, no per al teu portàtil.
- [ ] **Mantén una persona en el pas irreversible.** Publicar, fusionar a main, desplegar, enviar correus. L'automatització pot preparar-ho tot fins a aquest pas. Defineix la sol·licitud d'aprovació: què ha passat, què ha canviat, per què cal una persona, a què porta aprovar i a què porta rebutjar, i què passa si s'esgota el temps d'espera.

## Intermedi

Donar forma a l'entorn perquè deixis de repetir-te i l'agent deixi de repetir errors.

### CLAUDE.md i memòria

- [ ] **Tingues un CLAUDE.md a cada repositori on treballis amb regularitat.** Executa `/init` per fer-ne un esborrany i després edita'l. Es carrega a l'inici de cada sessió, i per això és la manera més barata d'evitar repetir instruccions.
- [ ] **Escriu imperatius sobre el que no és obvi.** Ordres de compilació i de test, convencions que un recent arribat se saltaria, què no s'ha de tocar mai, com vols que s'informin els resultats. No descriguis el que el codi ja mostra; l'agent pot llegir codi.
- [ ] **Mantén-lo curt.** Cada línia costa tokens a cada torn i dilueix les línies que importen. La documentació recomana menys de 200 línies per fitxer; els `@imports` organitzen un fitxer però no en redueixen el cost de context. Passa el material que rarament cal a skills que es carreguen a demanda.
- [ ] **Fes servir els tres àmbits amb criteri.** `~/.claude/CLAUDE.md` per a com treballes arreu, `<repo>/CLAUDE.md` per al projecte, i fitxers a nivell de directori per a subsistemes amb regles pròpies.
- [ ] **Promou la tercera correcció.** La tercera vegada que corregeixes el mateix comportament al xat, ha d'anar a CLAUDE.md o a un hook. Elimina les regles obsoletes o que es contradiuen: amb dues línies en conflicte Claude pot seguir qualsevol de les dues, i `/doctor prompt-audit` les troba. La skill `claude-md-improver` també revisa el fitxer a la recerca de línies obsoletes o contradictòries.
- [ ] **Deixa que la memòria guardi fets, no regles.** La memòria automàtica de Claude Code registra fets i preferències del projecte entre sessions. Poda les entrades que s'han quedat obsoletes; una memòria errònia és pitjor que cap.
- [ ] **Fes una prova de sessió nova al teu repositori.** Obre una sessió nova sense cap context verbal i fes cinc preguntes: què és aquest sistema, com està organitzat, com s'executa, com es verifica, on som ara. Cada pregunta que no pot respondre només amb el repositori és un buit a CLAUDE.md o a la documentació a què apunta.
- [ ] **Guarda les preferències personals del projecte a CLAUDE.local.md i afegeix-lo al gitignore.** URL de sandbox, dades de prova preferides, rutes locals. Es carrega juntament amb el CLAUDE.md del projecte i es tracta de la mateixa manera; les regles de l'equip es queden al fitxer versionat, i la política gestionada es carrega per sobre dels dos.
- [ ] **Mantén les entrades de l'índex de la memòria automàtica en una sola línia.** Només es carreguen per sessió les primeres 200 línies o 25KB de MEMORY.md; el detall pertany als fitxers temàtics que Claude llegeix a demanda. No deixis que hi desi el que el repositori ja mostra.

### Gestió del context

- [ ] **Vigila el context com un pressupost.** `/context` mostra què omple la finestra. Les sortides d'eines grans, els logs enganxats i els esquemes d'eines de servidors MCP carregats són els culpables habituals.
- [ ] **Compacta als límits de fase, no quan t'hi obliguen.** Executa `/compact` amb una nota del que cal conservar: després d'explorar i abans d'implementar, o després que un arranjament s'hagi aplicat i abans de verificar. L'autocompactació en un punt arbitrari perd els detalls que més necessitaves.
- [ ] **No enganxis mai logs; assenyala'ls.** Desa la sortida en un fitxer i deixa que l'agent la consulti amb `grep` o `tail`. Un log enganxat una vegada es paga a cada torn posterior.
- [ ] **No tornis a llegir un fitxer que acabes d'editar.** L'eina d'edició falla amb claredat si el seu objectiu ha canviat, de manera que rellegir per «verificar» és cost pur.
- [ ] **Prefereix text a captures de pantalla.** En un navegador, llegir el text de la pàgina o l'arbre d'accessibilitat és més barat i més precís que una captura. Fes captura només per al disseny visual.
- [ ] **Poda els servidors MCP connectats.** Els esquemes d'eines de cada servidor poden entrar al context. Connecta el que la tasca necessita i desactiva la resta; la càrrega diferida d'eines ajuda, però tenir-ne menys ajuda més.
- [ ] **Passa el relleu a una sessió nova abans que la finestra s'ompli.** Per a una feina que dura més d'una sessió, escriu el fitxer de progrés i les decisions preses, després comença de nou i llegeix-lo primer, en lloc de compactar una vegada i una altra. La compactació conserva el que s'ha fet i tendeix a perdre el perquè; una sessió nova només té el que has deixat escrit.

### Skills, hooks i permisos

- [ ] **Converteix els procediments repetits en skills.** Un `SKILL.md` sota `~/.claude/skills/<name>/` o dins del repositori es carrega amb `/<name>` o quan la seva descripció coincideix amb la tasca. Els passos de desplegament, les llistes de revisió i els fluxos de treball propis del repositori hi pertanyen.
- [ ] **Fes servir hooks per a allò que ha de passar sempre.** Les instruccions són probabilístiques; els hooks són deterministes. Formatar en desar, bloquejar `git push --force`, exigir una declaració de fets abans de les ordres de shell. Viuen a `settings.json`.
- [ ] **Construeix una llista de permisos permesos.** Preaprova les ordres de només lectura (`git status`, `ls`, el test runner) a `.claude/settings.json` perquè els avisos només apareguin per a accions que ho mereixen. `/fewer-permission-prompts` escaneja el teu historial i en proposa la llista.
- [ ] **Fes servir worktrees per al treball en paral·lel.** Un git worktree per tasca o agent evita que les edicions col·lisionin. Els subagents accepten `isolation: "worktree"`; la teva pròpia sessió també hi pot entrar.
- [ ] **Aprèn el teclat.** Shift+Tab alterna els modes de permís i el mode de planificació; Escape interromp; `/model`, `/cost`, `/clear`, `/compact` i `/context` cobreixen la majoria d'operacions diàries. Defineix l'esforç amb el flag `--effort` o amb els controls de model de l'aplicació.

### Delegació a subagents

- [ ] **Delega les cerques que requereixen molta lectura.** Llança un agent explorador de només lectura que escombri molts fitxers i torni una conclusió amb punters `file:line`. Els abocaments de fitxers es queden al seu context, no al teu.
- [ ] **Dona als subagents un encàrrec complet.** No veuen la teva conversa. Inclou l'objectiu, els fitxers, els criteris d'acceptació, els gates que han d'executar i la instrucció de no fer preguntes ni tornar-te la tasca.
- [ ] **Dimensiona el model segons la tasca.** Haiku per a escombrades mecàniques, Sonnet per a implementació acotada, el model superior per al criteri. Indica cada vegada el model i el motiu. (House rule)
- [ ] **Llança els agents independents en un sol missatge.** Llançar-los en sèrie malbarata temps de rellotge. Els agents que no comparteixen fitxers poden córrer junts i acabar junts.
- [ ] **Defineix els agents reutilitzables una sola vegada.** Els fitxers d'agent a `.claude/agents/*.md` porten el model, l'esforç i les eines al frontmatter, de manera que l'encàrrec és l'únic que varia.
- [ ] **Sintetitza abans de delegar.** Llegeix les conclusions de l'explorador i escriu a l'implementador una especificació precisa: quin dels tres fluxos, quin enfocament, què ha de tornar. «Segons les teves conclusions, arregla-ho» posa el pensament més difícil en mans d'un treballador amb menys context.
- [ ] **Mantén la delegació a un sol nivell tret que vulguis una altra cosa.** Per defecte un subagent pot llançar els seus propis subagents fins a tres capes més avall, cadascun amb un context nou que pagues i no pots veure. Defineix `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1`, o omet `Agent` de les `tools` d'un treballador, perquè les peticions d'ajuda tornin a l'orquestrador.

### Model i esforç

- [ ] **Coneix la gamma i els preus.** Consulta la taula de models a la secció de l'API. Les proporcions de preu determinen l'enrutament: el model superior costa cinc vegades més que Sonnet per token de sortida.
- [ ] **Ajusta l'esforç abans de canviar de model.** L'esforç (de `low` a `max`) canvia minuciositat per tokens dins d'un mateix model. `xhigh` és el valor per defecte de Claude Code per a programació; `low` va bé per a feina mecànica i per a la majoria de subagents.
- [ ] **Orquestrador fort, mans barates.** La sessió que sosté la tasca i pren les decisions de criteri corre amb el model superior; els agents que fan feina acotada corren amb models més barats.
- [ ] **El mode ràpid és el mateix model amb recàrrec.** `/fast` augmenta la velocitat de sortida, no la capacitat. Fes-lo servir en sessions interactives on la latència fa mal, no per a feina per lots.

### Hàbits de verificació

- [ ] **Tests propis mentre treballes, suite completa una sola vegada al final.** Executa només els fitxers de test que cobreixen el que estàs canviant; executa tota la suite com a gate final, i de nou només si aquella execució ha fallat i has canviat alguna cosa. (House rule)
- [ ] **Demana proves al missatge final.** Sortida dels tests, una captura de pantalla, un resultat de `curl`. Verificat i fet són estats diferents; fes que l'agent digui quin dels dos ha assolit.
- [ ] **Fes una revisió de segona opinió.** `/code-review` sobre el diff per a errors, `/simplify` per a la neteja, `/security-review` abans de fusionar res que toqui entrades, autenticació o secrets.
- [ ] **Escriu una definició de fet que l'agent pugui executar, per ordre.** Comprovacions estàtiques, després tests unitaris i d'integració, després una execució del flux real (arrenca l'aplicació, crida l'endpoint, mostra la sortida). Uns tests unitaris amb mocks en verd no proven un canvi entre components; un canvi no està fet fins que ha passat l'últim nivell que necessita.
- [ ] **Separa l'autor del revisor.** Revisa en una sessió nova o amb un agent diferent. Qui ha escrit el codi comparteix els seus punts cecs, i un subagent comença amb un context nou, per això és un millor revisor que la sessió que ha escrit el codi.

## Pro

Orquestració, automatització i governança. Aquests ítems suposen que ja fas tot l'anterior.

### Fluxos de treball multiagent

- [ ] **Productor més verificador independent, sempre.** Una etapa produeix, una etapa separada ataca el resultat i repara el que hi troba. No deixis mai que el productor comprovi la seva pròpia feina. (House rule)
- [ ] **Prefereix un oracle determinista a un jutge model.** Tests, round-trips, línies base byte a byte, una implementació de referència. Quan la correcció és decidible, deixa que decideixi el codi i posa un model barat a fer la feina. (House rule)
- [ ] **Obre cada prompt d'agent amb un preàmbul SETTLED.** L'arnès retransmet el teu darrer missatge de xat als subagents; sense el preàmbul, un agent llegeix un missatge conversacional i s'atura a preguntar. Indica què no ha de fer i quins gates ha d'executar. (House rule)
- [ ] **Protegeix-te dels resultats de farciment.** Un agent la sortida estructurada del qual és rebutjada pot tornar a enviar un esborrany vàlid però buit, que el runtime compta com a èxit. Valida el contingut al script i llegeix el diari abans de pagar una nova execució. (House rule)
- [ ] **Un worktree per pista paral·lela.** Les pistes corren en paral·lel només si no comparteixen fitxers ni mesures sensibles a la CPU; si no, una fa cua darrere de la fusió de l'altra. (House rule)
- [ ] **Acota per pressupost, no per ambició.** Comprova la quota abans de llançar, digues què costarà l'execució, informa de la despesa respecte al límit al final. Un únic flux de treball ben acotat val més que tres de prims. (House rule)
- [ ] **Torna les decisions com a evidència.** Quan una etapa planteja una decisió per al propietari, presenta la mesura que la resol i les opcions amb les seves conseqüències. Registra la resposta i les afirmacions que no han superat la verificació. (House rule)
- [ ] **Fes servir l'eina Workflow per a l'orquestració determinista.** Un script amb crides `pipeline`, `parallel` i `agent`, fases i sortides validades per esquema. Només s'executa si l'usuari ho accepta, perquè pot gastar tokens equivalents a desenes d'agents.
- [ ] **Acorda un contracte breu abans d'una construcció llarga.** Abans d'escriure codi, el constructor i el revisor acorden per escrit què vol dir «fet» per a aquest tros: abast, com es verifica cada part i què queda fora d'abast. El revisor puntua amb la mateixa llista, de manera que res es rebutja per un motiu previsible.
- [ ] **Dona a l'agent revisor una rúbrica i calibra'l amb el teu propi criteri.** Categories fixes (correcció, evidència que les comprovacions s'han executat, disciplina d'abast, sobreviu a un reinici, preparació del relleu) i un veredicte d'acceptar, revisar o bloquejar. Als agents a qui es demana valorar una feina, l'elogien; un revisor pot assenyalar un problema real i després convèncer-se a si mateix d'aprovar. Llegeix les seves transcripcions, troba on el veredicte ha divergit del teu i ajusta el seu prompt per a aquest cas.

### Feina de llarga durada i de diverses sessions

- [ ] **Fes la configuració com una sessió pròpia abans de la feina de funcionalitats.** La primera sessió només fa que el projecte es pugui executar i verificar: les dependències s'instal·len, un test passa, un script d'inici conté les ordres d'arrencada i de verificació, la feina es divideix en una llista de funcionalitats i hi ha un commit de línia base net. L'esquelet i la primera funcionalitat no comparteixen sessió.
- [ ] **Mantén una llista de funcionalitats llegible per màquina per a la feina de diverses sessions.** Un fitxer JSON al repositori on cada ítem té el comportament visible per a l'usuari, els passos exactes de verificació, un estat (no iniciat, en curs, bloquejat, superat) i un camp d'evidència. L'agent n'escull el següent ítem; el fitxer, no el xat, diu què està fet. JSON millor que Markdown: és menys probable que el model el reescrigui.
- [ ] **No deixis que l'agent s'avaluï a si mateix a la llista de funcionalitats.** Superar exigeix que la verificació registrada s'hagi executat, amb la sortida adjunta. Digues-li que l'estat només canvia després de la comprovació, i que esborrar, afeblir o reescriure tests o entrades de funcionalitats per amagar feina inacabada és inacceptable; allà on puguis, posa els tests i els scripts d'avaluació darrere d'una regla `permissions.deny` perquè l'agent que treballa no pugui editar el jutge.
- [ ] **Limita la feina en curs a una sola funcionalitat.** Escriu-ho a CLAUDE.md: acaba i verifica la funcionalitat actual abans de començar la següent, i no refactoritzis una altra cosa de passada. Davant d'un encàrrec ampli, un agent tendeix a començar diverses coses alhora i deixar-les totes a mitges.
- [ ] **Mantén un fitxer de progrés que la sessió següent llegeixi primer.** Un fitxer curt al repositori amb l'estat verificat, què ha canviat, què està trencat o sense verificar, el millor pas següent i les ordres exactes d'arrencada i de verificació. CLAUDE.md diu a l'agent que el llegeixi a l'inici i que l'actualitzi i en faci commit abans d'aturar-se; res no l'actualitza automàticament. Una execució programada que parteix d'un clon nou necessita el mateix fitxer.
- [ ] **Dona a l'agent una rutina fixa d'inici de sessió.** A CLAUDE.md: `pwd`, llegir el fitxer de progrés i la llista de funcionalitats, `git log --oneline -5`, executar l'script d'inici, executar una comprovació ràpida. Si la línia base ja està trencada, arregla això abans de qualsevol feina nova.

### Execucions sense interfície i programades

- [ ] **Fes servir el mode print per a execucions per script.** `claude -p "<prompt>"` és no interactiu; afegeix `--output-format json` per obtenir resultats llegibles per màquina, `--allowedTools` per restringir i `--bare` per a execucions mínimes de CI sense hooks ni sincronització de plugins.
- [ ] **Programa rutines per a la feina recurrent.** Els agents programats al núvol (`/schedule`) s'encarreguen d'informes nocturns i comprovacions de dependències. `/loop` consulta periòdicament un estat extern lent dins d'una sessió; no serveix per a tasques puntuals.
- [ ] **Dona als agents de CI només les eines que necessiten.** Llistes de permesos, tokens de només lectura i cap permís de push tret que fer push sigui la feina.
- [ ] **Registra cada execució.** Transcripció, cost, resultat. Revisa els errors cada setmana; són la font més barata de millores per a CLAUDE.md i els hooks.
- [ ] **Tria entre un objectiu i un bucle preguntant-te si la feina té final.** Una meta (tots els tests de `test/auth` passen, la llista de tasques pendents és buida) és un `/goal`: un model petit separat comprova la condició després de cada torn i la sessió continua treballant fins que es compleix o es jutja impossible. Allò que només necessites vigilar (la CI està en verd) és un `/loop` amb un interval. Tots dos són d'àmbit de sessió.
- [ ] **Escriu un objectiu que l'avaluador pugui llegir a la transcripció.** Un únic estat final mesurable, l'ordre que el demostra (`npm test` surt amb 0, `git status` és net), les restriccions que s'han de mantenir pel camí i un límit com ara «o atura't després de 20 torns». L'avaluador no executa ordres ni llegeix fitxers; només jutja el que l'agent ha mostrat, així que fes que l'agent imprimeixi la prova.
- [ ] **Posa un límit a cada execució desatesa.** En mode print, `--max-turns` i `--max-budget-usd` aturen una sessió descontrolada, i la despesa dels subagents compta per al pressupost; en un `/goal`, posa el límit de torns o de temps a la condició; un `/loop` recurrent caduca als set dies per disseny. Un bucle sense límit converteix un únic test encallat en una factura de tota la nit.
- [ ] **Fes coincidir la capa de programació amb el temps que la feina ha de sobreviure.** `/loop` necessita la sessió oberta, s'executa com a mínim cada minut i caduca als set dies; una tasca programada d'escriptori s'executa mentre la teva màquina és encesa, també fins a un minut; una rutina al núvol (`/schedule`) s'executa amb la teva màquina apagada des d'un clon nou, amb un mínim d'una hora, activada per una programació, una crida d'API o un esdeveniment de GitHub.

### Hooks com a gates

- [ ] **Codifica els invariants com a hooks bloquejants.** Un hook PreToolUse que rebutja git destructiu, exigeix una declaració de fets abans de les ordres de shell o requereix executar els tests abans d'un commit no es pot esquivar amb arguments.
- [ ] **No desactivis mai un gate per desbloquejar-te.** Indica els fets que demana i repeteix la mateixa crida idèntica. Un gate que pots apagar sota pressió no és un gate. (House rule)
- [ ] **Mantén els hooks ràpids i específics.** Un hook lent grava cada crida d'eina; un de vague ensenya a tothom a ometre'l.
- [ ] **Fes servir un hook Stop com a gate de finalització.** S'executa quan l'agent declara que ha acabat; el codi de sortida 2 o `{"decision":"block","reason":...}` refusa l'aturada i el motiu torna a l'agent com a següent instrucció. Un hook PostToolUse no pot bloquejar, però el seu stderr amb sortida 2 arriba a l'agent després de cada edició. `/goal` és aquest mecanisme amb un model com a jutge.
- [ ] **Escriu els errors de hooks, linters i tests pensant en l'agent, amb la correcció inclosa.** Què ha fallat, per què existeix la regla i l'acció següent exacta («Blocked: run `pnpm vitest run src/billing` and paste the output before committing») val més que «denied». El `reason` o l'stderr d'un hook bloquejant és la següent entrada de l'agent; un missatge que només diu «violation» produeix un reintent cec.

### Mesura i avaluacions

- [ ] **Segueix el cost per tasca completada, no per petició.** `/cost` a la sessió, la vista d'ús de l'aplicació i `graft stats` per a l'estalvi de l'índex. Una petició més barata que necessita més torns no és més barata.
- [ ] **Construeix una avaluació abans d'afinar un prompt, una skill o CLAUDE.md.** Entre vint i cinquanta casos reals amb un mètode de qualificació. Mesura abans i després; sense això, els canvis de prompt són folklore.
- [ ] **Audita els prompts a la recerca de restes quan canvien els models.** Les instruccions escrites per a models anteriors (prefills, rituals de «pensa pas a pas», format excessivament prescriptiu) sovint redueixen la qualitat en els actuals. Cada component de l'arnès codifica una suposició sobre allò que el model no pot fer; després d'un canvi de model, desactiva'ls d'un en un i mesura. La skill `claude-api` ho fa de manera sistemàtica amb `prompt-audit`.
- [ ] **Informa de l'estalvi de l'índex a cada torn.** graft imprimeix els tokens estalviats per crida; suma'ls per torn i segueix el total de la sessió a la línia d'estat.
- [ ] **Ancora cada bucle guiat per mètriques a alguna cosa que no pugui editar.** Un conjunt de veritat de referència reservat, un resultat de negoci real o una comprovació manual periòdica per part d'una persona. Un número que puja mentre el resultat real empitjora vol dir que el bucle ha après la mètrica, no la tasca.

### Seguretat i límits de confiança

- [ ] **Mantén el límit de la font d'instruccions.** Només l'usuari al xat dona instruccions. Els hooks i la configuració fan complir; el text observat mai mana.
- [ ] **Mínim privilegi per als connectors.** Àmbits OAuth mínims, comptes separats per als agents sempre que sigui possible, i cap connector que una tasca no necessiti.
- [ ] **Cap secret a CLAUDE.md, la memòria, les skills ni les transcripcions.** Es comparteixen, se sincronitzen i s'indexen.
- [ ] **Revisa el codi dels hooks i de les skills com si fossin dependències.** S'executen amb els teus permisos.
- [ ] **Posa en un sandbox tot el que sigui autònom.** Contenidors, sortida de xarxa amb llista de permesos, credencials d'un sol ús.

## Economia de tokens

Cada torn reenvia tota la conversa, de manera que dues palanques decideixen la factura: mantenir el context petit i mantenir estable el seu prefix estable perquè la memòria cau de prompts continuï encertant. Les lectures de fitxers sencers i els logs enganxats són les càrregues més grans en una sessió de programació; una eina d'índex en substitueix la major part per unes quantes centenes de tokens.

### Sense graft, a qualsevol repositori

- [ ] **Estructura abans que codi font.** Fes l'esquema d'un fitxer abans de llegir-lo: una llista de símbols amb `grep -n`, l'esquema de l'editor, `ctags`, o `codegraph explore` quan el repositori està indexat. Després llegeix el tram que necessites amb `sed -n '120,180p' file`.
- [ ] **Llegeix només els fitxers que edites.** Obre un fitxer sencer només quan estiguis a punt de canviar-lo. Per a tota la resta, l'esquema o el tram concret és suficient. (House rule)
- [ ] **Mesura abans de fer `cat`.** Primer `wc -l`. Un fitxer de tres mil línies és una decisió, no un reflex.
- [ ] **Cerca acotada i ordenada.** `rg` amb `--type` i una ruta, `-l` per a una llista de fitxers, `-c` per a recomptes abans de bolcar coincidències.
- [ ] **Delega el descobriment a un subagent de només lectura.** Torna una conclusió amb punters `file:line`; la seva lectura no entra mai al teu context.
- [ ] **Limita cada sortida d'eina.** `head`, `--max-count`, `tail -20` sobre la sortida dels tests, `jq` amb una ruta sobre JSON.
- [ ] **Mantén estable el prefix estable.** El prompt de sistema (inclòs CLAUDE.md) és el prefix en memòria cau. Editar-lo o canviar de model a mitja sessió reinicia la memòria cau la resta de la sessió.
- [ ] **Tests propis mentre treballes, suite completa una sola vegada.** Una execució completa de la suite a mig camí són tokens gastats en una sortida que no llegiràs. (House rule)
- [ ] **Compacta amb intenció.** Indica què conservar i què descartar. Una compactació que conserva el pla i descarta l'exploració val més que una que ho conserva tot mig recordat.
- [ ] **Evita els bucles de captures de pantalla.** Una captura per orientar-te i després extracció de text. Captures repetides de la mateixa pàgina són la manera més cara de llegir-la.

### Amb graft

graft manté un directori `graft/` a l'arrel del repositori: un graf precompilat de cada símbol amb el seu tram `file:line`, qui crida què i fitxes en prosa curtes per àrea. Cada consulta costa unes quantes centenes de tokens, no necessita clau d'API, respon en menys d'un segon i s'actualitza abans de respondre, de manera que sempre descriu el codi tal com és ara mateix, canvis sense commit inclosos.

- [ ] **Instal·la una vegada per repositori.** `npm i -g @nanonets/graft@latest`, i després `graft init` al repositori. A npm 12 i posteriors, les instal·lacions globals bloquegen per defecte els scripts de compilació natius, cosa que deixa graft sense poder carregar els seus parsers; repeteix la instal·lació amb `--allow-scripts=` llistant els paquets que npm esmenta a l'avís. Per a Claude Code escriu el fitxer d'instruccions, els hooks, la línia d'estat i la connexió del servidor MCP; `graft build` construeix el graf de connexions gratuït. `--deep` hi afegeix un mapa de conceptes amb LLM; no l'usis tret que te'l demanin.
- [ ] **Una crida per pregunta; tria l'eina que encaixa.** Fes servir la taula de sota. La majoria de tasques necessiten exactament una crida a graft; encadenar eines «esperant més» és la manera principal de malbaratar l'estalvi.
- [ ] **`graft ask "<question>" --source` és el valor per defecte.** Resultats ordenats amb el nucli de cada definició inclòs, de manera que el resultat és el codi que necessites sense lectura addicional. `--in <path>` acota; `--full` només quan el nucli és massa petit per actuar-hi.
- [ ] **`graft grep "<pattern>"` quan necessites totes les ocurrències.** Coincidències agrupades pel símbol que les conté i ordenades per acoblament. Cerca un nom pelat, no una signatura imaginada; si no troba res, afluixa el patró abans de recórrer al grep en brut.
- [ ] **`graft skeleton <file>` abans de tocar un fitxer.** Només signatures, uns 200 tokens, aproximadament deu vegades més barat que llegir el fitxer.
- [ ] **`graft callers <symbol> --depth 2` abans de canviar una signatura.** Arestes precalculades, no una cerca de text. `--depth all` abans de qualsevol refactorització o canvi en diversos fitxers; `--direction out` per saber de què depèn un símbol.
- [ ] **`graft map` per orientar-te en un repositori fred.** Després llegeix les fitxes de hub que esmenta. No facis skeleton ni ask per cada subsistema que llista.
- [ ] **No passis mai graft per `head`, `tail` ni `sed -n`.** La sortida ja està limitada i diu què ha descartat. Retallar-la perd coincidències i la línia d'estalvi de la qual s'analitza el total de la línia d'estat.
- [ ] **Confia en els trams.** La llista `covers:` d'un node es genera a partir del codi font i és autoritzada. No tornis a obrir fitxers per comprovar-la.
- [ ] **Informa de què ha estalviat graft, a cada torn.** Cada eina s'obre amb `[graft] tokens saved ≈ N`. Suma'ls a la resposta; `graft stats` mostra la barreja de la sessió.
- [ ] **Connecta-ho a la CI.** `graft check` falla quan l'índex és obsolet; `graft blast --format markdown` publica el radi d'impacte d'un diff com a comentari de PR amb un diagrama.
- [ ] **En worktrees, consulta des del checkout principal.** L'índex hi viu. Els agents el fan servir en només lectura i editen la seva pròpia còpia. (House rule)
- [ ] **En un monorepo, acota amb `--in <scope>/`.** Les coincidències porten una etiqueta d'àmbit; l'ordenació és justa entre subprojectes, però restringir-la estalvia igualment tokens.
- [ ] **Mantén graft al dia.** `graft version` compara la versió instal·lada amb npm; `graft upgrade` l'aplica. Reinicia l'agent després d'actualitzar. CodeGraph s'actualitza amb `codegraph upgrade`, i després `codegraph sync` a cada repositori indexat.

| Quan estàs... | Recorre a | Crides |
|---|---|---|
| Fent onboarding, «explica aquesta base de codi» | `graft map`, i després llegeix les fitxes de hub que esmenta | 1 |
| Entenent un flux, «com funciona X» | `graft ask "<flow>" --source` | 1 |
| Trobant on correspon un canvi | `graft ask "where is <behaviour>" --source` | 1 |
| Editant un símbol que ja pots anomenar | `graft grep "<symbol>"`, edita al `file:line` | 1 |
| Reanomenant, eliminant, canviant una signatura | Primer `graft callers <sym> --depth 2` | 1 |
| Refactorització o canvi en diversos fitxers | `graft callers <sym> --depth all` abans d'editar | 1 |
| «De què depèn això?» | `graft callers <sym> --direction out` | 1 |
| Totes les ocurrències d'un patró | `graft grep "<literal>"` | 1 |
| «Quina és l'API d'aquest fitxer?» | `graft skeleton <file>` | 1 |
| Depurant una fallada a l'àrea X | `graft ask "<symptom>" --source`, i després `callers` sobre el sospitós | 1 a 2 |
| Jutjant el risc d'un diff abans de fusionar | `graft callers <changed sym> --depth 2` | 1 per símbol |

Quan el servidor MCP de graft està connectat, les mateixes eines apareixen com a `graft_find_code`, `graft_find_all`, `graft_file_api`, `graft_trace_calls`, `graft_repo_map` i `graft_check_freshness`. Carrega-les en una sola crida a `ToolSearch`, mai una per una.

### CodeGraph com a l'altre índex

- [ ] **Si existeix `.codegraph/`, fes-lo servir abans del grep.** `codegraph explore "<question>"` retorna el codi dels símbols rellevants més els camins de crida entre ells en una sola crida; `callers`, `callees`, `impact` i `affected` cobreixen la resta. No executis `codegraph init` al repositori d'una altra persona; indexar és decisió del propietari.
- [ ] **Tria un índex principal per repositori.** Totes dues eines donen estructura abans que codi font; executar-les totes dues duplica els esquemes d'eines al context.

## Optimització de l'ús de models

Tres palanques, per ordre: mida del context (la secció anterior), esforç, nivell de model. Jutja pel cost per tasca completada. Un model més barat que necessita més torns, més reintents o una correcció humana no és més barat.

### Enrutament segons el tipus de tasca

| Tipus de tasca | Model | Esforç | Per què |
|---|---|---|---|
| Escombrades de grep, escaneig de logs, aplicar un reanomenament a partir d'un mapa conegut, format, codi repetitiu, extreure fets d'un únic fitxer conegut | Haiku 4.5 | low | Volum alt, criteri baix; els errors són barats i visibles |
| Un component o un test segons una especificació, un pas de migració documentat, actualitzacions de documentació, resums de registres de canvis, revisió de primera passada | Sonnet 5.5 | medium (per defecte) | Uns criteris d'acceptació clars limiten el dany d'una resposta equivocada |
| Decisions d'arquitectura i disseny, migracions ambigües, depuració d'arrel de causa, revisió de seguretat, verificació adversarial, judici final sobre la sortida d'altres agents | Opus 5.5, o el model superior de la sessió quan la quota ho permet | high o xhigh | Una resposta equivocada és cara de detectar i desfer |
| La sessió interactiva que sosté tota la tasca | El millor model disponible | xhigh (per defecte a Claude Code) | Pren les decisions de criteri i escriu els encàrrecs per a tots els altres |

### Sense graft

- [ ] **Orquestrador fort, mans barates.** La sessió o l'script que sosté la tasca corre amb el model superior; tot el que és acotat corre amb Sonnet o Haiku.
- [ ] **Estreny l'encàrrec perquè un model més barat no hagi d'explorar.** L'exploració és on els models barats gasten torns i s'equivoquen. Amb punters `file:line` i criteris d'acceptació, Sonnet fa el que faria Opus.
- [ ] **Baixa l'esforç abans de baixar de nivell.** Mesura sobre una mostra de tasques reals. El model més nou amb esforç baix sovint iguala un d'anterior amb esforç alt.
- [ ] **No rebaixis mai el verificador.** La verificació és on les respostes equivocades costen més. Executa-la amb el model més fort que la teva quota permeti, i comprova l'ús abans de llançar. (House rule)
- [ ] **Evita les cascades que trenquen la memòria cau.** Les memòries cau de prompts són per model. Una cascada multimodel en una aplicació d'API renuncia a la reutilització de la memòria cau entre els seus models; un sol model amb l'esforç ajustat sol guanyar.
- [ ] **Hereta el model de la sessió només quan la tasca necessita el nivell superior.** Assigna per defecte a cada etapa el que necessita, no el que corre el flux de treball. (House rule)

### Amb graft

- [ ] **Deixa que graft faci l'exploració i després baixa un nivell.** `graft ask --source` retorna trams exactes amb el nucli inclòs, de manera que un agent Sonnet pot editar el que abans necessitava Opus per trobar.
- [ ] **Dona a Haiku el mapa, no la cerca.** `graft callers <sym> --depth all` és la llista completa de llocs per a un reanomenament. Dona aquesta llista a un agent Haiku perquè l'apliqui mecànicament; no li demanis que descobreixi la llista.
- [ ] **Baixa l'esforç en les consultes recolzades per graft.** Calen menys crides a eines, de manera que la deliberació addicional aporta poc.
- [ ] **Mantén petits els resultats d'eines per mantenir calenta la memòria cau.** Les sortides de graft estan limitades; les lectures de fitxers sencers són les grans càrregues que treuen de la finestra el context estable.
- [ ] **Gasta l'estalvi en verificació.** Si graft estalvia desenes de milers de tokens per sessió, aquest és el pressupost per a un verificador més fort, no per a més exploració.

## Xat de claude.ai i Projects

- [ ] **Un Project per domini.** Les instruccions del Project porten el context permanent; el coneixement del Project porta els documents. Tots dos es carreguen sense haver d'enganxar-los a cada xat.
- [ ] **Primer l'esquema, després amplia secció per secció.** Les respostes llargues d'una sola tirada amaguen els problemes d'estructura fins al final.
- [ ] **Mostra la sortida que vols.** Un exemple breu del format, el to o la taula val més que tres paràgrafs que el descriguin.
- [ ] **Demana fonts i comprova-les.** Per a fets, dates i xifres, demana d'on provenen i verifica-ho abans de reutilitzar-ho.
- [ ] **Fes servir artifacts per a tot el que reutilitzis o comparteixis.** Documents, pàgines, diagrames i petites eines són millors com a artifacts que com a text de xat.
- [ ] **Passa a Claude Code quan la tasca toca fitxers.** Repositoris, terminals, navegadors i qualsevol cosa que s'hagi de verificar executant-la pertanyen a Code, no al xat.
- [ ] **Fes servir la memòria i els estils amb criteri.** La memòria ha de guardar fets estables sobre tu i la teva feina; els estils han de codificar la veu que continues demanant.
- [ ] **Comença un xat nou quan canvia el tema.** Els xats llargs porten el mateix cost de context que les sessions llargues.

## Construir amb l'API i els SDK

Per a equips que posen Claude dins del seu propi producte. Tot passa per un únic endpoint, `POST /v1/messages`; les eines, les sortides estructurades i la memòria cau són funcionalitats d'aquest endpoint. La skill `claude-api` de Claude Code conté la referència actual; els ítems de sota són els hàbits.

### Tria el nivell més simple

- [ ] **Una crida, després flux de treball, després agent.** Classificació, extracció i resum són una sola petició. Els pipelines de diversos passos amb lògica controlada pel codi són un flux de treball que orquestres tu. Només l'ús d'eines obert i dirigit pel model és un agent.
- [ ] **Quatre criteris abans de construir un agent.** Complexitat (diversos passos i difícil d'especificar d'entrada), valor (que valgui el cost i la latència), viabilitat (Claude és capaç en aquesta tasca), cost de l'error (es pot detectar i recuperar). Un «no» en qualsevol d'ells vol dir quedar-se en un nivell més simple.
- [ ] **Coneix les quatre maneres de construir un agent.** Un bucle manual que et pertany; el Tool Runner de l'SDK, que itera sobre les eines que defineixes; Managed Agents, on Anthropic executa el bucle i allotja el sandbox; i l'Agent SDK de Claude, que és Claude Code com a biblioteca amb eines integrades. La primera, la segona i la quarta et deixen el desplegament a tu.

### Higiene de les peticions

- [ ] **Per defecte, l'Opus actual amb pensament adaptatiu.** `claude-opus-5-5` tret que l'usuari anomeni un altre model. El pensament es manté activat; controla la profunditat amb `output_config.effort` i defineix-la explícitament, perquè el valor per defecte a Opus 5.5 és `medium`.
- [ ] **Fes streaming de tot el que sigui llarg.** No et quedis curt amb `max_tokens`: uns 16k sense streaming, 64k amb streaming. Fes servir l'ajudant de missatge final de l'SDK quan no necessites esdeveniments individuals.
- [ ] **Sense prefill ni elecció d'eina forçada als models actuals.** Tots dos retornen un 400 a la línia 5.x. Fes servir sortides estructurades (`output_config.format`) i eines amb `strict: true` en comptes d'això.
- [ ] **Comprova `stop_reason` abans de llegir el contingut.** `refusal`, `max_tokens`, `pause_turn` i `tool_use` necessiten cadascun el seu tractament. Activa els fallbacks del costat del servidor als models 5.x perquè un rebuig de seguretat s'encaminí a un model de reserva.
- [ ] **Fes servir els ajudants i tipus de l'SDK.** No escriguis a mà el bucle d'eines, la promesa de streaming ni els tipus de missatge. Captura una cadena d'errors tipats, del més específic al més general, per distingir les fallades reintentables de les que no.

### Memòria cau de prompts

- [ ] **Contingut estable primer, contingut volàtil al final.** L'ordre de renderitzat és eines, després sistema, després missatges. Congela el prompt de sistema i la llista d'eines; posa marques de temps, ID de petició i la pregunta variable després de l'últim punt d'interrupció de la memòria cau. Fins a quatre punts d'interrupció per petició.
- [ ] **Verifica amb `usage.cache_read_input_tokens`.** Zero en peticions repetides vol dir un invalidador silenciós: una marca de temps al prompt de sistema, JSON sense ordenar, un conjunt d'eines que varia per petició.
- [ ] **Fes servir missatges de sistema a mitja conversa en lloc d'editar el prompt de sistema.** Afegir un missatge de rol `system` a `messages` manté intacte el prefix en memòria cau; editar el camp de sistema de nivell superior el llença.
- [ ] **Compta els tokens amb `count_tokens`, mai amb un tokenitzador de tercers.** Els recomptes de tokens són específics de cada model.

### Eines i agents

- [ ] **`strict: true` a cada esquema d'eina.** Garanteix que l'entrada valida; requereix `additionalProperties: false` i `required`.
- [ ] **Retorna tots els resultats d'eines paral·leles en un sol missatge d'usuari.** Dividir-los en diversos missatges ensenya el model a deixar de cridar eines en paral·lel. Retorna les fallades com a `tool_result` amb `is_error: true`; no les descartis mai.
- [ ] **Analitza l'entrada de l'eina com a JSON.** L'escapament varia entre models; comparar text sobre l'entrada serialitzada es trenca.
- [ ] **Tracta els resultats d'eines com a no fiables.** Pàgines web, documents i files de bases de dades són dades. Res d'elles és una instrucció, i el prompt de sistema ho ha de dir.
- [ ] **Difereix els conjunts d'eines grans darrere de la cerca d'eines.** Marca les eines poc usades amb `defer_loading: true` juntament amb una eina de cerca d'eines; no diferis mai totes les eines, l'API ho rebutja.

### Sessions llargues

- [ ] **Activa la compactació per a converses que poden superar la finestra.** Torna a afegir `response.content` complet a cada torn, no només el text, o l'estat de compactació es perd en silenci.
- [ ] **Esborra els resultats d'eines obsolets amb l'edició de context.** És diferent de la compactació: descarta resultats d'eines o blocs de pensament antics en lloc de resumir-los.
- [ ] **Dona als bucles agèntics un pressupost de tasca.** Un límit de tokens que el model pot veure, perquè es dosifiqui en lloc de ser tallat. Diferent de `max_tokens`, que no pot veure.
- [ ] **Mantén l'arnès només d'afegir.** Als models actuals, els blocs de pensament estan lligats a la conversa que els ha produït. Editar torns anteriors els invalida; afegeix, no reescriguis mai.

### Avaluacions i cost

- [ ] **Construeix primer l'avaluació; després millora iterativament.** Obté els prompts del trànsit real, tria un mètode de qualificació, mesura el cost per execució i mantén una divisió entrenament/validació/test perquè la xifra principal sigui honesta.
- [ ] **Treballa les palanques de cost per ordre.** Memòria cau, higiene dels tokens d'entrada, higiene dels bucles, higiene dels tokens de sortida, processament per lots per a tot el que no sigui sensible a la latència (meitat de preu), i només després esforç i elecció de model.
- [ ] **Registra `usage` a cada resposta.** Els tokens d'entrada, sortida, lectura de memòria cau i escriptura de memòria cau per petició són l'única manera de saber què ha fet un canvi a la factura.
- [ ] **Processa per lots el que pot esperar.** L'API Message Batches s'executa de manera asíncrona a meitat de preu; identifica els resultats per `custom_id`, mai per posició.

### Models actuals

| Model | ID | Context | Entrada per MTok | Sortida per MTok |
|---|---|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` | 1M | $10.00 | $50.00 |
| Claude Opus 5.5 | `claude-opus-5-5` | 1M | $4.00 | $20.00 |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | 1M | $2.00 | $10.00 |
| Claude Haiku 4.5 | `claude-haiku-4-5` | 200K | $1.00 | $5.00 |

Tarifes de l'API de primera part a setembre de 2026. Les lectures de memòria cau als models actuals costen una petita fracció del preu d'entrada (del 2,5% al 10%), per això un prefix estable importa més que qualsevol altra palanca. Fes servir els ID exactes de dalt, sense sufixos de data.

## Regles de la casa

Les regles de treball que Marc ha establert per als agents, guardades a `~/.claude/CLAUDE.md` perquè cada sessió i cada subagent les carregui. Es reprodueixen aquí perquè l'equip llegeixi el mateix text. Les dates són quan es va establir cada regla.

### Selecció de model per a agents i fluxos de treball llançats (2026-09-09, reforçada 2026-09-17)

- [ ] **No gastis de més en fluxos de treball; és una regla estricta.** Tria model i esforç segons el tipus de tasca. No facis servir mai un model excessiu per a una tasca simple, ni un de insuficient per a una de difícil.
- [ ] **Dimensiona cada etapa segons el que necessita.** No assignis mai per defecte a cada etapa el model de l'orquestrador ni l'esforç màxim només perquè és el que executa el flux de treball.
- [ ] **Haiku, esforç baix** per a feina mecànica, d'alt volum i criteri baix: escombrades de grep, escaneig de logs, aplicar un reanomenament a partir d'un mapa conegut, format, codi repetitiu, extreure fets d'un únic fitxer conegut.
- [ ] **Sonnet, esforç per defecte** per a implementació i recerca acotades amb criteris d'acceptació clars: un component o un test segons una especificació, un pas de migració documentat, actualitzacions de documentació, resums de registres de canvis, revisió de primera passada.
- [ ] **Opus o el model superior de la sessió, esforç alt** quan una resposta equivocada és cara: decisions d'arquitectura i disseny, migracions ambigües, depuració d'arrel de causa, revisió de seguretat, verificació adversarial, judici final sobre la sortida d'altres agents.
- [ ] **Indica el model i el motiu per a cada etapa i cada subagent.** Sense excepcions.

### Com desplegar fluxos de treball (2026-09-20)

- [ ] **Productor més verificador independent, sempre.** El verificador repara el que troba en lloc de només informar-ne. El verificador corre amb Fable quan la quota ho permet, Opus en cas contrari; comprova `mcp__ccd_session_mgmt__get_usage` abans de llançar, i no deixis mai una etapa al model per defecte quan el model de la sessió és a prop del límit.
- [ ] **Prefereix un oracle determinista a un verificador model.** Un assemblador, una implementació de referència, un round-trip, una línia base byte a byte. Les pistes recolzades per un oracle no necessiten una etapa de verificació cara.
- [ ] **Cada prompt de productor s'obre amb un preàmbul SETTLED.** Els missatges recents de l'usuari van dirigits a l'orquestrador; no facis preguntes, no esperis, no tornis la tasca; no executis mai `gh`, `git commit`, `git push` ni `git checkout`; no desactivis mai el hook GateGuard; cap dependència nova de tercers; executa els gates finals indicats i informa amb honestedat.
- [ ] **Protegeix-te dels resultats de farciment.** Digues als agents: si la crida estructurada és rebutjada, corregeix el JSON i torna a enviar el resultat complet, mai un farciment. Valida el contingut al script, per exemple `if (!r || r.summary.length < 120) throw`. Abans de pagar una nova execució, llegeix `journal.jsonl` i la transcripció de l'agent; els primers 2 KB d'una càrrega fallida sobreviuen a `__unparsedToolInput.raw`.
- [ ] **Un git worktree per pista paral·lela.** `git worktree add -b <branch> <path> origin/main`; cada agent escriu només dins del seu. Les eines d'índex viuen al checkout principal i s'hi fan servir en només lectura.
- [ ] **Fusiona a través de l'API mentre un flux de treball ocupa el checkout principal.** `gh api -X PUT repos/<o>/<r>/pulls/N/merge -f merge_method=rebase`; `gh pr merge` canvia la branca local. No encadenis mai l'eliminació d'una branca després d'una ordre de fusió. Amb comprovacions d'estat estrictes, la fusió és en sèrie: fusiona main i espera la ronda de comprovacions següent; no facis mai rebase ni force-push d'una PR que el monitor de CI estigui vigilant.
- [ ] **Acota per pressupost, no per ambició.** Comprova primer la quota setmanal i digues què costarà l'execució. Informa de la despesa respecte al límit al final de cada execució, i informa de l'estalvi de tokens de graft o CodeGraph.
- [ ] **Torna les decisions com a evidència, no com a preguntes.** Presenta la mesura que la resol i les opcions amb les seves conseqüències; registra la resposta i les afirmacions que no han superat la verificació.

### Economia de context i de tests (2026-09-19)

- [ ] **Estructura abans que codi font.** En repositoris indexats amb graft, `graft skeleton <file>`, `graft grep` i `graft callers` abans d'obrir res. Quan graft no hi és, CodeGraph si està indexat, i si no un grep dirigit pel símbol; mai fitxers sencers per orientar-te.
- [ ] **Llegeix només els fitxers que edites.** Obre un fitxer sencer només quan estiguis a punt de canviar-lo. No tornis a llegir un fitxer que acabes d'editar.
- [ ] **Tests propis mentre treballes, suite completa una sola vegada.** Executa només els fitxers de test que cobreixen el que estàs canviant; la suite completa una vegada al final com a gate final, i de nou només si aquella execució ha fallat i has canviat alguna cosa.
- [ ] **Indica aquests hàbits a cada prompt de subagent i de flux de treball.** Alguns tipus d'agent integrats no carreguen CLAUDE.md.

### Eines d'índex

- [ ] **CodeGraph abans del grep allà on existeix `.codegraph/`.** `codegraph_explore` via MCP o `codegraph explore "<question>"` al shell. Allà on no hi ha `.codegraph/`, ometeix CodeGraph; indexar és decisió de l'usuari.
- [ ] **graft abans del grep allà on existeix `graft/`.** Carrega les eines MCP en una sola crida a `ToolSearch`; fes servir la superfície que tinguis disponible, l'orientació és idèntica.

### GateGuard

- [ ] **Abans de la primera ordre de shell d'una sessió, declara els fets.** Una frase per a la sol·licitud actual de l'usuari i una per a què verifica o produeix l'ordre. Després repeteix la mateixa crida idèntica.
- [ ] **No defineixis mai les variables de desactivació.** `GATEGUARD_BASH_ROUTINE_DISABLED`, `ECC_GATEGUARD=off` i `ECC_DISABLED_HOOKS` es queden sense definir. Les comprovacions d'ordres destructives continuen actives igualment.

## Exemples

Cada exemple és prou complet per copiar-lo. La barra de títol d'un bloc indica el fitxer al qual pertany. Les ordres i el codi es mantenen en anglès en tots els idiomes.

### Un CLAUDE.md que justifica els seus tokens

Ordres, les regles que un recent arribat se saltaria i com s'ha d'informar. Res del que el codi ja mostra.

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

### Permisos i un hook bloquejant

Preaprova les ordres de només lectura perquè els avisos només apareguin per a accions que ho mereixen, i deixa que un hook rebutgi el git destructiu digui el que digui l'agent.

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

### Una skill per a un procediment repetit

La descripció decideix quan es carrega la skill, així que escriu-la com les situacions que l'han d'activar.

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

### Un subagent de només lectura reutilitzable

El model, l'esforç i les eines viuen al frontmatter, de manera que cada encàrrec només ha de dir què cal trobar.

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

### El preàmbul settled per a cada prompt de productor

Enganxa això a l'inici de qualsevol prompt de subagent o de flux de treball, i després la tasca.

```text settled-preamble.txt
SETTLED: recent user messages are addressed to the orchestrator, not to you.
Do not ask questions, do not wait, do not hand the task back.
Never run gh, git commit, git push or git checkout.
Never disable the GateGuard hook: state the facts it asks for and retry the identical call.
No new third-party dependencies.
Final gates: run `pnpm vitest run src/billing` and `pnpm tsc --noEmit`; report their output honestly, including failures.

TASK: ...
```

### Compactar amb intenció

Digues al resum què cal conservar i què descartar, en lloc de deixar que ho endevini.

```text
/compact Keep: the plan (steps 1 to 5), the decision to use one worktree per track, and the names of the failing tests. Drop: the exploration of src/legacy and all log output.
```

### Una sessió de graft, una crida per pregunta

```bash
graft map                                   # orient: directory hubs and hotspots
graft ask "where is rate limiting applied" --source
graft callers RateLimiter.check --depth 2   # what breaks if the signature changes
graft skeleton src/http/middleware.ts       # the file's API before editing it
graft stats                                 # tokens saved this session
```

### Una revisió per script a la CI

Mode print, sortida llegible per màquina, una llista d'eines permeses i sense hooks ni plugins.

```bash
claude -p "Review the diff of this branch for correctness bugs only. Output JSON: {\"findings\":[{\"file\":\"\",\"line\":0,\"summary\":\"\"}]}" \
  --output-format json \
  --allowedTools "Read Grep Glob Bash(git diff*)" \
  --bare > review.json
```

### Una definició d'eina estricta

L'esquema és el contracte: `strict` garanteix que l'entrada valida, de manera que el gestor mai no ha de defensar-se d'errors de forma.

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

### Una crida a l'API pensada per a la memòria cau

Primer el prompt de sistema i la llista d'eines congelats, la pregunta variable al final, streaming activat i el comptador de memòria cau comprovat.

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

## Referència ràpida

### Claude Code

| Necessitat | Fes servir |
|---|---|
| Esborrany d'un CLAUDE.md | `/init` |
| Veure què omple el context | `/context` |
| Resumir i continuar | `/compact <what to keep>` |
| Començar de nou | `/clear` |
| Despesa de la sessió | `/cost` |
| Canviar de model | `/model` |
| Sortida més ràpida, mateix model | `/fast` |
| Esforç en llançar | `claude --effort xhigh` |
| Mode de planificació i modes de permís | Shift+Tab |
| Aturar el torn actual | Escape |
| Revisar el diff a la recerca d'errors | `/code-review` |
| Netejar el diff | `/simplify` |
| Passada de seguretat a la branca | `/security-review` |
| Menys avisos de permís | `/fewer-permission-prompts` |
| Execució per script | `claude -p "<prompt>" --output-format json --allowedTools "Read Grep"` |
| Execució recurrent al núvol | `/schedule` |
| Consultar periòdicament un estat extern lent | `/loop` |
| Continuar treballant fins que es compleixi una condició | `/goal <condition>` |
| Reobrir aquí l'última sessió | `claude --continue` (o `/resume`) |

### graft

| Necessitat | Fes servir |
|---|---|
| Instal·lar i connectar al repositori | `npm i -g @nanonets/graft@latest` i després `graft init` |
| Orientar-te en un repositori fred | `graft map` |
| Entendre o localitzar | `graft ask "<question>" --source` |
| Totes les ocurrències | `graft grep "<name>"` |
| L'API d'un fitxer | `graft skeleton <file>` |
| Qui crida, radi d'impacte | `graft callers <sym> --depth 2`, `--depth all`, `--direction out` |
| Gate de frescor a la CI | `graft check` |
| Comentari de risc a la PR | `graft blast --format markdown` |
| Estalvi de la sessió | `graft stats` |

### CodeGraph

| Necessitat | Fes servir |
|---|---|
| Símbols més camins de crida en una sola crida | `codegraph explore "<question>"` |
| Un símbol o un fitxer amb números de línia | `codegraph node <name>` |
| Callers, callees, impacte | `codegraph callers <sym>`, `codegraph callees <sym>`, `codegraph impact <sym>` |
| Tests afectats pels fitxers canviats | `codegraph affected <files>` |

### Paràmetres de l'API que val la pena recordar

| Necessitat | Fes servir |
|---|---|
| Profunditat de pensament | `output_config.effort`: `low`, `medium`, `high`, `xhigh`, `max` |
| Sortida JSON estructurada | `output_config.format` |
| Entrada d'eina validada | `strict: true` a l'eina |
| Punt d'interrupció de la memòria cau | `cache_control: {type: "ephemeral"}` (màx. 4) |
| Instrucció de l'operador a mitja conversa | `{role: "system", content: ...}` dins de `messages` |
| Converses llargues | beta de compactació `compact-2026-01-12` |
| Bucles d'agent dosificats | `output_config.task_budget` amb la beta `task-budgets-2026-03-13` |
| Feina asíncrona a meitat de preu | API Message Batches |

## Fonts

- Documentació de Claude Code: https://code.claude.com/docs
- Documentació de l'API de Claude: https://docs.anthropic.com
- Objectius, bucles i rutines de Claude Code: https://code.claude.com/docs/en/goal, https://code.claude.com/docs/en/scheduled-tasks, https://code.claude.com/docs/en/routines
- Anthropic Engineering, Effective harnesses for long-running agents (2025-11-26): https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Anthropic Engineering, Harness design for long-running application development (2026-03-24): https://www.anthropic.com/engineering/harness-design-long-running-apps
- graft: https://www.npmjs.com/package/@nanonets/graft (la skill instal·lada a `~/.claude/skills/graft/SKILL.md` és la referència operativa)
- CodeGraph: `codegraph --help` i les instruccions del servidor MCP `codegraph`
- Regles de treball de Marc: `~/.claude/CLAUDE.md`
