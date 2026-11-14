import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { company, homeByRole, notifications, roleLabels } from "../data/mock";

// Sidebar links for each role
const navByRole = {
  worker: [["My Day", "/my-day"], ["Work conditions", "/conditions"], ["Report incident", "/report-incident"]],
  supervisor: [
    ["Risk dashboard", "/dashboard"], ["Worksites", "/worksites"], ["Shift planner", "/planner"],
    ["Live board", "/live-board"], ["Incidents", "/incidents"], ["Reports", "/reports"],
  ],
  admin: [["User management", "/users"], ["Safety rules", "/safety-rules"]],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const role = user.title || roleLabels[user.role];
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="app">
      <header className="header">
        <Link to={homeByRole[user.role]} className="logo">HeatShield</Link>
        <span className="crumb">{company.name} / {role}</span>
        <nav className="header-actions">
          <Link className="btn" to="/notifications">Alerts ({unread})</Link>
          <Link className="btn" to="/profile">Profile</Link>
          <button className="btn" onClick={() => { logout(); navigate("/login"); }}>Log out</button>
        </nav>
      </header>
      <div className="body">
        <aside className="sidebar">
          <h2>{role}</h2>
          {navByRole[user.role].map(([label, to]) => (
            <NavLink key={to} to={to} className="nav-btn">{label}</NavLink>
          ))}
          <div className="sidebar-foot">DEMO / 10 Jul 2026</div>
        </aside>
        <main className="main">
          <Outlet />
        </main>
      </div>
      <footer className="footer">Operational planning only. Heat estimates do not certify safe exposure or legal compliance.</footer>
    </div>
  );
}
