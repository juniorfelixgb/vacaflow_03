# QA SDET — Quick Start (from zero)

**Who this is for:** any QA — including manual QAs — getting started with the Claude Code QA
agents for the first time. You do **not** need to be a developer. You describe what you want;
the agents do the heavy lifting and stop for your approval at every important step.

> Want the big picture first? Open the **KT deck**: `docs/kt/qa-agents-kt.html`.
> Want the deep reference? Open `docs/QA-AGENTS-GUIDE.md`.

---

## In one minute

- The toolkit lives in a `.claude/` folder copied into the project.
- You work through **slash commands** in Claude Code. Start every session with `/qa-orchestrator`.
- The agents are **human-gated**: at each checkpoint (CP-NN) they wait for **Approve / Edit / Reject**.
- Two things work for manual QAs with no command at all — just type them in chat:
  *"design manual test cases for story 6628938"* and *"I found a bug: …"*.

---

## Step 1 — Clone and install

```bash
git clone <repository-url>
cd your-project
npm install
```

## Step 2 — Configure your `.env`

Credentials and URLs come from environment variables — never hardcoded.

```bash
cp .env.example .env
```

Then open `.env` and set:

```
URL=https://your-app-under-test/login
USERNAME=your-test-user
PASSWORD=your-password
```

If you use Azure DevOps integration, also add a Personal Access Token
(*Azure DevOps → User Settings → Personal Access Tokens*):

```
AZURE_DEVOPS_PAT=your-personal-access-token
```

## Step 3 — Run `/qa-setup`

Open Claude Code and type:

```
/qa-setup
```

- **New project** (no `docs/qa-config.yaml` yet): the agent asks the setup intake questions and
  generates the single config file. The whole file waits for your **CP-1** approval before it's written.
- **Already configured**: the agent verifies your environment (folders, dependencies, Playwright
  config, env vars) and prints a checklist report.

## Step 4 — Start working

```
/qa-orchestrator
```

The orchestrator reads the config, checks the repo, and routes you to the right lane. It enforces
the quality gates before any test is written: **100% AC coverage**, **max 10 test cases per wave**,
and a **PR checkpoint** between waves.

Run your first ad-hoc task with the human-gated runner:

```
/qa-task "design manual test cases for story 6628938"
```

---

## Cheat sheet — "I want to… → run…"

| I want to… | Run |
|---|---|
| Start a session / route my work | `/qa-orchestrator` |
| Do any task with approvals as I go | `/qa-task "…"` |
| Set up or verify a project | `/qa-setup` |
| Automate a lane (its `style` decides POM specs, Gherkin, or API requests) | `/qa-lane <lane-name> <ADO-ID \| module \| feature \| endpoint>` |
| Run the full pipeline for one work item | `/qa-loop <ADO-ID or PBI>` |
| Design manual cases / report a bug | just describe it in chat |
| Produce a release go / no-go report | `/qa-release-report` |

> `<lane-name>` comes from `docs/qa-config.yaml` — the shipped template has
> `regression` (POM specs), `acceptance` (Gherkin + steps), and `api` (request-fixture
> tests, opt-in).
>
> `/qa-orchestrator` vs `/qa-task`: use the **orchestrator** when you already know it's a
> test-automation job and want the right pipeline; use **qa-task** for an open-ended task,
> improvement, or question where you want to plan and approve before any work starts. They hand
> off to each other freely.

---

## The one habit that keeps this safe

The agents never act behind your back. At every checkpoint you decide:

- **Approve** → continue
- **Edit** → adjust, then continue
- **Reject** → stop

You stay in control. You just stop typing the boilerplate.

---

## Where to go next

| Open this | For |
|---|---|
| `docs/kt/qa-agents-kt.html` | The visual Knowledge Transfer deck (what / how / when / flows) |
| `docs/QA-AGENTS-GUIDE.md` | The deep reference: every command, all lanes, troubleshooting, examples |
| `.claude/docs/reference/` | The 37 canonical rule docs — the source of truth for every standard |
