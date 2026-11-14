import { useState } from "react";
import { company, tasks, users, worksites } from "../../data/mock";
import PageTitle from "../../components/PageTitle";
import Banner from "../../components/Banner";
import Badge from "../../components/Badge";
import Modal from "../../components/Modal";
import Field from "../../components/Field";

const workers = users.filter((u) => u.role === "worker");
const emptyForm = { id: "", name: "", project: "", location: "", workerIds: [] };

// Start from the mock sites and attach their assigned workers
const initialSites = worksites.map((s) => ({
  ...s,
  location: `${s.lat}, ${s.lng}`,
  workerIds: workers.filter((w) => w.siteId === s.id).map((w) => w.id),
}));

// FR-SV1 manage worksites
export default function Worksites() {
  const [sites, setSites] = useState(initialSites);
  const [selected, setSelected] = useState(initialSites[0].id);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // form | delete
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const site = sites.find((s) => s.id === selected);
  const shown = sites.filter((s) => (s.name + s.project).toLowerCase().includes(search.toLowerCase()));
  const futureTasks = site ? tasks.filter((t) => t.siteId === site.id && t.date >= company.demoDateIso).length : 0;

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleWorker = (id) =>
    setForm({ ...form, workerIds: form.workerIds.includes(id) ? form.workerIds.filter((w) => w !== id) : [...form.workerIds, id] });

  const openAdd = () => { setForm(emptyForm); setErrors({}); setModal("form"); };
  const openEdit = () => { setForm({ ...site }); setErrors({}); setModal("form"); };

  const save = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = "Site name is required";
    if (!form.location.trim()) err.location = "Location is required";
    if (sites.some((s) => s.name.toLowerCase() === form.name.trim().toLowerCase() && s.id !== form.id)) err.name = "A worksite with this name already exists";
    setErrors(err);
    if (Object.keys(err).length) return;
    if (form.id) {
      setSites(sites.map((s) => (s.id === form.id ? { ...s, ...form } : s)));
      setMessage("Worksite updated");
    } else {
      const id = "S" + Date.now();
      setSites([...sites, { ...form, id, status: "Active" }]);
      setSelected(id);
      setMessage("Worksite created");
    }
    setModal(null);
  };

  const remove = () => {
    setSites(sites.filter((s) => s.id !== site.id));
    setSelected(sites.find((s) => s.id !== site.id)?.id || "");
    setMessage(`${site.name} deleted${futureTasks ? `, ${futureTasks} future task(s) cancelled` : ""}`);
    setModal(null);
  };

  return (
    <div>
      <PageTitle title="Worksites" />
      {message && <Banner type="success">{message}</Banner>}
      <div className="row" style={{ alignItems: "flex-end" }}>
        <div className="actions" style={{ margin: 0 }}>
          <button className="btn btn-primary" onClick={openAdd}>Add Worksite</button>
        </div>
        <Field label="Search site or project">
          <input value={search} onChange={(e) => setSearch(e.target.value)} />
        </Field>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Worksite</th><th>Project</th><th>Members</th><th>Location</th><th>Status</th></tr>
          </thead>
          <tbody>
            {shown.map((s) => (
              <tr key={s.id} className="clickable" onClick={() => setSelected(s.id)} style={{ fontWeight: s.id === selected ? 700 : 400 }}>
                <td>{s.name}</td>
                <td>{s.project}</td>
                <td>{s.workerIds.length} workers</td>
                <td>{s.location}</td>
                <td><Badge kind={s.status} /></td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan="5">No worksites match your search.</td></tr>}
          </tbody>
        </table>
      </div>

      {site && (
        <div className="actions">
          <button className="btn" onClick={openEdit}>Edit {site.name}</button>
          <button className="btn btn-danger" onClick={() => setModal("delete")}>Delete {site.name}</button>
        </div>
      )}
      <p>Click a row to select it. Deleted sites keep their past checklists, incidents and task records.</p>

      {modal === "form" && (
        <Modal title={form.id ? "Edit worksite" : "Add worksite"} onClose={() => setModal(null)}>
          <form onSubmit={save} noValidate>
            <Field label="Site name *" error={errors.name}>
              <input name="name" value={form.name} onChange={set} />
            </Field>
            <Field label="Project name">
              <input name="project" value={form.project} onChange={set} />
            </Field>
            <Field label="Location *" hint="Search an address or enter coordinates (map pin placeholder)" error={errors.location}>
              <input name="location" placeholder="26.306 N, 50.147 E" value={form.location} onChange={set} />
            </Field>
            <div className="card muted">
              <h3>Schematic map</h3>
              <p>{form.location || "No location set"}</p>
            </div>
            <Field label="Assigned workers">
              <div className="check-list">
                {workers.map((w) => (
                  <label key={w.id} className="check-row" style={{ justifyContent: "flex-start" }}>
                    <input type="checkbox" style={{ width: "auto", minHeight: 0 }} checked={form.workerIds.includes(w.id)} onChange={() => toggleWorker(w.id)} />
                    {w.name}
                  </label>
                ))}
              </div>
            </Field>
            <div className="actions">
              <button className="btn btn-primary" type="submit">Save</button>
              <button className="btn" type="button" onClick={() => setModal(null)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === "delete" && (
        <Modal title={`Delete ${site.name}?`} onClose={() => setModal(null)}>
          {futureTasks > 0 ? (
            <Banner type="warning">This site has {futureTasks} future task(s). Confirming will cancel them and notify the assigned workers.</Banner>
          ) : (
            <p>This site has no future tasks.</p>
          )}
          <div className="actions">
            <button className="btn btn-danger" onClick={remove}>Confirm delete</button>
            <button className="btn" onClick={() => setModal(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
