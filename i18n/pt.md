# Trabalhar de forma profissional com o Claude e com agentes de programação

Uma lista de verificação dos hábitos que separam a utilização ocasional do Claude da utilização profissional. Abrange o Claude Code (CLI e aplicação de ambiente de trabalho), a interface de chat do claude.ai e a construção dos seus próprios agentes com a Claude API e o Agent SDK. As três primeiras secções são níveis: Básico, Intermédio e Pro. As secções seguintes são temas transversais aos níveis: economia de tokens, encaminhamento de modelos, chat, a API e as regras da casa pelas quais esta equipa se rege.

Como usar: assinale o que já faz de forma consistente. O que ficar por assinalar é a sua próxima competência a desenvolver. Os itens marcados como **Regra da casa** vêm das regras de trabalho do Marc, que os agentes carregam a partir de `~/.claude/CLAUDE.md`; estão reproduzidas na íntegra na secção Regras da casa, para que a equipa leia o mesmo texto que os agentes. Tudo o resto é prática geral.

Última revisão em 2026-10-02. Verificado com o Claude Code 2.1, o graft 0.21.1, o CodeGraph 1.6.1, a Vercel CLI 62.2 e a gama de modelos da Claude API de setembro de 2026.

## Básico

Os hábitos que contam desde a primeira sessão. Nenhum exige configuração.

### Antes de escrever

- [ ] **Escreva a tarefa como um ticket.** Indique o objetivo, as restrições e o que significa "concluído" numa única mensagem. Os agentes preenchem as lacunas com suposições, e os critérios de aceitação que omite são os que acabam por ser adivinhados erradamente.
- [ ] **Aponte para o contexto em vez de o colar.** Indique os ficheiros, as funções, as mensagens de erro ou os URLs. O agente lê-os por si, gastando menos tokens do que um bloco de texto colado, e lê a versão atual em vez de uma cópia desatualizada.
- [ ] **Diga o que não deve ser tocado.** Ficheiros fora do âmbito, interfaces públicas, migrações, tudo o que tenha uma dependência de deploy. Uma frase a delimitar o âmbito poupa uma hora de reversões.
- [ ] **Peça primeiro um plano para qualquer tarefa não trivial.** No Claude Code, passe para o modo de planeamento com Shift+Tab; o agente lê e propõe, mas não edita até o utilizador aprovar. No chat, peça um esquema antes da resposta completa.
- [ ] **Uma tarefa por conversa.** Comece de novo (`/clear`) para trabalho não relacionado. O contexto que sobra da tarefa anterior é pago em cada turno e induz o modelo em erro quanto ao que importa agora.
- [ ] **Saiba em que superfície está.** O chat serve para pensar, redigir e analisar material colado. O Claude Code serve para tudo o que toque em ficheiros, num repositório, num terminal ou num navegador. A API serve quando quer o comportamento dentro do seu próprio produto.

### Durante a sessão

- [ ] **Leia o que o agente diz antes de responder.** Quando ele declara um pressuposto, corrija-o de imediato. Confirmar tarde significa refazer trabalho assente numa premissa errada.
- [ ] **Responda às perguntas com decisões.** Se o agente pára para perguntar, precisa de uma decisão que só o utilizador pode tomar. Dê-a e deixe-o continuar; não responda a uma pergunta com outra pergunta.
- [ ] **Interrompa cedo.** Escape pára o turno em curso. Se ele segue na direção errada no segundo passo, não espere pelo nono.
- [ ] **Faça-o executar as suas próprias verificações.** Peça que corra os testes, o verificador de tipos e o linter, e que mostre o resultado. "Os testes passam" sem output é uma afirmação, não uma prova.
- [ ] **Mantenha os segredos fora da conversa.** Nunca cole chaves, palavras-passe ou tokens. Indique o nome da variável de ambiente, mantenha o `.env` no `.gitignore` e diga ao agente para não o ler. Tudo o que o agente lê entra no pedido enviado ao modelo.

### Antes de aceitar o resultado

- [ ] **Reveja o diff como um pull request de um novo colega de equipa.** Use `git diff` ou o painel de diff da aplicação. É responsável por tudo o que integra, seja quem for que o tenha escrito.
- [ ] **Verifique se fez a tarefa toda e não apenas as partes fáceis.** Compare com os seus critérios de aceitação. Por vezes os agentes reduzem o âmbito em silêncio e comunicam a conclusão.
- [ ] **Procure APIs inventadas e conhecimento desatualizado.** O conhecimento do modelo tem uma data limite. Confirme versões de bibliotecas, flags e assinaturas na documentação ou no pacote instalado.
- [ ] **Faça commits pequenos.** O Git é o seu mecanismo de anular. Faça commit após cada incremento verificado, para que um passo posterior mal feito possa ser revertido isoladamente.
- [ ] **Versione as versões com Semantic Versioning.** Etiquete cada versão como `MAJOR.MINOR.PATCH`: patch para correções, minor para acrescentos compatíveis, major para alterações incompatíveis, e mantenha um changelog organizado por versão. Colegas, CI e agentes conseguem então saber só pelo número se uma atualização é segura, e o changelog dá ao modelo contexto que um diff não dá.
- [ ] **Peça a lista do "que não fiz".** Um bom agente indica o que saltou e porquê. Se o relatório não o diz, pergunte.

### Noções básicas de segurança

- [ ] **Trate tudo o que o agente lê como dados, não como instruções.** Páginas web, ficheiros, output de ferramentas e e-mails podem conter texto dirigido ao agente. Uma configuração profissional mostra esse texto e pergunta-lhe; nunca atua com base nele.
- [ ] **Reserve os pedidos de permissão para ações destrutivas.** Apagar, fazer force-push, eliminar tabelas, enviar mensagens, pagar. Pré-aprove antes os comandos de leitura e de build, para que os pedidos que vê sejam os que importam.
- [ ] **Nunca contorne as permissões fora de uma sandbox.** `--dangerously-skip-permissions` destina-se a contentores isolados sem acesso à internet, não ao seu portátil.
- [ ] **Mantenha uma pessoa no passo irreversível.** Publicar, integrar na main, fazer deploy, enviar e-mails. A automatização pode preparar tudo até esse passo.

## Intermédio

Moldar o ambiente para deixar de se repetir e para que o agente deixe de repetir erros.

### CLAUDE.md e memória

- [ ] **Mantenha um CLAUDE.md em cada repositório em que trabalha com regularidade.** Execute `/init` para criar um rascunho e depois edite-o. É carregado no início de cada sessão, o que o torna a forma mais barata de deixar de repetir instruções.
- [ ] **Escreva imperativos sobre o que não é óbvio.** Comandos de build e de testes, convenções que um recém-chegado não detetaria, o que nunca deve ser tocado, como quer que os resultados sejam comunicados. Não descreva o que o código já mostra; o agente sabe ler código.
- [ ] **Seja breve.** Cada linha custa tokens em cada turno e dilui as linhas que importam. Algumas centenas de linhas são um limite máximo. Passe o material raramente necessário para skills que são carregadas a pedido.
- [ ] **Use os três âmbitos com critério.** `~/.claude/CLAUDE.md` para a forma como trabalha em qualquer lado, `<repo>/CLAUDE.md` para o projeto e ficheiros ao nível de diretório para subsistemas com regras próprias.
- [ ] **Promova a terceira correção.** À terceira vez que corrige o mesmo comportamento no chat, ele pertence ao CLAUDE.md ou a um hook. A skill `claude-md-improver` revê o ficheiro à procura de linhas obsoletas ou contraditórias.
- [ ] **Deixe a memória guardar factos, não regras.** A memória automática do Claude Code regista factos e preferências do projeto entre sessões. Elimine as entradas que ficam obsoletas; uma memória errada é pior do que nenhuma.

### Gestão de contexto

- [ ] **Vigie o contexto como um orçamento.** `/context` mostra o que está a encher a janela. Outputs de ferramentas volumosos, logs colados e esquemas de ferramentas MCP carregados são os suspeitos habituais.
- [ ] **Compacte nas fronteiras entre fases, não quando for forçado.** Execute `/compact` com uma nota do que manter: depois da exploração e antes da implementação, ou depois de uma correção ser aplicada e antes da verificação. A compactação automática num ponto arbitrário perde os detalhes de que mais precisava.
- [ ] **Nunca cole logs; aponte para eles.** Guarde o output num ficheiro e deixe o agente fazer `grep` ou `tail`. Um log colado uma vez é pago em todos os turnos seguintes.
- [ ] **Não volte a ler um ficheiro que acabou de editar.** A ferramenta de edição falha de forma explícita se o alvo tiver mudado, pelo que reler para "verificar" é custo puro.
- [ ] **Prefira texto a capturas de ecrã.** Num navegador, ler o texto da página ou a árvore de acessibilidade é mais barato e mais preciso do que uma captura de ecrã. Use capturas só para o aspeto visual.
- [ ] **Reduza os servidores MCP ligados.** Os esquemas de ferramentas de cada servidor podem entrar no contexto. Ligue o que a tarefa exige e desative o resto; o carregamento diferido de ferramentas ajuda, mas menos servidores ajuda mais.

### Skills, hooks e permissões

- [ ] **Transforme procedimentos repetidos em skills.** Um `SKILL.md` em `~/.claude/skills/<name>/` ou dentro do repositório é carregado com `/<name>` ou quando a sua descrição corresponde à tarefa. Passos de deploy, listas de verificação de revisão e fluxos de trabalho específicos de um repositório pertencem aqui.
- [ ] **Use hooks para o que tem de acontecer sempre.** As instruções são probabilísticas; os hooks são determinísticos. Formatar ao guardar, bloquear `git push --force`, exigir uma declaração de factos antes de comandos de shell. Vivem no `settings.json`.
- [ ] **Construa uma lista de permissões.** Pré-aprove comandos de leitura (`git status`, `ls`, o executor de testes) em `.claude/settings.json`, para que os pedidos apareçam apenas em ações que o justifiquem. `/fewer-permission-prompts` analisa o seu histórico e propõe a lista.
- [ ] **Use worktrees para trabalho em paralelo.** Um git worktree por tarefa ou agente evita colisões entre edições. Os subagentes aceitam `isolation: "worktree"`; a sua própria sessão também pode entrar num.
- [ ] **Aprenda o teclado.** Shift+Tab alterna entre os modos de permissão e o modo de planeamento; Escape interrompe; `/model`, `/cost`, `/clear`, `/compact` e `/context` cobrem a maior parte das operações diárias. Defina o esforço com a flag `--effort` ou nos controlos de modelo da aplicação.

### Delegação em subagentes

- [ ] **Delegue as pesquisas com muita leitura.** Lance um agente explorador só de leitura para varrer muitos ficheiros e devolver uma conclusão com referências `file:line`. Os despejos de ficheiros ficam no contexto dele, não no seu.
- [ ] **Dê aos subagentes um briefing completo.** Eles não veem a sua conversa. Inclua o objetivo, os ficheiros, os critérios de aceitação, as verificações a executar e a instrução de não fazer perguntas nem devolver a tarefa.
- [ ] **Dimensione o modelo para a tarefa.** Haiku para varrimentos mecânicos, Sonnet para implementação delimitada, o modelo de topo para decisões de juízo. Indique sempre o modelo e o motivo. (House rule)
- [ ] **Lance agentes independentes numa única mensagem.** Lançá-los em série desperdiça tempo real. Agentes que não partilham ficheiros podem correr em conjunto e terminar em conjunto.
- [ ] **Defina agentes reutilizáveis uma só vez.** Os ficheiros de agentes em `.claude/agents/*.md` trazem o modelo, o esforço e as ferramentas no frontmatter, de modo que o briefing é a única coisa que varia.

### Modelo e esforço

- [ ] **Conheça a gama e os preços.** Veja a tabela de modelos na secção da API. As proporções de preço determinam o encaminhamento: o modelo de topo custa cinco vezes o Sonnet por token de saída.
- [ ] **Ajuste o esforço antes de trocar de modelo.** O esforço (`low` a `max`) troca profundidade por tokens dentro de um mesmo modelo. `xhigh` é a predefinição do Claude Code para programação; `low` convém ao trabalho mecânico e à maioria dos subagentes.
- [ ] **Orquestrador forte, executores baratos.** A sessão que detém a tarefa e toma as decisões de juízo corre no modelo de topo; os agentes que fazem trabalho delimitado correm em modelos mais baratos.
- [ ] **O modo rápido é o mesmo modelo com um sobrepreço.** `/fast` aumenta a velocidade de saída, não a capacidade. Use-o em sessões interativas em que a latência prejudica, não em trabalho em lote.

### Hábitos de verificação

- [ ] **Testes próprios durante o trabalho, a suite completa uma só vez no fim.** Execute apenas os ficheiros de teste que cobrem o que está a alterar; execute a suite inteira como verificação final e só voltar a fazê-lo se essa execução tiver falhado e tiver alterado algo. (House rule)
- [ ] **Peça provas na mensagem final.** Output dos testes, uma captura de ecrã, o resultado de um `curl`. Verificado e concluído são estados diferentes; faça o agente dizer qual deles atingiu.
- [ ] **Faça uma revisão de segunda opinião.** `/code-review` sobre o diff para encontrar bugs, `/simplify` para limpeza e `/security-review` antes de integrar qualquer coisa que toque em input, autenticação ou segredos.
- [ ] **Separe o autor do revisor.** Reveja numa sessão nova ou com outro agente. Aquele que escreveu o código partilha os seus pontos cegos.

## Pro

Orquestração, automatização e governação. Estes itens pressupõem que já faz tudo o que está acima.

### Fluxos de trabalho multiagente

- [ ] **Produtor mais verificador independente, sempre.** Uma fase produz, outra fase separada ataca o resultado e repara o que encontra. Nunca deixe o produtor verificar o seu próprio trabalho. (House rule)
- [ ] **Prefira um oráculo determinístico a um juiz baseado em modelo.** Testes, ida e volta, linhas de base byte a byte, uma implementação de referência. Quando a correção é decidível, deixe o código decidir e ponha um modelo barato a fazer o trabalho. (House rule)
- [ ] **Abra cada prompt de agente com um preâmbulo de assunto assente.** O harness reencaminha a sua última mensagem de chat para os subagentes; sem o preâmbulo, um agente lê uma mensagem conversacional e pára para perguntar. Indique o que não deve fazer e que verificações tem de executar. (House rule)
- [ ] **Proteja-se contra resultados de preenchimento.** Um agente cujo output estruturado é rejeitado pode reenviar um esboço válido mas vazio, que o runtime conta como sucesso. Valide o conteúdo no script e leia o diário antes de pagar uma nova execução. (House rule)
- [ ] **Um worktree por linha de trabalho paralela.** As linhas só correm em paralelo se não partilharem ficheiros nem medições sensíveis ao CPU; caso contrário, uma fica em fila atrás da integração da outra. (House rule)
- [ ] **Delimite pelo orçamento, não pela ambição.** Verifique a quota antes de lançar, diga quanto a execução vai custar e comunique a despesa face ao limite no final. Um fluxo de trabalho bem delimitado vale mais do que três superficiais. (House rule)
- [ ] **Traga as decisões de volta como provas.** Quando uma fase levanta uma decisão para o responsável, apresente a medição que a resolve e as opções com as respetivas consequências. Registe a resposta e as afirmações que falharam a verificação. (House rule)
- [ ] **Use a ferramenta Workflow para orquestração determinística.** Um script com chamadas `pipeline`, `parallel` e `agent`, fases e outputs validados por esquema. Só corre quando o utilizador o autoriza, porque pode gastar tokens equivalentes a dezenas de agentes.

### Execuções sem interface e agendadas

- [ ] **Use o modo de impressão para execuções em script.** `claude -p "<prompt>"` é não interativo; acrescente `--output-format json` para resultados legíveis por máquina, `--allowedTools` para restringir e `--bare` para execuções mínimas de CI sem hooks nem sincronização de plugins.
- [ ] **Agende rotinas para o trabalho recorrente.** Os agentes agendados na cloud (`/schedule`) tratam de relatórios noturnos e verificações de dependências. `/loop` consulta periodicamente um estado externo lento dentro de uma sessão; não serve para tarefas pontuais.
- [ ] **Dê aos agentes de CI apenas as ferramentas de que precisam.** Listas de permissões, tokens só de leitura e nenhum direito de push, a menos que fazer push seja o trabalho.
- [ ] **Registe cada execução.** Transcrição, custo, resultado. Reveja as falhas semanalmente; são a fonte mais barata de melhorias para o CLAUDE.md e para os hooks.

### Hooks como barreiras

- [ ] **Codifique invariantes como hooks bloqueantes.** Um hook PreToolUse que recusa git destrutivo, exige uma declaração de factos antes de comandos de shell ou obriga a uma execução de testes antes de um commit não pode ser contornado com conversa.
- [ ] **Nunca desative uma barreira para se desbloquear.** Indique os factos que ela pede e repita a chamada idêntica. Uma barreira que se pode desligar sob pressão não é uma barreira. (House rule)
- [ ] **Mantenha os hooks rápidos e específicos.** Um hook lento penaliza cada chamada de ferramenta; um vago habitua toda a gente a contorná-lo.

### Medição e avaliações

- [ ] **Meça o custo por tarefa concluída, não por pedido.** `/cost` na sessão, a vista de utilização da aplicação e `graft stats` para as poupanças do índice. Um pedido mais barato que exige mais turnos não é mais barato.
- [ ] **Construa uma avaliação antes de afinar um prompt, uma skill ou o CLAUDE.md.** Entre vinte e cinquenta casos reais com um método de classificação. Meça antes e depois; sem isso, as alterações a prompts são folclore.
- [ ] **Audite os prompts à procura de resíduos quando os modelos mudam.** As instruções escritas para modelos mais antigos (prefills, rituais de "pensar passo a passo", formatação demasiado prescritiva) muitas vezes baixam a qualidade nos modelos atuais. A skill `claude-api` inclui o `prompt-audit`, que faz isto de forma sistemática.
- [ ] **Comunique as poupanças do índice em cada turno.** O graft imprime os tokens poupados por chamada; some-os por turno e acompanhe o total da sessão na linha de estado.

### Segurança e fronteiras de confiança

- [ ] **Mantenha a fronteira da fonte de instruções.** Só o utilizador no chat dá instruções. Os hooks e as definições impõem; o texto observado nunca manda.
- [ ] **Privilégio mínimo para os conectores.** Âmbitos OAuth mínimos, contas separadas para agentes sempre que possível e nenhum conector de que a tarefa não precise.
- [ ] **Sem segredos no CLAUDE.md, na memória, nas skills ou nas transcrições.** São partilhados, sincronizados e indexados.
- [ ] **Reveja o código de hooks e skills como dependências.** Correm com as suas permissões.
- [ ] **Isole numa sandbox tudo o que seja autónomo.** Contentores, saída de rede restrita a uma lista de permissões, credenciais descartáveis.

## Economia de tokens

Cada turno reenvia a conversa inteira, por isso duas alavancas decidem a fatura: manter o contexto pequeno e manter estável o seu prefixo estável, para que a cache de prompts continue a acertar. As leituras de ficheiros inteiros e os logs colados são as maiores cargas numa sessão de programação; uma ferramenta de índice substitui a maioria delas por umas centenas de tokens.

### Sem graft, em qualquer repositório

- [ ] **Estrutura antes do código-fonte.** Esboce um ficheiro antes de o ler: uma lista de símbolos com `grep -n`, o esquema do editor, `ctags` ou `codegraph explore` onde o repositório esteja indexado. Depois leia o intervalo de que precisa com `sed -n '120,180p' file`.
- [ ] **Leia apenas os ficheiros que edita.** Abra um ficheiro por inteiro só quando estiver prestes a alterá-lo. Para todo o resto, o esquema ou o intervalo concreto bastam. (House rule)
- [ ] **Meça antes de fazer `cat`.** Primeiro `wc -l`. Um ficheiro de três mil linhas é uma decisão, não um reflexo.
- [ ] **Pesquise com âmbito e por relevância.** `rg` com `--type` e um caminho, `-l` para uma lista de ficheiros, `-c` para contagens antes de despejar ocorrências.
- [ ] **Delegue a descoberta num subagente só de leitura.** Devolve uma conclusão com referências `file:line`; a leitura dele nunca entra no seu contexto.
- [ ] **Limite cada output de ferramenta.** `head`, `--max-count`, `tail -20` no output de testes, `jq` com um caminho em JSON.
- [ ] **Mantenha estável o prefixo estável.** O prompt de sistema (incluindo o CLAUDE.md) é o prefixo em cache. Editá-lo ou trocar de modelo a meio da sessão repõe a cache a zero para o resto da sessão.
- [ ] **Testes próprios durante o trabalho, a suite completa uma só vez.** Executar a suite completa a meio da tarefa são tokens gastos em output que não vai ler. (House rule)
- [ ] **Compacte com intenção.** Indique o que manter e o que descartar. Uma compactação que mantém o plano e descarta a exploração vale mais do que uma que guarda tudo meio lembrado.
- [ ] **Evite ciclos de capturas de ecrã.** Uma captura para se orientar, depois extração de texto. Capturas repetidas da mesma página são a forma mais cara de a ler.

### Com graft

O graft mantém um diretório `graft/` na raiz do repositório: um grafo pré-construído de cada símbolo com o seu intervalo `file:line`, de quem chama quem e de pequenas fichas em prosa por área. Cada consulta custa umas centenas de tokens, não precisa de chave de API, responde em menos de um segundo e atualiza-se sozinha antes de responder, pelo que descreve sempre o código tal como está agora, incluindo as edições por submeter.

- [ ] **Instale uma vez por repositório.** `npm i -g @nanonets/graft@latest` e depois `graft init` no repositório. No npm 12 e posteriores, as instalações globais bloqueiam por predefinição os scripts de compilação nativos, o que impede o graft de carregar os seus parsers; volte a executar a instalação com `--allow-scripts=` seguido dos pacotes que o npm indica no aviso. Para o Claude Code, escreve o ficheiro de instruções, os hooks, a linha de estado e a ligação do servidor MCP; `graft build` constrói o grafo de ligações gratuito. `--deep` acrescenta um mapa de conceitos por LLM; não o use, a menos que lho peçam.
- [ ] **Uma chamada por pergunta; escolha a ferramenta adequada.** Use a tabela abaixo. A maioria das tarefas precisa de exatamente uma chamada ao graft; encadear ferramentas "na esperança de obter mais" é a principal forma de desperdiçar as poupanças.
- [ ] **`graft ask "<question>" --source` é a opção por defeito.** Resultados ordenados com o essencial de cada definição incluído, de modo que o resultado é o código de que precisa, sem leitura adicional. `--in <path>` delimita; `--full` só quando o essencial for pequeno demais para agir.
- [ ] **`graft grep "<pattern>"` quando precisa de todas as ocorrências.** Resultados agrupados pelo símbolo envolvente e ordenados por acoplamento. Pesquise um nome simples, não uma assinatura adivinhada; se falhar, alargue o padrão antes de recorrer ao grep normal.
- [ ] **`graft skeleton <file>` antes de mexer num ficheiro.** Apenas assinaturas, cerca de 200 tokens, aproximadamente dez vezes mais barato do que ler o ficheiro.
- [ ] **`graft callers <symbol> --depth 2` antes de alterar uma assinatura.** Arestas pré-calculadas, não uma pesquisa de texto. `--depth all` antes de qualquer refatoração ou alteração em vários ficheiros; `--direction out` para ver de que depende um símbolo.
- [ ] **`graft map` para se orientar num repositório desconhecido.** Depois leia as fichas dos nós centrais que ele indica. Não faça skeleton nem ask por todos os subsistemas que ele lista.
- [ ] **Nunca encaminhe o graft para `head`, `tail` ou `sed -n`.** O output já tem limite e diz o que deixou de fora. Cortá-lo perde resultados e a linha de poupança de onde se extrai o total da linha de estado.
- [ ] **Confie nos intervalos.** A lista `covers:` de um nó é gerada a partir do código-fonte e é fidedigna. Não reabra ficheiros para a confirmar.
- [ ] **Comunique o que o graft poupou, em cada turno.** Cada ferramenta abre com `[graft] tokens saved ≈ N`. Some-os na resposta; `graft stats` mostra a distribuição da sessão.
- [ ] **Ligue-o ao CI.** `graft check` falha quando o índice está desatualizado; `graft blast --format markdown` publica o raio de impacto de um diff como comentário de PR, com um diagrama.
- [ ] **Em worktrees, consulte a partir do checkout principal.** O índice vive lá. Os agentes usam-no só para leitura e editam a sua própria cópia. (House rule)
- [ ] **Num monorepo, delimite com `--in <scope>/`.** Os resultados trazem uma etiqueta de âmbito; a ordenação é justa entre subprojetos, mas restringir continua a poupar tokens.
- [ ] **Mantenha o graft atualizado.** `graft version` compara a versão instalada com a do npm; `graft upgrade` aplica-a. Reinicie o agente após a atualização. O CodeGraph atualiza-se com `codegraph upgrade`, seguido de `codegraph sync` em cada repositório indexado.

| Quando está a... | Recorra a | Chamadas |
|---|---|---|
| Fazer onboarding, "explica esta base de código" | `graft map`, depois ler as fichas dos nós centrais que ele indica | 1 |
| Perceber um fluxo, "como funciona X" | `graft ask "<flow>" --source` | 1 |
| Descobrir onde uma alteração pertence | `graft ask "where is <behaviour>" --source` | 1 |
| Editar um símbolo que já sabe nomear | `graft grep "<symbol>"`, editar em `file:line` | 1 |
| Renomear, eliminar, alterar uma assinatura | primeiro `graft callers <sym> --depth 2` | 1 |
| Refatoração ou alteração em vários ficheiros | `graft callers <sym> --depth all` antes de editar | 1 |
| "De que depende isto?" | `graft callers <sym> --direction out` | 1 |
| Todas as ocorrências de um padrão | `graft grep "<literal>"` | 1 |
| "Qual é a API deste ficheiro?" | `graft skeleton <file>` | 1 |
| Depurar uma falha na área X | `graft ask "<symptom>" --source`, depois `callers` sobre o suspeito | 1 a 2 |
| Avaliar o risco de um diff antes de integrar | `graft callers <changed sym> --depth 2` | 1 por símbolo |

Quando o servidor MCP do graft está ligado, as mesmas ferramentas aparecem como `graft_find_code`, `graft_find_all`, `graft_file_api`, `graft_trace_calls`, `graft_repo_map` e `graft_check_freshness`. Carregue-as numa única chamada `ToolSearch`, nunca uma a uma.

### O CodeGraph como o outro índice

- [ ] **Se existir `.codegraph/`, use-o antes do grep.** `codegraph explore "<question>"` devolve, numa só chamada, o código dos símbolos relevantes e os caminhos de chamada entre eles; `callers`, `callees`, `impact` e `affected` cobrem o resto. Não execute `codegraph init` no repositório de outra pessoa; indexar é uma decisão do proprietário.
- [ ] **Escolha um índice principal por repositório.** Ambas as ferramentas dão estrutura antes do código-fonte; usar as duas duplica os esquemas de ferramentas no contexto.

## Otimização da utilização de modelos

Três alavancas, por ordem: tamanho do contexto (a secção anterior), esforço, nível do modelo. Julgue pelo custo por tarefa concluída. Um modelo mais barato que exige mais turnos, mais tentativas ou uma correção humana não é mais barato.

### Encaminhamento por tipo de tarefa

| Tipo de tarefa | Modelo | Esforço | Porquê |
|---|---|---|---|
| Varrimentos com grep, análise de logs, aplicação de uma renomeação a partir de um mapa conhecido, formatação, código de rotina, extração de factos de um ficheiro conhecido | Haiku 4.5 | baixo | Volume elevado, pouco juízo; os erros são baratos e visíveis |
| Um componente ou teste segundo uma especificação, um passo de migração documentado, atualizações de documentação, resumos de changelog, revisão de primeira passagem | Sonnet 5.5 | médio (predefinição) | Critérios de aceitação claros limitam o dano de uma resposta errada |
| Decisões de arquitetura e de design, migrações ambíguas, depuração de causa raiz, revisão de segurança, verificação adversarial, juízo final sobre o output de outros agentes | Opus 5.5, ou o modelo de topo da sessão quando a quota o permitir | alto ou xhigh | Uma resposta errada é cara de detetar e de desfazer |
| A sessão interativa que detém a tarefa inteira | O melhor modelo disponível | xhigh (predefinição do Claude Code) | Toma as decisões de juízo e escreve os briefings para todos os outros |

### Sem graft

- [ ] **Orquestrador forte, executores baratos.** A sessão ou o script que detém a tarefa corre no modelo de topo; tudo o que é delimitado corre em Sonnet ou Haiku.
- [ ] **Afine o briefing para que um modelo mais barato não tenha de explorar.** A exploração é onde os modelos baratos gastam turnos e se enganam. Com referências `file:line` e critérios de aceitação, o Sonnet faz o que o Opus faria.
- [ ] **Baixe o esforço antes de baixar o nível.** Meça numa amostra de tarefas reais. O modelo mais recente com esforço baixo muitas vezes iguala um mais antigo com esforço alto.
- [ ] **Nunca baixe o nível do verificador.** A verificação é onde as respostas erradas custam mais. Corra-a no modelo mais forte que a sua quota permitir e verifique a utilização antes de lançar. (House rule)
- [ ] **Evite cascatas que dividem a cache.** As caches de prompts são por modelo. Uma cascata de vários modelos numa aplicação com API perde a reutilização da cache entre eles; um só modelo com esforço afinado costuma ganhar.
- [ ] **Herde o modelo da sessão apenas quando a tarefa exige o nível de topo.** Atribua a cada fase o que ela precisa, não o que está a correr o fluxo de trabalho. (House rule)

### Com graft

- [ ] **Deixe o graft fazer a exploração e depois desça um nível.** `graft ask --source` devolve intervalos exatos com o essencial incluído, pelo que um agente Sonnet pode editar o que antes precisava do Opus para ser encontrado.
- [ ] **Dê ao Haiku o mapa, não a pesquisa.** `graft callers <sym> --depth all` é a lista completa de locais para uma renomeação. Entregue essa lista a um agente Haiku para aplicar mecanicamente; não lhe peça que descubra a lista.
- [ ] **Baixe o esforço nas consultas apoiadas pelo graft.** São necessárias menos chamadas de ferramentas, pelo que deliberar mais compra pouco.
- [ ] **Mantenha os resultados das ferramentas pequenos para manter a cache quente.** Os outputs do graft têm limite; as leituras de ficheiros inteiros são as grandes cargas que empurram o contexto estável para fora da janela.
- [ ] **Gaste as poupanças em verificação.** Se o graft poupa dezenas de milhares de tokens por sessão, esse é o orçamento para um verificador mais forte, não para mais exploração.

## Chat do claude.ai e Projects

- [ ] **Um Project por domínio.** As instruções do Project guardam o contexto permanente; o conhecimento do Project guarda os documentos. Ambos são carregados sem terem de ser colados em cada chat.
- [ ] **Primeiro o esquema, depois expanda secção a secção.** As respostas longas de uma só vez escondem problemas estruturais até ao fim.
- [ ] **Mostre o resultado que quer.** Um pequeno exemplo do formato, do tom ou da tabela vale mais do que três parágrafos a descrevê-lo.
- [ ] **Peça fontes e verifique-as.** Para factos, datas e valores, pergunte de onde vêm e confirme antes de os reutilizar.
- [ ] **Use artefactos para tudo o que vai reutilizar ou partilhar.** Documentos, páginas, diagramas e pequenas ferramentas ficam melhor como artefactos do que como texto de chat.
- [ ] **Passe para o Claude Code quando a tarefa toca em ficheiros.** Repositórios, terminais, navegadores e tudo o que tenha de ser verificado executando pertencem ao Code, não ao chat.
- [ ] **Use a memória e os estilos com critério.** A memória deve guardar factos estáveis sobre si e o seu trabalho; os estilos devem codificar a voz que continua a pedir.
- [ ] **Comece um novo chat quando o tema muda.** Os chats longos têm o mesmo custo de contexto que as sessões longas.

## Construir com a API e os SDKs

Para equipas que colocam o Claude dentro do seu próprio produto. Tudo passa por um único endpoint, `POST /v1/messages`; ferramentas, outputs estruturados e cache são funcionalidades desse endpoint. A skill `claude-api` no Claude Code contém a referência atual; os itens abaixo são os hábitos.

### Escolha o nível mais simples

- [ ] **Chamada única, depois fluxo de trabalho, depois agente.** Classificação, extração e resumo são um único pedido. Pipelines de vários passos com lógica controlada por código são um fluxo de trabalho que orquestra. Só o uso de ferramentas aberto e conduzido pelo modelo é um agente.
- [ ] **Quatro critérios antes de construir um agente.** Complexidade (vários passos e difícil de especificar à partida), valor (compensa o custo e a latência), viabilidade (o Claude é capaz nesta tarefa), custo do erro (pode ser detetado e recuperado). Um "não" em qualquer um deles significa manter-se mais simples.
- [ ] **Conheça as quatro formas de construir um agente.** Um ciclo manual que controla; o Tool Runner do SDK, que percorre em ciclo as ferramentas que define; os Managed Agents, em que a Anthropic executa o ciclo e aloja a sandbox; e o Claude Agent SDK, que é o Claude Code como biblioteca, com ferramentas integradas. A primeira, a segunda e a quarta deixam o deployment ao seu cuidado.

### Higiene dos pedidos

- [ ] **Use por defeito o Opus atual com pensamento adaptativo.** `claude-opus-5-5`, a menos que o utilizador nomeie outro modelo. O pensamento fica ativo; controle a profundidade com `output_config.effort` e defina-a explicitamente, porque a predefinição no Opus 5.5 é `medium`.
- [ ] **Use streaming em tudo o que seja longo.** Não subestime `max_tokens`: cerca de 16k sem streaming, 64k com streaming. Use o auxiliar de mensagem final do SDK quando não precisar de eventos individuais.
- [ ] **Sem prefill nem escolha de ferramenta forçada nos modelos atuais.** Ambos devolvem um 400 na linha 5.x. Use antes outputs estruturados (`output_config.format`) e ferramentas `strict: true`.
- [ ] **Verifique `stop_reason` antes de ler o conteúdo.** `refusal`, `max_tokens`, `pause_turn` e `tool_use` exigem cada um o seu tratamento. Ative os fallbacks no servidor nos modelos 5.x, para que uma recusa de segurança seja encaminhada para um modelo de recurso.
- [ ] **Use os auxiliares e os tipos do SDK.** Não escreva à mão o ciclo de ferramentas, a promise de streaming nem os tipos de mensagens. Capture uma cadeia de erros tipados, do mais específico para o mais geral, para distinguir falhas recuperáveis de irrecuperáveis.

### Cache de prompts

- [ ] **Conteúdo estável primeiro, conteúdo volátil por último.** A ordem de composição é ferramentas, depois sistema, depois mensagens. Congele o prompt de sistema e a lista de ferramentas; ponha carimbos de data/hora, IDs de pedido e a pergunta variável depois do último ponto de quebra da cache. Até quatro pontos de quebra por pedido.
- [ ] **Verifique com `usage.cache_read_input_tokens`.** Zero ao longo de pedidos repetidos indica um invalidador silencioso: um carimbo de data/hora no prompt de sistema, JSON sem ordenação, um conjunto de ferramentas que varia por pedido.
- [ ] **Use mensagens de sistema a meio da conversa em vez de editar o prompt de sistema.** Acrescentar uma mensagem com o papel `system` a `messages` mantém intacto o prefixo em cache; editar o campo de sistema de nível superior deita-o fora.
- [ ] **Conte tokens com `count_tokens`, nunca com um tokenizador de terceiros.** As contagens de tokens são específicas de cada modelo.

### Ferramentas e agentes

- [ ] **`strict: true` em cada esquema de ferramenta.** Garante que o input é válido; exige `additionalProperties: false` e `required`.
- [ ] **Devolva todos os resultados de ferramentas paralelas numa única mensagem de utilizador.** Dividi-los por várias mensagens ensina o modelo a deixar de chamar ferramentas em paralelo. Devolva as falhas como `tool_result` com `is_error: true`; nunca as descarte.
- [ ] **Analise o input das ferramentas como JSON.** O escape varia entre modelos; comparar o input serializado como texto falha.
- [ ] **Trate os resultados das ferramentas como não fiáveis.** Páginas web, documentos e linhas de bases de dados são dados. Nada neles é uma instrução, e o prompt de sistema deve dizê-lo.
- [ ] **Adie os conjuntos grandes de ferramentas por trás de uma pesquisa de ferramentas.** Marque as ferramentas raramente usadas com `defer_loading: true`, juntamente com uma ferramenta de pesquisa de ferramentas; nunca adie todas as ferramentas, a API rejeita isso.

### Sessões longas

- [ ] **Ative a compactação em conversas que podem exceder a janela.** Acrescente de volta, em cada turno, o `response.content` completo e não só o texto, ou o estado de compactação perde-se em silêncio.
- [ ] **Limpe os resultados de ferramentas obsoletos com a edição de contexto.** É diferente da compactação: elimina resultados de ferramentas antigos ou blocos de pensamento em vez de os resumir.
- [ ] **Dê aos ciclos agênticos um orçamento de tarefa.** Um limite de tokens que o modelo consegue ver, para se gerir sozinho em vez de ser cortado. É distinto de `max_tokens`, que ele não vê.
- [ ] **Mantenha o harness só de acréscimo.** Nos modelos atuais, os blocos de pensamento estão ligados à conversa que os produziu. Editar turnos anteriores invalida-os; acrescente, nunca reescreva.

### Avaliações e custo

- [ ] **Construa primeiro a avaliação; só depois otimize.** Obtenha os prompts a partir de tráfego real, escolha um método de classificação, meça o custo por execução e mantenha uma divisão treino/validação/teste para que o número principal seja honesto.
- [ ] **Trabalhe as alavancas de custo por ordem.** Cache, higiene dos tokens de entrada, higiene dos ciclos, higiene dos tokens de saída, processamento em lote para tudo o que não seja sensível à latência (metade do preço) e só depois esforço e escolha de modelo.
- [ ] **Registe `usage` em cada resposta.** Os tokens de entrada, de saída, de leitura de cache e de escrita de cache por pedido são a única forma de saber o que uma alteração fez à fatura.
- [ ] **Processe em lote o que pode esperar.** A Message Batches API corre de forma assíncrona a metade do preço; associe os resultados por `custom_id`, nunca pela posição.

### Modelos atuais

| Modelo | ID | Contexto | Entrada por MTok | Saída por MTok |
|---|---|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` | 1M | $10.00 | $50.00 |
| Claude Opus 5.5 | `claude-opus-5-5` | 1M | $4.00 | $20.00 |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | 1M | $2.00 | $10.00 |
| Claude Haiku 4.5 | `claude-haiku-4-5` | 200K | $1.00 | $5.00 |

Tarifas da API própria em setembro de 2026. As leituras de cache nos modelos atuais custam uma pequena fração do preço de entrada (2,5% a 10%), razão pela qual um prefixo estável importa mais do que qualquer outra alavanca. Use os IDs exatos acima, sem sufixos de data.

## Regras da casa

As regras de trabalho que o Marc definiu para os agentes, mantidas em `~/.claude/CLAUDE.md` para que cada sessão e cada subagente as carregue. Estão aqui reproduzidas para que a equipa leia o mesmo texto. As datas indicam quando cada regra foi definida.

### Seleção de modelos para agentes e fluxos de trabalho lançados (2026-09-09, reforçada em 2026-09-17)

- [ ] **Não gaste em excesso em fluxos de trabalho; é uma regra rígida.** Escolha o modelo e o esforço por tipo de tarefa. Nunca exagere numa tarefa simples, nunca subdimensione uma difícil.
- [ ] **Dimensione cada fase para o que essa fase precisa.** Nunca atribua a todas as fases o modelo do orquestrador nem o esforço máximo só porque é isso que está a executar o fluxo de trabalho.
- [ ] **Haiku, esforço baixo** para trabalho mecânico, de grande volume e pouco juízo: varrimentos com grep, análise de logs, aplicação de uma renomeação a partir de um mapa conhecido, formatação, código de rotina, extração de factos de um ficheiro conhecido.
- [ ] **Sonnet, esforço predefinido** para implementação e pesquisa delimitadas com critérios de aceitação claros: um componente ou teste segundo uma especificação, um passo de migração documentado, atualizações de documentação, resumos de changelog, revisão de primeira passagem.
- [ ] **Opus ou o modelo de topo da sessão, esforço alto** quando uma resposta errada é cara: decisões de arquitetura e de design, migrações ambíguas, depuração de causa raiz, revisão de segurança, verificação adversarial, juízo final sobre o output de outros agentes.
- [ ] **Indique o modelo e o motivo para cada fase e cada subagente.** Sem exceções.

### Como lançar fluxos de trabalho (2026-09-20)

- [ ] **Produtor mais verificador independente, sempre.** O verificador repara o que encontra em vez de se limitar a reportar. O verificador corre em Fable quando a quota o permite, em Opus caso contrário; verifique `mcp__ccd_session_mgmt__get_usage` antes de lançar e nunca deixe uma fase no modelo predefinido quando o modelo da sessão estiver perto do limite.
- [ ] **Prefira um oráculo determinístico a um verificador baseado em modelo.** Um assembler, uma implementação de referência, uma ida e volta, uma linha de base byte a byte. As linhas de trabalho apoiadas num oráculo dispensam uma fase de verificação dispendiosa.
- [ ] **Todo o prompt de produtor abre com um preâmbulo SETTLED.** As mensagens recentes do utilizador dirigem-se ao orquestrador; não faça perguntas, não espere, não devolva a tarefa; nunca execute `gh`, `git commit`, `git push` nem `git checkout`; nunca desative o hook GateGuard; sem novas dependências de terceiros; execute as verificações finais indicadas e comunique com honestidade.
- [ ] **Proteja-se contra resultados de preenchimento.** Diga aos agentes: se a chamada estruturada for rejeitada, corrija o JSON e reenvie o resultado completo, nunca um preenchimento. Valide o conteúdo no script, por exemplo `if (!r || r.summary.length < 120) throw`. Antes de pagar uma nova execução, leia `journal.jsonl` e a transcrição do agente; os primeiros 2 KB de um payload falhado sobrevivem em `__unparsedToolInput.raw`.
- [ ] **Um git worktree por linha de trabalho paralela.** `git worktree add -b <branch> <path> origin/main`; cada agente escreve apenas dentro do seu. As ferramentas de índice vivem no checkout principal e são usadas a partir daí só para leitura.
- [ ] **Integre através da API enquanto um fluxo de trabalho ocupa o checkout principal.** `gh api -X PUT repos/<o>/<r>/pulls/N/merge -f merge_method=rebase`; `gh pr merge` muda o ramo local. Nunca encadeie a eliminação de um ramo a seguir a um comando de integração. Com verificações de estado estritas, a integração é em série: integre a main e aguarde a ronda de verificações seguinte; nunca faça rebase nem force-push a um PR que o monitor de CI esteja a vigiar.
- [ ] **Delimite pelo orçamento, não pela ambição.** Verifique primeiro a quota semanal e diga quanto a execução vai custar. Comunique a despesa face ao limite no fim de cada execução e comunique a poupança de tokens do graft ou do CodeGraph.
- [ ] **Traga as decisões de volta como provas, não como perguntas.** Apresente a medição que a resolve e as opções com as respetivas consequências; registe a resposta e as afirmações que falharam a verificação.

### Economia de contexto e de testes (2026-09-19)

- [ ] **Estrutura antes do código-fonte.** Em repositórios indexados pelo graft, `graft skeleton <file>`, `graft grep` e `graft callers` antes de abrir seja o que for. Onde o graft não existe, o CodeGraph se estiver indexado, caso contrário um grep direcionado ao símbolo; nunca ficheiros inteiros para se orientar.
- [ ] **Leia apenas os ficheiros que edita.** Abra um ficheiro por inteiro só quando estiver prestes a alterá-lo. Não volte a ler um ficheiro que acabou de editar.
- [ ] **Testes próprios durante o trabalho, a suite completa uma só vez.** Execute apenas os ficheiros de teste que cobrem o que está a alterar; a suite completa uma só vez no fim como verificação final, e só voltar a fazê-lo se essa execução tiver falhado e tiver alterado algo.
- [ ] **Declare estes hábitos em cada prompt de subagente e de fluxo de trabalho.** Alguns tipos de agentes integrados não carregam o CLAUDE.md.

### Ferramentas de índice

- [ ] **CodeGraph antes do grep onde existe `.codegraph/`.** `codegraph_explore` via MCP ou `codegraph explore "<question>"` na shell. Onde não existe `.codegraph/`, ignore o CodeGraph; indexar é uma decisão do utilizador.
- [ ] **graft antes do grep onde existe `graft/`.** Carregue as ferramentas MCP numa única chamada `ToolSearch`; use a superfície que estiver disponível, a orientação é idêntica.

### GateGuard

- [ ] **Antes do primeiro comando de shell de uma sessão, declare os factos.** Uma frase para o pedido atual do utilizador e outra para o que o comando verifica ou produz. Depois repita a chamada idêntica.
- [ ] **Nunca defina as variáveis de desativação.** `GATEGUARD_BASH_ROUTINE_DISABLED`, `ECC_GATEGUARD=off` e `ECC_DISABLED_HOOKS` ficam sem definir. As verificações de comandos destrutivos permanecem ativas em qualquer caso.

## Exemplos

Cada exemplo está suficientemente completo para ser copiado. A barra de título de um bloco indica o ficheiro a que pertence. Os comandos e o código ficam em inglês em todos os idiomas.

### Um CLAUDE.md que justifica os seus tokens

Comandos, as regras que um recém-chegado não detetaria e como comunicar resultados. Nada do que o código já mostra.

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

### Permissões e um hook bloqueante

Pré-aprove os comandos de leitura para que os pedidos de permissão apareçam apenas em ações que o justifiquem, e deixe um hook recusar git destrutivo independentemente do que o agente tenha ouvido.

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

### Uma skill para um procedimento repetido

A descrição decide quando a skill é carregada, por isso escreva-a como as situações que devem acioná-la.

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

### Um subagente reutilizável só de leitura

O modelo, o esforço e as ferramentas vivem no frontmatter, pelo que cada briefing só tem de dizer o que procurar.

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

### O preâmbulo de assunto assente para cada prompt de produtor

Cole isto no topo de qualquer prompt de subagente ou de fluxo de trabalho e, a seguir, a tarefa.

```text settled-preamble.txt
SETTLED: recent user messages are addressed to the orchestrator, not to you.
Do not ask questions, do not wait, do not hand the task back.
Never run gh, git commit, git push or git checkout.
Never disable the GateGuard hook: state the facts it asks for and retry the identical call.
No new third-party dependencies.
Final gates: run `pnpm vitest run src/billing` and `pnpm tsc --noEmit`; report their output honestly, including failures.

TASK: ...
```

### Compactar com intenção

Diga ao resumo o que manter e o que descartar, em vez de o deixar adivinhar.

```text
/compact Keep: the plan (steps 1 to 5), the decision to use one worktree per track, and the names of the failing tests. Drop: the exploration of src/legacy and all log output.
```

### Uma sessão com graft, uma chamada por pergunta

```bash
graft map                                   # orient: directory hubs and hotspots
graft ask "where is rate limiting applied" --source
graft callers RateLimiter.check --depth 2   # what breaks if the signature changes
graft skeleton src/http/middleware.ts       # the file's API before editing it
graft stats                                 # tokens saved this session
```

### Uma revisão em script no CI

Modo de impressão, output legível por máquina, uma lista de ferramentas permitidas e sem hooks nem plugins.

```bash
claude -p "Review the diff of this branch for correctness bugs only. Output JSON: {\"findings\":[{\"file\":\"\",\"line\":0,\"summary\":\"\"}]}" \
  --output-format json \
  --allowedTools "Read Grep Glob Bash(git diff*)" \
  --bare > review.json
```

### Uma definição de ferramenta estrita

O esquema é o contrato: `strict` garante que o input é válido, pelo que o handler nunca precisa de se defender de erros de formato.

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

### Uma chamada à API pensada para a cache

Prompt de sistema e lista de ferramentas congelados primeiro, a pergunta variável por último, streaming ativo e o contador da cache verificado.

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

## Referência rápida

### Claude Code

| Necessidade | Usar |
|---|---|
| Criar um rascunho de CLAUDE.md | `/init` |
| Ver o que enche o contexto | `/context` |
| Resumir e continuar | `/compact <what to keep>` |
| Recomeçar do zero | `/clear` |
| Gasto da sessão | `/cost` |
| Mudar de modelo | `/model` |
| Saída mais rápida, mesmo modelo | `/fast` |
| Esforço no arranque | `claude --effort xhigh` |
| Modo de planeamento e modos de permissão | Shift+Tab |
| Parar o turno em curso | Escape |
| Rever o diff à procura de bugs | `/code-review` |
| Limpar o diff | `/simplify` |
| Passagem de segurança no ramo | `/security-review` |
| Menos pedidos de permissão | `/fewer-permission-prompts` |
| Execução em script | `claude -p "<prompt>" --output-format json --allowedTools "Read Grep"` |
| Execução recorrente na cloud | `/schedule` |
| Consultar periodicamente um estado externo lento | `/loop` |

### graft

| Necessidade | Usar |
|---|---|
| Instalar e ligar ao repositório | `npm i -g @nanonets/graft@latest` e depois `graft init` |
| Orientar-se num repositório desconhecido | `graft map` |
| Compreender ou localizar | `graft ask "<question>" --source` |
| Todas as ocorrências | `graft grep "<name>"` |
| A API de um ficheiro | `graft skeleton <file>` |
| Quem chama, raio de impacto | `graft callers <sym> --depth 2`, `--depth all`, `--direction out` |
| Verificação de atualização no CI | `graft check` |
| Comentário de risco no PR | `graft blast --format markdown` |
| Poupanças da sessão | `graft stats` |

### CodeGraph

| Necessidade | Usar |
|---|---|
| Símbolos mais caminhos de chamada numa só chamada | `codegraph explore "<question>"` |
| Um símbolo ou um ficheiro com números de linha | `codegraph node <name>` |
| Chamadores, chamados, impacto | `codegraph callers <sym>`, `codegraph callees <sym>`, `codegraph impact <sym>` |
| Testes afetados por ficheiros alterados | `codegraph affected <files>` |

### Parâmetros da API que vale a pena recordar

| Necessidade | Usar |
|---|---|
| Profundidade de pensamento | `output_config.effort`: `low`, `medium`, `high`, `xhigh`, `max` |
| Saída JSON estruturada | `output_config.format` |
| Input de ferramenta validado | `strict: true` na ferramenta |
| Ponto de quebra da cache | `cache_control: {type: "ephemeral"}` (máx. 4) |
| Instrução do operador a meio da conversa | `{role: "system", content: ...}` dentro de `messages` |
| Conversas longas | beta de compactação `compact-2026-01-12` |
| Ciclos de agente com ritmo controlado | `output_config.task_budget` com a beta `task-budgets-2026-03-13` |
| Trabalho assíncrono a metade do preço | Message Batches API |

## Fontes

- Documentação do Claude Code: https://code.claude.com/docs
- Documentação da Claude API: https://docs.anthropic.com
- graft: https://www.npmjs.com/package/@nanonets/graft (a skill instalada em `~/.claude/skills/graft/SKILL.md` é a referência operacional)
- CodeGraph: `codegraph --help` e as instruções do servidor MCP `codegraph`
- Regras de trabalho do Marc: `~/.claude/CLAUDE.md`
