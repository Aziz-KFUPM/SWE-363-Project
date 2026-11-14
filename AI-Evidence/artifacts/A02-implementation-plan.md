# HeatShield Phase 3 – Front-end scaffold plan

## Context

Phase 3 of the SWE363 project (HeatShield: Outdoor Work Safety Planner) starts the front-end
implementation of the 18 Figma wireframes described in `Phase-3-Requirements-with-Figma.docx`
(requirements FR-G1..G3, FR-W1..W5, FR-SV1..SV7, FR-A1..A2, FR-N1). There is **no backend and no
database** in this phase: every screen runs on in-memory mock data. The code must be simple,
minimalist React (JavaScript), with only short one-line comments.

The work is shared by three people. This plan creates **every file the whole app needs**, fully
implements the part owned by the user (app shell + Guest + Worker), and leaves the rest as runnable
stub pages with a one-line `// TODO: to be implemented by <name>` comment.

Decisions already made with the user:
- Tooling: **Vite + React (JS) + react-router-dom + one plain CSS file**. No UI, chart or map libraries.
- User (Aziz) implements: app shell, routing, layout, shared components, mock data, Register, Login,
  First-login, Profile, My Day, Assignment details (check-in / break / complete / couldn't finish),
  Report incident.
- **Abdulrahman**: Worksites (SV1), Risk dashboard (SV2), Shift planner (SV3), Daily checklist (SV4).
- **Abdulaziz**: Live board (SV5), Incidents (SV6), Reports (SV7), User management (A1),
  Safety rules (A2), Notifications (N1).

Visual style (from the wireframes): white header with bottom border, light-grey sidebar
(role title + stacked nav buttons, active one dark), page background `#f7f7f7`, page title +
grey subtitle line `Friday 10 July 2026 / Asia/Riyadh / Fictional demonstration records`,
dark filled primary buttons, outlined secondary buttons, grey info/warning banners with `i` / `!`
icon, simple bordered tables, cards with 1px border. Footer disclaimer on every page:
`Operational planning only. Heat estimates do not certify safe exposure or legal compliance.`
Buttons ≥ 44px tall, base font 16px (NFR-3). Risk level always shown as text + icon (NFR-4).

**Styling enhancements (minor, layout stays as the wireframes):**
- Primary accent instead of flat black: deep teal/navy (e.g. `#1f4e5f`) for primary buttons, active
  sidebar item and links; hover/focus states on buttons, inputs and table rows.
- Risk-level colors, used together with text + icon: Low green `#2e7d32`, Caution amber `#b26a00`,
  High orange-red `#d84315`, Extreme red `#b71c1c`; shown as a small colored badge/pill.
- Banner variants: info (grey), warning (amber tint), danger (red tint) for the paused-work and
  blocked states; success (green tint) for confirmations like "Checked in at 06:42".
- Status badges in tables (Scheduled / In progress / On break / Completed / Incomplete / Missed)
  with subtle tinted backgrounds; inline error text in red under invalid fields.
- Cards and inputs with slight border-radius and a soft shadow; sidebar slightly tinted.
All colors live as CSS variables at the top of `styles.css` so the team can tweak them in one place.

## Project layout

Create the app inside the existing empty folder `project-code/FrontEnd/`:

```
FrontEnd/
  index.html
  package.json            (vite, react, react-dom, react-router-dom)
  vite.config.js
  README.md               run instructions + file ownership table
  src/
    main.jsx              BrowserRouter + AuthProvider + <App/>
    App.jsx               all <Routes>
    styles.css            single global stylesheet
    AuthContext.jsx       current user, login(email,pw), logout(); demo accounts
    data/mock.js          all demo data (see below)
    components/
      Layout.jsx          header (HeatShield / company / role, Alerts(n), Profile, Log out),
                          sidebar by role, <Outlet/>, footer disclaimer; redirects to /login if no user
      GuestLayout.jsx     header with Log in / Register buttons, <Outlet/>, footer
      PageTitle.jsx       h1 + the grey subtitle line
      Banner.jsx          grey info/warning box: props icon ("i" | "!"), children
      Modal.jsx           simple centered dialog over grey overlay: props title, onClose, children
      Field.jsx           label + input/select/textarea + inline error text
    pages/
      guest/Landing.jsx         FR-G1 landing: short pitch + Register Company / Log in buttons
      guest/Register.jsx        FR-G1 form, inline validation, success message → /users
      guest/Login.jsx           FR-G2 form, generic error, demo accounts panel, role redirect
      guest/FirstLogin.jsx      FR-G2 change temporary password
      Profile.jsx               FR-G3
      Notifications.jsx         FR-N1  (stub – Abdulaziz)
      worker/MyDay.jsx          FR-W1 normal / no-tasks / paused banners, task table → /tasks/:id
      worker/WorkConditions.jsx FR-W1 site risk card + restricted period (sidebar "Work conditions")
      worker/TaskDetails.jsx    FR-W2/W3/W4: details card, schematic map box, Check In,
                                location-warning modal with reason, break timer, complete modal,
                                couldn't-finish modal
      worker/ReportIncident.jsx FR-W5 form + submitted confirmation
      supervisor/Worksites.jsx     FR-SV1 (stub – Abdulrahman)
      supervisor/RiskDashboard.jsx FR-SV2 (stub – Abdulrahman)
      supervisor/ShiftPlanner.jsx  FR-SV3 (stub – Abdulrahman)
      supervisor/Checklist.jsx     FR-SV4 (stub – Abdulrahman)
      supervisor/LiveBoard.jsx     FR-SV5 (stub – Abdulaziz)
      supervisor/Incidents.jsx     FR-SV6 (stub – Abdulaziz)
      supervisor/Reports.jsx       FR-SV7 (stub – Abdulaziz)
      admin/Users.jsx              FR-A1 (stub – Abdulaziz)
      admin/SafetyRules.jsx        FR-A2 (stub – Abdulaziz)
```

### Routes (App.jsx)

| Path | Page | Who sees it |
|---|---|---|
| `/`, `/register`, `/login`, `/first-login` | guest pages inside `GuestLayout` | guest |
| `/profile`, `/notifications` | inside `Layout` | any logged-in role |
| `/my-day`, `/tasks/:id`, `/conditions`, `/report-incident` | worker pages | worker |
| `/dashboard`, `/worksites`, `/planner`, `/checklist`, `/live-board`, `/incidents`, `/reports` | supervisor pages | supervisor / safety officer |
| `/users`, `/safety-rules` | admin pages | admin |

Login redirect per role (FR-G2): worker → `/my-day`, supervisor → `/dashboard`, admin → `/users`.
Sidebar links per role come from one small array in `Layout.jsx`:
- Worker: My Day, Work conditions, Report incident
- Supervisor: Risk dashboard, Worksites, Shift planner, Live board, Incidents, Reports
- Admin: User management, Safety rules

### Auth (AuthContext.jsx)

`useState` for `user`, mirrored to `localStorage` so refresh keeps the session. `login` matches
email against `mock.users` and password `HeatDemo1!`, returns `false` on mismatch. No tokens, no API.

### Mock data (data/mock.js)

Plain exported arrays/objects, fictional values taken from the wireframes:
- `company`: `Desert Maintenance Co.`, timezone Asia/Riyadh, demo date `Friday 10 July 2026`
- `users`: Sara Ahmad (admin), Ali Hassan (worker), Noura Saleh (safety officer), supervisor; all `@heatshield.test`
- `worksites`: Worksite B / Pump Station (5 workers, 26.306 N 50.147 E), Worksite A / Road Maintenance (3 workers)
- `weather`: per site temp, humidity, heat index, level, readiness, updated time (B: 35/42/37 Caution Ready; A: 38/46/44 High Not ready)
- `tasks`: A-104 Pump maintenance 09:00-11:00, Equipment inspection 15:30-16:30, Site inspection, with site, worker, status, instructions
- `incidents`: INC-017 Missing water or shade, Ali Hassan, Open, HI 42 High
- `notifications`: the 4 rows from the wireframe
- `rules`: thresholds 32/40/52, restricted 12:00-15:00, 15 Jun–15 Sep
- `riskLevels`: label + icon per level (Low ✓, Caution ▲, High ■, Extreme ✖) for NFR-4
- `incidentTypes`, `checklistItems` arrays

Pages copy the slice they need into `useState`; nothing persists across pages (fine for this phase).

## Fully implemented pages (user's part)

**Register** – 6 fields in a 2-column grid; on submit validate: all required, email regex,
mobile `^\+9665\d{8}$`, password ≥ 8 with upper/lower/digit, confirm match; inline `Field` errors;
on success show "Registration Successful", log in as new admin, navigate to `/users`.

**Login** – email + password, error line "Incorrect email or password", "Demo accounts" side panel,
"First login demo" button → `/first-login`, "Session expired demo" shows a banner.
**FirstLogin** – current temp password + new + confirm, same password rule, then role redirect.

**Profile** – prefilled from `user`; email read-only; language select (English/Arabic, no real i18n);
optional password change requiring current password; "Profile updated" message.

**MyDay** – `Banner` with site / level + icon / readiness / restricted period; table Task / Site /
Time / My status; rows link to `/tasks/:id`; buttons View Conditions, Report Incident,
"No tasks scenario" and "Paused work scenario" toggles (show "No tasks assigned for today" and the
"Outdoor work paused, follow your supervisor's instructions" banner).

**TaskDetails** – one page driven by a local `status` state: `Scheduled → In progress → On break →
Completed | Incomplete`.
- Scheduled: Check In (sets status, shows "Checked in at HH:MM"), "Location exception" opens the
  outside-radius modal ("You appear to be 1.2 km from the site", required reason), "Blocked work"
  shows the paused banner.
- In progress: Start Break, Mark Complete (modal with optional note), Couldn't finish (modal with
  required reason → Incomplete).
- On break: banner "You are on break…", elapsed timer via `setInterval`, End Break, Mark Complete.
- Right-hand "Schematic site map" card with site name, coordinates, note.

**ReportIncident** – Worksite (required), Task (optional), Incident type (required), one photo
(file input, JPG/PNG check), Description (required); on submit replace form with
"Incident reported. Your supervisor has been notified."

**WorkConditions** – reuses the risk card data for the worker's site (small page).

## Stub pages (teammates)

Each stub is a complete, routable component so the app never breaks:

```jsx
// TODO: to be implemented by Abdulrahman – FR-SV1 Worksites (see Figma + Phase-3 requirements)
import PageTitle from "../../components/PageTitle";

export default function Worksites() {
  return <PageTitle title="Worksites" />;
}
```

The `README.md` lists for each stub: owner, FR id, required states from the traceability table
(e.g. Risk dashboard: site cards, hourly forecast, weather-unavailable state), and the shared
components/mock data to reuse.

## Steps

1. `cd project-code && npm create vite@latest FrontEnd -- --template react`, then
   `npm install react-router-dom`; delete Vite demo assets/CSS.
2. Write `styles.css`, `AuthContext.jsx`, `data/mock.js`, the 6 shared components, `App.jsx`, `main.jsx`.
3. Write the guest, profile and worker pages in full.
4. Write the 10 stub pages with the owner comment.
5. Write `README.md` (how to run, demo accounts, folder structure, ownership table, coding rules:
   plain JS, one-line comments only, reuse shared components, no new libraries).

## Verification

- `npm run dev` and walk through: Landing → Register (trigger each inline error, then succeed) →
  lands on Users stub as admin; Log out → Login with wrong password (generic error) → log in as
  `worker@heatshield.test` → My Day → task → Check In → Start/End Break → Mark Complete; also
  Couldn't finish, Location exception modal, No-tasks and Paused toggles, Report incident success,
  Profile save. Log in as supervisor and admin to confirm sidebars and every stub route render.
- `npm run build` passes with no errors.
- Resize to 360px width: sidebar stacks above content, no horizontal scroll (NFR-12).
