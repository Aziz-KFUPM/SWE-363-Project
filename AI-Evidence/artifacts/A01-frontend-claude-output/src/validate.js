import { rules } from "./data/mock";

// Small validation helpers shared by the forms (FR-G1 rules)
export const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

export const isSaudiMobile = (v) => /^\+9665\d{8}$/.test(v);

export const isStrongPassword = (v) => v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v);

export const PASSWORD_HINT = "Password: 8-64 characters, uppercase, lowercase and a digit.";

// Current time as HH:MM (24-hour)
export const nowTime = () => new Date().toTimeString().slice(0, 5);

// Risk level for a heat index using the configured thresholds
export const riskLevel = (hi) => (hi >= rules.extreme ? "Extreme" : hi >= rules.high ? "High" : hi >= rules.caution ? "Caution" : "Low");
