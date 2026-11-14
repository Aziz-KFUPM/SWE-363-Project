import { useState } from "react";
import { useAuth } from "../../AuthContext";
import { checklistItems, worksites } from "../../data/mock";
import PageTitle from "../../components/PageTitle";
import Banner from "../../components/Banner";
import Field from "../../components/Field";

// FR-SV4 daily site checklist
export default function Checklist() {
  const { user } = useAuth();
  const [siteId, setSiteId] = useState("B");
  const [answers, setAnswers] = useState({});
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [revision, setRevision] = useState(2);

  const site = worksites.find((s) => s.id === siteId);
  const setAnswer = (item, value) => setAnswers({ ...answers, [item]: value });

  const submit = (e) => {
    e.preventDefault();
    const missing = checklistItems.filter((i) => !answers[i]);
    if (missing.length) return setError(`Answer every item: ${missing.join(", ")}`);
    setError("");
    const failed = checklistItems.filter((i) => answers[i] === "No");
    setResult({ failed, time: new Date().toTimeString().slice(0, 5) });
    setRevision(revision + 1);
  };

  const reset = () => { setAnswers({}); setNote(""); setResult(null); setError(""); };

  return (
    <div>
      <PageTitle title="Daily site checklist" />
      {result && (result.failed.length === 0 ? (
        <Banner type="success">Site ready. Checklist saved for {site.name} at {result.time} by {user.name}.</Banner>
      ) : (
        <Banner type="danger">Site Not ready: {result.failed.join(", ")}. Saved for {site.name} at {result.time} by {user.name}. The dashboard shows this site as Not ready.</Banner>
      ))}
      {error && <Banner type="warning">{error}</Banner>}

      <form className="card" onSubmit={submit} noValidate>
        <div className="row" style={{ alignItems: "flex-end" }}>
          <Field label="Worksite">
            <select value={siteId} onChange={(e) => { setSiteId(e.target.value); reset(); }}>
              {worksites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <h2>{site.name} / Daily checklist / Revision {revision}</h2>
        </div>
        <div className="check-list">
          {checklistItems.map((item) => (
            <label key={item} className="check-row">
              <span>{item} *</span>
              <select value={answers[item] || ""} onChange={(e) => setAnswer(item, e.target.value)}>
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>
          ))}
        </div>
        <Field label="Note (optional)">
          <textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <div className="actions">
          <button className="btn btn-primary" type="submit">Submit Checklist</button>
          <button className="btn" type="button" onClick={reset}>Cancel</button>
        </div>
      </form>
      <p>Any "No" marks the site Not ready on the risk dashboard. All "Yes" shows Site ready.</p>
    </div>
  );
}
