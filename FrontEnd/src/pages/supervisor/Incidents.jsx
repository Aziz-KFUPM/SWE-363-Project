import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { incidents, worksites } from "../../data/mock";
import PageTitle from "../../components/PageTitle";
import Banner from "../../components/Banner";
import Badge from "../../components/Badge";
import Field from "../../components/Field";

const siteName = (id) => worksites.find((s) => s.id === id)?.name || id;
const dates = [...new Set(incidents.map((i) => i.date))];
const allFilters = { site: "All", status: "All", date: "All" };

// FR-SV6 follow up incidents with filters and a required action note
export default function Incidents() {
  const navigate = useNavigate();
  const [list, setList] = useState(incidents);
  const [draft, setDraft] = useState(allFilters);
  const [filters, setFilters] = useState(allFilters);
  const [selectedId, setSelectedId] = useState(incidents[0].id);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const shown = list.filter(
    (i) => (filters.site === "All" || i.siteId === filters.site) && (filters.status === "All" || i.status === filters.status) && (filters.date === "All" || i.date === filters.date)
  );
  const inc = list.find((i) => i.id === selectedId);

  const setD = (e) => setDraft({ ...draft, [e.target.name]: e.target.value });
  const update = (changes) => setList(list.map((i) => (i.id === inc.id ? { ...i, ...changes } : i)));
  const select = (id) => { setSelectedId(id); setNote(""); setError(""); setMessage(""); };

  const startReview = () => { update({ status: "In review" }); setMessage(`${inc.id} is now in review`); };

  // Resolving needs a 10-1000 character action note
  const resolve = () => {
    const text = note.trim();
    if (text.length < 10 || text.length > 1000) return setError("Enter the action taken (10-1000 characters) before resolving.");
    update({ status: "Resolved", note: text });
    setError("");
    setNote("");
    setMessage(`${inc.id} resolved`);
  };

  return (
    <div>
      <PageTitle title="Incidents and follow-up" />
      <div className="row" style={{ alignItems: "flex-end" }}>
        <Field label="Site">
          <select name="site" value={draft.site} onChange={setD}>
            <option value="All">All sites</option>
            {worksites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select name="status" value={draft.status} onChange={setD}>
            {["All", "Open", "In review", "Resolved"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Date">
          <select name="date" value={draft.date} onChange={setD}>
            <option value="All">All dates</option>
            {dates.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
      </div>
      <div className="actions" style={{ marginTop: 0 }}>
        <button className="btn btn-primary" onClick={() => setFilters(draft)}>Apply Filters</button>
        <button className="btn" onClick={() => navigate("/report-incident")}>Report Incident</button>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Reference</th><th>Type</th><th>Site</th><th>Reporter</th><th>Status</th></tr>
          </thead>
          <tbody>
            {shown.map((i) => (
              <tr key={i.id} className={`clickable ${i.id === selectedId ? "selected" : ""}`} onClick={() => select(i.id)}>
                <td>{i.id}</td>
                <td>{i.type}</td>
                <td>{siteName(i.siteId)}</td>
                <td>{i.reporter}</td>
                <td><Badge kind={i.status} /></td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan="5">No incidents match these filters.</td></tr>}
          </tbody>
        </table>
      </div>

      {inc && (
        <div className="card">
          <h2>{inc.id} / {siteName(inc.siteId)} / {inc.date} {inc.time}</h2>
          {message && <Banner type="success">{message}</Banner>}
          <p>{inc.description} Photo: optional, none attached.</p>
          <p>Type: {inc.type} / Task: {inc.taskId || "None"} / Reported by {inc.reporter}</p>
          <p>Weather snapshot: HI {inc.heatIndex} C <Badge kind={inc.level} /> / Status: <Badge kind={inc.status} /></p>

          {inc.status === "Resolved" ? (
            <p><strong>Action taken:</strong> {inc.note}</p>
          ) : (
            <>
              <Field label="Action taken *" error={error} hint="Resolution requires a 10-1000 character action note; history is retained.">
                <textarea value={note} maxLength={1000} onChange={(e) => setNote(e.target.value)} />
              </Field>
              <div className="actions">
                {inc.status === "Open" && <button className="btn" onClick={startReview}>Start Review</button>}
                <button className="btn btn-primary" onClick={resolve}>Resolve</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
