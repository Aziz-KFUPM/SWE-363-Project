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
| Abdulrahman Khatib | `pages/supervisor/Worksites.jsx`, `RiskDashboard.jsx`, `ShiftPlanner.jsx`, `Checklist.jsx` | FR-SV1..SV4 | done |
| Abdulaziz Saleh | `pages/supervisor/LiveBoard.jsx`, `Incidents.jsx`, `Reports.jsx`, `pages/admin/Users.jsx`, `SafetyRules.jsx`, `pages/Notifications.jsx` | FR-SV5..SV7, FR-A1, FR-A2, FR-N1 | done |

## Coding rules for the team

- Plain JavaScript React with hooks, no TypeScript, no new libraries.
- Reuse the shared components: `PageTitle`, `Banner` (info/warning/danger/success), `Modal`, `Field`, `Badge`.
- Reuse CSS classes from `styles.css`: `card`, `card-grid`, `table`, `actions`, `btn`, `btn-primary`, `grid-2`, `grid-3`, `row`.
- Keep page state local with `useState`; copy what you need from `src/data/mock.js`.
- Short one-line comments only. Keep each page in a single file.
- Look at `pages/worker/TaskDetails.jsx` for an example with modals and status changes, and
  `pages/guest/Register.jsx` for form validation with inline errors.
