import { Link, Outlet } from "react-router-dom";

export default function GuestLayout() {
  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">HeatShield</Link>
        <span className="crumb" />
        <nav className="header-actions">
          <Link className="btn" to="/login">Log in</Link>
          <Link className="btn" to="/register">Register</Link>
        </nav>
      </header>
      <main className="main">
        <div className="form-narrow" style={{ margin: "0 auto" }}>
          <Outlet />
        </div>
      </main>
      <footer className="footer">Operational planning only. Heat estimates do not certify safe exposure or legal compliance.</footer>
    </div>
  );
}
