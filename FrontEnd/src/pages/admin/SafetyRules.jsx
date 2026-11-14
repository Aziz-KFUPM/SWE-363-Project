import { useState } from "react";
import { Link } from "react-router-dom";
import { company, rules, tasks } from "../../data/mock";
import PageTitle from "../../components/PageTitle";
import Banner from "../../components/Banner";
import Modal from "../../components/Modal";
import Field from "../../components/Field";

// Read the current thresholds each time the page opens
const initial = () => ({
  caution: String(rules.caution), high: String(rules.high), extreme: String(rules.extreme),
  startDate: "2026-07-10", endDate: "2026-07-20", dailyStart: "11:30", dailyEnd: "15:30",
});

// Future scheduled tasks that overlap the company restricted period
const findConflicts = (f) =>
  tasks.filter(
    (t) => t.status === "Scheduled" && t.date >= company.demoDateIso && t.date >= f.startDate && t.date <= f.endDate && t.start < f.dailyEnd && t.end > f.dailyStart
  );

// FR-A2 configure heat-risk thresholds and company restricted periods
export default function SafetyRules() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(null);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    const [c, h, x] = [form.caution, form.high, form.extreme].map(Number);
    ["caution", "high", "extreme"].forEach((k) => { if (form[k] === "" || isNaN(Number(form[k]))) err[k] = "Enter a number"; });
    if (!err.caution && !err.high && !(c < h)) err.high = "High must be greater than Caution";
    if (!err.high && !err.extreme && !(h < x)) err.extreme = "Extreme must be greater than High";
    if (!form.startDate) err.startDate = "Start date is required";
    if (!form.endDate || form.endDate <= form.startDate) err.endDate = "End date must be after start date";
    if (!form.dailyStart) err.dailyStart = "Daily start is required";
    if (!form.dailyEnd || form.dailyEnd <= form.dailyStart) err.dailyEnd = "Daily end must be after daily start";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const openPreview = (e) => {
    e.preventDefault();
    setSaved(null);
    if (validate()) setPreview(findConflicts(form));
  };

  // Apply the thresholds so the rest of the app uses the new risk levels
  const confirmSave = () => {
    Object.assign(rules, { caution: Number(form.caution), high: Number(form.high), extreme: Number(form.extreme) });
    setSaved(preview);
    setPreview(null);
  };

  return (
    <div>
      <PageTitle title="Safety Rules" />
      <Banner type="info">Mandatory 2026 baseline: {rules.restricted.startDate}-{rules.restricted.endDate}, {rules.restricted.from}-{rules.restricted.to} daily. Read only.</Banner>
      {saved && (
        <Banner type={saved.length ? "warning" : "success"}>
          {saved.length ? (
            <>
              Rules updated, {saved.length} scheduled task{saved.length > 1 ? "s" : ""} now conflict:{" "}
              {saved.map((t, i) => <span key={t.id}>{i > 0 && ", "}<Link to="/planner">{t.id} {t.name}</Link></span>)}. Supervisors have been notified.
            </>
          ) : (
            "Rules updated, no scheduled tasks conflict."
          )}
        </Banner>
      )}

      <form onSubmit={openPreview} noValidate>
        <div className="grid-3">
          <Field label="Caution starts at C" error={errors.caution}>
            <input name="caution" type="number" value={form.caution} onChange={set} />
          </Field>
          <Field label="High starts at C" error={errors.high}>
            <input name="high" type="number" value={form.high} onChange={set} />
          </Field>
          <Field label="Extreme starts at C" error={errors.extreme}>
            <input name="extreme" type="number" value={form.extreme} onChange={set} />
          </Field>
        </div>

        <div className="grid-4">
          <Field label="Company rule start date" error={errors.startDate}>
            <input name="startDate" type="date" value={form.startDate} onChange={set} />
          </Field>
          <Field label="End date" error={errors.endDate}>
            <input name="endDate" type="date" value={form.endDate} onChange={set} />
          </Field>
          <Field label="Daily start" error={errors.dailyStart}>
            <input name="dailyStart" type="time" value={form.dailyStart} onChange={set} />
          </Field>
          <Field label="Daily end" error={errors.dailyEnd}>
            <input name="dailyEnd" type="time" value={form.dailyEnd} onChange={set} />
          </Field>
        </div>

        <p>Additional company rules may tighten restrictions; mandatory baseline cannot be weakened.</p>
        <p className="hint">Low &lt; Caution; Caution &lt;= HI &lt; High; High &lt;= HI &lt; Extreme; Extreme &gt;= threshold.</p>

        <div className="actions">
          <button className="btn btn-primary" type="submit">Preview and save</button>
        </div>
      </form>

      {preview && (
        <Modal title="Preview rule changes" onClose={() => setPreview(null)}>
          <p>Thresholds: Caution {form.caution} C / High {form.high} C / Extreme {form.extreme} C</p>
          <p>Company restriction: {form.startDate} to {form.endDate}, {form.dailyStart}-{form.dailyEnd} daily</p>
          {preview.length ? (
            <Banner type="warning">
              {preview.length} scheduled task{preview.length > 1 ? "s" : ""} will conflict: {preview.map((t) => `${t.id} (${t.date} ${t.start}-${t.end})`).join(", ")}
            </Banner>
          ) : (
            <Banner type="info">No scheduled tasks conflict with these rules.</Banner>
          )}
          <div className="actions">
            <button className="btn btn-primary" onClick={confirmSave}>Save rules</button>
            <button className="btn" onClick={() => setPreview(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
