import { createContext, useContext, useState } from "react";
import { users, DEMO_PASSWORD } from "./data/mock";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => JSON.parse(localStorage.getItem("hs-user")));

  // Keep the logged-in user across page refreshes
  const setUser = (u) => {
    setUserState(u);
    localStorage.setItem("hs-user", JSON.stringify(u));
  };

  const login = (email, password) => {
    const found = users.find((u) => u.email === email.trim().toLowerCase());
    if (!found || found.status !== "Active" || password !== DEMO_PASSWORD) return false;
    setUser(found);
    return true;
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem("hs-user");
  };

  return <AuthContext.Provider value={{ user, setUser, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
