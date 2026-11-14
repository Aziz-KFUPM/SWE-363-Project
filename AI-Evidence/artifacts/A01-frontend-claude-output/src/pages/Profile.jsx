import { useState } from "react";
import { useAuth } from "../AuthContext";
import { company, roleLabels } from "../data/mock";
import { isSaudiMobile, isStrongPassword, PASSWORD_HINT } from "../validate";
import PageTitle from "../components/PageTitle";
import Field from "../components/Field";
import Banner from "../components/Banner";

// FR-G3 edit own name, phone, language and password
export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || "", language: user.language || "English", current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = "This field is required";
    if (!isSaudiMobile(form.phone)) err.phone = "Use the Saudi mobile format +9665XXXXXXXX";
    const changingPassword = form.current || form.next || form.confirm;
    if (changingPassword) {
      if (!form.current) err.current = "Current password is required";
      if (!isStrongPassword(form.next)) err.next = PASSWORD_HINT;
      if (form.confirm !== form.next) err.confirm = "Passwords do not match";
    }
    setErrors(err);
    if (Object.keys(err).length) return;
    setUser({ ...user, name: form.name, phone: form.phone, language: form.language });
    setForm({ ...form, current: "", next: "", confirm: "" });
    setSaved(true);
  };

  return (
    <form onSubmit={submit} noValidate>
      <PageTitle title="My profile" />
      {saved && <Banner type="success">Profile updated</Banner>}
      <div className="grid-2">
        <Field label="Full name *" error={errors.name}>
          <input name="name" value={form.name} onChange={set} />
        </Field>
        <Field label="Saudi mobile *" error={errors.phone}>
          <input name="phone" value={form.phone} onChange={set} />
        </Field>
        <Field label="Email (read only)">
          <input value={user.email} readOnly />
        </Field>
        <Field label="Preferred language">
          <select name="language" value={form.language} onChange={set}>
            <option>English</option>
            <option>Arabic</option>
          </select>
        </Field>
      </div>
      <div className="grid-3">
        <Field label="Current password" error={errors.current}>
          <input name="current" type="password" value={form.current} onChange={set} />
        </Field>
        <Field label="New password" error={errors.next}>
          <input name="next" type="password" value={form.next} onChange={set} />
        </Field>
        <Field label="Confirm password" error={errors.confirm}>
          <input name="confirm" type="password" value={form.confirm} onChange={set} />
        </Field>
      </div>
      <p>Company: {company.name} / Role: {user.title || roleLabels[user.role]}</p>
      <div className="actions">
        <button className="btn btn-primary" type="submit">Save Profile</button>
      </div>
    </form>
  );
}
