// All demo data for the front-end phase. Fictional records only, no backend.

export const DEMO_PASSWORD = "HeatDemo1!";

export const company = {
  name: "Desert Maintenance Co.",
  timezone: "Asia/Riyadh",
  demoDate: "Friday 10 July 2026",
};

export const roleLabels = { worker: "Worker", supervisor: "Supervisor", admin: "Administrator" };

// Home page for each role after login (FR-G2)
export const homeByRole = { worker: "/my-day", supervisor: "/dashboard", admin: "/users" };

export const users = [
  { id: 1, name: "Sara Ahmad", email: "admin@heatshield.test", role: "admin", phone: "+966512345678", status: "Active" },
  { id: 2, name: "Ali Hassan", email: "worker@heatshield.test", role: "worker", phone: "+966512345678", status: "Active", siteId: "B" },
  { id: 3, name: "Khalid Omar", email: "supervisor@heatshield.test", role: "supervisor", phone: "+966512345679", status: "Active" },
  { id: 4, name: "Noura Saleh", email: "safety@heatshield.test", role: "supervisor", title: "Safety Officer", phone: "+966512345680", status: "Active" },
  { id: 5, name: "Omar Saeed", email: "omar@heatshield.test", role: "worker", phone: "+966512345681", status: "Active", siteId: "B" },
  { id: 6, name: "Fahad Aziz", email: "fahad@heatshield.test", role: "worker", phone: "+966512345682", status: "Active", siteId: "B" },
  { id: 7, name: "Yousef Sami", email: "yousef@heatshield.test", role: "worker", phone: "+966512345683", status: "Inactive", siteId: "A" },
];

export const worksites = [
  { id: "B", name: "Worksite B", project: "Pump Station", members: 5, lat: "26.306 N", lng: "50.147 E", status: "Active" },
  { id: "A", name: "Worksite A", project: "Road Maintenance", members: 3, lat: "26.421 N", lng: "50.088 E", status: "Active" },
];

// Current weather per worksite (FR-SV2, FR-W1)
export const weather = {
  B: { temp: 35, humidity: 42, heatIndex: 37, level: "Caution", readiness: "Ready", updated: "08:45" },
  A: { temp: 38, humidity: 46, heatIndex: 44, level: "High", readiness: "Not ready / Water unavailable", updated: "08:45" },
};

// Hourly forecast for the dashboard chart (FR-SV2)
export const forecast = {
  B: [
    { hour: "06:00", hi: 31 }, { hour: "08:00", hi: 35 }, { hour: "10:00", hi: 39 }, { hour: "12:00", hi: 43 },
    { hour: "14:00", hi: 45 }, { hour: "16:00", hi: 41 }, { hour: "18:00", hi: 36 },
  ],
  A: [
    { hour: "06:00", hi: 33 }, { hour: "08:00", hi: 38 }, { hour: "10:00", hi: 44 }, { hour: "12:00", hi: 49 },
    { hour: "14:00", hi: 52 }, { hour: "16:00", hi: 47 }, { hour: "18:00", hi: 40 },
  ],
};

// Icon per risk level so color is never the only signal (NFR-4)
export const riskIcons = { Low: "✓", Caution: "▲", High: "■", Extreme: "✖" };

export const rules = {
  caution: 32,
  high: 40,
  extreme: 52,
  restricted: { from: "12:00", to: "15:00", startDate: "15 Jun", endDate: "15 Sep" },
};

export const tasks = [
  { id: "A-104", name: "Pump maintenance", siteId: "B", date: "2026-07-10", start: "09:00", end: "11:00", status: "Scheduled", workerId: 2, instructions: "Inspect pump and record equipment issues.", checkInWindow: "08:30-10:00" },
  { id: "A-105", name: "Equipment inspection", siteId: "B", date: "2026-07-10", start: "15:30", end: "16:30", status: "Scheduled", workerId: 2, instructions: "Check safety equipment and log serial numbers.", checkInWindow: "15:00-16:30" },
  { id: "A-106", name: "Pump maintenance", siteId: "B", date: "2026-07-10", start: "09:00", end: "11:00", status: "On break", workerId: 5, instructions: "Assist with pump inspection.", checkInWindow: "08:30-10:00" },
  { id: "A-107", name: "Equipment inspection", siteId: "B", date: "2026-07-10", start: "09:30", end: "11:00", status: "Scheduled", workerId: 6, instructions: "Inspect lifting equipment.", checkInWindow: "09:00-10:30" },
  { id: "A-108", name: "Site inspection", siteId: "B", date: "2026-07-10", start: "09:00", end: "10:00", status: "Missed", workerId: 7, instructions: "Walk the site perimeter.", checkInWindow: "08:30-10:00" },
  { id: "A-109", name: "Road patching", siteId: "A", date: "2026-07-11", start: "07:00", end: "10:00", status: "Scheduled", workerId: 7, instructions: "Patch potholes on access road.", checkInWindow: "06:30-08:00" },
];

export const incidentTypes = ["Heat-related", "Injury", "Equipment failure", "Missing water or shade", "Other"];

export const incidents = [
  { id: "INC-017", siteId: "B", taskId: "A-104", type: "Missing water or shade", reporter: "Ali Hassan", date: "10 July", time: "10:40", heatIndex: 42, level: "High", status: "Open", description: "Drinking-water supply is empty near the rest area.", note: "" },
  { id: "INC-016", siteId: "A", taskId: "A-109", type: "Equipment failure", reporter: "Yousef Sami", date: "08 July", time: "08:15", heatIndex: 39, level: "Caution", status: "Resolved", description: "Compactor failed to start.", note: "Replaced battery and tested." },
  { id: "INC-015", siteId: "B", taskId: "", type: "Heat-related", reporter: "Omar Saeed", date: "03 July", time: "13:20", heatIndex: 46, level: "High", status: "Resolved", description: "Worker felt dizzy, moved to shade.", note: "Rested in shaded area, work paused." },
];

export const checklistItems = ["Drinking water", "Shaded area", "Separate rest area", "Protective equipment", "First-aid kit"];

// Rows for the supervisor live board (FR-SV5)
export const liveBoard = [
  { worker: "Ali Hassan", task: "Pump maintenance", state: "In progress", event: "Check-in 08:58", breaks: [], flags: [] },
  { worker: "Omar Saeed", task: "Pump maintenance", state: "On break", event: "Break 09:45", breaks: ["09:45 - now"], flags: [] },
  { worker: "Fahad Aziz", task: "Equipment inspection", state: "Late", event: "Start +35 min", breaks: [], flags: ["Outside radius"] },
  { worker: "Yousef Sami", task: "Site inspection", state: "Missed", event: "Start +62 min", breaks: [], flags: [] },
];

// Summary numbers for the reports page (FR-SV7)
export const reportSummary = {
  scheduled: 12,
  completed: 8,
  highAuthorizations: 3,
  checklistDone: 8,
  checklistTotal: 10,
  missed: 2,
  perWeek: [{ week: "W26", count: 1 }, { week: "W27", count: 3 }, { week: "W28", count: 2 }],
  byType: [{ type: "Water / shade", count: 3 }, { type: "Equipment", count: 2 }, { type: "Other", count: 1 }],
};

export const notifications = [
  { id: 1, time: "10:40", message: "Water unavailable at Worksite B", destination: "INC-017", to: "/incidents", read: false },
  { id: 2, time: "10:01", message: "Yousef missed the Site inspection check-in", destination: "Live Board", to: "/live-board", read: false },
  { id: 3, time: "09:50", message: "High risk forecast for Worksite B", destination: "Weather", to: "/dashboard", read: false },
  { id: 4, time: "08:12", message: "Task assignment changed", destination: "My Day", to: "/my-day", read: true },
];
