// Small validation helpers shared by the forms (FR-G1 rules)
export const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

export const isSaudiMobile = (v) => /^\+9665\d{8}$/.test(v);

export const isStrongPassword = (v) => v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v);

export const PASSWORD_HINT = "Password: 8-64 characters, uppercase, lowercase and a digit.";

// Current time as HH:MM (24-hour)
export const nowTime = () => new Date().toTimeString().slice(0, 5);
