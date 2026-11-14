# HeatShield: Outdoor Work Safety Planner

SWE 363, Milestone 4 (Front-End). HeatShield helps outdoor-work companies plan shifts around heat risk.
Workers see their tasks and conditions, supervisors plan shifts, check sites and follow incidents,
and administrators manage users and safety rules.

This is a **front-end only** prototype built with React. There is no backend or database: every screen
runs on fictional demo data in `FrontEnd/src/data/mock.js`. No API keys or environment variables are needed.

## Setup and run

Requires Node.js 18 or newer.

```bash
cd FrontEnd
npm install
npm run dev       # http://localhost:5173
npm run build     # production build check
npm run lint      # oxlint
```

## Usage

Log in with one of the demo accounts (password for all: `HeatDemo1!`):

| Email | Role | Home page |
|---|---|---|
| worker@heatshield.test | Worker | /my-day |
| supervisor@heatshield.test | Supervisor | /dashboard |
| safety@heatshield.test | Safety Officer | /dashboard |
| admin@heatshield.test | Administrator | /users |

Example flow: log in as the worker, open a task, check in, start and end a break, then mark it complete.
Log in as a supervisor to plan shifts, watch the Live Board and resolve incidents. Log in as the
administrator to add users and change safety rules. Layouts adapt to phone width.

## Screens and requirements

| Area | Screens | Requirements |
|---|---|---|
| Guest | Landing, Register, Login, First login | FR-G1, FR-G2 |
| All users | Profile, Notifications | FR-G3, FR-N1 |
| Worker | My Day, Work conditions, Task details, Report incident | FR-W1 to FR-W5 |
| Supervisor | Worksites, Risk dashboard, Shift planner, Checklist, Live board, Incidents, Reports | FR-SV1 to FR-SV7 |
| Administrator | User management, Safety rules | FR-A1, FR-A2 |

The design reference is the 18 Figma wireframes from the Phase 3 requirements document:
[HeatShield Figma designs](https://www.figma.com/design/CYMV4CboQ1SK9QHGyVE2XN) (view only).

## Responsive design

One stylesheet serves desktop and phone. Below 768 px the sidebar stacks above the content, forms and
card grids collapse to one column, tables scroll sideways inside their container, and all buttons are at
least 44 px tall with 16 px text.

## Interactive features

Every screen is interactive on demo data: form validation with inline errors, modals for confirmations,
filters and search, status changes (check in, break, complete), charts drawn with plain SVG and divs,
print-friendly reports, and notifications that mark as read and link to their pages.
Changes live in memory only and reset when the page is reloaded.

## Built with

React 19, React Router 7, Vite, one plain CSS file (`src/styles.css`). No UI or chart libraries.
See [FrontEnd/README.md](FrontEnd/README.md) for the folder structure and coding rules.

## Repository layout

```
FrontEnd/        React app (src/pages, src/components, src/data/mock.js)
AI-Declaration/  AI usage declaration
AI-Evidence/     AI conversations and generated artifacts
AI_USAGE.md      AI tools used and files affected
```

## Team

| Member | KFUPM ID | Role and files |
|---|---|---|
| Abdul Azziz Alkhatib | 202372090 | App shell, routing, shared components, mock data, guest pages, Profile, worker pages |
| Abdulrahman Dhaer Khatib | 202460820 | Supervisor pages: Worksites, Risk dashboard, Shift planner, Checklist |
| Abdulaziz Saleh | 202456880 | Live board, Incidents, Reports, User management, Safety rules, Notifications |
