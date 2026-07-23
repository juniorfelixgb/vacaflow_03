# Handoff: VacaFlow — Absence Request Management (Redesign)

## Overview
VacaFlow is the absence/leave request management app for **IGS Solutions**. This handoff
covers a visual redesign of the **three key screens** of the existing product, keeping the
**same functionality** the current codebase already implements (no new features). The redesign
warms up a generic Tailwind default UI into an approachable, human HR product using an
orange + light‑gray palette and the JetBrains Mono typeface. Language is **English**; target is
**responsive web (Next.js)**.

The three screens are:
1. **Employee · My Requests** — list & history of the employee's own absence requests.
2. **Employee · Request Detail** — a single request with status timeline and draft actions.
3. **Manager · Review Request** — a manager approving/rejecting a submitted request.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing the
intended look and behavior, **not production code to copy directly**. The task is to
**recreate these designs in the existing VacaFlow codebase** (Next.js 16 App Router + React 19 +
Tailwind CSS v4 — see `vacaflow-web/`), reusing its established routing, data fetching, and
component patterns. Wire the visuals onto the API calls the current pages already make (see
"State Management & Data" below); do not ship the HTML as-is.

The prototype is a single self-contained Design Component (`VacaFlow Prototypes.dc.html`) with
all three screens laid out on one canvas. Each screen is a `[id="1a"]` / `[id="1b"]` / `[id="1c"]`
wrapper. Ignore the canvas scaffolding (badges, outer padding) — only the inner "app frame" of
each screen is the design.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, and shadows are specified
below with exact values. Recreate pixel-perfectly using the codebase's existing libraries and
Tailwind config. Sample data (names, dates, request IDs) is illustrative — bind to real API data.

---

## Design Tokens

### Colors
| Token | Hex | Usage |
|---|---|---|
| Primary / orange | `#EA580C` | Primary buttons, active nav, brand mark, key numbers |
| Primary hover | `#C2410C` | Button/link hover, accent text, "View" links |
| Primary deep | `#9A3412` | Link hover (text links) |
| Orange tint bg | `#FFF3EC` | Active nav pill, avatar bg, type-icon bg (`#FBF3EC` variant) |
| Warm tint panel | `#FBF7F2` | Sidebar promo card, reviewer box (border `#F0E9DF`) |
| Page canvas (outer) | `#EDE8E2` | Behind the app frame |
| App bg | `#F7F4F0` | App frame background |
| Surface / card | `#FFFFFF` | Cards, sidebar, header, table |
| Table header bg | `#FBF8F4` | Table column-header row |
| Ink / heading | `#1C1917` | Headings, primary text, dark sidebar (manager) |
| Body text | `#44403C` | Paragraphs, reason text |
| Muted text | `#57534E` / `#78716C` | Secondary labels, nav idle |
| Faint text | `#A8A29E` / `#B0A99F` | Meta, uppercase labels, timestamps |
| Border (warm) | `#EDE7DF` / `#E1DAD1` / `#EFEAE3` | Card borders, dividers, frame border |
| Hairline divider | `#F2ECE4` | Row separators, in-card rules |
| Green (approve) | `#16A34A` (dot `#22C55E`, bg `#E7F6EC`, text `#15803D`, border `#C6EBD1`) | Approve button, Approved status |
| Amber (submitted) | dot `#F59E0B`, bg `#FEF3E2`, text `#B45309`, border `#FBE2C1` | Submitted/pending status |
| Red (reject) | text `#B91C1C`, bg `#FDECEC`, border `#F6D3D3` (btn border `#F0CFCF`) | Reject, Rejected status, cancel |
| Gray (draft) | dot `#A8A29E`, bg `#F5F3F0`, text `#78716C`, border `#E7E2DA` | Draft status |
| Gray (cancelled) | dot `#B0A99F`, bg `#F1EEEA`, text `#8A817A`, border `#E4DED6` | Cancelled status |

### Typography
- **Font family:** `'JetBrains Mono', ui-monospace, monospace` — used everywhere (Google Fonts, weights 400/500/600/700/800; italic 400 available).
- **Page/screen H1:** 25–27px, weight 800, letter-spacing −0.6 to −0.8px, color `#1C1917`.
- **Section/card title:** 13px, weight 800, letter-spacing −0.2px.
- **Body / reason:** 14px, weight 400/500, line-height 1.75, color `#44403C`.
- **Table cell primary:** 13px, weight 700. **Secondary:** 11–12px, color `#B0A99F`/`#78716C`.
- **Uppercase field labels:** 11px, weight 700, letter-spacing 0.6px, text-transform uppercase, color `#A8A29E`.
- **Status pill text:** 11px, weight 700. **Nav item:** 13px (idle 500, active 700).
- **Meta / timestamps:** 11–12px, color `#B0A99F`.

### Spacing & layout
- App frame: width 1300px (desktop reference), min-height 820px, radius 20px, border `1px #E1DAD1`, shadow `0 30px 60px -30px rgba(60,40,20,.28)`.
- Sidebar: width 250px, padding 26px 18px.
- Header bar: padding 20px 36px, bottom border `1px #EFEAE3`, white.
- Main content padding: 34px 40px (list uses 34px 36px).
- Card padding: 24–26px. Grid gaps: 16–28px.

### Radii
- Buttons / inputs / cards inner: 12px · Cards: 16px · App frame: 20px · Nav items: 11px
- Type-icon tiles: 10–14px · Avatars: 11px (36–38px) / 14px (52px) · Status pills: 999px

### Shadows
- Primary orange button: `0 8px 20px -8px rgba(234,88,12,.6)`
- Approve (green) button: `0 8px 20px -8px rgba(22,163,74,.55)`
- App frame: `0 30px 60px -30px rgba(60,40,20,.28)`

### Icons
Simple stroke SVG line icons (stroke-width ~2, `currentColor`, round caps/joins): grid (dashboard),
list-lines (my requests), check-in-square (review queue), arrow-left (back), plus, paper-plane
(submit), pencil (edit), check (approve/timeline), x (reject). Absence types use emoji
(🏝️ Vacation, 🤒 Sick Leave, 📋 Personal). Replace emoji with the codebase's icon set if one exists.

---

## Screens / Views

### 1. Employee · My Requests  (`[id="1a"]`)
**Purpose:** Employee views and tracks all their own absence requests; entry point to create a new one.

**Layout:** App frame = flex row. Left **sidebar (250px, white)**: brand (orange "V" tile + "VacaFlow"),
nav (Dashboard idle, **My Requests** active = `#FFF3EC` bg / `#C2410C` text / weight 700), and a
bottom promo card ("Need time off?" + dark "+ New Request" button). Right **main** = white top header
(org label left; user block "Alex Morgan / Employee" + `AM` avatar right) over content.

**Content components:**
- **Title block:** H1 "My Requests" + subtitle "Track your absence requests from draft to decision."; right-aligned **orange "New Request" button** (plus icon, radius 12px, orange shadow).
- **Filter tabs (pills, radius 999px):** `All · 5` (active — white bg, orange 1px border + inset ring), then `Draft · 1`, `Submitted · 1`, `Approved · 1`, `Closed · 2` (idle: `#78716C` text, border `#EAE3DA`). *These filter existing data client-side; no new backend.*
- **Requests table (white card, radius 16px):** column header row (bg `#FBF8F4`, uppercase 11px labels) with a 5-column grid `1.6fr 1.7fr 1fr 1fr 0.7fr` = **Type · Dates · Status · Created · Action**.
  - **Type cell:** emoji tile (34px, `#FBF3EC`) + request type (13px/700) + request id (`RQ-1042`, 11px `#B0A99F`).
  - **Dates cell:** human date range (13px `#44403C`) + "N working days" (11px `#B0A99F`).
  - **Status cell:** status pill (dot + label) — see status color tokens.
  - **Created cell:** date, 12px `#78716C`. **Action:** "View ›" link, orange `#C2410C`, weight 700 → navigates to Request Detail.
- Rows separated by `1px #F2ECE4`. Sample rows: Vacation/Submitted, Sick Leave/Approved, Vacation/Draft, Personal/Rejected, Vacation/Cancelled.

### 2. Employee · Request Detail  (`[id="1b"]`)
**Purpose:** View one request; for a **Draft**, edit / submit / cancel it. Shows lifecycle timeline.

**Layout:** Same sidebar (My Requests active). Header shows **"← Back to requests"** link (left) + user block (right). Main content is a **2-column grid `1.55fr 1fr`**, gap 28px.

**Left column:**
- **Header row:** 52px emoji tile (`#FBF3EC`) + H1 "Vacation" + meta "Request RQ-1035 · created Jul 20, 2026"; right-aligned **Draft** status pill.
- **Details card (white, radius 16px, padding 26px):** two-column Start/End dates (11px uppercase label + 16px/700 value + weekday in `#B0A99F`), hairline divider, then **Reason** label + paragraph (14px, line-height 1.75).
- **Draft actions (flex, wrap):** **"Submit for approval"** (orange, paper-plane icon, orange shadow) · **"Edit"** (white, `#E4DDD3` border, pencil icon) · **"Cancel request"** (white, red text `#B91C1C`, `#F3D6D6` border). *Buttons shown depend on status — see state rules.*

**Right column — Request timeline (white card):**
- Vertical stepper: **Step 1 "Created as draft"** = filled orange circle w/ check + timestamp (done). **Step 2 "Submitted for approval"** = dashed circle "2", muted, "Pending — submit when ready". **Step 3 "Manager decision"** = dashed circle "3", "Awaiting review". Connectors are 2px `#F0E4D8` lines.
- **Reviewer box** (warm `#FBF7F2`): "Reviewer" label + `JP` tile + "James Parker / Your manager".

### 3. Manager · Review Request  (`[id="1c"]`)
**Purpose:** Manager reviews a submitted request and approves or rejects it with an optional comment.

**Layout:** **Dark sidebar** (`#1C1917`) to distinguish the manager context: brand (white text), "MANAGER" caption (`#78716C`), nav (Dashboard idle white `#D6D3D1`; **Review Queue** active = orange `#EA580C` bg / white), bottom stat card (`#292524`) big "3" + "requests awaiting your review". Header: "← Back to queue" (left) + "James Parker / Manager" + dark `JP` avatar (right). Main content = **2-column grid `1fr 1.5fr`**, gap 28px.

**Left column — Employee card (white):** `AM` avatar (52px, orange tint) + "Alex Morgan" + "Design Team · Employee"; divider; **Absence type** ("🏝️ Vacation (VAC)"); Start/End dates two-up; a warm strip "Total absence — **5 working days**" (`#C2410C`); "Submitted Jul 21, 2026 · 09:12".

**Right column:**
- Title "Review request" + subtitle "Read the request and record your decision. The employee will see your comment."
- **Reason card (white):** uppercase "Reason from employee" label + paragraph.
- **Decision card (white):** "Your comment (optional)" label + textarea (min-height 96px, `#E4DDD3` border, `#FBFAF8` bg; prototype shows sample text + a caret). Actions row: **Approve** (green `#16A34A`, check icon, full-width flex:1, green shadow) + **Reject** (white, red text, x icon, `#F0CFCF` border, flex:1).

---

## Interactions & Behavior
- **My Requests → View:** navigates to `/requests/[id]` (Request Detail).
- **New Request button (×2):** navigates to `/requests/new`.
- **Filter tabs:** client-side filter of the already-fetched list by status (All/Draft/Submitted/Approved/Closed where Closed = Rejected+Cancelled). Active tab styling as specified.
- **Request Detail — Submit:** POST `…/submit` → status Draft→Submitted; advances timeline step 2.
- **Request Detail — Edit:** toggles inline edit form (start date, end date, reason) then PUT `…/{id}`. Only available while **Draft**.
- **Request Detail — Cancel request:** confirm dialog → POST `…/cancel`. Available for Draft and Submitted.
- **Manager — Approve / Reject:** POST `…/approve` or `…/reject` with `{ comment }` → returns to review queue.
- **Hover states:** buttons darken (orange `#EA580C`→`#C2410C`; green `#16A34A`→~`#15803D`); nav idle rows may get a subtle `#FBF7F2` hover; table rows subtle warm hover; text links `#C2410C`→`#9A3412`.
- **Loading states:** buttons show "Submitting…/Saving…/Processing…" and disable (disabled bg `#gray-400` in current code — restyle to a muted warm tone). List shows "Loading requests…".
- **Error states:** inline banner, red-tinted (`bg #FDECEC`, border `#F6D3D3`, text `#B91C1C`).
- **Responsive:** below ~900px collapse the 2-column detail/review grids to a single column; sidebar becomes a top bar or drawer; table rows reflow to stacked cards. (Prototype is drawn at desktop reference width 1300px.)

## State Management & Data
Bind to the endpoints the current pages already use (base `http://localhost:5000/api`, `credentials: 'include'`):
- **My Requests:** `GET /requests` → `{ id, absenceTypeId, startDate, endDate, reason, status, createdAt }[]`.
- **Request Detail:** `GET /requests/{id}`; actions `PUT /requests/{id}`, `POST /requests/{id}/submit|cancel`. `approvalComment` shown when present.
- **Manager Queue → Review:** `GET /requests/submitted/all`; detail `GET /requests/{id}` (includes `employeeId`, `submittedAt`); actions `POST /requests/{id}/approve|reject` with body `{ comment }`.
- **Absence types (new request):** `GET /absence-types` → `{ id, code, nameEn, nameEs }[]`.
- **Current user / role:** `GET /users/me` → `{ id, fullName, email, role }`; `role === 'Manager'` unlocks the manager surfaces.
- **Statuses:** `Draft | Submitted | Approved | Rejected | Cancelled`.
- State vars per current code: `requests`, `request`, `loading`, `actionLoading`, `error`, `isEditing`, `editData`, `reviewData.comment`.

**Status → pill mapping:** Draft (gray), Submitted (amber), Approved (green), Rejected (red), Cancelled (gray). "Closed" tab = Rejected + Cancelled.

## Assets
- **Font:** JetBrains Mono via Google Fonts.
- **Icons:** inline stroke SVGs (listed above) — swap for the codebase's icon library if present.
- **Absence-type glyphs:** emoji in the prototype (🏝️/🤒/📋) — replace with the app's icon set if available.
- No raster images or logos required; the brand mark is a CSS tile with the letter "V".

## Files
- `VacaFlow Prototypes.dc.html` — the HTML prototype containing all three screens (design reference).
- `screenshots/01-employee-my-requests.png`
- `screenshots/02-employee-request-detail.png`
- `screenshots/03-manager-review-request.png`
- Existing codebase to recreate into: `vacaflow-web/` (Next.js App Router; relevant pages under `app/requests/`, `app/requests/[id]/`, `app/manager/review/[id]/`).
