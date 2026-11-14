import { useState } from "react";
import { useAuth } from "../../AuthContext";
import { roleLabels, users } from "../../data/mock";
import { isEmail, isStrongPassword, PASSWORD_HINT } from "../../validate";
import PageTitle from "../../components/PageTitle";
import Banner from "../../components/Banner";
import Badge from "../../components/Badge";
import Modal from "../../components/Modal";
import Field from "../../components/Field";

// Role choices; Safety Officer is a supervisor with a title
const roleOptions = ["Administrator", "Supervisor", "Safety Officer", "Worker"];
const roleLabel = (u) => u.title || roleLabels[u.role];
const toRole = (label) => (label === "Safety Officer" ? { role: "supervisor", title: label } : { role: label === "Administrator" ? "admin" : label.toLowerCase(), title: undefined });
const emptyForm = { id: null, name: "", email: "", role: "", password: "" };

// FR-A1 manage user accounts
export default function Users() {
  const { user: me } = useAuth();
  const [list, setList] = useState(users);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(2);
  const [modal, setModal] = useState(null); // form | deactivate
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const shown = list.filter(
    (u) => (u.name + u.email).toLowerCase().includes(search.toLowerCase()) && (roleFilter === "All" || roleLabel(u) === roleFilter)
  );
  const sel = list.find((u) => u.id === selectedId);
  const isMe = sel && (sel.id === me.id || sel.email === me.email);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const openAdd = () => { setForm(emptyForm); setErrors({}); setModal("form"); };
  const openEdit = () => { setForm({ id: sel.id, name: sel.name, email: sel.email, role: roleLabel(sel), password: "" }); setErrors({}); setModal("form"); };

  const save = (e) => {
    e.preventDefault();
    const err = {};
    const email = form.email.trim().toLowerCase();
    if (!form.name.trim()) err.name = "Name is required";
    if (!isEmail(email)) err.email = "Enter a valid email address";
    else if (list.some((u) => u.email === email && u.id !== form.id)) err.email = "This email is already used by another user";
    if (!form.role) err.role = "Role is required";
    if (!form.id && !isStrongPassword(form.password)) err.password = PASSWORD_HINT;
    setErrors(err);
    if (Object.keys(err).length) return;
    const data = { name: form.name.trim(), email, ...toRole(form.role) };
    if (form.id) {
      setList(list.map((u) => (u.id === form.id ? { ...u, ...data } : u)));
      setMessage("User updated");
    } else {
      const id = Date.now();
      setList([...list, { ...data, id, phone: "", status: "Active" }]);
      setSelectedId(id);
      setMessage("User created. Give the temporary password in person; it must be changed at first login.");
    }
    setModal(null);
  };

  const deactivate = () => {
    setList(list.map((u) => (u.id === sel.id ? { ...u, status: "Inactive" } : u)));
    setMessage("User deactivated");
    setModal(null);
  };

  return (
    <div>
      <PageTitle title="User Management" />
      {message && <Banner type="success">{message}</Banner>}
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div className="actions" style={{ margin: "0 0 18px", flex: "0 0 auto", minWidth: 0 }}>
          <button className="btn btn-primary" onClick={openAdd}>Add User</button>
        </div>
        <Field label="Search name or email">
          <input value={search} onChange={(e) => setSearch(e.target.value)} />
        </Field>
        <Field label="Role">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option>All</option>
            {roleOptions.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>State</th></tr>
          </thead>
          <tbody>
            {shown.map((u) => (
              <tr key={u.id} className={`clickable ${u.id === selectedId ? "selected" : ""}`} onClick={() => setSelectedId(u.id)}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{roleLabel(u)}</td>
                <td><Badge kind={u.status} /></td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan="4">No users match your search.</td></tr>}
          </tbody>
        </table>
      </div>

      {sel && (
        <div className="actions">
          <button className="btn" onClick={openEdit}>Edit {sel.name}</button>
          <button className="btn btn-danger" onClick={() => setModal("deactivate")} disabled={sel.status !== "Active"}>
            Deactivate {sel.name.split(" ")[0]}
          </button>
        </div>
      )}
      <p className="hint">Click a row to select a user.</p>

      {modal === "form" && (
        <Modal title={form.id ? "Edit user" : "Add user"} onClose={() => setModal(null)}>
          <form onSubmit={save} noValidate>
            <Field label="Full name *" error={errors.name}>
              <input name="name" value={form.name} onChange={set} />
            </Field>
            <Field label="Email *" error={errors.email}>
              <input name="email" type="email" value={form.email} onChange={set} />
            </Field>
            <Field label="Role *" error={errors.role}>
              <select name="role" value={form.role} onChange={set}>
                <option value="">Select a role</option>
                {roleOptions.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            {!form.id && (
              <Field label="Temporary password *" hint="The user must change it at first login." error={errors.password}>
                <input name="password" type="password" value={form.password} onChange={set} />
              </Field>
            )}
            <div className="actions">
              <button className="btn btn-primary" type="submit">{form.id ? "Save" : "Create"}</button>
              <button className="btn" type="button" onClick={() => setModal(null)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === "deactivate" && (
        <Modal title={`Deactivate ${sel.name}?`} onClose={() => setModal(null)}>
          {isMe ? (
            <Banner type="danger">Administrators cannot deactivate their own account.</Banner>
          ) : (
            <p>{sel.name} will no longer be able to log in. Their past records are kept.</p>
          )}
          <div className="actions">
            {!isMe && <button className="btn btn-danger" onClick={deactivate}>Confirm deactivate</button>}
            <button className="btn" onClick={() => setModal(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
