# AI Usage Declaration – SWE 363 Term Project

<!-- Team: fill in every [bracketed] field, tick one option per member, then export this file to PDF for submission. -->

---

## Part A – Team Information
| Field | Value |
|-------|-------|
| Team numbers | [team number] |
| Section | [section] |
| Project title | HeatShield: Outdoor Work Safety Planner |
| Milestone (Phase) | Phase 3 – Front-end implementation (React) |
| Submission date | [YYYY-MM-DD] |

## Part B – Individual Declarations
*Each member completes one block and ticks one option. Repeat for every member.*

**Member: [Aziz – full name] – [KFUPM ID] – Front-end lead (app shell, guest and worker screens)**

[x] **Option 1 – I used AI tools in this milestone.**
- Tools and models: Claude Code (Anthropic, model Claude Fable 5.1) running inside VS Code.
- Purposes: Converting the Figma wireframe images and the Phase 3 requirements document into React code; organising the project structure (folders, routing, shared components, mock data, per-page files) according to my instructions on how it should be organised; generating placeholder files and a README so the remaining pages could be split between team members; asking Claude Code to explain its design decisions (authentication context, error state and inline errors, navigation hooks, page structure) so that I understand every generated file; drafting this declaration and the evidence folder from the template.
- Parts of the deliverable affected: `project-code/FrontEnd/` – Vite project setup, `src/App.jsx` (routes), `src/AuthContext.jsx`, `src/styles.css`, `src/data/mock.js`, `src/validate.js`, shared components (`Layout`, `GuestLayout`, `PageTitle`, `Banner`, `Modal`, `Field`, `Badge`), guest pages (Landing, Register, Login, FirstLogin), Profile, worker pages (MyDay, WorkConditions, TaskDetails, ReportIncident), stub files for the supervisor and admin pages, and `README.md`.
- Usage Log IDs (Part C): C01, A01, A02

> I declare that the Usage Log and the attached evidence contain **all** of my AI use in this milestone, with complete and unedited conversations, and that I understand and can explain all AI-assisted content I contributed.

[ ] **Option 2 – I did not use any AI tools in this milestone.**

> I declare that I did **not** use any generative AI tool in my contribution to this milestone. I understand that if this is found to be false, the case will be treated as **plagiarism** according to KFUPM regulations.

Signature: ____________________ Date: ____________

---

**Member: Abdulrahman Khatib – [KFUPM ID] – Supervisor screens (Worksites, Risk dashboard, Shift planner, Daily checklist)**

[x] **Option 1 – I used AI tools in this milestone.**
- Tools and models: Claude Code (Anthropic, model Claude Fable 5.1) running inside VS Code, in the same team session as C01.
- Purposes: Converting the Figma wireframes for the supervisor screens (FR-SV1 to FR-SV4) and their requirements into React pages that reuse the shared components, mock data and structure already set up for the project; asking Claude Code to explain how and why each page was built (Worksites, error handling, navigation) so that I can explain the code.
- Parts of the deliverable affected: `project-code/FrontEnd/src/pages/supervisor/Worksites.jsx`, `RiskDashboard.jsx`, `ShiftPlanner.jsx`, `Checklist.jsx`, plus small additions to `src/styles.css`, `src/validate.js` (risk level helper) and `src/data/mock.js` (demo date).
- Usage Log IDs (Part C): C01, A01

> I declare that the Usage Log and the attached evidence contain **all** of my AI use in this milestone, with complete and unedited conversations, and that I understand and can explain all AI-assisted content I contributed.

[ ] **Option 2 – I did not use any AI tools in this milestone.**

> I declare that I did **not** use any generative AI tool in my contribution to this milestone. I understand that if this is found to be false, the case will be treated as **plagiarism** according to KFUPM regulations.

Signature: ____________________ Date: ____________

---

**Member: [Abdulaziz – full name] – [KFUPM ID] – Supervisor and admin screens (Live board, Incidents, Reports, User management, Safety rules, Notifications)**

[ ] **Option 1 – I used AI tools in this milestone.**
- Tools and models:
- Purposes:
- Parts of the deliverable affected:
- Usage Log IDs (Part C):

> I declare that the Usage Log and the attached evidence contain **all** of my AI use in this milestone, with complete and unedited conversations, and that I understand and can explain all AI-assisted content I contributed.

[ ] **Option 2 – I did not use any AI tools in this milestone.**

> I declare that I did **not** use any generative AI tool in my contribution to this milestone. I understand that if this is found to be false, the case will be treated as **plagiarism** according to KFUPM regulations.

Signature: ____________________ Date: ____________

## Part C – AI Usage Log
*One row per conversation (`C01`, `C02`, ...) or AI-generated artifact (`A01`, `A02`, ...).*

| ID | Member | Tool (model) | Date(s) | Purpose | Part of deliverable affected | What you changed and how you verified it | Evidence file |
|----|--------|--------------|---------|---------|------------------------------|------------------------------------------|---------------|
| C01 | [Aziz], Abdulrahman Khatib | Claude Code (Claude Fable 5.1) | 2026-11-14 | Gave Claude Code the Phase 3 requirements document with the Figma wireframe images and asked it to plan and then implement the front end in simple React, organised the way I specified (shared components, mock data, one file per page, stub files with owner comments for teammates). In the same session, generated the four supervisor pages owned by Abdulrahman Khatib (Worksites, Risk dashboard, Shift planner, Daily checklist). | `project-code/FrontEnd/` (front-end scaffold, guest, worker and supervisor SV1-SV4 screens, stubs, README) | Reviewed the plan before approving it, then reviewed every generated file (routing, layout, components, pages, mock data, styles) against the Figma design and the requirements. Confirmed `npm run build` passes and that all 22 routes render for every role. Kept the code as generated because it matched the design and my structure; no manual edits were made. Afterwards asked Claude Code to explain its design decisions file by file and checked the answers against the code. | `AI-Evidence/conversations/C01-claude-code-session-2026-11-14.md` and `.jsonl` |
| A01 | [Aziz], Abdulrahman Khatib | Claude Code (Claude Fable 5.1) | 2026-11-14 | Generated React front end (output of C01). | `project-code/FrontEnd/` | Unchanged after review; the artifact folder is identical to the submitted code. | `AI-Evidence/artifacts/A01-frontend-claude-output/` |
| A02 | [Aziz] | Claude Code (Claude Fable 5.1) | 2026-11-14 | Implementation plan written by Claude Code and approved by me before coding (file list, routes, page behaviour, team split). | Project structure and task split | Read and approved in full; used as the basis for assigning pages to team members. | `AI-Evidence/artifacts/A02-implementation-plan.md` |
| A03 | [Aziz] | Claude Code (Claude Fable 5.1) | 2026-11-14 | First draft of this AI declaration and the `AI-Evidence/` folder (README and transcript export script), filled from the course template with the team's description of the AI use. | `AI-Declaration/ai-declaration.md`, `AI-Evidence/` | Team members review, complete their own blocks, IDs, dates and signatures, then export to PDF. | `AI-Evidence/conversations/C01-claude-code-session-2026-11-14.md` |
| C02 | | | | | | | |
| A04 | | | | | | | |

## Part D – Team Statement
> We confirm that this declaration is complete and accurate. We take full responsibility for our submission, including AI-assisted parts, and understand that AI errors are not an excuse. We understand that a missing declaration results in a grade of zero, and that a false or incomplete declaration is an academic integrity violation.

| Member name | KFUPM ID | Signature | Date |
|-------------|----------|-----------|------|
| [Aziz – full name] | | | |
| Abdulrahman Khatib | | | |
| [Abdulaziz – full name] | | | |
