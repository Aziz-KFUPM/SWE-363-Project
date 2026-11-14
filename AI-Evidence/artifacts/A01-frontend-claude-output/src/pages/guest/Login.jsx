import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { homeByRole, users, DEMO_PASSWORD } from "../../data/mock";
import PageTitle from "../../components/PageTitle";
import Field from "../../components/Field";
import Banner from "../../components/Banner";

// FR-G2 log in and redirect by role
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Email and password are required");
    if (!login(email, password)) return setError("Incorrect email or password");
    const role = users.find((u) => u.email === email.trim().toLowerCase()).role;
    navigate(homeByRole[role]);
  };

  return (
    <div>
      <PageTitle title="Log in" />
      {expired && <Banner type="warning">Your session expired after 8 hours. Please log in again.</Banner>}
      <div className="row">
        <form className="card" onSubmit={submit} noValidate style={{ flex: 2 }}>
          <Field label="Email *">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password *" error={error}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <div className="actions">
            <button className="btn btn-primary" type="submit">Log in</button>
            <button className="btn" type="button" onClick={() => navigate("/first-login")}>First login demo</button>
          </div>
          <p>Need an account? Ask your company administrator.</p>
        </form>
        <aside>
          <h2>Demo accounts</h2>
          {users.slice(0, 4).map((u) => (
            <p key={u.id}><a href="#" onClick={(e) => { e.preventDefault(); setEmail(u.email); setPassword(DEMO_PASSWORD); }}>{u.email}</a></p>
          ))}
          <p>All use <b>{DEMO_PASSWORD}</b></p>
          <button className="btn" type="button" onClick={() => setExpired(true)}>Session expired demo</button>
        </aside>
      </div>
    </div>
  );
}
