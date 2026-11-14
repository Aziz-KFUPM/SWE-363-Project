import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { users } from "../../data/mock";
import { isEmail, isSaudiMobile, isStrongPassword, PASSWORD_HINT } from "../../validate";
import PageTitle from "../../components/PageTitle";
import Field from "../../components/Field";
import Banner from "../../components/Banner";

const empty = { company: "", name: "", email: "", phone: "", password: "", confirm: "" };

// FR-G1 register a company and its first administrator
export default function Register() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    Object.keys(form).forEach((k) => { if (!form[k].trim()) err[k] = "This field is required"; });
    if (form.email && !isEmail(form.email)) err.email = "Enter a valid email address";
    if (users.some((u) => u.email === form.email.trim().toLowerCase())) err.email = "This email is already registered";
    if (form.phone && !isSaudiMobile(form.phone)) err.phone = "Use the Saudi mobile format +9665XXXXXXXX";
    if (form.password && !isStrongPassword(form.password)) err.password = PASSWORD_HINT;
    if (form.confirm && form.confirm !== form.password) err.confirm = "Passwords do not match";
    return err;
  };

  const submit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;
    setDone(true);
    // Log the new administrator in and open User Management
    setTimeout(() => {
      setUser({ id: Date.now(), name: form.name, email: form.email, role: "admin", phone: form.phone, status: "Active" });
      navigate("/users");
    }, 1200);
  };

  return (
    <form onSubmit={submit} noValidate>
      <PageTitle title="Register company" />
      {done && <Banner type="success">Registration Successful. Opening User Management...</Banner>}
      <div className="grid-2">
        <Field label="Company name *" error={errors.company}>
          <input name="company" value={form.company} onChange={set} />
        </Field>
        <Field label="Administrator name *" error={errors.name}>
          <input name="name" value={form.name} onChange={set} />
        </Field>
        <Field label="Work email *" error={errors.email}>
          <input name="email" type="email" value={form.email} onChange={set} />
        </Field>
        <Field label="Saudi mobile *" error={errors.phone}>
          <input name="phone" placeholder="+9665XXXXXXXX" value={form.phone} onChange={set} />
        </Field>
        <Field label="Password *" error={errors.password} hint={PASSWORD_HINT}>
          <input name="password" type="password" value={form.password} onChange={set} />
        </Field>
        <Field label="Confirm password *" error={errors.confirm}>
          <input name="confirm" type="password" value={form.confirm} onChange={set} />
        </Field>
      </div>
      <p>Creates a new company and its first administrator. Existing company records stay private.</p>
      <div className="actions">
        <button className="btn btn-primary" type="submit" disabled={done}>Create Company</button>
        <button className="btn" type="button" onClick={() => navigate("/")}>Back</button>
      </div>
    </form>
  );
}
