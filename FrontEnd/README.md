# HeatShield – Front end (Phase 3)

Simple React front end for the HeatShield Outdoor Work Safety Planner. No backend and no database in
this phase: every screen runs on the demo data in `src/data/mock.js`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production check
```

## Demo accounts (password for all: `HeatDemo1!`)

| Email | Role | Home page |
|---|---|---|
| worker@heatshield.test | Field Worker | /my-day |
| supervisor@heatshield.test | Supervisor | /dashboard |
| safety@heatshield.test | Safety Officer (supervisor role) | /dashboard |
| admin@heatshield.test | Administrator | /users |

## Folder structure

```
src/
  main.jsx            app entry (router + auth provider)
  App.jsx             all routes, role guard
  styles.css          the only stylesheet; colors are CSS variables at the top
  AuthContext.jsx     current user, login(), logout(), setUser()
  validate.js         email / mobile / password helpers, nowTime()
  data/mock.js        all demo data (users, worksites, weather, tasks, incidents, notifications, rules...)
  components/         Layout, GuestLayout, PageTitle, Banner, Modal, Field, Badge
  pages/guest/        Landing, Register, Login, FirstLogin
  pages/worker/       MyDay, WorkConditions, TaskDetails, ReportIncident
  pages/supervisor/   Worksites, RiskDashboard, ShiftPlanner, Checklist, LiveBoard, Incidents, Reports
  pages/admin/        Users, SafetyRules
  pages/              Profile, Notifications
```

## Who implements what

| Owner | Files | Requirement | States to cover (from the traceability table) |
|---|---|---|---|
| Aziz | shell, components, mock data, guest pages, Profile, worker pages | FR-G1..G3, FR-W1..W5 | done |
| Abdulrahman | `pages/supervisor/Worksites.jsx` | FR-SV1 | list with search, Add/Edit worksite form (name, project, location, assigned workers), delete confirmation modal |
| Abdulrahman | `pages/supervisor/RiskDashboard.jsx` | FR-SV2 | card per site (temp, humidity, heat index, level badge, readiness, updated), hourly forecast (use `forecast` from mock), weather-unavailable state "Data from 09:30, live updates unavailable" |
| Abdulrahman | `pages/supervisor/ShiftPlanner.jsx` | FR-SV3 | weekly calendar per site with 12:00-15:00 shaded, New/Edit task form, blocked-slot error, High-risk reason modal, cancel task |
| Abdulrahman | `pages/supervisor/Checklist.jsx` | FR-SV4 | Yes/No per item from `checklistItems`, optional note, result "Site ready" / "Not ready" |
| Abdulaziz | `pages/supervisor/LiveBoard.jsx` | FR-SV5 | table from `liveBoard`, worker details (check-in time, breaks, flags) |
| Abdulaziz | `pages/supervisor/Incidents.jsx` | FR-SV6 | filters by site/status, incident list from `incidents`, details with required action note, Resolve |
| Abdulaziz | `pages/supervisor/Reports.jsx` | FR-SV7 | date range + site filters, summary cards from `reportSummary`, incidents per week (line) and by type (bar) drawn with plain divs or SVG, print button, empty-results state |
| Abdulaziz | `pages/admin/Users.jsx` | FR-A1 | user table with search and role filter, Add/Edit user modal, Deactivate confirmation modal |
| Abdulaziz | `pages/admin/SafetyRules.jsx` | FR-A2 | thresholds + restricted period form from `rules`, validation (increasing thresholds, end after start), "Rules updated, 3 scheduled tasks now conflict" message |
| Abdulaziz | `pages/Notifications.jsx` | FR-N1 | list from `notifications`, Mark all read, each row links to its `to` path |

## Coding rules for the team

- Plain JavaScript React with hooks, no TypeScript, no new libraries.
- Reuse the shared components: `PageTitle`, `Banner` (info/warning/danger/success), `Modal`, `Field`, `Badge`.
- Reuse CSS classes from `styles.css`: `card`, `card-grid`, `table`, `actions`, `btn`, `btn-primary`, `grid-2`, `grid-3`, `row`.
- Keep page state local with `useState`; copy what you need from `src/data/mock.js`.
- Short one-line comments only. Keep each page in a single file.
- Look at `pages/worker/TaskDetails.jsx` for an example with modals and status changes, and
  `pages/guest/Register.jsx` for form validation with inline errors.
