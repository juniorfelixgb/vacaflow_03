# Visual Presentation — Terminal-First Standards

> **Single source of truth** for how QA output is made *readable*: status badges, metric
> tables, progress bars, comparison tables, pipeline lists, and the catalog of visual
> document types. The `sdlc-visual-docs` skill is a thin wrapper over this file; the HITL
> cadence in [hitl-workflow.md](hitl-workflow.md) renders its ToDo table, badges, and bars
> with the patterns below. When a visual rule changes, change it here — nowhere else.

**Rendering target: the terminal (VSCode extension).** The team works in the Claude Code
terminal, where **HTML widgets (`show_widget`) do not render**. Therefore the default and
required output is **plain markdown** — tables, emoji badges, and ASCII bars that render
everywhere. HTML widgets are an **optional enhancement** for claude.ai / desktop only (see
the appendix), never the default.

---

## Core principles

1. **Status first.** Lead every document with a one-line status/score and 3–5 key numbers,
   before any detail. Never bury a failure below the fold.
2. **Every document has:** a summary status, key metrics, and actionable next steps.
3. **Semantic color via emoji** (works in the terminal; hex/CSS does not):
   - ✅ green = good / passing / covered
   - ⚠️ amber = warning / in progress / needs attention soon
   - ❌ red = critical / failing / blocked
   - ℹ️ blue = info / neutral / pending
4. **Structure before content.** Establish the skeleton (header → metrics → sections →
   next steps) before filling it in.
5. **Real data only.** No Lorem Ipsum, no invented numbers. If data is missing, mark it
   `NO DATA` / `OPEN QUESTION` rather than fabricating.
6. **English artifacts, chat may be Spanish** — consistent with the repo convention; do not
   "match the user's language" inside generated documents.

---

## Terminal component catalog

### Status badge
Inline emoji + label: `✅ Passing` · `⚠️ In progress` · `❌ Blocked` · `ℹ️ Pending`.

### Metric row (3–5 numbers)
A compact markdown table — the terminal equivalent of metric cards:

```
| Coverage | Pass rate | Defects | Flakiness |
|----------|-----------|---------|-----------|
| 87% ✅   | 94% ✅    | 12 ⚠️   | 1.3% ✅   |
```

### ASCII progress bar
Ten cells, filled `█` / empty `░`, value on the right:

```
Regression   ███████░░░  73%
API          █████████░  91%
BDD          ████░░░░░░  42% ⚠️
```

Rule of thumb: `filled = round(pct / 10)`. Append a `⚠️`/`❌` when below threshold.

### Comparison table (2–3 options)
One column per option, ✅/❌ per factor, a verdict row last:

```
| Factor        | Option A | Option B |
|---------------|----------|----------|
| Setup effort  | ✅ Low   | ❌ High  |
| Maintenance   | ⚠️ Med   | ✅ Low   |
| Verdict       | **Pick A for speed** | Pick B for scale |
```

### Numbered pipeline / timeline
A numbered list with a one-line description per step:

```
1. Discover    — inventory upstream docs
2. Decisions   — scored options → QD log        ⏸ CP-TODO
3. Generate    — one artifact per block          ⏸ CP-BLOCK
```

Use `⏸ {CP-id}` to mark where a human gate sits.

### Score line
`QA Health: 84/100 — Good ✅` (interpret per the health-score scale below).

---

## Plain-language HITL blocks (for `/qa-task`)

The `/qa-task` cadence in [hitl-workflow.md](hitl-workflow.md) is read by **non-technical
users** (manual QAs, analysts). For its three recurring moments — progress update, approval
gate, summary gate — use these **plain** formats instead of the box-drawing
`STATUS`/`CHECKPOINT` shapes in [output-style.md](output-style.md). No box-drawing, no
exposed checkpoint ids, no jargon columns. The checkpoint id (CP-TODO / CP-BLOCK) is still
recorded in the audit trail; it is just **not shown** to the user.

**Golden rule for every gate:** end with the question **"¿Qué quieres hacer?"** (or "What
do you want to do?") and list the choices as **plain words**, so the user always knows the
next action.

### Progress update (one line, during execution)
A single sentence — what just finished, what's next. No box:

```
✅ Listo el punto 1 (tabla de comandos actualizada). Sigo con el punto 2: la subsección. ¿Reviso contigo o continúo?
```

### Approval gate (the ToDo list — replaces CP-TODO box)
A short "what I'll do" list, then the question. The user-facing table has **only**
`# · Qué voy a hacer` (read-only/write type and touched files stay internal — they drive the
cadence but do not clutter the user's view):

```
**Voy a hacer 2 cambios (en docs/QA-AGENTS-GUIDE.md):**

| # | Qué voy a hacer |
|---|-----------------|
| 1 | … |
| 2 | … |

**¿Qué quieres hacer?**
- ✅ **Aprobar** — empiezo por el punto 1 y te muestro el resultado antes de seguir.
- ✏️ **Editar** — dime qué cambiar (quitar, añadir o reordenar) y te muestro la lista corregida.
- ❌ **Rechazar** — no escribo nada.
```

### Summary gate (end of block — replaces CP-BLOCK box)
A "what changed" list, then the same question:

```
**Listo. Esto es lo que cambié:**

| Archivo | Qué cambió |
|---------|-----------|
| … | … |

**¿Qué quieres hacer?**
- ✅ **Aprobar** — doy por bueno este bloque.
- ✏️ **Editar** — dime el ajuste y te muestro solo lo que cambia.
- ❌ **Rechazar** — lo deshago.
```

Keep the conversation in the user's language (Spanish or English); only the repo artifacts
stay English.

---

## Document types — when to use which

Pick the type from what the user asks for; each has a required skeleton (header + status →
metric row → sections → next steps).

| User asks for… | Document type | Core sections |
|---|---|---|
| document / visualize a QA approach | **Test Strategy** | scope (in/out), test-pyramid bars, tools, risk table, timeline, next steps |
| coverage / metrics report | **Coverage & Metrics Dashboard** | KPI metric row, per-module coverage bars, results trend, top defects table, gaps |
| defect / bug analysis | **Defect Analysis** | severity distribution, defects-by-component bars, found-vs-fixed, top recurring table, root causes, recommendations |
| framework architecture | **Framework Architecture** | layered overview, tech-stack table, folder tree, patterns, CI/CD flow, dos/don'ts |
| sprint / release summary | **Sprint QA Summary** | sprint metric row, execution summary, automation progress, defects by severity, blockers, next commitments |
| CI/CD pipeline doc | **Pipeline Documentation** | numbered pipeline, per-stage table (trigger/runs/pass criteria/on-failure), env map, metrics |
| compare tools / approaches | **Comparison Matrix** | side-by-side cards, factor rating table, pros/cons, recommendation + conditions |
| onboarding guide | **Team Onboarding** | first-week checklist, tech-stack table, process overview, contacts, FAQ, glossary |

Every type ends with an **action list / next steps**.

---

## Metrics glossary & benchmarks

Use these standard formulas and benchmark bands when filling metric rows. Color a value
✅/⚠️/❌ by which band it falls in.

### Coverage
| Metric | Formula | Good | Acceptable | Poor |
|---|---|---|---|---|
| Automation Coverage | (Automated / Total) × 100 | >80% | 50–80% | <50% |
| Code Coverage | Lines covered / Total × 100 | >85% | 60–85% | <60% |
| Requirements Coverage | Requirements tested / Total × 100 | >95% | 80–95% | <80% |
| Regression Coverage | Regression automated / Total × 100 | >90% | 70–90% | <70% |

### Defects
| Metric | Formula | Good | Acceptable | Poor |
|---|---|---|---|---|
| Defect Detection Rate | Found by QA / All × 100 | >85% | 70–85% | <70% |
| Defect Escape Rate | Found in prod / All × 100 | <5% | 5–15% | >15% |
| Defect Removal Efficiency | Removed before release / Total × 100 | >95% | 85–95% | <85% |
| Mean Time to Detect (MTTD) | Avg introduction → detection | <1 day | 1–3 days | >3 days |
| Mean Time to Fix (MTTF) | Avg report → resolution | <2 days | 2–5 days | >5 days |

### Execution
| Metric | Formula | Good | Acceptable | Poor |
|---|---|---|---|---|
| Test Pass Rate | Passed / Executed × 100 | >95% | 85–95% | <85% |
| Test Execution Rate | Executed / Planned × 100 | >95% | 80–95% | <80% |
| Flakiness Rate | Flaky runs / Total × 100 | <2% | 2–5% | >5% |
| Automation ROI | (Manual saved − Automation cost) / Cost × 100 | >200% | 100–200% | <100% |

### Pipeline (CI/CD)
| Metric | Benchmark |
|---|---|
| PR smoke test duration | <10 minutes |
| Full regression duration | <2 hours (parallelized) |
| Pipeline success rate | >90% |
| Test flakiness in CI | <3% |
| Time from commit to feedback | <15 minutes |

### Severity (standard)
| Level | Definition | SLA to fix |
|---|---|---|
| Critical (P0) | System down, data loss, security breach | Same day |
| High (P1) | Major feature broken, no workaround | 1–2 days |
| Medium (P2) | Feature degraded, workaround available | Sprint |
| Low (P3) | Minor / cosmetic | Backlog |

### Test pyramid (recommended distribution)
| Layer | % of total | Execution time |
|---|---|---|
| Unit | 60–70% | Seconds |
| Integration / API | 20–25% | Minutes |
| E2E / UI | 10–15% | Minutes–Hours |

### QA health score
```
QA Health = (Automation Coverage × 0.25) + (Pass Rate × 0.25)
          + (Defect Detection Rate × 0.20) + ((100 − Escape Rate) × 0.20)
          + ((100 − Flakiness Rate) × 0.10) ) / 100
```
Interpretation: **90–100** Excellent · **75–89** Good · **60–74** Needs improvement ·
**<60** Critical attention.

---

## Quality checklist (before presenting)

- [ ] Title + status/score on the first line
- [ ] 3–5 real metrics in a metric row
- [ ] Color coding is semantically correct (✅ good / ❌ bad)
- [ ] Every section has a clear label
- [ ] Action items / next steps present
- [ ] English artifact content; no Lorem Ipsum
- [ ] Plain markdown only in the default path (no `show_widget` dependency)

---

## Appendix — HTML widgets (optional, claude.ai / desktop only)

> **Does not render in the VSCode terminal extension.** Use only when the user is on
> claude.ai or the desktop app and explicitly wants a rich widget. The markdown catalog
> above is always the default and the required fallback.

When generating a widget: call `visualize:read_me` with `["mockup","interactive"]`, then
`show_widget` with full HTML. Use Claude CSS variables for theming and hardcode hex only for
semantic colors:

```
Green  #1D9E75 / #E1F5EE / #085041   Amber #EF9F27 / #FAEEDA / #633806
Red    #D85A30 / #FAECE7 / #993C1D   Blue  #378ADD / #E6F1FB / #0C447C
Purple #AFA9EC / #EEEDFE / #3C3489
```

Ready-to-fill HTML templates (metric cards, tabs, progress bars, comparison grids,
pipelines, score hero) live in
[../../skills/sdlc-visual-docs/references/example-outputs.md](../../skills/sdlc-visual-docs/references/example-outputs.md).
