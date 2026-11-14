import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { incidentTypes, tasks, worksites } from "../../data/mock";
import PageTitle from "../../components/PageTitle";
import Field from "../../components/Field";
import Banner from "../../components/Banner";

// FR-W5 report a safety incident (also used by supervisors from the incidents page)
export default function ReportIncident() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ siteId: user.siteId || "B", taskId: "", type: "", description: "" });
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const siteTasks = tasks.filter((t) => t.siteId === form.siteId);

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.siteId) err.siteId = "Worksite is required";
    if (!form.type) err.type = "Incident type is required";
    if (!form.description.trim()) err.description = "Description is required";
    if (photo && !["image/jpeg", "image/png"].includes(photo.type)) err.photo = "Photo must be JPG or PNG";
    if (photo && photo.size > 5 * 1024 * 1024) err.photo = "Photo must be 5 MB or smaller";
    setErrors(err);
    if (!Object.keys(err).length) setDone(true);
  };

  if (done) {
    return (
      <div>
        <PageTitle title="Report incident" />
        <Banner type="success">Incident reported. Your supervisor has been notified.</Banner>
        <div className="actions">
          <button className="btn btn-primary" onClick={() => navigate(-1)}>Back</button>
          <button className="btn" onClick={() => { setDone(false); setForm({ ...form, type: "", description: "" }); setPhoto(null); }}>Report another</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <PageTitle title="Report incident" />
      <div className="grid-2">
        <Field label="Worksite *" error={errors.siteId}>
          <select name="siteId" value={form.siteId} onChange={set}>
            {worksites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>
        <Field label="Task (optional)">
          <select name="taskId" value={form.taskId} onChange={set}>
            <option value="">None</option>
            {siteTasks.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.start}-{t.end})</option>)}
          </select>
        </Field>
        <Field label="Incident type *" error={errors.type}>
          <select name="type" value={form.type} onChange={set}>
            <option value="">Select a type</option>
            {incidentTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="One photo (optional)" error={errors.photo}>
          <input type="file" accept="image/jpeg,image/png" onChange={(e) => setPhoto(e.target.files[0] || null)} />
        </Field>
      </div>
      <Field label="Description *" error={errors.description}>
        <textarea name="description" value={form.description} onChange={set} />
      </Field>
      <p className="hint">JPG or PNG, maximum 5 MB. Date, reporter and available weather snapshot are added automatically.</p>
      <div className="actions">
        <button className="btn btn-primary" type="submit">Submit incident</button>
        <button className="btn" type="button" onClick={() => navigate(-1)}>Cancel</button>
      </div>
      <p>Reporting remains available while outdoor work is paused.</p>
    </form>
  );
}
