# Handoff: VacaFlow MVP — UI Prototype

## Overview
This is the UI for the VacaFlow_03 MVP (IGS Solutions): a locally-run absence-request app covering registration, login, an Employee request lifecycle (Draft → Submitted → Approved/Rejected/Cancelled), and a Manager review/approval workflow. The prototype demonstrates all five screens and the full lifecycle with simulated client-side state.

## About the Design Files
The bundled file (`VacaFlow.dc.html`) is a **design reference built in HTML** — a clickable prototype with simulated in-browser state (plain React-like state, no real backend, no persistence). It is not production code to copy directly. The task is to **recreate this UI in the target stack defined by the project's own architecture documents**: a Next.js web app calling an ASP.NET Core Minimal API backed by SQLite, following the reduced Onion Architecture (Domain, Application, Infrastructure, API, Web) already specified in this project's `software-architecture-document.md`, `functional-spec.md`, and `business-rules.md`. Do not introduce MediatR, CQRS, generic repositories, or messaging frameworks — the target architecture explicitly excludes them.

## Fidelity
**High-fidelity.** Colors, spacing, typography, and copy in this prototype are final for the MVP visual direction. Recreate pixel-close using the target stack's styling approach (CSS Modules / Tailwind / styled-components — whatever the Next.js app already uses; if the app doesn't exist yet, plain CSS or CSS Modules is a safe default).

## Business Rules the UI Must Enforce
The prototype simulates these client-side for demo purposes, but **in the real app all of them must be enforced server-side** (per `business-rules.md`); the UI only needs to *reflect* server responses and disable/hide actions optimistically:
- End date ≥ start date; start date ≥ today (BR-DATE-001, BR-DATE-002)
- Only Draft requests are editable (BR-LIFE-003)
- Only Draft/Submitted requests are cancellable (BR-LIFE-004)
- Only Submitted requests can be approved/rejected (BR-LIFE-005)
- Approved/Rejected/Cancelled are terminal states (BR-LIFE-002)
- A Manager cannot approve/reject their own request (BR-ROLE-003)
- Public registration always creates Employee role; Manager accounts are seed/admin-only (BR-AUTH-001, BR-AUTH-003)
- Employee identity and approver identity must come from the authenticated session, never from a request-body field (BR-IDEN-001, BR-IDEN-002) — the frontend must never send an employee/approver ID for a business decision; rely on the session cookie only

## Screens / Views

### 1. Login
- **Purpose:** Authenticate an existing Employee or Manager.
- **Layout:** Full-viewport flex container, centered card, `max-width: 420px`, padding `40px`, white background, `1px solid #e2e6ec` border, `border-radius: 14px`, shadow `0 8px 24px rgba(16,24,40,0.06)`.
- **Components:**
  - Kicker label "IGS Solutions" — 12px, weight 600, uppercase, letter-spacing 0.08em, color `#64748b`
  - Title "VacaFlow" — 28px, weight 700, color `#1c2430`
  - Subtitle "Gestión de solicitudes de ausencia" — 14px, `#64748b`
  - Error banner (conditional): background `#fdecec`, text `#b42318`, 13px, padding `10px 14px`, radius 8px. Copy: "Correo o contraseña incorrectos." — generic message, does not reveal whether email or password was wrong (FR-AUTH-005)
  - Email input, password input: full width, padding `10px 12px`, border `1px solid #d0d5dd`, radius 8px, 14px font
  - Primary button "Iniciar Sesión": full width, padding 12px, background accent color (default `#2451c4`, tweakable), white text, weight 600, radius 8px; hover = `filter: brightness(0.92)`
  - Footer link row: "¿No tienes cuenta? Regístrate" → navigates to Register
  - Demo-accounts hint box (toggleable): light gray box listing seeded credentials

### 2. Register
- **Purpose:** Self-service Employee signup only.
- **Layout:** Same card shell as Login.
- **Components:**
  - Name, Email, Password inputs (same style as Login)
  - **Role field is not a selector** — shown as a fixed, disabled-looking pill: "Empleado" (background `#eef1f5`, radius 999px, padding `6px 12px`, 13px weight 600, color `#475467`), plus a caption: "Las cuentas de Manager se crean mediante datos semilla o un proceso administrativo controlado; no están disponibles en el registro público." This directly reflects BR-AUTH-001/003 — **do not add a role selector on this screen in the real implementation.**
  - Error banner (duplicate email / missing fields)
  - Primary button "Crear Cuenta"
  - Footer link to Login

### 3. Employee Request List (home for Employee role)
- **Purpose:** View own requests across all lifecycle states; start new requests; act on Draft/Submitted ones.
- **Layout:** App shell (see "Shared App Shell" below) + content container `max-width: 1040px`, `margin: 0 auto`, `padding: 32px`.
- **Header row:** flex, `justify-content: space-between`, title "Mis Solicitudes de Ausencia" (24px/700) + subtitle (14px/`#64748b`) on the left; "+ Nueva Solicitud" primary button on the right.
- **Request card** (one per request, `margin-bottom: 14px`): white, `1px solid #e2e6ec`, radius 12px, padding `20px 24px`, flex row (`justify-content: space-between`, wraps).
  - Left block: absence-type label (16px/700) + status badge inline (see badge colors below); date range (14px/`#475467`); reason in italics (13px/`#8a94a6`), quoted
  - If the request has a final decision: a note box below (background `#f4f6f9`, radius 8px, 13px, `#475467`) reading `"<Aprobada|Rechazada> por <manager name>: "<comment>""` (comment omitted if empty)
  - Right block (action buttons, stacked, only shown per current state):
    - Draft → "Editar" (outline), "Enviar" (primary), "Cancelar" (red outline)
    - Submitted → "Cancelar" only
    - Approved / Rejected / Cancelled → no actions
- **Empty state:** dashed border box, centered muted text, when the employee has zero requests.

### 4. Request Form (Create / Edit Draft)
- **Purpose:** Create a new Draft, or edit an existing Draft.
- **Layout:** Back link "← Volver a Mis Solicitudes" + heading ("Nueva Solicitud" or "Editar Solicitud"), then a single white card (`max-width: 640px`, padding 28px, radius 12px, border `1px solid #e2e6ec`).
- **Fields:**
  - Absence Type — `<select>` populated from the seeded catalog (Vacaciones / Permiso Personal / Licencia por Enfermedad ↔ Vacation / Personal Leave / Sick Leave server-side)
  - Start Date / End Date — two `type="date"` inputs side by side (flex, gap 16px); start date's native `min` = today
  - Reason — textarea, 3 rows, resizable vertically
  - Error banner at top of card when validation fails (missing field / end < start / start in past)
- **Footer actions** (right-aligned, gap 10px): "Cancelar" (ghost, returns without saving), "Guardar Borrador" (outline, saves as Draft), "Enviar para Revisión" (primary, saves and transitions straight to Submitted)

### 5. Manager Review Queue (home for Manager role)
- **Purpose:** Review Submitted requests assigned to this manager; approve or reject with an optional comment.
- **Layout:** Same shell/content container as screen 3.
- **Header:** "Cola de Revisión" (24px/700) + subtitle "Solicitudes enviadas que esperan tu decisión."
- **Queue card** per Submitted request (excludes the manager's own requests — self-approval guard, BR-ROLE-003): employee name + type (15px/700), date range, reason (italic), "Enviada" badge (amber) top-right; a comment textarea (2 rows, optional); footer buttons "Rechazar" (red outline) and "Aprobar" (green fill `#1f7a4d`).
- **Empty state:** dashed box, "No hay solicitudes pendientes de revisión."
- **Decisiones Recientes** (secondary section below the queue): compact read-only rows of requests this manager has already decided, each showing employee + type + date range + result badge (Aprobada/Rechazada). Demonstrates that the Approval record (BR-APPR-002) persists and is retrievable.

## Shared App Shell (screens 3–5, once authenticated)
- **Top bar:** height 64px, white background, bottom border `1px solid #e2e6ec`, `padding: 0 32px`, sticky, flex `justify-content: space-between`.
  - Left: 32×32px logo mark (rounded 8px, accent-color background, white "V", weight 700) + "VacaFlow" (15px/700) stacked over "IGS Solutions" (11px, `#8a94a6`); then role-appropriate nav button(s) — Employee sees "Mis Solicitudes", Manager sees "Cola de Revisión". Active nav item: background `#eef2fb`, text = accent color. Inactive: transparent background, text `#64748b`.
  - Right: user name (13px/600) over role label (11px, `#8a94a6`), right-aligned; "Salir" (logout) outline button.
- A user only ever sees the nav item(s) for their own role — there is no role switcher in the shell.

## Status Badge Colors (used across screens 3 and 5)
| State | Label (ES) | Background | Text |
|---|---|---|---|
| Draft | Borrador | `#eef1f5` | `#475467` |
| Submitted | Enviada | `#fdf1de` | `#a15c00` |
| Approved | Aprobada | `#e6f4ec` | `#1f7a4d` |
| Rejected | Rechazada | `#fdecec` | `#b42318` |
| Cancelled | Cancelada | `#eef1f5` | `#8a94a6` |

Badge shape: pill, `border-radius: 999px`, `padding: 4px 10px`, `font-size: 11px`, `font-weight: 700`, `letter-spacing: 0.02em`.

## Interactions & Behavior
- All navigation is client-side view-swapping in the prototype; in the real app, screens 3–5 should be real Next.js routes (e.g. `/requests`, `/requests/new`, `/requests/[id]/edit`, `/manager/queue`) guarded by the authenticated session, with server-side redirects by role (Employee → `/requests`, Manager → `/manager/queue`).
- Login/Register buttons and all mutating actions (submit/cancel/approve/reject/save) should show a loading state and disable the button while the request is in flight (not modeled in the static prototype — add this in the real build).
- Errors returned by the API (400/403/422/401) should map to the same banner style already used in the prototype's inline "formError" / "loginError" boxes.
- Hover states throughout: buttons darken via `filter: brightness(0.92)` (primary/accent) or a light gray background (outline/ghost buttons).

## State Management
Real implementation should not simulate business logic client-side. Needed client state is limited to:
- Current authenticated user (name, email, role) — fetched from a `GET /me`-style endpoint or session, never trusted from local state alone
- Form field values for login/register/request-create/edit (controlled inputs)
- List of the current user's requests (Employee) or the manager's Submitted queue + recent decisions (Manager) — fetched from the API, not held as mock arrays
- Per-row optional comment draft (Manager queue) before approve/reject is submitted

State transitions (Draft→Submitted, →Approved/Rejected/Cancelled) must be driven by API responses, not optimistic local mutation, given the business-rule enforcement requirement.

## Design Tokens
**Colors**
- Ink (primary text): `#1c2430`
- Body text / secondary: `#475467`
- Muted text: `#64748b` / `#8a94a6`
- Borders: `#e2e6ec` / `#d0d5dd`
- Surface: `#ffffff`
- Page background: `#f4f6f9`
- Accent (tweakable in the prototype; MVP default): `#2451c4` — other curated options exposed as tweaks: `#0f766e`, `#7c3aed`, `#b45309`
- Success/Approved: `#1f7a4d` on `#e6f4ec`
- Warning/Submitted: `#a15c00` on `#fdf1de`
- Danger/Rejected: `#b42318` on `#fdecec`
- Neutral/Draft-Cancelled: `#475467` / `#8a94a6` on `#eef1f5`

**Typography:** IBM Plex Sans (400/500/600/700), system-ui fallback. Title 28px/700 (auth cards), page H1 24px/700, card title 15–16px/700, body 14px/400, small/meta 11–13px.

**Spacing:** Card padding 20–40px depending on context; card radius 12–14px; button radius 8px; badge radius 999px (pill); gaps 8–24px depending on density.

**Shadows:** Auth cards only — `0 8px 24px rgba(16,24,40,0.06)`. List/queue cards use a border instead of a shadow.

## Assets
No external images/icons — the logo is a plain colored square with a "V" glyph. No icon font or SVG iconography is used in this design; keep it that way unless the target design system specifies otherwise.

## Files
- `VacaFlow.dc.html` — the full interactive prototype (open directly in a browser). Contains all 5 screens, seeded demo data (2 employees, 1 manager, 6 sample requests across all five states), and the client-simulated lifecycle logic described above.
- `screenshots/01-login.png` — Login
- `screenshots/02-register.png` — Register
- `screenshots/03-employee-list.png` — Employee Request List
- `screenshots/04-request-form.png` — Request Form (Create)
- `screenshots/05-manager-queue.png` — Manager Review Queue
