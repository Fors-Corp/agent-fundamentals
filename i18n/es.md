# Trabajar de forma profesional con Claude y los agentes de programación

Una lista de comprobación de los hábitos que separan el uso ocasional de Claude del uso profesional. Abarca Claude Code (CLI y aplicación de escritorio), el chat de claude.ai y la creación de agentes propios con la API de Claude y el Agent SDK. Las tres primeras secciones son niveles: Básico, Intermedio y Pro. Las siguientes son temas transversales a los niveles: economía de tokens, enrutado de modelos, chat, la API y las reglas de la casa con las que trabaja este equipo.

Cómo usarla: marcar lo que ya se hace de forma constante. Lo que quede sin marcar es la siguiente habilidad que desarrollar. Los elementos marcados como **Regla de la casa** proceden de las reglas de trabajo de Marc, que los agentes cargan desde `~/.claude/CLAUDE.md`; se reproducen íntegras en la sección Reglas de la casa para que el equipo lea el mismo texto que los agentes. Todo lo demás es práctica general.

Última revisión: 2026-10-02. Verificada con Claude Code 2.1, graft 0.21.1, CodeGraph 1.6.1, Vercel CLI 62.2 y la gama de modelos de la API de Claude de septiembre de 2026.

## Básico

Los hábitos que importan desde la primera sesión. Ninguno requiere configuración.

### Antes de escribir

- [ ] **Redactar la tarea como un ticket.** Indicar en un solo mensaje el objetivo, las restricciones y qué significa «terminado». Los agentes rellenan los huecos con suposiciones, y los criterios de aceptación que se omiten son los que se suponen mal.
- [ ] **Señalar el contexto en lugar de pegarlo.** Nombrar los archivos, funciones, mensajes de error o URL. El agente los lee por sí mismo con menos tokens que un muro de texto pegado, y lee la versión actual en lugar de una copia obsoleta.
- [ ] **Indicar qué no se debe tocar.** Archivos fuera del alcance, interfaces públicas, migraciones, cualquier cosa con una dependencia de despliegue. Una frase de alcance ahorra una hora de deshacer cambios.
- [ ] **Pedir primero un plan en cualquier tarea no trivial.** En Claude Code, pasar al modo plan con Shift+Tab; el agente lee y propone, pero no edita hasta que se apruebe. En el chat, pedir un esquema antes de la respuesta completa.
- [ ] **Una tarea por conversación.** Empezar de cero (`/clear`) para trabajo no relacionado. El contexto sobrante de la tarea anterior se paga en cada turno y confunde al modelo sobre lo que importa ahora.
- [ ] **Saber en qué superficie se está.** El chat sirve para pensar, redactar y analizar material pegado. Claude Code, para todo lo que toque archivos, un repositorio, un terminal o un navegador. La API, cuando se quiere el comportamiento dentro del propio producto.

### Durante la sesión

- [ ] **Leer lo que dice el agente antes de responder.** Cuando exponga una suposición, corregirla de inmediato. Confirmar tarde significa rehacer trabajo construido sobre una premisa errónea.
- [ ] **Responder a las preguntas con decisiones.** Si el agente se detiene a preguntar, necesita una decisión que solo corresponde a quien dirige. Darla y dejar que continúe; no responder a una pregunta con otra pregunta.
- [ ] **Interrumpir pronto.** Escape detiene el turno en curso. Si va en la dirección equivocada en el segundo paso, no esperar al noveno.
- [ ] **Hacer que ejecute sus propias comprobaciones.** Pedir que se ejecuten las pruebas, el verificador de tipos y el linter, y que se muestre la salida. «Las pruebas pasan» sin salida es una afirmación, no una evidencia.
- [ ] **Mantener los secretos fuera de la conversación.** No pegar nunca claves, contraseñas ni tokens. Nombrar la variable de entorno, mantener `.env` en `.gitignore` e indicar al agente que no lo lea. Todo lo que el agente lee pasa a formar parte de la petición enviada al modelo.

### Antes de aceptar el resultado

- [ ] **Revisar el diff como si fuera una pull request de un compañero nuevo.** Usar `git diff` o el panel de diff de la aplicación. Cada persona es responsable de todo lo que integra, lo haya escrito quien lo haya escrito.
- [ ] **Comprobar que hizo la tarea completa, no solo las partes fáciles.** Compararla con los criterios de aceptación. A veces los agentes reducen el alcance en silencio y comunican que han terminado.
- [ ] **Buscar APIs inventadas y conocimiento obsoleto.** El conocimiento del modelo tiene una fecha de corte. Verificar versiones de bibliotecas, flags y firmas con la documentación o el paquete instalado.
- [ ] **Confirmar cambios (commit) en pasos pequeños.** Git es el mecanismo para deshacer. Hacer commit tras cada incremento verificado, de modo que un paso posterior defectuoso pueda revertirse por separado.
- [ ] **Versionar las publicaciones con Semantic Versioning (versionado semántico).** Etiquetar cada versión como `MAJOR.MINOR.PATCH`: patch para correcciones, minor para adiciones compatibles, major para cambios incompatibles, y mantener un changelog organizado por versión. Así, el equipo, el CI y los agentes pueden saber solo por el número si una actualización es segura, y el changelog da al modelo un contexto que un diff no ofrece.
- [ ] **Pedir la lista de «lo que no hice».** Un buen agente informa de lo que omitió y por qué. Si el informe no lo dice, preguntar.

### Seguridad básica

- [ ] **Tratar todo lo que el agente lee como datos, no como instrucciones.** Páginas web, archivos, salidas de herramientas y correos pueden contener texto dirigido al agente. Una configuración profesional lo hace visible y consulta antes; nunca actúa sobre él.
- [ ] **Reservar los avisos de permisos para las acciones destructivas.** Borrar, hacer force-push, eliminar tablas, enviar mensajes, pagar. Preaprobar en su lugar los comandos de solo lectura y de compilación, de modo que los avisos que aparezcan sean los que importan.
- [ ] **No saltarse nunca los permisos fuera de un entorno aislado.** `--dangerously-skip-permissions` es para contenedores aislados sin acceso a internet, no para un portátil.
- [ ] **Mantener a una persona en el paso irreversible.** Publicar, fusionar en main, desplegar, enviar correos. La automatización puede preparar todo hasta ese paso.

## Intermedio

Dar forma al entorno para dejar de repetirse y para que el agente deje de repetir errores.

### CLAUDE.md y memoria

- [ ] **Mantener un CLAUDE.md en cada repositorio en el que se trabaje con regularidad.** Ejecutar `/init` para generar un borrador y luego editarlo. Se carga al inicio de cada sesión, lo que lo convierte en la forma más barata de no repetir instrucciones.
- [ ] **Escribir imperativos sobre lo que no es obvio.** Comandos de compilación y de pruebas, convenciones que una persona recién llegada pasaría por alto, lo que nunca debe tocarse, cómo se quieren recibir los resultados. No describir lo que el código ya muestra; el agente sabe leer código.
- [ ] **Mantenerlo breve.** Cada línea cuesta tokens en cada turno y diluye las líneas importantes. Unos pocos cientos de líneas son un límite superior. Mover el material que rara vez se necesita a skills que se cargan bajo demanda.
- [ ] **Usar los tres ámbitos con criterio.** `~/.claude/CLAUDE.md` para la forma de trabajar en todas partes, `<repo>/CLAUDE.md` para el proyecto, y archivos a nivel de directorio para subsistemas con reglas propias.
- [ ] **Promover la tercera corrección.** La tercera vez que se corrige el mismo comportamiento en el chat, pertenece a CLAUDE.md o a un hook. La skill `claude-md-improver` revisa el archivo en busca de líneas obsoletas o contradictorias.
- [ ] **Dejar que la memoria guarde hechos, no reglas.** La memoria automática de Claude Code registra hechos y preferencias del proyecto entre sesiones. Depurar las entradas que se queden obsoletas; una memoria errónea es peor que ninguna.

### Gestión del contexto

- [ ] **Vigilar el contexto como un presupuesto.** `/context` muestra qué está llenando la ventana. Las salidas grandes de herramientas, los logs pegados y los esquemas de herramientas MCP cargados suelen ser los culpables.
- [ ] **Compactar en los límites de fase, no cuando se esté obligado.** Ejecutar `/compact` con una nota sobre qué conservar: después de la exploración y antes de la implementación, o después de aplicar una corrección y antes de la verificación. La compactación automática en un punto arbitrario pierde los detalles que más se necesitaban.
- [ ] **No pegar nunca los logs; señalarlos.** Guardar la salida en un archivo y dejar que el agente use `grep` o `tail` sobre él. Un log pegado una vez se paga en todos los turnos posteriores.
- [ ] **No volver a leer un archivo recién editado.** La herramienta de edición falla de forma explícita si su objetivo cambió, así que releer para «verificar» es coste puro.
- [ ] **Preferir texto a capturas de pantalla.** En un navegador, leer el texto de la página o el árbol de accesibilidad es más barato y preciso que una captura. Capturar solo para el diseño visual.
- [ ] **Depurar los servidores MCP conectados.** Los esquemas de herramientas de cada servidor pueden entrar en el contexto. Conectar lo que la tarea necesita y desactivar el resto; la carga diferida de herramientas ayuda, pero tener menos servidores ayuda más.

### Skills, hooks y permisos

- [ ] **Convertir los procedimientos repetidos en skills.** Un `SKILL.md` bajo `~/.claude/skills/<name>/` o dentro del repositorio se carga con `/<name>` o cuando su descripción coincide con la tarea. Los pasos de despliegue, las listas de revisión y los flujos de trabajo específicos de un repositorio tienen aquí su sitio.
- [ ] **Usar hooks para lo que siempre debe ocurrir.** Las instrucciones son probabilísticas; los hooks son deterministas. Dar formato al guardar, bloquear `git push --force`, exigir una declaración de hechos antes de los comandos de shell. Viven en `settings.json`.
- [ ] **Construir una lista de permisos permitidos.** Preaprobar los comandos de solo lectura (`git status`, `ls`, el ejecutor de pruebas) en `.claude/settings.json` para que los avisos aparezcan solo ante acciones que lo merezcan. `/fewer-permission-prompts` analiza el historial y propone la lista.
- [ ] **Usar worktrees para el trabajo en paralelo.** Un git worktree por tarea o agente evita que las ediciones colisionen. Los subagentes aceptan `isolation: "worktree"`; la propia sesión también puede entrar en uno.
- [ ] **Aprender el teclado.** Shift+Tab alterna entre los modos de permisos y el modo plan; Escape interrumpe; `/model`, `/cost`, `/clear`, `/compact` y `/context` cubren la mayoría de las operaciones diarias. El esfuerzo se fija con el flag `--effort` o con los controles de modelo de la aplicación.

### Delegación en subagentes

- [ ] **Delegar las búsquedas que exigen mucha lectura.** Lanzar un agente explorador de solo lectura que recorra muchos archivos y devuelva una conclusión con referencias `file:line`. Los volcados de archivos se quedan en su contexto, no en el propio.
- [ ] **Dar a los subagentes un encargo completo.** No ven la conversación. Incluir el objetivo, los archivos, los criterios de aceptación, las comprobaciones que deben ejecutar y la instrucción de no hacer preguntas ni devolver la tarea.
- [ ] **Dimensionar el modelo según la tarea.** Haiku para barridos mecánicos, Sonnet para implementación acotada, el modelo superior para el criterio. Indicar en cada caso el modelo y el motivo. (House rule)
- [ ] **Lanzar los agentes independientes en un solo mensaje.** Lanzarlos en serie desperdicia tiempo real. Los agentes que no comparten archivos pueden ejecutarse a la vez y terminar a la vez.
- [ ] **Definir una sola vez los agentes reutilizables.** Los archivos de agente en `.claude/agents/*.md` llevan el modelo, el esfuerzo y las herramientas en su frontmatter, de modo que el encargo es lo único que varía.

### Modelo y esfuerzo

- [ ] **Conocer la gama y los precios.** Consultar la tabla de modelos en la sección de la API. Las proporciones de precio determinan el enrutado: el modelo superior cuesta cinco veces más que Sonnet por token de salida.
- [ ] **Ajustar el esfuerzo antes de cambiar de modelo.** El esfuerzo (de `low` a `max`) intercambia exhaustividad por tokens dentro de un mismo modelo. `xhigh` es el valor por defecto de Claude Code para programar; `low` es adecuado para trabajo mecánico y para la mayoría de los subagentes.
- [ ] **Orquestador potente, manos baratas.** La sesión que sostiene la tarea y toma las decisiones de criterio se ejecuta en el modelo superior; los agentes que hacen trabajo acotado se ejecutan en modelos más baratos.
- [ ] **El modo rápido es el mismo modelo con recargo.** `/fast` aumenta la velocidad de salida, no la capacidad. Usarlo en sesiones interactivas en las que la latencia perjudica, no en trabajo por lotes.

### Hábitos de verificación

- [ ] **Pruebas propias durante el trabajo, la suite completa una sola vez al final.** Ejecutar solo los archivos de prueba que cubren lo que se está cambiando; ejecutar la suite entera como control final, y de nuevo solo si esa ejecución falló y se cambió algo. (House rule)
- [ ] **Pedir pruebas en el mensaje final.** Salida de las pruebas, una captura de pantalla, un resultado de `curl`. Verificado y terminado son estados distintos; hacer que el agente diga cuál alcanzó.
- [ ] **Hacer una revisión de segunda opinión.** `/code-review` sobre el diff para buscar errores, `/simplify` para limpiar, `/security-review` antes de integrar cualquier cosa que toque entradas, autenticación o secretos.
- [ ] **Separar al autor del revisor.** Revisar en una sesión nueva o con otro agente. Quien escribió el código comparte sus puntos ciegos.

## Pro

Orquestación, automatización y gobernanza. Estos elementos presuponen que ya se hace todo lo anterior.

### Flujos de trabajo multiagente

- [ ] **Productor más verificador independiente, siempre.** Una etapa produce y otra distinta ataca el resultado y repara lo que encuentra. No dejar nunca que el productor revise su propio trabajo. (House rule)
- [ ] **Preferir un oráculo determinista a un juez basado en un modelo.** Pruebas, ida y vuelta (round-trips), referencias byte a byte, una implementación de referencia. Cuando la corrección es decidible, que decida el código y poner un modelo barato a hacer el trabajo. (House rule)
- [ ] **Abrir cada prompt de agente con un preámbulo de asunto cerrado.** El arnés retransmite el último mensaje del chat a los subagentes; sin el preámbulo, un agente lee un mensaje conversacional y se detiene a preguntar. Indicar qué no debe hacer y qué comprobaciones debe ejecutar. (House rule)
- [ ] **Protegerse contra los resultados de relleno.** Un agente cuya salida estructurada se rechaza puede reenviar un esbozo válido pero vacío, que el entorno de ejecución cuenta como éxito. Validar el contenido en el script y leer el journal antes de pagar una nueva ejecución. (House rule)
- [ ] **Un worktree por línea de trabajo en paralelo.** Las líneas se ejecutan en paralelo solo si no comparten archivos ni mediciones sensibles a la CPU; en caso contrario, una espera a la fusión de la otra. (House rule)
- [ ] **Acotar por presupuesto, no por ambición.** Comprobar la cuota antes de lanzar, decir cuánto costará la ejecución e informar del gasto frente al límite al final. Un flujo bien acotado vale más que tres endebles. (House rule)
- [ ] **Devolver las decisiones como evidencia.** Cuando una etapa plantea una decisión para quien es responsable, presentar la medición que la resuelve y las opciones con sus consecuencias. Registrar la respuesta y las afirmaciones que no superaron la verificación. (House rule)
- [ ] **Usar la herramienta Workflow para la orquestación determinista.** Un script con llamadas `pipeline`, `parallel` y `agent`, fases y salidas validadas por esquema. Solo se ejecuta cuando la persona usuaria lo acepta, porque puede gastar los tokens de decenas de agentes.

### Ejecuciones sin interfaz y programadas

- [ ] **Usar el modo de impresión para ejecuciones con script.** `claude -p "<prompt>"` no es interactivo; añadir `--output-format json` para resultados legibles por máquina, `--allowedTools` para restringir y `--bare` para ejecuciones mínimas de CI sin hooks ni sincronización de plugins.
- [ ] **Programar rutinas para el trabajo recurrente.** Los agentes programados en la nube (`/schedule`) se ocupan de informes nocturnos y comprobaciones de dependencias. `/loop` consulta periódicamente un estado externo lento dentro de una sesión; no sirve para tareas puntuales.
- [ ] **Dar a los agentes de CI solo las herramientas que necesitan.** Listas de permitidos, tokens de solo lectura y sin permiso de push salvo que hacer push sea el trabajo.
- [ ] **Registrar cada ejecución.** Transcripción, coste, resultado. Revisar los fallos cada semana; son la fuente más barata de mejoras para CLAUDE.md y los hooks.

### Hooks como barreras

- [ ] **Codificar las invariantes como hooks bloqueantes.** Un hook PreToolUse que rechace git destructivo, que exija una declaración de hechos antes de los comandos de shell o que requiera una ejecución de pruebas antes de un commit no se puede eludir con argumentos.
- [ ] **No desactivar nunca una barrera para desbloquearse.** Exponer los hechos que pide y repetir la misma llamada. Una barrera que puede apagarse bajo presión no es una barrera. (House rule)
- [ ] **Mantener los hooks rápidos y específicos.** Un hook lento grava cada llamada a herramienta; uno vago enseña a todos a saltárselo.

### Medición y evaluaciones

- [ ] **Medir el coste por tarea completada, no por petición.** `/cost` en la sesión, la vista de uso de la aplicación y `graft stats` para el ahorro del índice. Una petición más barata que necesita más turnos no es más barata.
- [ ] **Construir una evaluación antes de ajustar un prompt, una skill o CLAUDE.md.** Entre veinte y cincuenta casos reales con un método de calificación. Medir antes y después; sin eso, los cambios de prompt son folclore.
- [ ] **Revisar los prompts en busca de lastre cuando cambian los modelos.** Las instrucciones escritas para modelos anteriores (prefills, rituales de «piensa paso a paso», formato excesivamente prescriptivo) a menudo reducen la calidad en los actuales. La skill `claude-api` incluye `prompt-audit`, que lo hace de forma sistemática.
- [ ] **Informar del ahorro del índice en cada turno.** graft imprime los tokens ahorrados por llamada; sumarlos por turno y seguir el total de la sesión en la línea de estado.

### Seguridad y límites de confianza

- [ ] **Mantener el límite de la fuente de instrucciones.** Solo la persona usuaria en el chat da instrucciones. Los hooks y los ajustes hacen cumplir; el texto observado nunca da órdenes.
- [ ] **Mínimo privilegio para los conectores.** Ámbitos OAuth mínimos, cuentas separadas para los agentes cuando sea posible y ningún conector que la tarea no necesite.
- [ ] **Sin secretos en CLAUDE.md, la memoria, las skills ni las transcripciones.** Se comparten, se sincronizan y se indexan.
- [ ] **Revisar el código de hooks y skills como se revisan las dependencias.** Se ejecutan con los permisos de quien los usa.
- [ ] **Aislar todo lo autónomo.** Contenedores, salida de red restringida por lista de permitidos y credenciales desechables.

## Economía de tokens

Cada turno reenvía toda la conversación, así que dos palancas deciden la factura: mantener el contexto pequeño y mantener estable su prefijo para que la caché de prompts siga acertando. Las lecturas de archivos completos y los logs pegados son las cargas más grandes de una sesión de programación; una herramienta de índice sustituye a la mayoría de ellas por unos cientos de tokens.

### Sin graft, en cualquier repositorio

- [ ] **Estructura antes que código.** Esquematizar un archivo antes de leerlo: una lista de símbolos con `grep -n`, el esquema del editor, `ctags` o `codegraph explore` cuando el repositorio está indexado. Después, leer el tramo necesario con `sed -n '120,180p' file`.
- [ ] **Leer solo los archivos que se editan.** Abrir un archivo completo solo cuando se vaya a modificar. Para todo lo demás basta el esquema o el tramo concreto. (House rule)
- [ ] **Medir antes de hacer `cat`.** Primero `wc -l`. Un archivo de tres mil líneas es una decisión, no un reflejo.
- [ ] **Buscar de forma acotada y ordenada.** `rg` con `--type` y una ruta, `-l` para una lista de archivos, `-c` para recuentos antes de volcar coincidencias.
- [ ] **Delegar el descubrimiento en un subagente de solo lectura.** Devuelve una conclusión con referencias `file:line`; su lectura nunca entra en el contexto propio.
- [ ] **Acotar toda salida de herramientas.** `head`, `--max-count`, `tail -20` en la salida de las pruebas, `jq` con una ruta en JSON.
- [ ] **Mantener estable el prefijo estable.** El prompt de sistema (incluido CLAUDE.md) es el prefijo en caché. Editarlo o cambiar de modelo a mitad de sesión reinicia la caché durante el resto de la sesión.
- [ ] **Pruebas propias durante el trabajo, la suite completa una sola vez.** Una ejecución completa de la suite a mitad de tarea son tokens gastados en una salida que no se leerá. (House rule)
- [ ] **Compactar con intención.** Indicar qué conservar y qué descartar. Una compactación que conserva el plan y descarta la exploración vale más que otra que lo conserva todo a medio recordar.
- [ ] **Evitar los bucles de capturas de pantalla.** Una captura para orientarse y luego extracción de texto. Repetir capturas de la misma página es la forma más cara de leerla.

### Con graft

graft mantiene un directorio `graft/` en la raíz del repositorio: un grafo precompilado de cada símbolo con su tramo `file:line`, de quién llama a qué y de fichas breves en prosa por área. Cada consulta cuesta unos cientos de tokens, no necesita clave de API, responde en menos de un segundo y se actualiza sola antes de responder, de modo que siempre describe el código tal como está ahora, incluidas las ediciones sin confirmar.

- [ ] **Instalar una vez por repositorio.** `npm i -g @nanonets/graft@latest` y después `graft init` en el repositorio. Con npm 12 y posteriores, las instalaciones globales bloquean por defecto los scripts de compilación nativos, lo que impide que graft cargue sus analizadores; repetir la instalación con `--allow-scripts=` indicando los paquetes que npm nombra en su aviso. Para Claude Code escribe el archivo de instrucciones, los hooks, la línea de estado y la configuración del servidor MCP; `graft build` construye el grafo de conexiones gratuito. `--deep` añade un mapa de conceptos con LLM; omitirlo salvo que se pida.
- [ ] **Una llamada por pregunta; elegir la herramienta adecuada.** Usar la tabla siguiente. La mayoría de las tareas necesitan exactamente una llamada a graft; encadenar herramientas «a ver si da más» es la principal forma de desperdiciar el ahorro.
- [ ] **`graft ask "<question>" --source` es la opción por defecto.** Resultados ordenados con lo esencial de cada definición en línea, de modo que se obtiene el código necesario sin lectura adicional. `--in <path>` acota; `--full` solo cuando lo esencial es demasiado pequeño para actuar.
- [ ] **`graft grep "<pattern>"` cuando se necesitan todas las apariciones.** Coincidencias agrupadas por símbolo contenedor y ordenadas por acoplamiento. Buscar un nombre simple, no una firma supuesta; si no hay resultados, relajar el patrón antes de recurrir a grep sin más.
- [ ] **`graft skeleton <file>` antes de tocar un archivo.** Solo firmas, unos 200 tokens, aproximadamente diez veces más barato que leer el archivo.
- [ ] **`graft callers <symbol> --depth 2` antes de cambiar una firma.** Aristas precalculadas, no una búsqueda de texto. `--depth all` antes de cualquier refactorización o cambio en varios archivos; `--direction out` para ver de qué depende un símbolo.
- [ ] **`graft map` para orientarse en un repositorio desconocido.** Después, leer las fichas centrales que nombra. No esquematizar ni preguntar por cada subsistema que enumera.
- [ ] **No encadenar nunca graft con `head`, `tail` ni `sed -n`.** La salida ya está limitada e indica qué se omitió. Recortarla pierde coincidencias y la línea de ahorro de la que se extrae el total de la línea de estado.
- [ ] **Confiar en los tramos.** La lista `covers:` de un nodo se genera a partir del código fuente y es la referencia. No reabrir archivos para comprobarla otra vez.
- [ ] **Informar de lo que ahorró graft, en cada turno.** Cada herramienta empieza con `[graft] tokens saved ≈ N`. Sumarlos en la respuesta; `graft stats` muestra la combinación de la sesión.
- [ ] **Integrarlo en CI.** `graft check` falla cuando el índice está obsoleto; `graft blast --format markdown` publica el radio de impacto de un diff como comentario de PR con un diagrama.
- [ ] **En los worktrees, consultar desde la copia de trabajo principal.** El índice vive allí. Los agentes lo usan en modo de solo lectura y editan su propia copia. (House rule)
- [ ] **En un monorrepositorio, acotar con `--in <scope>/`.** Las coincidencias llevan una etiqueta de ámbito; la ordenación es justa entre subproyectos, pero acotar sigue ahorrando tokens.
- [ ] **Mantener graft actualizado.** `graft version` compara la compilación instalada con npm; `graft upgrade` la aplica. Reiniciar el agente tras actualizar. CodeGraph se actualiza con `codegraph upgrade` y luego `codegraph sync` en cada repositorio indexado.

| Cuando se está... | Recurrir a | Llamadas |
|---|---|---|
| Incorporándose, «explicar este código base» | `graft map`, y luego leer las fichas centrales que nombra | 1 |
| Entendiendo un flujo, «cómo funciona X» | `graft ask "<flow>" --source` | 1 |
| Buscando dónde encaja un cambio | `graft ask "where is <behaviour>" --source` | 1 |
| Editando un símbolo que ya se puede nombrar | `graft grep "<symbol>"`, editar en el `file:line` | 1 |
| Renombrando, eliminando, cambiando una firma | Primero `graft callers <sym> --depth 2` | 1 |
| Refactorización o cambio en varios archivos | `graft callers <sym> --depth all` antes de editar | 1 |
| «¿De qué depende esto?» | `graft callers <sym> --direction out` | 1 |
| Todas las apariciones de un patrón | `graft grep "<literal>"` | 1 |
| «¿Cuál es la API de este archivo?» | `graft skeleton <file>` | 1 |
| Depurando un fallo en el área X | `graft ask "<symptom>" --source`, y luego `callers` sobre el sospechoso | 1 a 2 |
| Valorando el riesgo de un diff antes de fusionar | `graft callers <changed sym> --depth 2` | 1 por símbolo |

Cuando el servidor MCP de graft está conectado, las mismas herramientas aparecen como `graft_find_code`, `graft_find_all`, `graft_file_api`, `graft_trace_calls`, `graft_repo_map` y `graft_check_freshness`. Cargarlas en una sola llamada a `ToolSearch`, nunca una a una.

### CodeGraph como el otro índice

- [ ] **Si existe `.codegraph/`, usarlo antes que grep.** `codegraph explore "<question>"` devuelve el código fuente de los símbolos relevantes más las rutas de llamada entre ellos en una sola llamada; `callers`, `callees`, `impact` y `affected` cubren el resto. No ejecutar `codegraph init` en el repositorio de otra persona; indexar es decisión de su responsable.
- [ ] **Elegir un índice principal por repositorio.** Ambas herramientas ofrecen estructura antes que código; ejecutar las dos duplica los esquemas de herramientas en el contexto.

## Optimización del uso de modelos

Tres palancas, por orden: tamaño del contexto (la sección anterior), esfuerzo y nivel de modelo. Juzgar por el coste por tarea completada. Un modelo más barato que necesita más turnos, más reintentos o una corrección humana no es más barato.

### Enrutado por tipo de tarea

| Tipo de tarea | Modelo | Esfuerzo | Por qué |
|---|---|---|---|
| Barridos con grep, revisión de logs, aplicar un renombrado a partir de un mapa conocido, formato, código repetitivo, extraer datos de un archivo conocido | Haiku 4.5 | bajo | Alto volumen y poco criterio; los errores son baratos y visibles |
| Un componente o una prueba según una especificación, un paso de migración documentado, actualizaciones de documentación, resúmenes de changelog, revisión de primera pasada | Sonnet 5.5 | medio (por defecto) | Unos criterios de aceptación claros acotan el daño de una respuesta errónea |
| Decisiones de arquitectura y diseño, migraciones ambiguas, depuración de causa raíz, revisión de seguridad, verificación adversarial, juicio final sobre la salida de otros agentes | Opus 5.5, o el modelo superior de la sesión cuando la cuota lo permita | alto o xhigh | Una respuesta errónea es costosa de detectar y de deshacer |
| La sesión interactiva que sostiene toda la tarea | El mejor modelo disponible | xhigh (valor por defecto de Claude Code) | Toma las decisiones de criterio y redacta los encargos para todos los demás |

### Sin graft

- [ ] **Orquestador potente, manos baratas.** La sesión o el script que sostiene la tarea se ejecuta en el modelo superior; todo lo acotado se ejecuta en Sonnet o Haiku.
- [ ] **Ajustar el encargo para que un modelo más barato no tenga que explorar.** La exploración es donde los modelos baratos gastan turnos y se equivocan. Con referencias `file:line` y criterios de aceptación, Sonnet hace lo que haría Opus.
- [ ] **Bajar el esfuerzo antes de bajar de nivel.** Medir sobre una muestra de tareas reales. El modelo más reciente con esfuerzo bajo suele igualar a uno anterior con esfuerzo alto.
- [ ] **No rebajar nunca el verificador.** La verificación es donde las respuestas erróneas cuestan más. Ejecutarla en el modelo más potente que permita la cuota y comprobar el uso antes de lanzar. (House rule)
- [ ] **Evitar las cascadas que parten la caché.** Las cachés de prompts son por modelo. Una cascada de varios modelos en una aplicación con API renuncia a reutilizar la caché entre ellos; un solo modelo con esfuerzo ajustado suele ganar.
- [ ] **Heredar el modelo de la sesión solo cuando la tarea requiera el nivel superior.** Asignar a cada etapa lo que necesita, no lo que está ejecutando el flujo. (House rule)

### Con graft

- [ ] **Dejar que graft explore y luego bajar un nivel.** `graft ask --source` devuelve tramos exactos con lo esencial en línea, de modo que un agente Sonnet puede editar lo que antes necesitaba a Opus para localizarlo.
- [ ] **Dar a Haiku el mapa, no la búsqueda.** `graft callers <sym> --depth all` es la lista completa de sitios para un renombrado. Entregar esa lista a un agente Haiku para aplicarla de forma mecánica; no pedirle que descubra la lista.
- [ ] **Bajar el esfuerzo en las consultas respaldadas por graft.** Hacen falta menos llamadas a herramientas, así que la deliberación extra aporta poco.
- [ ] **Mantener pequeños los resultados de las herramientas para conservar la caché caliente.** Las salidas de graft están acotadas; las lecturas de archivos completos son las cargas grandes que expulsan de la ventana el contexto estable.
- [ ] **Gastar el ahorro en verificación.** Si graft ahorra decenas de miles de tokens por sesión, ese es el presupuesto para un verificador más potente, no para más exploración.

## Chat de claude.ai y Projects

- [ ] **Un Project por dominio.** Las instrucciones del Project aportan el contexto permanente; el conocimiento del Project aporta los documentos. Ambos se cargan sin tener que pegarlos en cada chat.
- [ ] **Primero el esquema y luego ampliar sección por sección.** Las respuestas largas de un solo golpe ocultan los problemas de estructura hasta el final.
- [ ] **Mostrar el resultado deseado.** Un breve ejemplo del formato, el tono o la tabla vale más que tres párrafos que lo describan.
- [ ] **Pedir fuentes y comprobarlas.** Para hechos, fechas y cifras, preguntar de dónde proceden y verificarlas antes de reutilizarlas.
- [ ] **Usar artefactos para todo lo que se vaya a reutilizar o compartir.** Documentos, páginas, diagramas y pequeñas herramientas funcionan mejor como artefactos que como texto de chat.
- [ ] **Pasar a Claude Code cuando la tarea toque archivos.** Repositorios, terminales, navegadores y todo lo que deba verificarse ejecutándolo pertenecen a Code, no al chat.
- [ ] **Usar la memoria y los estilos con criterio.** La memoria debe guardar hechos estables sobre la persona y su trabajo; los estilos deben codificar la voz que se pide una y otra vez.
- [ ] **Empezar un chat nuevo cuando cambie el tema.** Los chats largos arrastran el mismo coste de contexto que las sesiones largas.

## Creación con la API y los SDK

Para equipos que integran Claude en su propio producto. Todo pasa por un único endpoint, `POST /v1/messages`; las herramientas, las salidas estructuradas y el almacenamiento en caché son funciones de ese endpoint. La skill `claude-api` de Claude Code contiene la referencia actual; los elementos siguientes son los hábitos.

### Elegir el nivel más sencillo

- [ ] **Una sola llamada, luego un flujo de trabajo, luego un agente.** Clasificación, extracción y resumen son una sola petición. Los procesos de varios pasos con lógica controlada por código son un flujo de trabajo que se orquesta. Solo el uso de herramientas abierto y dirigido por el modelo es un agente.
- [ ] **Cuatro criterios antes de crear un agente.** Complejidad (varios pasos y difícil de especificar de antemano), valor (compensa el coste y la latencia), viabilidad (Claude es capaz en esta tarea) y coste del error (se puede detectar y corregir). Un «no» en cualquiera significa quedarse en algo más sencillo.
- [ ] **Conocer las cuatro formas de crear un agente.** Un bucle manual propio; el Tool Runner del SDK, que recorre en bucle las herramientas definidas; Managed Agents, donde Anthropic ejecuta el bucle y aloja el entorno aislado; y el Claude Agent SDK, que es Claude Code como biblioteca con herramientas integradas. La primera, la segunda y la cuarta dejan el despliegue en manos propias.

### Higiene de las peticiones

- [ ] **Usar por defecto el Opus actual con razonamiento adaptativo.** `claude-opus-5-5`, salvo que se indique otro modelo. El razonamiento permanece activado; controlar la profundidad con `output_config.effort` y fijarla de forma explícita, porque el valor por defecto en Opus 5.5 es `medium`.
- [ ] **Usar streaming en todo lo largo.** No quedarse corto con `max_tokens`: unos 16k sin streaming, 64k con streaming. Usar el asistente de mensaje final del SDK cuando no se necesitan los eventos individuales.
- [ ] **Sin prefill ni elección forzada de herramienta en los modelos actuales.** Ambos devuelven un 400 en la línea 5.x. Usar en su lugar salidas estructuradas (`output_config.format`) y herramientas con `strict: true`.
- [ ] **Comprobar `stop_reason` antes de leer el contenido.** `refusal`, `max_tokens`, `pause_turn` y `tool_use` requieren cada uno su tratamiento. Activar los fallbacks del lado del servidor en los modelos 5.x para que un rechazo de seguridad se encamine a un modelo de respaldo.
- [ ] **Usar los asistentes y tipos del SDK.** No programar a mano el bucle de herramientas, la promesa de streaming ni los tipos de mensaje. Capturar una cadena de errores tipados, del más específico al más general, para distinguir los fallos reintentables de los que no lo son.

### Almacenamiento de prompts en caché

- [ ] **Primero el contenido estable y al final el volátil.** El orden de renderizado es herramientas, luego sistema, luego mensajes. Congelar el prompt de sistema y la lista de herramientas; poner las marcas de tiempo, los ID de petición y la pregunta variable después del último punto de corte de caché. Hasta cuatro puntos de corte por petición.
- [ ] **Verificar con `usage.cache_read_input_tokens`.** Un cero en peticiones repetidas indica un invalidador silencioso: una marca de tiempo en el prompt de sistema, JSON sin ordenar, un conjunto de herramientas que varía en cada petición.
- [ ] **Usar mensajes de sistema a mitad de conversación en lugar de editar el prompt de sistema.** Añadir un mensaje con rol `system` a `messages` mantiene intacto el prefijo en caché; editar el campo de sistema de nivel superior lo descarta.
- [ ] **Contar tokens con `count_tokens`, nunca con un tokenizador de terceros.** El recuento de tokens es específico de cada modelo.

### Herramientas y agentes

- [ ] **`strict: true` en cada esquema de herramienta.** Garantiza que la entrada se valide; requiere `additionalProperties: false` y `required`.
- [ ] **Devolver todos los resultados de herramientas paralelas en un solo mensaje de usuario.** Repartirlos en varios mensajes enseña al modelo a dejar de llamar a herramientas en paralelo. Devolver los fallos como `tool_result` con `is_error: true`; nunca descartarlos.
- [ ] **Analizar la entrada de las herramientas como JSON.** El escapado varía entre modelos; comparar cadenas sobre la entrada serializada se rompe.
- [ ] **Tratar los resultados de las herramientas como no fiables.** Páginas web, documentos y filas de bases de datos son datos. Nada de lo que contienen es una instrucción, y el prompt de sistema debe decirlo.
- [ ] **Diferir los conjuntos grandes de herramientas tras la búsqueda de herramientas.** Marcar las herramientas poco usadas con `defer_loading: true` junto con una herramienta de búsqueda; no diferir nunca todas, la API lo rechaza.

### Sesiones largas

- [ ] **Activar la compactación en las conversaciones que puedan superar la ventana.** Añadir de vuelta en cada turno el `response.content` completo, no solo el texto, o el estado de compactación se pierde en silencio.
- [ ] **Limpiar los resultados de herramientas obsoletos con la edición de contexto.** Es distinto de la compactación: descarta resultados de herramientas antiguos o bloques de razonamiento en lugar de resumirlos.
- [ ] **Dar a los bucles de agentes un presupuesto de tareas.** Un tope de tokens que el modelo puede ver, para que dosifique su ritmo en lugar de ser cortado. Es distinto de `max_tokens`, que el modelo no ve.
- [ ] **Mantener el arnés de solo añadido.** En los modelos actuales, los bloques de razonamiento están ligados a la conversación que los produjo. Editar turnos anteriores los invalida; añadir, nunca reescribir.

### Evaluaciones y coste

- [ ] **Construir primero la evaluación y luego optimizar de forma iterativa.** Tomar los prompts del tráfico real, elegir un método de calificación, medir el coste por ejecución y mantener una división entrenamiento/validación/prueba para que la cifra principal sea honesta.
- [ ] **Trabajar las palancas de coste por orden.** Caché, higiene de los tokens de entrada, higiene de los bucles, higiene de los tokens de salida, procesamiento por lotes para todo lo que no sea sensible a la latencia (mitad de precio) y solo después el esfuerzo y la elección de modelo.
- [ ] **Registrar `usage` en cada respuesta.** Los tokens de entrada, salida, lectura de caché y escritura de caché por petición son la única forma de saber qué efecto tuvo un cambio en la factura.
- [ ] **Procesar por lotes lo que pueda esperar.** La Message Batches API se ejecuta de forma asíncrona a la mitad de precio; asociar los resultados por `custom_id`, nunca por posición.

### Modelos actuales

| Modelo | ID | Contexto | Entrada por MTok | Salida por MTok |
|---|---|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` | 1M | $10.00 | $50.00 |
| Claude Opus 5.5 | `claude-opus-5-5` | 1M | $4.00 | $20.00 |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | 1M | $2.00 | $10.00 |
| Claude Haiku 4.5 | `claude-haiku-4-5` | 200K | $1.00 | $5.00 |

Tarifas de la API propia a septiembre de 2026. Las lecturas de caché en los modelos actuales cuestan una pequeña fracción del precio de entrada (del 2,5 % al 10 %), por lo que un prefijo estable importa más que cualquier otra palanca. Usar los ID exactos de arriba, sin sufijos de fecha.

## Reglas de la casa

Las reglas de trabajo que Marc fijó para los agentes, guardadas en `~/.claude/CLAUDE.md` para que cada sesión y cada subagente las cargue. Se reproducen aquí para que el equipo lea el mismo texto. Las fechas indican cuándo se fijó cada regla.

### Selección de modelo para agentes y flujos de trabajo lanzados (2026-09-09, reforzada el 2026-09-17)

- [ ] **No gastar de más en los flujos de trabajo; es una regla estricta.** Elegir modelo y esfuerzo según el tipo de tarea. No sobredimensionar nunca una tarea sencilla ni infradimensionar una difícil.
- [ ] **Dimensionar cada etapa según lo que necesita.** No asignar por defecto a todas las etapas el modelo del orquestador ni el esfuerzo máximo solo porque eso sea lo que ejecuta el flujo de trabajo.
- [ ] **Haiku, esfuerzo bajo** para trabajo mecánico, de alto volumen y poco criterio: barridos con grep, revisión de logs, aplicar un renombrado a partir de un mapa conocido, formato, código repetitivo, extraer datos de un archivo conocido.
- [ ] **Sonnet, esfuerzo por defecto** para implementación e investigación acotadas con criterios de aceptación claros: un componente o una prueba según una especificación, un paso de migración documentado, actualizaciones de documentación, resúmenes de changelog, revisión de primera pasada.
- [ ] **Opus o el modelo superior de la sesión, esfuerzo alto** cuando una respuesta errónea es costosa: decisiones de arquitectura y diseño, migraciones ambiguas, depuración de causa raíz, revisión de seguridad, verificación adversarial, juicio final sobre la salida de otros agentes.
- [ ] **Indicar el modelo y el motivo en cada etapa y en cada subagente.** Sin excepciones.

### Cómo desplegar flujos de trabajo (2026-09-20)

- [ ] **Productor más verificador independiente, siempre.** El verificador repara lo que encuentra en lugar de limitarse a informar. El verificador se ejecuta en Fable cuando la cuota lo permite y en Opus en caso contrario; comprobar `mcp__ccd_session_mgmt__get_usage` antes de lanzar y no dejar nunca una etapa en el modelo por defecto cuando el modelo de la sesión está cerca de su límite.
- [ ] **Preferir un oráculo determinista a un verificador basado en un modelo.** Un ensamblador, una implementación de referencia, una ida y vuelta (round-trip), una referencia byte a byte. Las líneas respaldadas por un oráculo no necesitan una etapa de verificación cara.
- [ ] **Todo prompt de productor se abre con un preámbulo SETTLED.** Los mensajes recientes de la persona usuaria van dirigidos al orquestador; no hacer preguntas, no esperar, no devolver la tarea; no ejecutar nunca `gh`, `git commit`, `git push` ni `git checkout`; no desactivar nunca el hook GateGuard; sin nuevas dependencias de terceros; ejecutar las comprobaciones finales indicadas e informar con honestidad.
- [ ] **Protegerse contra los resultados de relleno.** Indicar a los agentes: si la llamada estructurada se rechaza, corregir el JSON y reenviar el resultado completo, nunca un relleno. Validar el contenido en el script, por ejemplo `if (!r || r.summary.length < 120) throw`. Antes de pagar una nueva ejecución, leer `journal.jsonl` y la transcripción del agente; los primeros 2 KB de una carga fallida sobreviven en `__unparsedToolInput.raw`.
- [ ] **Un git worktree por línea de trabajo en paralelo.** `git worktree add -b <branch> <path> origin/main`; cada agente escribe solo dentro del suyo. Las herramientas de índice viven en la copia de trabajo principal y se usan en modo de solo lectura desde allí.
- [ ] **Fusionar a través de la API mientras un flujo de trabajo retiene la copia de trabajo principal.** `gh api -X PUT repos/<o>/<r>/pulls/N/merge -f merge_method=rebase`; `gh pr merge` cambia la rama local. No encadenar nunca un borrado de rama tras un comando de fusión. Con comprobaciones de estado estrictas, la fusión es en serie: fusionar main y esperar a la siguiente ronda de comprobaciones; no hacer nunca rebase ni force-push de una PR que el monitor de CI esté vigilando.
- [ ] **Acotar por presupuesto, no por ambición.** Comprobar primero la cuota semanal y decir cuánto costará la ejecución. Informar del gasto frente al límite al final de cada ejecución e informar del ahorro de tokens de graft o CodeGraph.
- [ ] **Devolver las decisiones como evidencia, no como preguntas.** Presentar la medición que la resuelve y las opciones con sus consecuencias; registrar la respuesta y las afirmaciones que no superaron la verificación.

### Economía de contexto y de pruebas (2026-09-19)

- [ ] **Estructura antes que código.** En los repositorios indexados con graft, `graft skeleton <file>`, `graft grep` y `graft callers` antes de abrir nada. Donde graft no esté, CodeGraph si está indexado y, si no, un grep dirigido al símbolo; nunca archivos completos para orientarse.
- [ ] **Leer solo los archivos que se editan.** Abrir un archivo completo solo cuando se vaya a modificar. No volver a leer un archivo recién editado.
- [ ] **Pruebas propias durante el trabajo, la suite completa una sola vez.** Ejecutar solo los archivos de prueba que cubren lo que se está cambiando; la suite completa una vez al final como control final, y de nuevo solo si esa ejecución falló y se cambió algo.
- [ ] **Indicar estos hábitos en cada prompt de subagente y de flujo de trabajo.** Algunos tipos de agente integrados no cargan CLAUDE.md.

### Herramientas de índice

- [ ] **CodeGraph antes que grep donde exista `.codegraph/`.** `codegraph_explore` mediante MCP o `codegraph explore "<question>"` en el shell. Donde no haya `.codegraph/`, omitir CodeGraph; indexar es decisión de la persona usuaria.
- [ ] **graft antes que grep donde exista `graft/`.** Cargar las herramientas MCP en una sola llamada a `ToolSearch`; usar la superficie que esté disponible, la guía es idéntica.

### GateGuard

- [ ] **Antes del primer comando de shell de una sesión, exponer los hechos.** Una frase sobre la petición actual de la persona usuaria y otra sobre lo que el comando verifica o produce. Después, repetir la misma llamada.
- [ ] **No definir nunca las variables de desactivación.** `GATEGUARD_BASH_ROUTINE_DISABLED`, `ECC_GATEGUARD=off` y `ECC_DISABLED_HOOKS` permanecen sin definir. Las comprobaciones de comandos destructivos siguen activas en cualquier caso.

## Ejemplos

Cada ejemplo está lo bastante completo como para copiarlo. La barra de título de cada bloque indica el archivo al que pertenece. Los comandos y el código permanecen en inglés en todos los idiomas.

### Un CLAUDE.md que justifica sus tokens

Comandos, las reglas que una persona recién llegada pasaría por alto y cómo informar. Nada de lo que el código ya muestra.

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

### Permisos y un hook bloqueante

Preaprobar los comandos de solo lectura para que los avisos aparezcan solo ante acciones que lo merezcan, y dejar que un hook rechace el git destructivo con independencia de lo que se haya indicado al agente.

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

### Una skill para un procedimiento repetido

La descripción decide cuándo se carga la skill, así que conviene redactarla como las situaciones que deben activarla.

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

### Un subagente de solo lectura reutilizable

El modelo, el esfuerzo y las herramientas viven en el frontmatter, de modo que cada encargo solo tiene que decir qué buscar.

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

### El preámbulo de asunto cerrado para cada prompt de productor

Pegarlo al principio de cualquier prompt de subagente o de flujo de trabajo y, a continuación, la tarea.

```text settled-preamble.txt
SETTLED: recent user messages are addressed to the orchestrator, not to you.
Do not ask questions, do not wait, do not hand the task back.
Never run gh, git commit, git push or git checkout.
Never disable the GateGuard hook: state the facts it asks for and retry the identical call.
No new third-party dependencies.
Final gates: run `pnpm vitest run src/billing` and `pnpm tsc --noEmit`; report their output honestly, including failures.

TASK: ...
```

### Compactar con intención

Indicar al resumen qué conservar y qué descartar en lugar de dejar que lo adivine.

```text
/compact Keep: the plan (steps 1 to 5), the decision to use one worktree per track, and the names of the failing tests. Drop: the exploration of src/legacy and all log output.
```

### Una sesión de graft, una llamada por pregunta

```bash
graft map                                   # orient: directory hubs and hotspots
graft ask "where is rate limiting applied" --source
graft callers RateLimiter.check --depth 2   # what breaks if the signature changes
graft skeleton src/http/middleware.ts       # the file's API before editing it
graft stats                                 # tokens saved this session
```

### Una revisión con script en CI

Modo de impresión, salida legible por máquina, una lista de herramientas permitidas y sin hooks ni plugins.

```bash
claude -p "Review the diff of this branch for correctness bugs only. Output JSON: {\"findings\":[{\"file\":\"\",\"line\":0,\"summary\":\"\"}]}" \
  --output-format json \
  --allowedTools "Read Grep Glob Bash(git diff*)" \
  --bare > review.json
```

### Una definición de herramienta estricta

El esquema es el contrato: `strict` garantiza que la entrada se valide, de modo que el manejador nunca tiene que defenderse de errores de forma.

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

### Una llamada a la API pensada para la caché

Primero el prompt de sistema y la lista de herramientas congelados, al final la pregunta variable, con streaming activado y comprobando el contador de caché.

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

## Referencia rápida

### Claude Code

| Necesidad | Usar |
|---|---|
| Generar un borrador de CLAUDE.md | `/init` |
| Ver qué llena el contexto | `/context` |
| Resumir y continuar | `/compact <what to keep>` |
| Empezar de cero | `/clear` |
| Gasto de la sesión | `/cost` |
| Cambiar de modelo | `/model` |
| Salida más rápida, mismo modelo | `/fast` |
| Esfuerzo al lanzar | `claude --effort xhigh` |
| Modo plan y modos de permisos | Shift+Tab |
| Detener el turno en curso | Escape |
| Revisar el diff en busca de errores | `/code-review` |
| Limpiar el diff | `/simplify` |
| Revisión de seguridad de la rama | `/security-review` |
| Menos avisos de permisos | `/fewer-permission-prompts` |
| Ejecución con script | `claude -p "<prompt>" --output-format json --allowedTools "Read Grep"` |
| Ejecución recurrente en la nube | `/schedule` |
| Consultar periódicamente un estado externo lento | `/loop` |

### graft

| Necesidad | Usar |
|---|---|
| Instalar y conectar con el repositorio | `npm i -g @nanonets/graft@latest` y luego `graft init` |
| Orientarse en un repositorio desconocido | `graft map` |
| Entender o localizar | `graft ask "<question>" --source` |
| Todas las apariciones | `graft grep "<name>"` |
| La API de un archivo | `graft skeleton <file>` |
| Quién llama, radio de impacto | `graft callers <sym> --depth 2`, `--depth all`, `--direction out` |
| Control de actualización en CI | `graft check` |
| Comentario de riesgo en la PR | `graft blast --format markdown` |
| Ahorro de la sesión | `graft stats` |

### CodeGraph

| Necesidad | Usar |
|---|---|
| Símbolos y rutas de llamada en una sola llamada | `codegraph explore "<question>"` |
| Un símbolo o un archivo con números de línea | `codegraph node <name>` |
| Llamadores, llamados, impacto | `codegraph callers <sym>`, `codegraph callees <sym>`, `codegraph impact <sym>` |
| Pruebas afectadas por los archivos cambiados | `codegraph affected <files>` |

### Parámetros de la API que conviene recordar

| Necesidad | Usar |
|---|---|
| Profundidad de razonamiento | `output_config.effort`: `low`, `medium`, `high`, `xhigh`, `max` |
| Salida JSON estructurada | `output_config.format` |
| Entrada de herramienta validada | `strict: true` en la herramienta |
| Punto de corte de caché | `cache_control: {type: "ephemeral"}` (máx. 4) |
| Instrucción del operador a mitad de conversación | `{role: "system", content: ...}` dentro de `messages` |
| Conversaciones largas | beta de compactación `compact-2026-01-12` |
| Bucles de agentes dosificados | `output_config.task_budget` con la beta `task-budgets-2026-03-13` |
| Trabajo asíncrono a mitad de precio | Message Batches API |

## Fuentes

- Documentación de Claude Code: https://code.claude.com/docs
- Documentación de la API de Claude: https://docs.anthropic.com
- graft: https://www.npmjs.com/package/@nanonets/graft (la skill instalada en `~/.claude/skills/graft/SKILL.md` es la referencia operativa)
- CodeGraph: `codegraph --help` y las instrucciones del servidor MCP `codegraph`
- Reglas de trabajo de Marc: `~/.claude/CLAUDE.md`
