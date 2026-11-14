import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isStrongPassword, PASSWORD_HINT } from "../../validate";
import PageTitle from "../../components/PageTitle";
import Field from "../../components/Field";
import Banner from "../../components/Banner";

// FR-G2 change the temporary password on first login
export default function FirstLogin() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.current) err.current = "Enter your temporary password";
    if (!isStrongPassword(form.next)) err.next = PASSWORD_HINT;
    if (form.confirm !== form.next) err.confirm = "Passwords do not match";
    setErrors(err);
    if (Object.keys(err).length) return;
    setDone(true);
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <form className="card" onSubmit={submit} noValidate>
      <PageTitle title="Change temporary password" />
      <Banner type="warning">Your administrator gave you a temporary password. Choose a new one before continuing.</Banner>
      {done && <Banner type="success">Password updated. Please log in with your new password.</Banner>}
      <Field label="Temporary password *" error={errors.current}>
        <input name="current" type="password" value={form.current} onChange={set} />
      </Field>
      <Field label="New password *" error={errors.next} hint={PASSWORD_HINT}>
        <input name="next" type="password" value={form.next} onChange={set} />
      </Field>
      <Field label="Confirm new password *" error={errors.confirm}>
        <input name="confirm" type="password" value={form.confirm} onChange={set} />
      </Field>
      <div className="actions">
        <button className="btn btn-primary" type="submit" disabled={done}>Save password</button>
        <button className="btn" type="button" onClick={() => navigate("/login")}>Back</button>
      </div>
    </form>
  );
}
