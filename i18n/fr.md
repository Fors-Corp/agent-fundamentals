# Travailler en professionnel avec Claude et les agents de code

Une checklist des habitudes qui distinguent un usage occasionnel de Claude d'un usage professionnel. Elle couvre Claude Code (CLI et application de bureau), l'interface de chat claude.ai, et la création de vos propres agents sur l'API Claude et l'Agent SDK. Les trois premières sections correspondent à des niveaux : Bases, Intermédiaire, Pro. Les sections suivantes sont transversales : économie de tokens, routage des modèles, chat, API et règles maison de l'équipe.

Mode d'emploi : cochez ce que vous faites déjà de façon constante. Ce qui reste décoché est votre prochaine compétence à construire. Les éléments marqués **Règle maison** viennent des règles de travail de Marc, que les agents chargent depuis `~/.claude/CLAUDE.md` ; elles sont reprises intégralement dans la section Règles maison, afin que l'équipe lise le même texte que les agents. Tout le reste relève des bonnes pratiques générales.

Dernière révision le 2026-10-02. Vérifié avec Claude Code 2.1, graft 0.21.1, CodeGraph 1.6.1, Vercel CLI 62.2 et la gamme de modèles de l'API Claude de septembre 2026.

## Bases

Les habitudes qui comptent dès la première session. Aucune ne demande de configuration.

### Avant de saisir quoi que ce soit

- [ ] **Rédigez la tâche comme un ticket.** Indiquez l'objectif, les contraintes et ce que « terminé » signifie, en un seul message. Les agents comblent les vides par des suppositions, et les critères d'acceptation que vous omettez sont ceux qui seront mal devinés.
- [ ] **Pointez vers le contexte au lieu de le coller.** Nommez les fichiers, fonctions, messages d'erreur ou URL. L'agent les lit lui-même pour moins de tokens qu'un mur de texte collé, et il lit la version actuelle plutôt qu'une copie périmée.
- [ ] **Dites ce qu'il ne faut pas toucher.** Fichiers hors périmètre, interfaces publiques, migrations, tout ce qui a une dépendance de déploiement. Une phrase de cadrage évite une heure de retour en arrière.
- [ ] **Demandez d'abord un plan pour tout ce qui n'est pas trivial.** Dans Claude Code, passez en mode plan avec Shift+Tab : l'agent lit et propose, mais ne modifie rien tant que vous n'avez pas approuvé. En chat, demandez un plan détaillé avant la réponse complète.
- [ ] **Une tâche par conversation.** Repartez de zéro (`/clear`) pour un travail sans rapport. Le contexte résiduel de la tâche précédente est facturé à chaque tour et induit le modèle en erreur sur ce qui compte maintenant.
- [ ] **Sachez sur quelle surface vous êtes.** Le chat pour réfléchir, rédiger et analyser du contenu collé. Claude Code pour tout ce qui touche des fichiers, un dépôt, un terminal ou un navigateur. L'API quand vous voulez ce comportement dans votre propre produit.

### Pendant la session

- [ ] **Lisez ce que dit l'agent avant de répondre.** Quand il énonce une hypothèse, corrigez-la immédiatement. Confirmer tard, c'est refaire un travail construit sur une mauvaise prémisse.
- [ ] **Répondez aux questions par des décisions.** Si l'agent s'arrête pour poser une question, c'est qu'il attend une décision que vous seul pouvez prendre. Donnez-la et laissez-le continuer ; ne répondez pas à une question par une autre question.
- [ ] **Interrompez tôt.** Escape arrête le tour en cours. S'il part dans la mauvaise direction à l'étape deux, n'attendez pas l'étape neuf.
- [ ] **Faites-lui exécuter ses propres vérifications.** Demandez que les tests, le vérificateur de types et le linter soient lancés, et que leur sortie soit affichée. « Les tests passent » sans sortie est une affirmation, pas une preuve.
- [ ] **Gardez les secrets hors de la conversation.** Ne collez jamais de clés, de mots de passe ni de tokens. Nommez la variable d'environnement, gardez `.env` dans `.gitignore` et dites à l'agent de ne pas le lire. Tout ce que l'agent lit entre dans la requête envoyée au modèle.

### Avant d'accepter le résultat

- [ ] **Relisez le diff comme la pull request d'un nouveau coéquipier.** Utilisez `git diff` ou le volet de diff de l'application. Vous êtes responsable de tout ce que vous fusionnez, quel qu'en soit l'auteur.
- [ ] **Vérifiez qu'il a fait toute la tâche, pas seulement les parties faciles.** Comparez avec vos critères d'acceptation. Les agents réduisent parfois le périmètre sans le dire et annoncent avoir terminé.
- [ ] **Traquez les API inventées et les connaissances périmées.** Les connaissances du modèle ont une date limite. Vérifiez les versions de bibliothèques, les options et les signatures dans la documentation ou dans le paquet installé.
- [ ] **Faites des commits par petites étapes.** Git est votre bouton d'annulation. Committez après chaque incrément vérifié, pour qu'une mauvaise étape ultérieure puisse être annulée seule.
- [ ] **Demandez la liste de « ce que je n'ai pas fait ».** Un bon agent indique ce qu'il a laissé de côté et pourquoi. Si son compte rendu ne le dit pas, demandez-le.

### Sécurité de base

- [ ] **Traitez tout ce que l'agent lit comme des données, pas comme des instructions.** Les pages web, fichiers, sorties d'outils et e-mails peuvent contenir du texte destiné à l'agent. Une configuration professionnelle fait remonter ce texte et vous demande votre avis ; elle n'agit jamais dessus.
- [ ] **Gardez les demandes d'autorisation pour les actions destructrices.** Supprimer, faire un force-push, supprimer des tables, envoyer des messages, payer. Pré-approuvez plutôt les commandes de lecture seule et de build, pour que les demandes que vous voyez soient celles qui comptent.
- [ ] **Ne contournez jamais les permissions hors d'un bac à sable.** `--dangerously-skip-permissions` est réservé aux conteneurs isolés sans accès à Internet, pas à votre ordinateur portable.
- [ ] **Gardez un humain sur l'étape irréversible.** Publier, fusionner dans main, déployer, envoyer un e-mail. L'automatisation peut tout préparer jusqu'à cette étape.

## Intermédiaire

Façonner l'environnement pour que vous cessiez de vous répéter et que l'agent cesse de refaire les mêmes erreurs.

### CLAUDE.md et mémoire

- [ ] **Gardez un CLAUDE.md dans chaque dépôt où vous travaillez régulièrement.** Lancez `/init` pour en rédiger un, puis retouchez-le. Il se charge au début de chaque session, ce qui en fait le moyen le moins coûteux d'arrêter de répéter vos instructions.
- [ ] **Écrivez des impératifs sur ce qui n'est pas évident.** Commandes de build et de test, conventions qu'un nouvel arrivant manquerait, ce qui ne doit jamais être touché, la façon dont vous voulez que les résultats soient rapportés. Ne décrivez pas ce que le code montre déjà ; l'agent sait lire du code.
- [ ] **Restez bref.** Chaque ligne coûte des tokens à chaque tour et dilue celles qui comptent. Quelques centaines de lignes constituent un plafond. Déplacez le contenu rarement utile dans des skills chargés à la demande.
- [ ] **Utilisez les trois portées à bon escient.** `~/.claude/CLAUDE.md` pour votre façon de travailler partout, `<repo>/CLAUDE.md` pour le projet, et des fichiers par répertoire pour les sous-systèmes ayant leurs propres règles.
- [ ] **Promouvez la troisième correction.** La troisième fois que vous corrigez le même comportement dans le chat, il a sa place dans CLAUDE.md ou dans un hook. Le skill `claude-md-improver` passe le fichier en revue pour repérer les lignes périmées ou contradictoires.
- [ ] **Laissez la mémoire porter des faits, pas des règles.** La mémoire automatique de Claude Code enregistre des faits sur le projet et des préférences d'une session à l'autre. Élaguez les entrées devenues obsolètes ; une mémoire erronée est pire que pas de mémoire.

### Gestion du contexte

- [ ] **Surveillez le contexte comme un budget.** `/context` montre ce qui remplit la fenêtre. Les grosses sorties d'outils, les journaux collés et les schémas d'outils MCP chargés sont les coupables habituels.
- [ ] **Compactez aux frontières de phase, pas quand on vous y force.** Lancez `/compact` avec une note de ce qu'il faut garder : après l'exploration et avant l'implémentation, ou après un correctif et avant la vérification. Une compaction automatique à un moment arbitraire perd les détails dont vous aviez le plus besoin.
- [ ] **Ne collez jamais de journaux ; pointez vers eux.** Enregistrez la sortie dans un fichier et laissez l'agent la parcourir avec `grep` ou `tail`. Un journal collé une fois est facturé à chaque tour suivant.
- [ ] **Ne relisez pas un fichier que vous venez de modifier.** L'outil d'édition échoue bruyamment si sa cible a changé ; relire pour « vérifier » est donc un pur coût.
- [ ] **Préférez le texte aux captures d'écran.** Dans un navigateur, lire le texte de la page ou l'arbre d'accessibilité est moins coûteux et plus précis qu'une capture. Ne faites une capture que pour la mise en page.
- [ ] **Élaguez les serveurs MCP connectés.** Les schémas d'outils de chaque serveur peuvent entrer dans le contexte. Connectez ce dont la tâche a besoin et désactivez le reste ; le chargement différé des outils aide, mais moins de serveurs aide davantage.

### Skills, hooks et permissions

- [ ] **Transformez les procédures répétées en skills.** Un `SKILL.md` placé sous `~/.claude/skills/<name>/` ou dans le dépôt se charge via `/<name>` ou lorsque sa description correspond à la tâche. Étapes de déploiement, checklists de relecture et workflows propres à un dépôt y ont tous leur place.
- [ ] **Utilisez des hooks pour ce qui doit toujours se produire.** Les instructions sont probabilistes ; les hooks sont déterministes. Formater à l'enregistrement, bloquer `git push --force`, exiger un énoncé des faits avant les commandes shell. Ils se trouvent dans `settings.json`.
- [ ] **Construisez une liste d'autorisations.** Pré-approuvez les commandes de lecture seule (`git status`, `ls`, le lanceur de tests) dans `.claude/settings.json` pour que les demandes n'apparaissent que pour les actions qui le méritent. `/fewer-permission-prompts` analyse votre historique et propose la liste.
- [ ] **Utilisez des worktrees pour le travail en parallèle.** Un worktree git par tâche ou par agent évite que les modifications entrent en collision. Les sous-agents acceptent `isolation: "worktree"` ; votre propre session peut aussi en rejoindre un.
- [ ] **Apprenez le clavier.** Shift+Tab fait défiler les modes de permission et le mode plan ; Escape interrompt ; `/model`, `/cost`, `/clear`, `/compact` et `/context` couvrent l'essentiel des opérations quotidiennes. Réglez l'effort avec l'option `--effort` ou les commandes de modèle de l'application.

### Délégation aux sous-agents

- [ ] **Déléguez les recherches qui demandent beaucoup de lecture.** Lancez un agent explorateur en lecture seule pour balayer de nombreux fichiers et rapporter une conclusion avec des pointeurs `file:line`. Les extraits de fichiers restent dans son contexte, pas dans le vôtre.
- [ ] **Donnez aux sous-agents un brief complet.** Ils ne voient pas votre conversation. Incluez l'objectif, les fichiers, les critères d'acceptation, les vérifications à exécuter, et l'instruction de ne pas poser de questions ni de vous rendre la tâche.
- [ ] **Dimensionnez le modèle selon la tâche.** Haiku pour les balayages mécaniques, Sonnet pour l'implémentation bornée, le modèle le plus puissant pour le jugement. Indiquez à chaque fois le modèle et la raison. (House rule)
- [ ] **Lancez les agents indépendants dans un seul message.** Lancer en série fait perdre du temps réel. Des agents qui ne partagent aucun fichier peuvent tourner ensemble et finir ensemble.
- [ ] **Définissez une seule fois les agents réutilisables.** Les fichiers d'agent dans `.claude/agents/*.md` portent le modèle, l'effort et les outils dans leur frontmatter ; seul le brief varie alors.

### Modèle et effort

- [ ] **Connaissez la gamme et les prix.** Voir le tableau des modèles dans la section API. Ce sont les rapports de prix qui dictent le routage : le modèle le plus puissant coûte dix fois Sonnet par token de sortie.
- [ ] **Ajustez l'effort avant de changer de modèle.** L'effort (de `low` à `max`) échange de la rigueur contre des tokens au sein d'un même modèle. `xhigh` est la valeur par défaut de Claude Code pour le code ; `low` convient au travail mécanique et à la plupart des sous-agents.
- [ ] **Un orchestrateur solide, des exécutants économiques.** La session qui détient la tâche et tranche tourne sur le modèle le plus puissant ; les agents qui font le travail borné tournent sur des modèles moins chers.
- [ ] **Le mode rapide, c'est le même modèle avec une surcharge.** `/fast` augmente la vitesse de sortie, pas la capacité. Utilisez-le pour les sessions interactives où la latence gêne, pas pour le travail par lots.

### Habitudes de vérification

- [ ] **Vos propres tests pendant le travail, la suite complète une seule fois à la fin.** Lancez uniquement les fichiers de test qui couvrent ce que vous modifiez ; lancez toute la suite comme vérification finale, et une nouvelle fois seulement si elle a échoué et que vous avez changé quelque chose. (House rule)
- [ ] **Demandez une preuve dans le message final.** Sortie de test, capture d'écran, résultat d'un `curl`. « Vérifié » et « terminé » sont deux états différents ; faites dire à l'agent lequel il a atteint.
- [ ] **Faites une relecture pour un second avis.** `/code-review` sur le diff pour les bugs, `/simplify` pour le nettoyage, `/security-review` avant de fusionner tout ce qui touche aux entrées, à l'authentification ou aux secrets.
- [ ] **Séparez l'auteur du relecteur.** Relisez dans une nouvelle session ou avec un autre agent. Celui qui a écrit le code partage ses angles morts.

## Pro

Orchestration, automatisation et gouvernance. Ces éléments supposent que vous faites déjà tout ce qui précède.

### Workflows multi-agents

- [ ] **Un producteur et un vérificateur indépendant, toujours.** Une étape produit, une étape distincte attaque le résultat et corrige ce qu'elle trouve. Ne laissez jamais le producteur vérifier son propre travail. (House rule)
- [ ] **Préférez un oracle déterministe à un juge modèle.** Tests, aller-retour, références exactes à l'octet, implémentation de référence. Quand l'exactitude est décidable, laissez le code trancher et confiez le travail à un modèle économique. (House rule)
- [ ] **Ouvrez chaque prompt d'agent par un préambule « settled ».** Le harnais relaie votre dernier message de chat aux sous-agents ; sans préambule, un agent lit un message conversationnel et s'arrête pour poser une question. Indiquez ce qu'il ne doit pas faire et quelles vérifications il doit exécuter. (House rule)
- [ ] **Protégez-vous des résultats factices.** Un agent dont la sortie structurée est rejetée peut renvoyer une ébauche valide mais vide, que le runtime compte comme un succès. Validez le fond dans le script, et lisez le journal avant de payer une nouvelle exécution. (House rule)
- [ ] **Un worktree par piste parallèle.** Les pistes ne tournent en parallèle que si elles ne partagent aucun fichier ni aucune mesure sensible au CPU ; sinon, l'une attend la fusion de l'autre. (House rule)
- [ ] **Cadrez selon le budget, pas selon l'ambition.** Vérifiez le quota avant de lancer, dites ce que l'exécution coûtera, rapportez la dépense par rapport au plafond à la fin. Un workflow bien cadré vaut mieux que trois workflows minces. (House rule)
- [ ] **Rapportez les décisions sous forme de preuves.** Quand une étape fait remonter une décision au propriétaire, présentez la mesure qui la tranche et les options avec leurs conséquences. Consignez la réponse et les affirmations qui n'ont pas résisté à la vérification. (House rule)
- [ ] **Utilisez l'outil Workflow pour une orchestration déterministe.** Un script avec des appels `pipeline`, `parallel` et `agent`, des phases et des sorties validées par schéma. Il ne s'exécute que si l'utilisateur y consent, car il peut dépenser les tokens de dizaines d'agents.

### Exécutions headless et planifiées

- [ ] **Utilisez le mode print pour les exécutions scriptées.** `claude -p "<prompt>"` est non interactif ; ajoutez `--output-format json` pour des résultats exploitables par une machine, `--allowedTools` pour restreindre, et `--bare` pour des exécutions CI minimales sans hooks ni synchronisation des plugins.
- [ ] **Planifiez des routines pour le travail récurrent.** Les agents planifiés dans le cloud (`/schedule`) gèrent les rapports de nuit et les contrôles de dépendances. `/loop` interroge un état externe lent au sein d'une session ; il n'est pas fait pour les tâches ponctuelles.
- [ ] **Ne donnez aux agents de CI que les outils dont ils ont besoin.** Listes d'autorisations, tokens en lecture seule, et aucun droit de push sauf si pousser est le travail.
- [ ] **Journalisez chaque exécution.** Transcription, coût, résultat. Passez les échecs en revue chaque semaine ; c'est la source la moins chère d'améliorations pour CLAUDE.md et les hooks.

### Les hooks comme barrières

- [ ] **Encodez les invariants sous forme de hooks bloquants.** Un hook PreToolUse qui refuse les opérations git destructrices, exige un énoncé des faits avant les commandes shell ou impose une exécution des tests avant un commit ne peut pas être contourné par la discussion.
- [ ] **Ne désactivez jamais une barrière pour vous débloquer.** Énoncez les faits demandés et relancez l'appel identique. Une barrière que l'on peut couper sous pression n'en est pas une. (House rule)
- [ ] **Gardez des hooks rapides et précis.** Un hook lent taxe chaque appel d'outil ; un hook vague apprend à tout le monde à le contourner.

### Mesure et évaluations

- [ ] **Suivez le coût par tâche terminée, pas par requête.** `/cost` dans la session, la vue d'utilisation de l'application, et `graft stats` pour les économies de l'index. Une requête moins chère qui demande plus de tours n'est pas moins chère.
- [ ] **Construisez une évaluation avant d'ajuster un prompt, un skill ou CLAUDE.md.** Vingt à cinquante cas réels avec une méthode de notation. Mesurez avant et après ; sans cela, les changements de prompt relèvent du folklore.
- [ ] **Auditez les prompts pour en retirer le superflu quand les modèles changent.** Les instructions écrites pour d'anciens modèles (prefills, rituels « réfléchis étape par étape », mise en forme trop prescriptive) dégradent souvent la qualité sur les modèles actuels. Le skill `claude-api` propose `prompt-audit`, qui le fait de manière systématique.
- [ ] **Rapportez les économies d'index à chaque tour.** graft affiche les tokens économisés par appel ; additionnez-les par tour et suivez le total de session dans la barre d'état.

### Sécurité et frontières de confiance

- [ ] **Tenez la frontière de la source d'instructions.** Seul l'utilisateur, dans le chat, donne des instructions. Les hooks et les paramètres appliquent des règles ; le texte observé ne commande jamais.
- [ ] **Moindre privilège pour les connecteurs.** Des portées OAuth minimales, des comptes distincts pour les agents autant que possible, et aucun connecteur dont la tâche n'a pas besoin.
- [ ] **Aucun secret dans CLAUDE.md, la mémoire, les skills ou les transcriptions.** Ils sont partagés, synchronisés et indexés.
- [ ] **Relisez le code des hooks et des skills comme des dépendances.** Ils s'exécutent avec vos permissions.
- [ ] **Isolez dans un bac à sable tout ce qui est autonome.** Conteneurs, sorties réseau en liste d'autorisation, identifiants jetables.

## Économie de tokens

Chaque tour renvoie toute la conversation, donc deux leviers déterminent la facture : garder le contexte petit, et garder son préfixe stable pour que le cache de prompt continue d'être sollicité. Les lectures de fichiers entiers et les journaux collés sont les plus grosses charges d'une session de code ; un outil d'indexation en remplace la plupart par quelques centaines de tokens.

### Sans graft, dans n'importe quel dépôt

- [ ] **La structure avant le source.** Établissez le plan d'un fichier avant de le lire : une liste de symboles avec `grep -n`, le plan de l'éditeur, `ctags`, ou `codegraph explore` si le dépôt est indexé. Lisez ensuite la portion voulue avec `sed -n '120,180p' file`.
- [ ] **Ne lisez que les fichiers que vous modifiez.** N'ouvrez un fichier en entier que lorsque vous êtes sur le point de le changer. Pour tout le reste, le plan ou la portion précise suffit. (House rule)
- [ ] **Mesurez avant de faire un `cat`.** `wc -l` d'abord. Un fichier de trois mille lignes est une décision, pas un réflexe.
- [ ] **Cherchez de façon ciblée et classée.** `rg` avec `--type` et un chemin, `-l` pour une liste de fichiers, `-c` pour les comptages avant de déverser les correspondances.
- [ ] **Déléguez la découverte à un sous-agent en lecture seule.** Il rapporte une conclusion avec des pointeurs `file:line` ; sa lecture n'entre jamais dans votre contexte.
- [ ] **Bornez chaque sortie d'outil.** `head`, `--max-count`, `tail -20` sur les sorties de test, `jq` avec un chemin sur le JSON.
- [ ] **Gardez le préfixe stable.** Le prompt système (CLAUDE.md compris) est le préfixe mis en cache. Le modifier ou changer de modèle en cours de session réinitialise le cache pour le reste de la session.
- [ ] **Vos propres tests pendant le travail, la suite complète une seule fois.** Lancer la suite complète en cours de tâche, c'est dépenser des tokens sur une sortie que vous ne lirez pas. (House rule)
- [ ] **Compactez avec une intention.** Dites ce qu'il faut garder et ce qu'il faut écarter. Une compaction qui garde le plan et abandonne l'exploration vaut mieux qu'une qui garde tout à moitié en mémoire.
- [ ] **Évitez les boucles de captures d'écran.** Une capture pour s'orienter, puis de l'extraction de texte. Des captures répétées de la même page sont la manière la plus coûteuse de la lire.

### Avec graft

graft maintient un répertoire `graft/` à la racine du dépôt : un graphe prégénéré de chaque symbole avec sa portée `file:line`, de qui appelle quoi, et de courtes fiches en prose par zone. Chaque requête coûte quelques centaines de tokens, ne demande aucune clé d'API, répond en moins d'une seconde et se rafraîchit avant de répondre, de sorte qu'elle décrit toujours le code tel qu'il est à l'instant, modifications non committées comprises.

- [ ] **Installez une fois par dépôt.** `npm i -g @nanonets/graft@latest`, puis `graft init` dans le dépôt. Avec npm 12 et versions ultérieures, les installations globales bloquent par défaut les scripts de build natifs, ce qui empêche graft de charger ses analyseurs ; relancez l'installation avec `--allow-scripts=` suivi des paquets que npm nomme dans son avertissement. Pour Claude Code, il écrit le fichier d'instructions, les hooks, la barre d'état et le câblage du serveur MCP ; `graft build` construit le graphe de câblage gratuit. `--deep` ajoute une carte des concepts par LLM ; ignorez-le sauf demande.
- [ ] **Un appel par question ; choisissez l'outil adapté.** Utilisez le tableau ci-dessous. La plupart des tâches ne demandent qu'un seul appel graft ; enchaîner les outils « en espérant plus » est la principale façon de gaspiller les économies.
- [ ] **`graft ask "<question>" --source` est le choix par défaut.** Des résultats classés avec l'essentiel de chaque définition en ligne, de sorte que vous obtenez le code voulu sans lecture supplémentaire. `--in <path>` restreint le périmètre ; `--full` seulement quand l'essentiel est trop mince pour agir.
- [ ] **`graft grep "<pattern>"` quand vous avez besoin de chaque occurrence.** Résultats regroupés par symbole englobant et classés par couplage. Cherchez un nom simple, pas une signature devinée ; en cas d'échec, élargissez le motif avant de recourir à un grep brut.
- [ ] **`graft skeleton <file>` avant de toucher à un fichier.** Les signatures seulement, environ 200 tokens, soit à peu près dix fois moins cher que de lire le fichier.
- [ ] **`graft callers <symbol> --depth 2` avant de changer une signature.** Des arêtes précalculées, pas une recherche textuelle. `--depth all` avant toute refonte ou modification multi-fichiers ; `--direction out` pour ce dont un symbole dépend.
- [ ] **`graft map` pour s'orienter dans un dépôt inconnu.** Lisez ensuite les fiches de nœuds centraux qu'il nomme. Ne parcourez pas chaque sous-système qu'il liste avec skeleton ou ask.
- [ ] **Ne redirigez jamais graft vers `head`, `tail` ou `sed -n`.** La sortie est déjà plafonnée et indique ce qu'elle a écarté. La tronquer fait perdre des résultats et la ligne d'économies dont le total de la barre d'état est extrait.
- [ ] **Faites confiance aux portées.** La liste `covers:` d'un nœud est générée à partir du source et fait foi. Ne rouvrez pas les fichiers pour la revérifier.
- [ ] **Rapportez ce que graft a économisé, à chaque tour.** Chaque outil s'ouvre par `[graft] tokens saved ≈ N`. Additionnez-les dans la réponse ; `graft stats` montre la répartition de la session.
- [ ] **Branchez-le sur la CI.** `graft check` échoue quand l'index est périmé ; `graft blast --format markdown` publie le rayon d'impact d'un diff en commentaire de PR avec un diagramme.
- [ ] **Dans les worktrees, interrogez depuis le checkout principal.** L'index s'y trouve. Les agents l'utilisent en lecture seule et modifient leur propre copie. (House rule)
- [ ] **Dans un monorepo, restreignez avec `--in <scope>/`.** Les résultats portent une étiquette de portée ; le classement est équitable entre sous-projets, mais restreindre économise tout de même des tokens.
- [ ] **Gardez graft à jour.** `graft version` compare la version installée avec npm ; `graft upgrade` l'applique. Redémarrez l'agent après la mise à jour. CodeGraph se met à jour avec `codegraph upgrade`, puis `codegraph sync` dans chaque dépôt indexé.

| Quand vous... | Utilisez | Appels |
|---|---|---|
| Faites de l'onboarding, « expliquer cette base de code » | `graft map`, puis lisez les fiches de nœuds centraux qu'il nomme | 1 |
| Comprenez un flux, « comment fonctionne X » | `graft ask "<flow>" --source` | 1 |
| Cherchez où placer une modification | `graft ask "where is <behaviour>" --source` | 1 |
| Modifiez un symbole que vous savez déjà nommer | `graft grep "<symbol>"`, modifiez à l'emplacement `file:line` | 1 |
| Renommez, supprimez, changez une signature | `graft callers <sym> --depth 2` d'abord | 1 |
| Refondez ou modifiez plusieurs fichiers | `graft callers <sym> --depth all` avant de modifier | 1 |
| Demandez « de quoi cela dépend-il ? » | `graft callers <sym> --direction out` | 1 |
| Cherchez chaque occurrence d'un motif | `graft grep "<literal>"` | 1 |
| Demandez « quelle est l'API de ce fichier ? » | `graft skeleton <file>` | 1 |
| Déboguez un échec dans la zone X | `graft ask "<symptom>" --source`, puis `callers` sur le suspect | 1 à 2 |
| Jugez le risque d'un diff avant fusion | `graft callers <changed sym> --depth 2` | 1 par symbole |

Quand le serveur MCP de graft est connecté, les mêmes outils apparaissent sous les noms `graft_find_code`, `graft_find_all`, `graft_file_api`, `graft_trace_calls`, `graft_repo_map` et `graft_check_freshness`. Chargez-les en un seul appel `ToolSearch`, jamais un par un.

### CodeGraph comme autre index

- [ ] **Si `.codegraph/` existe, utilisez-le avant grep.** `codegraph explore "<question>"` renvoie en un seul appel le source des symboles pertinents ainsi que les chemins d'appel entre eux ; `callers`, `callees`, `impact` et `affected` couvrent le reste. Ne lancez pas `codegraph init` sur le dépôt de quelqu'un d'autre ; l'indexation est une décision du propriétaire.
- [ ] **Choisissez un seul index principal par dépôt.** Les deux outils donnent la structure avant le source ; faire tourner les deux double les schémas d'outils dans le contexte.

## Optimisation de l'usage des modèles

Trois leviers, dans l'ordre : la taille du contexte (section précédente), l'effort, le niveau de modèle. Jugez au coût par tâche terminée. Un modèle moins cher qui demande plus de tours, plus d'essais ou une correction humaine n'est pas moins cher.

### Routage par type de tâche

| Type de tâche | Modèle | Effort | Pourquoi |
|---|---|---|---|
| Balayages grep, analyse de journaux, application d'un renommage à partir d'une table connue, mise en forme, code répétitif, extraction de faits d'un fichier connu | Haiku 4.5 | faible | Fort volume, peu de jugement ; les erreurs sont peu coûteuses et visibles |
| Un composant ou un test selon une spécification, une étape de migration documentée, des mises à jour de documentation, des résumés de changelog, une première relecture | Sonnet 5.5 | moyen (par défaut) | Des critères d'acceptation clairs limitent les dégâts d'une mauvaise réponse |
| Décisions d'architecture et de conception, migrations ambiguës, débogage de cause racine, revue de sécurité, vérification adverse, jugement final sur la production des autres agents | Opus 5.5, ou le modèle le plus puissant de la session quand le quota le permet | élevé ou xhigh | Une mauvaise réponse est coûteuse à détecter et à annuler |
| La session interactive qui détient toute la tâche | Le modèle le plus puissant disponible | xhigh (défaut de Claude Code) | Elle tranche et rédige les briefs de tous les autres |

### Sans graft

- [ ] **Un orchestrateur solide, des exécutants économiques.** La session ou le script qui détient la tâche tourne sur le modèle le plus puissant ; tout ce qui est borné tourne sur Sonnet ou Haiku.
- [ ] **Resserrez le brief pour qu'un modèle moins cher n'ait pas à explorer.** L'exploration est l'endroit où les modèles économiques brûlent des tours et se trompent. Avec des pointeurs `file:line` et des critères d'acceptation, Sonnet fait ce qu'Opus ferait.
- [ ] **Baissez l'effort avant de baisser de niveau.** Mesurez sur un échantillon de tâches réelles. Le modèle le plus récent à faible effort égale souvent un modèle plus ancien à effort élevé.
- [ ] **Ne rétrogradez jamais le vérificateur.** La vérification est l'endroit où les mauvaises réponses coûtent le plus cher. Lancez-la sur le modèle le plus puissant que votre quota permet, et vérifiez l'usage avant de lancer. (House rule)
- [ ] **Évitez les cascades qui fragmentent le cache.** Les caches de prompt sont propres à chaque modèle. Une cascade multi-modèles dans une application API renonce à la réutilisation du cache entre ses modèles ; un seul modèle à l'effort réglé l'emporte généralement.
- [ ] **N'héritez du modèle de la session que si la tâche exige le niveau le plus élevé.** Donnez aux étapes ce dont elles ont besoin par défaut, pas ce qui fait tourner le workflow. (House rule)

### Avec graft

- [ ] **Laissez graft explorer, puis descendez d'un niveau.** `graft ask --source` renvoie des portées exactes avec l'essentiel en ligne, si bien qu'un agent Sonnet peut modifier ce pour quoi il fallait auparavant Opus afin de le trouver.
- [ ] **Donnez à Haiku la carte, pas la recherche.** `graft callers <sym> --depth all` est la liste complète des sites d'un renommage. Donnez cette liste à un agent Haiku pour l'appliquer mécaniquement ; ne lui demandez pas de la découvrir.
- [ ] **Baissez l'effort sur les recherches appuyées par graft.** Il faut moins d'appels d'outils, donc une délibération supplémentaire rapporte peu.
- [ ] **Gardez les résultats d'outils petits pour garder le cache chaud.** Les sorties de graft sont plafonnées ; les lectures de fichiers entiers sont les grosses charges qui chassent le contexte stable de la fenêtre.
- [ ] **Dépensez les économies en vérification.** Si graft économise des dizaines de milliers de tokens par session, c'est le budget d'un vérificateur plus puissant, pas d'une exploration supplémentaire.

## Chat claude.ai et Projects

- [ ] **Un Project par domaine.** Les instructions du Project portent le contexte permanent ; les connaissances du Project portent les documents. Les deux se chargent sans être collés dans chaque chat.
- [ ] **Commencez par un plan, puis développez section par section.** Les longues réponses d'un seul jet cachent les problèmes de structure jusqu'à la fin.
- [ ] **Montrez la sortie que vous voulez.** Un court exemple du format, du ton ou du tableau vaut mieux que trois paragraphes pour le décrire.
- [ ] **Demandez les sources et vérifiez-les.** Pour les faits, les dates et les chiffres, demandez d'où ils viennent et vérifiez avant de les réutiliser.
- [ ] **Utilisez des artifacts pour tout ce que vous réutiliserez ou partagerez.** Documents, pages, diagrammes et petits outils sont préférables sous forme d'artifacts plutôt que de texte de chat.
- [ ] **Passez à Claude Code quand la tâche touche des fichiers.** Dépôts, terminaux, navigateurs et tout ce qui doit être vérifié en l'exécutant relèvent de Code, pas du chat.
- [ ] **Utilisez la mémoire et les styles à bon escient.** La mémoire doit contenir des faits stables sur vous et votre travail ; les styles doivent encoder le ton que vous demandez sans cesse.
- [ ] **Ouvrez un nouveau chat quand le sujet change.** Les longs chats ont le même coût de contexte que les longues sessions.

## Construire avec l'API et les SDK

Pour les équipes qui intègrent Claude dans leur propre produit. Tout passe par un seul point d'accès, `POST /v1/messages` ; les outils, les sorties structurées et la mise en cache sont des fonctionnalités de ce point d'accès. Le skill `claude-api` dans Claude Code contient la référence à jour ; les éléments ci-dessous sont les habitudes.

### Choisir le niveau le plus simple

- [ ] **Un seul appel, puis un workflow, puis un agent.** La classification, l'extraction et le résumé tiennent en une seule requête. Les pipelines à plusieurs étapes dont la logique est pilotée par le code sont un workflow que vous orchestrez. Seul l'usage d'outils ouvert, piloté par le modèle, est un agent.
- [ ] **Quatre critères avant de construire un agent.** Complexité (plusieurs étapes, difficile à spécifier à l'avance), valeur (qui justifie le coût et la latence), viabilité (Claude est capable pour cette tâche), coût de l'erreur (peut-elle être détectée et rattrapée). Un « non » sur l'un d'eux signifie : restez plus simple.
- [ ] **Connaissez les quatre façons de construire un agent.** Une boucle manuelle que vous gérez ; le Tool Runner du SDK, qui boucle sur les outils que vous définissez ; Managed Agents, où Anthropic exécute la boucle et héberge le bac à sable ; et l'Agent SDK de Claude, qui est Claude Code sous forme de bibliothèque avec des outils intégrés. La première, la deuxième et la quatrième vous laissent le déploiement.

### Hygiène des requêtes

- [ ] **Utilisez par défaut l'Opus actuel avec la réflexion adaptative.** `claude-opus-5-5` sauf si l'utilisateur nomme un autre modèle. La réflexion reste activée ; réglez la profondeur avec `output_config.effort`, et définissez-la explicitement, car la valeur par défaut sur Opus 5.5 est `medium`.
- [ ] **Diffusez en streaming tout ce qui est long.** Ne sous-estimez pas `max_tokens` : environ 16k sans streaming, 64k avec streaming. Utilisez l'assistant de message final du SDK quand vous n'avez pas besoin des événements individuels.
- [ ] **Ni prefill ni choix d'outil forcé sur les modèles actuels.** Les deux renvoient une erreur 400 sur la gamme 5.x. Utilisez plutôt les sorties structurées (`output_config.format`) et les outils `strict: true`.
- [ ] **Vérifiez `stop_reason` avant de lire le contenu.** `refusal`, `max_tokens`, `pause_turn` et `tool_use` demandent chacun un traitement. Activez les solutions de repli côté serveur sur les modèles 5.x pour qu'un refus de sécurité soit routé vers un modèle de repli.
- [ ] **Utilisez les assistants et les types du SDK.** N'écrivez pas à la main la boucle d'outils, la promesse de streaming ni les types de messages. Interceptez une chaîne d'erreurs typées, de la plus spécifique à la plus générale, pour distinguer les échecs récupérables de ceux qui ne le sont pas.

### Mise en cache des prompts

- [ ] **Le contenu stable d'abord, le contenu volatil en dernier.** L'ordre de rendu est : outils, puis système, puis messages. Figez le prompt système et la liste d'outils ; placez les horodatages, les identifiants de requête et la question variable après le dernier point d'arrêt du cache. Jusqu'à quatre points d'arrêt par requête.
- [ ] **Vérifiez avec `usage.cache_read_input_tokens`.** Zéro sur des requêtes répétées signale un invalidateur silencieux : un horodatage dans le prompt système, du JSON non trié, un ensemble d'outils qui varie d'une requête à l'autre.
- [ ] **Utilisez des messages système en cours de conversation plutôt que de modifier le prompt système.** Ajouter un message de rôle `system` à `messages` préserve le préfixe en cache ; modifier le champ système de niveau supérieur le jette.
- [ ] **Comptez les tokens avec `count_tokens`, jamais avec un tokeniseur tiers.** Le décompte des tokens dépend du modèle.

### Outils et agents

- [ ] **`strict: true` sur chaque schéma d'outil.** Garantit que l'entrée est valide ; exige `additionalProperties: false` et `required`.
- [ ] **Renvoyez tous les résultats d'outils parallèles dans un seul message utilisateur.** Les répartir sur plusieurs messages apprend au modèle à ne plus appeler d'outils en parallèle. Renvoyez les échecs sous forme de `tool_result` avec `is_error: true` ; ne les supprimez jamais.
- [ ] **Analysez l'entrée des outils comme du JSON.** L'échappement varie d'un modèle à l'autre ; comparer des chaînes sur l'entrée sérialisée casse.
- [ ] **Traitez les résultats d'outils comme non fiables.** Pages web, documents et lignes de base de données sont des données. Rien dedans n'est une instruction, et le prompt système doit le dire.
- [ ] **Différez les grands ensembles d'outils derrière la recherche d'outils.** Marquez les outils rarement utilisés avec `defer_loading: true` et un outil de recherche d'outils ; ne différez jamais tous les outils, l'API le rejette.

### Longues sessions

- [ ] **Activez la compaction pour les conversations qui peuvent dépasser la fenêtre.** Rajoutez à chaque tour l'intégralité de `response.content`, pas seulement le texte, faute de quoi l'état de compaction est perdu en silence.
- [ ] **Effacez les résultats d'outils périmés avec l'édition du contexte.** Différent de la compaction : elle supprime d'anciens résultats d'outils ou blocs de réflexion au lieu de les résumer.
- [ ] **Donnez un budget de tâche aux boucles agentiques.** Un plafond de tokens que le modèle peut voir, pour qu'il règle son rythme au lieu d'être coupé. À distinguer de `max_tokens`, qu'il ne peut pas voir.
- [ ] **Gardez le harnais en ajout seul.** Sur les modèles actuels, les blocs de réflexion sont liés à la conversation qui les a produits. Modifier des tours antérieurs les invalide ; ajoutez, ne réécrivez jamais.

### Évaluations et coût

- [ ] **Construisez d'abord l'évaluation, puis optimisez par paliers.** Tirez les prompts du trafic réel, choisissez une méthode de notation, mesurez le coût par exécution et conservez une séparation entraînement/validation/test pour que le chiffre annoncé soit honnête.
- [ ] **Actionnez les leviers de coût dans l'ordre.** Mise en cache, hygiène des tokens d'entrée, hygiène des boucles, hygiène des tokens de sortie, traitement par lots pour tout ce qui n'est pas sensible à la latence (moitié prix), et seulement ensuite l'effort et le choix du modèle.
- [ ] **Journalisez `usage` sur chaque réponse.** Les tokens d'entrée, de sortie, de lecture et d'écriture du cache par requête sont le seul moyen de savoir ce qu'un changement a fait à la facture.
- [ ] **Traitez par lots ce qui peut attendre.** L'API Message Batches s'exécute de façon asynchrone à moitié prix ; indexez les résultats par `custom_id`, jamais par position.

### Modèles actuels

| Modèle | ID | Contexte | Entrée par MTok | Sortie par MTok |
|---|---|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` | 1M | $10.00 | $50.00 |
| Claude Opus 5.5 | `claude-opus-5-5` | 1M | $4.00 | $20.00 |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | 1M | $2.00 | $10.00 |
| Claude Haiku 4.5 | `claude-haiku-4-5` | 200K | $1.00 | $5.00 |

Tarifs de l'API officielle en septembre 2026. Les lectures de cache sur les modèles actuels coûtent une petite fraction du prix d'entrée (2,5 % à 10 %), ce qui explique pourquoi un préfixe stable compte plus que n'importe quel autre levier. Utilisez les ID exacts ci-dessus, sans suffixe de date.

## Règles maison

Les règles de travail que Marc a fixées pour les agents, conservées dans `~/.claude/CLAUDE.md` pour que chaque session et chaque sous-agent les charge. Elles sont reprises ici pour que l'équipe lise le même texte. Les dates sont celles de la mise en place de chaque règle.

### Choix du modèle pour les agents et workflows lancés (2026-09-09, renforcé le 2026-09-17)

- [ ] **Ne dépensez pas trop sur les workflows ; c'est une règle stricte.** Choisissez le modèle et l'effort selon le type de tâche. Ne surdimensionnez jamais une tâche simple, ne sous-dimensionnez jamais une tâche difficile.
- [ ] **Dimensionnez chaque étape selon ses besoins.** Ne reprenez jamais par défaut, pour chaque étape, le modèle de l'orchestrateur ni l'effort maximal sous prétexte que c'est ce qui fait tourner le workflow.
- [ ] **Haiku, effort faible** pour le travail mécanique, à fort volume et sans grand jugement : balayages grep, analyse de journaux, application d'un renommage à partir d'une table connue, mise en forme, code répétitif, extraction de faits d'un fichier connu.
- [ ] **Sonnet, effort par défaut** pour l'implémentation et la recherche bornées avec des critères d'acceptation clairs : un composant ou un test selon une spécification, une étape de migration documentée, des mises à jour de documentation, des résumés de changelog, une première relecture.
- [ ] **Opus ou le modèle le plus puissant de la session, effort élevé** là où une mauvaise réponse coûte cher : décisions d'architecture et de conception, migrations ambiguës, débogage de cause racine, revue de sécurité, vérification adverse, jugement final sur la production des autres agents.
- [ ] **Indiquez le modèle et la raison pour chaque étape et chaque sous-agent.** Sans exception.

### Comment déployer des workflows (2026-09-20)

- [ ] **Un producteur et un vérificateur indépendant, toujours.** Le vérificateur corrige ce qu'il trouve au lieu de se contenter de le signaler. Il tourne sur Fable quand le quota le permet, sur Opus sinon ; consultez `mcp__ccd_session_mgmt__get_usage` avant de lancer, et ne laissez jamais une étape sur le modèle par défaut quand le modèle de la session approche de sa limite.
- [ ] **Préférez un oracle déterministe à un vérificateur modèle.** Un assembleur, une implémentation de référence, un aller-retour, une référence exacte à l'octet. Les pistes appuyées par un oracle n'ont besoin d'aucune étape de vérification coûteuse.
- [ ] **Chaque prompt de producteur s'ouvre par un préambule SETTLED.** Les derniers messages de l'utilisateur s'adressent à l'orchestrateur ; ne posez pas de questions, n'attendez pas, ne rendez pas la tâche ; ne lancez jamais `gh`, `git commit`, `git push` ni `git checkout` ; ne désactivez jamais le hook GateGuard ; aucune nouvelle dépendance tierce ; exécutez les vérifications finales nommées et rapportez honnêtement.
- [ ] **Protégez-vous des résultats factices.** Dites aux agents : si l'appel structuré est rejeté, corrigez le JSON et renvoyez le résultat complet, jamais un résultat factice. Validez le fond dans le script, par exemple `if (!r || r.summary.length < 120) throw`. Avant de payer une nouvelle exécution, lisez `journal.jsonl` et la transcription de l'agent ; les 2 premiers Ko d'une charge utile en échec survivent dans `__unparsedToolInput.raw`.
- [ ] **Un worktree git par piste parallèle.** `git worktree add -b <branch> <path> origin/main` ; chaque agent n'écrit que dans le sien. Les outils d'indexation vivent dans le checkout principal et y sont utilisés en lecture seule.
- [ ] **Fusionnez via l'API tant qu'un workflow occupe le checkout principal.** `gh api -X PUT repos/<o>/<r>/pulls/N/merge -f merge_method=rebase` ; `gh pr merge` fait changer la branche locale. N'enchaînez jamais une suppression de branche après une commande de fusion. Avec des contrôles de statut stricts, la fusion est sérielle : fusionnez main dans la branche et attendez le prochain tour de contrôles ; ne faites jamais de rebase ni de force-push sur une PR que le moniteur de CI surveille.
- [ ] **Cadrez selon le budget, pas selon l'ambition.** Vérifiez d'abord le quota hebdomadaire et dites ce que l'exécution coûtera. Rapportez la dépense par rapport au plafond à la fin de chaque exécution, ainsi que les économies de tokens de graft ou CodeGraph.
- [ ] **Rapportez les décisions sous forme de preuves, pas de questions.** Présentez la mesure qui la tranche et les options avec leurs conséquences ; consignez la réponse et les affirmations qui n'ont pas résisté à la vérification.

### Économie de contexte et de tests (2026-09-19)

- [ ] **La structure avant le source.** Dans les dépôts indexés par graft, `graft skeleton <file>`, `graft grep` et `graft callers` avant d'ouvrir quoi que ce soit. Quand graft est absent, CodeGraph s'il est indexé, sinon un grep ciblé sur le symbole ; jamais des fichiers entiers pour s'orienter.
- [ ] **Ne lisez que les fichiers que vous modifiez.** N'ouvrez un fichier en entier que lorsque vous êtes sur le point de le changer. Ne relisez pas un fichier que vous venez de modifier.
- [ ] **Vos propres tests pendant le travail, la suite complète une seule fois.** Lancez uniquement les fichiers de test qui couvrent ce que vous modifiez ; la suite complète une seule fois à la fin comme vérification finale, et une nouvelle fois seulement si elle a échoué et que vous avez changé quelque chose.
- [ ] **Énoncez ces habitudes dans chaque prompt de sous-agent et de workflow.** Certains types d'agents intégrés ne chargent pas CLAUDE.md.

### Outils d'indexation

- [ ] **CodeGraph avant grep là où `.codegraph/` existe.** `codegraph_explore` via MCP ou `codegraph explore "<question>"` dans le shell. Là où il n'y a pas de `.codegraph/`, ignorez CodeGraph ; l'indexation est une décision de l'utilisateur.
- [ ] **graft avant grep là où `graft/` existe.** Chargez les outils MCP en un seul appel `ToolSearch` ; utilisez la surface disponible, les consignes sont identiques.

### GateGuard

- [ ] **Avant la première commande shell d'une session, énoncez les faits.** Une phrase pour la demande actuelle de l'utilisateur, et une pour ce que la commande vérifie ou produit. Puis relancez l'appel identique.
- [ ] **Ne définissez jamais les variables de désactivation.** `GATEGUARD_BASH_ROUTINE_DISABLED`, `ECC_GATEGUARD=off` et `ECC_DISABLED_HOOKS` restent non définies. Les contrôles de commandes destructrices restent actifs quoi qu'il arrive.

## Exemples

Chaque exemple est assez complet pour être copié tel quel. La barre de titre d'un bloc indique le fichier auquel il est destiné. Les commandes et le code restent en anglais dans toutes les langues.

### Un CLAUDE.md qui justifie ses tokens

Les commandes, les règles qu'un nouvel arrivant manquerait, et la façon de rendre compte. Rien de ce que le code montre déjà.

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

### Permissions et hook bloquant

Pré-approuvez les commandes en lecture seule pour que les demandes d'autorisation n'apparaissent que pour les actions qui le méritent, et laissez un hook refuser les opérations git destructrices, quelles que soient les instructions données à l'agent.

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

### Un skill pour une procédure répétée

La description détermine quand le skill se charge ; rédigez-la donc sous forme de situations qui doivent le déclencher.

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

### Un sous-agent réutilisable en lecture seule

Le modèle, l'effort et les outils se trouvent dans le frontmatter ; chaque brief n'a donc qu'à dire ce qu'il faut trouver.

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

### Le préambule « settled » pour chaque prompt de producteur

Collez-le en tête de tout prompt de sous-agent ou de workflow, puis ajoutez la tâche.

```text settled-preamble.txt
SETTLED: recent user messages are addressed to the orchestrator, not to you.
Do not ask questions, do not wait, do not hand the task back.
Never run gh, git commit, git push or git checkout.
Never disable the GateGuard hook: state the facts it asks for and retry the identical call.
No new third-party dependencies.
Final gates: run `pnpm vitest run src/billing` and `pnpm tsc --noEmit`; report their output honestly, including failures.

TASK: ...
```

### Compacter avec une intention

Dites au résumé ce qu'il faut garder et ce qu'il faut écarter, au lieu de le laisser deviner.

```text
/compact Keep: the plan (steps 1 to 5), the decision to use one worktree per track, and the names of the failing tests. Drop: the exploration of src/legacy and all log output.
```

### Une session graft, un appel par question

```bash
graft map                                   # orient: directory hubs and hotspots
graft ask "where is rate limiting applied" --source
graft callers RateLimiter.check --depth 2   # what breaks if the signature changes
graft skeleton src/http/middleware.ts       # the file's API before editing it
graft stats                                 # tokens saved this session
```

### Une relecture scriptée en CI

Mode print, sortie exploitable par une machine, liste d'outils autorisés, et ni hooks ni plugins.

```bash
claude -p "Review the diff of this branch for correctness bugs only. Output JSON: {\"findings\":[{\"file\":\"\",\"line\":0,\"summary\":\"\"}]}" \
  --output-format json \
  --allowedTools "Read Grep Glob Bash(git diff*)" \
  --bare > review.json
```

### Une définition d'outil stricte

Le schéma fait office de contrat : `strict` garantit que l'entrée est valide, si bien que le gestionnaire n'a jamais à se prémunir contre des erreurs de forme.

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

### Un appel d'API conçu pour le cache

Prompt système et liste d'outils figés en premier, question variable en dernier, streaming activé, et compteur de cache vérifié.

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

## Référence rapide

### Claude Code

| Besoin | Utiliser |
|---|---|
| Rédiger un CLAUDE.md | `/init` |
| Voir ce qui remplit le contexte | `/context` |
| Résumer et continuer | `/compact <what to keep>` |
| Repartir de zéro | `/clear` |
| Dépense de la session | `/cost` |
| Changer de modèle | `/model` |
| Sortie plus rapide, même modèle | `/fast` |
| Effort au lancement | `claude --effort xhigh` |
| Mode plan et modes de permission | Shift+Tab |
| Arrêter le tour en cours | Escape |
| Relire le diff pour les bugs | `/code-review` |
| Nettoyer le diff | `/simplify` |
| Passe de sécurité sur la branche | `/security-review` |
| Moins de demandes d'autorisation | `/fewer-permission-prompts` |
| Exécution scriptée | `claude -p "<prompt>" --output-format json --allowedTools "Read Grep"` |
| Exécution récurrente dans le cloud | `/schedule` |
| Interroger un état externe lent | `/loop` |

### graft

| Besoin | Utiliser |
|---|---|
| Installer et brancher sur le dépôt | `npm i -g @nanonets/graft@latest` puis `graft init` |
| S'orienter dans un dépôt inconnu | `graft map` |
| Comprendre ou localiser | `graft ask "<question>" --source` |
| Chaque occurrence | `graft grep "<name>"` |
| L'API d'un fichier | `graft skeleton <file>` |
| Qui appelle, rayon d'impact | `graft callers <sym> --depth 2`, `--depth all`, `--direction out` |
| Contrôle de fraîcheur en CI | `graft check` |
| Commentaire de risque sur une PR | `graft blast --format markdown` |
| Économies de la session | `graft stats` |

### CodeGraph

| Besoin | Utiliser |
|---|---|
| Symboles et chemins d'appel en un seul appel | `codegraph explore "<question>"` |
| Un symbole ou un fichier avec numéros de ligne | `codegraph node <name>` |
| Appelants, appelés, impact | `codegraph callers <sym>`, `codegraph callees <sym>`, `codegraph impact <sym>` |
| Tests concernés par les fichiers modifiés | `codegraph affected <files>` |

### Paramètres d'API à retenir

| Besoin | Utiliser |
|---|---|
| Profondeur de réflexion | `output_config.effort` : `low`, `medium`, `high`, `xhigh`, `max` |
| Sortie JSON structurée | `output_config.format` |
| Entrée d'outil validée | `strict: true` sur l'outil |
| Point d'arrêt du cache | `cache_control: {type: "ephemeral"}` (4 max) |
| Instruction de l'opérateur en cours de conversation | `{role: "system", content: ...}` dans `messages` |
| Longues conversations | bêta de compaction `compact-2026-01-12` |
| Boucles d'agent cadencées | `output_config.task_budget` avec la bêta `task-budgets-2026-03-13` |
| Travail asynchrone à moitié prix | API Message Batches |

## Sources

- Documentation de Claude Code : https://code.claude.com/docs
- Documentation de l'API Claude : https://docs.anthropic.com
- graft : https://www.npmjs.com/package/@nanonets/graft (le skill installé à l'emplacement `~/.claude/skills/graft/SKILL.md` est la référence opérationnelle)
- CodeGraph : `codegraph --help` et les instructions du serveur MCP `codegraph`
- Règles de travail de Marc : `~/.claude/CLAUDE.md`
