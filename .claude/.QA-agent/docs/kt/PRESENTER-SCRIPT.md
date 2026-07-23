# QA Agents — KT Presenter Script / Guion del presentador

> Companion to the deck `docs/kt/qa-agents-kt.html`. This file is **for the presenter only** —
> it is not shared with the audience. The deck itself is clean (no notes embedded).
>
> **Español primero, luego English.** Same content, split — not interleaved.

---
---

# 🇪🇸 Guion (Español)

**Duración total:** ~25–30 min + Q&A · **17 diapositivas (00–16)**

**Cómo manejar el deck:** botón **▶ Present** (arriba a la derecha) para modo diapositiva;
avanza con **→** / retrocede con **←** (o barra espaciadora). **Esc** para salir. La barra de
progreso arriba te dice por dónde vas.

**La audiencia:** equipo QA mixto — muchos son **QA manuales** sin base de programación. Regla
de oro: **primero la analogía, después el detalle**. No leas las tablas; explícalas.

**El hilo conductor a repetir 2–3 veces:** *Approve / Edit / Reject* — los agentes nunca actúan
sin tu OK. Es lo que le da tranquilidad al equipo. En todo momento el mensaje es de
**apalancamiento y trabajo de más valor**, nunca de reemplazo.

---

## 00 · Hero — "The QA Agents, from zero" ⏱ ~2 min
- Bienvenida. Deja claro el objetivo: al terminar sabrán qué son estos agentes y cómo correr el primero. **No hace falta saber programar.**
- Di el destino desde el inicio: es una **subida de rol, QA Manual → QA SDET** — las mismas habilidades que ya tienen, con más apalancamiento y trabajo de mayor valor.
- Señala los seis números: **esto ya existe en nuestro repo hoy**, no es una propuesta.
- *Transición:* "Empecemos por: ¿por qué existe esto?"

## 01 · Why this exists ⏱ ~2 min
- Una frase: escribir pruebas solía ser lo caro; la IA cambió eso. Ahora el valor está en el **criterio**.
- Recorre las dos columnas (izquierda→derecha) y pregunta: *¿qué lado describe tu día hoy?* — engancha a los QA manuales.
- Aterriza el recuadro: **tu criterio conduce, los agentes hacen el trabajo pesado**; tú te enfocas en la parte de valor.
- Mantenlo en ~2 min: es motivación, no detalle.
- *Transición:* "Entonces, ¿qué es exactamente un 'agente'?"

## 02 · Mental model ⏱ ~3 min (la más importante)
- La diapositiva **más importante** para gente no técnica — baja el ritmo aquí.
- Usa la analogía de cocina: **comando = receta**, **skill = técnica**, **subagente = un especialista al que llamas**.
- Martilla los dos mecanismos de confianza: **config-driven** (todo en un archivo) y **human-gated** (nada pasa sin tu OK).
- Pausa para preguntas antes de avanzar.
- *Transición:* "Con eso en mente, veamos todo lo que tenemos."

## 03 · The big picture ⏱ ~1.5 min
- No leas cada tarjeta — di: "aquí está toda la caja de herramientas en una vista" y deja que la escaneen.
- Tranquiliza: **no usarán todo esto el día uno**; la mayoría empieza con dos o tres.
- La tira de abajo muestra cómo se conectan las piezas — anticipa que la siguiente lo explica.
- *Transición:* "¿Cómo encajan esas piezas? Tres capas."

## 04 · How it's built (3 capas) ⏱ ~1.5 min (opcional)
- Profundidad opcional: pasa rápido si la sala es mayormente manual; detente si hay ingenieros.
- La idea única: **las reglas viven una sola vez**. Por eso los agentes nunca se contradicen.
- Segunda idea: **nunca hardcodear** = portabilidad; editas un archivo y funciona en otro proyecto.
- *Transición:* "Ahora, ¿dónde haces tu trabajo? En los carriles."

## 05 · The three lanes ⏱ ~2 min
- Un **carril (lane)** es una pista de automatización. Relaciona cada uno con algo que conocen: suite de regresión, aceptación de sprint, chequeos de API.
- Idea clave: los **page objects son compartidos**, así que el esfuerzo en un carril suma en los otros.
- Pregunta a la sala en qué carril vive más su equipo.
- *Transición:* "¿Con qué comandos manejas todo esto?"

## 06 · The commands (toolbox) ⏱ ~3 min
- El corazón práctico. Diles: **memoricen uno — `/qa-orchestrator`**. Te enruta a todo lo demás.
- Recorrido por grupos: **entry points** (empieza aquí), **lanes** (el trabajo), **pipeline y reporting** (trabajos más grandes).
- Nota la tarjeta punteada `/qa-docs`: ese es el flujo de documentación SDLC, **sesión aparte — ignórenlo hoy**.
- *Transición:* "Los comandos usan 'skills' por debajo. ¿Qué son?"

## 07 · The skills ⏱ ~2 min
- No enumeres las 20. Di: las skills son las **técnicas** que usan los comandos; rara vez las llamas por nombre.
- **Destaca el recuadro:** `manual-test-design` y `bug-reporting` **no necesitan comando** — solo lo escribes en el chat.
- Este es el momento **"puedes empezar hoy"** para los QA manuales — recálcalo.
- *Transición:* "Y hay dos especialistas que trabajan aparte."

## 08 · The subagents ⏱ ~1.5 min
- Dos especialistas: **reviewer** es el portero antes del merge; **healer** es el mecánico de pruebas rotas.
- Por qué en aislamiento: mantiene tu chat limpio — devuelven un **veredicto**, no ruido.
- Healer no hace trampa: un bug real de la app se vuelve **reporte de bug**, no una aserción debilitada.
- *Transición:* "¿Qué pasa realmente cuando corres un comando de carril?"

## 09 · The wave pipeline ⏱ ~2 min
- Esto es lo que **de verdad pasa** al correr un comando de carril — recórrelo nodo por nodo.
- Resalta las tres compuertas teal (**CP-AC, CP-4, CP-3**): ahí es donde **tú decides**.
- **Wave = máx 10 pruebas** para que cada revisión sea de tamaño humano.
- *Transición:* "Esas compuertas son parte de algo más grande: el control humano."

## 10 · Human-in-the-loop ⏱ ~2.5 min (la de confianza)
- La diapositiva de **confianza**. Todo trabajo corre en bloques cortos con pausas.
- Actúa los cinco pasos; las dos compuertas son **CP-TODO** (antes del trabajo) y **CP-BLOCK** (después).
- No leas la tabla del catálogo — di: **cada CP es solo una pausa para Approve, Edit o Reject.**
- *Transición:* "Si quieres el trabajo completo de un tirón, existe `/qa-loop`."

## 11 · The autonomous pipeline (/qa-loop) ⏱ ~2 min
- Para cuando quieres todo el trabajo de una: **tres fases, con compuertas entre fases** (nunca a mitad de fase).
- Nota los topes de iteración — el agente **no** hace bucles infinitos; se detiene y pregunta.
- Mejor para una historia bien definida; menos para trabajo exploratorio.
- *Transición:* "Veámoslo en situaciones del día a día."

## 12 · A day in the life ⏱ ~2.5 min
- Hazlo concreto — lee el **escenario A** en voz alta como mini recorrido.
- Refuerza la regla orchestrator-vs-task del recuadro.
- **Muy buen momento para pasar a demo en vivo** si tienes un sandbox listo *(ver tip abajo).*
- *Transición:* "¿Cómo arrancas desde cero?"

## 13 · Get started ⏱ ~2 min
- Los cuatro pasos al primer run. Con calma: es un **setup de ~10 min, una sola vez**.
- Apunta a `docs/QA-SDET-QUICKSTART.md` para la versión copiar-pegar.
- Si presentas en vivo, esta es tu señal para **abrir Claude Code**.
- *Transición:* "Y ¿hacia dónde crece cada quien? Tu camino."

## 14 · Your path: Manual QA → SDET ⏱ ~2.5 min (el núcleo emocional)
- El **núcleo emocional** para los QA manuales — pide a cada quien ubicar su **escalón actual**.
- Recalca que los agentes cargan el peso en cada nivel; subir **no** es "aprende a programar desde cero".
- Usa la tabla de mapeo: lo que hoy haces a mano tiene un equivalente asistido por agentes mañana.
- *Transición:* "Dejo un glosario para que vuelvan cuando quieran."

## 15 · Glossary & cheat sheet ⏱ ~1 min
- No la presentes — di que es una **referencia** para volver después.
- Define en vivo solo los dos o tres términos que la sala realmente preguntó.
- La **cheat-sheet** es el screenshot que la gente guardará — señálala.
- *Transición:* "Y para terminar, a dónde ir después."

## 16 · Where to go next ⏱ ~1.5 min + Q&A
- Cuatro recursos — diles que abran **primero el quick-start**.
- Cierra con el hábito **Approve / Edit / Reject**; el mensaje de seguridad enmarca toda la charla.
- Abre el turno de preguntas y termina con la línea de bienvenida al SDET.

---

### 💡 Tip de demo en vivo (después de la §13)
Cambia a Claude Code y corre **`/qa-orchestrator`** con un ID de ADO real (o un módulo). Deja que
el equipo vea los bloques `STATUS` aparecer fase por fase y detente en el primer **CHECKPOINT**
para mostrar las opciones Approve / Edit / Reject en vivo. El deck es el mapa; la demo es el "ajá".
Si no tienes sandbox, di explícitamente que es un ejemplo y usa los escenarios de la §12.

---
---

# 🇬🇧 Presenter script (English)

**Total time:** ~25–30 min + Q&A · **17 slides (00–16)**

**Driving the deck:** the **▶ Present** button (top right) enters slide mode; advance with **→**
/ back with **←** (or spacebar). **Esc** to exit. The top progress bar shows where you are.

**The audience:** a mixed QA team — many are **manual QAs** with no coding background. Golden
rule: **analogy first, detail second.** Don't read the tables; explain them.

**The through-line to repeat 2–3 times:** *Approve / Edit / Reject* — the agents never act
without your OK. That is what reassures the team. Frame everything as **leverage and
higher-value work**, never as replacement.

---

## 00 · Hero — "The QA Agents, from zero" ⏱ ~2 min
- Welcome. Set the goal: by the end you will know what these agents are and how to run your first one. **No coding background needed.**
- Say the destination early: this is a **role upgrade, Manual QA → QA SDET** — the same skills you have, with more leverage and higher-value work.
- Point at the six numbers: **this already exists in our repo today**, it is not a proposal.
- *Transition:* "Let's start with: why does this exist?"

## 01 · Why this exists ⏱ ~2 min
- One line: writing tests used to be the expensive part; AI flipped that. The value now is **judgment**.
- Walk the two columns (left→right), then ask: *which side describes your day today?* — engages manual QAs.
- Land the callout: **your judgment steers, the agents do the heavy lifting**; you focus on the high-value work.
- Keep it to ~2 min — this is motivation, not detail.
- *Transition:* "So what exactly is an 'agent'?"

## 02 · Mental model ⏱ ~3 min (most important)
- The **most important** slide for non-technical folks — slow down here.
- Use the cooking analogy: **command = recipe**, **skill = technique**, **subagent = a specialist you call in**.
- Drive the two trust mechanisms home: **config-driven** (one file) and **human-gated** (nothing happens without your OK).
- Pause for questions before moving on.
- *Transition:* "With that in mind, here's everything we have."

## 03 · The big picture ⏱ ~1.5 min
- Don't read every card — say: "here is the whole toolbox in one view" and let them scan.
- Reassure: **you will not use all of this on day one**; most people start with two or three.
- The bottom strip shows how the pieces connect — preview that the next slide explains it.
- *Transition:* "How do those pieces fit? Three layers."

## 04 · How it's built (3 layers) ⏱ ~1.5 min (optional)
- Optional depth: skip fast for a manual-heavy room, linger for engineers.
- The one takeaway: **rules live once**. That is why the agents never contradict each other.
- Second takeaway: **never hardcode** = portability; edit one file and it works in a new project.
- *Transition:* "Now, where do you do your work? In the lanes."

## 05 · The three lanes ⏱ ~2 min
- A **lane** is a track of automation. Map each to something they know: regression suite, sprint acceptance, API checks.
- Key idea: **page objects are shared**, so effort in one lane compounds across the others.
- Ask the room which lane their team lives in most.
- *Transition:* "Which commands drive all this?"

## 06 · The commands (toolbox) ⏱ ~3 min
- The practical heart. Tell them: **memorize one — `/qa-orchestrator`**. It routes you everywhere else.
- Tour by group: **entry points** (start here), **lanes** (the work), **pipeline and reporting** (bigger jobs).
- Note the dashed `/qa-docs` card: that is the SDLC docs flow, **a separate session — ignore for today**.
- *Transition:* "The commands use 'skills' under the hood. What are those?"

## 07 · The skills ⏱ ~2 min
- Don't enumerate 20. Say: skills are the **techniques** commands use; you rarely call them by name.
- **Spotlight the callout:** `manual-test-design` and `bug-reporting` need **no command** — just type it in chat.
- This is the **you-can-start-today** moment for manual QAs — emphasize it.
- *Transition:* "And two specialists work off to the side."

## 08 · The subagents ⏱ ~1.5 min
- Two specialists: **reviewer** is the gatekeeper before merge; **healer** is the mechanic for broken tests.
- Why isolation: it keeps your chat clean — they hand back a **verdict**, not noise.
- Healer never cheats: a real app bug becomes a **bug report**, not a weakened assertion.
- *Transition:* "What actually happens when you run a lane command?"

## 09 · The wave pipeline ⏱ ~2 min
- This is what **actually happens** when you run a lane command — walk it node by node.
- Highlight the three teal gates (**CP-AC, CP-4, CP-3**): those are where **you decide**.
- **Wave = max 10 tests** so each review stays human-sized.
- *Transition:* "Those gates are part of something bigger: human control."

## 10 · Human-in-the-loop ⏱ ~2.5 min (the trust slide)
- The **trust** slide. Every job runs as short blocks with stops.
- Act out the five steps; the two gates are **CP-TODO** (before work) and **CP-BLOCK** (after).
- Don't read the catalog table — say: **every CP is just a pause for Approve, Edit, or Reject.**
- *Transition:* "If you want the whole job in one go, there's `/qa-loop`."

## 11 · The autonomous pipeline (/qa-loop) ⏱ ~2 min
- For when you want the whole job at once: **three phases, with gates between phases** (never mid-phase).
- Note the iteration caps — the agent will **not** loop forever; it stops and asks.
- Best for a well-defined story; less so for exploratory work.
- *Transition:* "Let's see it in day-to-day situations."

## 12 · A day in the life ⏱ ~2.5 min
- Make it concrete — read **scenario A** aloud as a mini walk-through.
- Reinforce the orchestrator-vs-task rule in the callout.
- **Great spot to switch to a live demo** if you have a sandbox ready *(see tip below).*
- *Transition:* "How do you get started from zero?"

## 13 · Get started ⏱ ~2 min
- The four steps to first run. Keep it calm: this is a **~10-minute setup, once**.
- Point to `docs/QA-SDET-QUICKSTART.md` for the copy-paste version.
- If presenting live, this is your cue to **open Claude Code**.
- *Transition:* "And where does each person grow? Your path."

## 14 · Your path: Manual QA → SDET ⏱ ~2.5 min (the emotional core)
- The **emotional core** for manual QAs — ask each person to find their **current rung**.
- Stress that the agents carry the weight at every level; climbing is **not** "learn to code from scratch".
- Use the mapping table: what you do by hand today has an agent-driven equivalent tomorrow.
- *Transition:* "I'll leave a glossary you can come back to."

## 15 · Glossary & cheat sheet ⏱ ~1 min
- Don't present it — say it is a **reference** to come back to.
- Define live only the two or three terms the room actually asked about.
- The **cheat-sheet** is the screenshot people will keep — point it out.
- *Transition:* "Finally, where to go next."

## 16 · Where to go next ⏱ ~1.5 min + Q&A
- Four resources — tell them to open the **quick-start first**.
- Close on the **Approve / Edit / Reject** habit; the safety message bookends the talk.
- Open the floor for Q&A, then end on the SDET welcome line.

---

### 💡 Live-demo tip (after §13)
Switch to Claude Code and run **`/qa-orchestrator`** with a real ADO ID (or a module). Let the
team watch the `STATUS` blocks appear phase by phase, and stop at the first **CHECKPOINT** to
show the Approve / Edit / Reject options live. The deck is the map; the demo is the "aha". If you
have no sandbox, say explicitly it's an example and use the §12 scenarios instead.
