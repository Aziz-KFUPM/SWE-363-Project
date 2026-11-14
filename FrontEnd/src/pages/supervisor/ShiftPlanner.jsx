import { useState } from "react";
import { company, forecast, rules, tasks as mockTasks, users, worksites } from "../../data/mock";
import { riskLevel } from "../../validate";
import PageTitle from "../../components/PageTitle";
import Banner from "../../components/Banner";
import Modal from "../../components/Modal";
import Field from "../../components/Field";

const workers = users.filter((u) => u.role === "worker");
const HOURS = Array.from({ length: 13 }, (_, i) => `${String(i + 6).padStart(2, "0")}:00`);
const WEEK_START = "2026-07-06"; // Monday of the demo week
const emptyForm = { id: "", name: "", siteId: "B", date: company.demoDateIso, start: "", end: "", workerIds: [], reason: "" };

const pad = (n) => String(n).padStart(2, "0");
const addDays = (iso, n) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const dayLabel = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric" });
const inRestricted = (start, end) => start < rules.restricted.to && end > rules.restricted.from;
const overlaps = (a, b) => a.date === b.date && a.start < b.end && a.end > b.start;

// Forecast heat index closest before the given time
const forecastAt = (siteId, time) => (forecast[siteId].filter((f) => f.hour <= time).pop() || forecast[siteId][0]).hi;

// FR-SV3 weekly shift planner with restricted and high-risk checks
export default function ShiftPlanner() {
  const [tasks, setTasks] = useState(mockTasks);
  const [siteId, setSiteId] = useState("B");
  const [week, setWeek] = useState(0);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [message, setMessage] = useState("");

  const days = Array.from({ length: 7 }, (_, i) => addDays(WEEK_START, week * 7 + i));
  const site = worksites.find((s) => s.id === siteId);
  const level = form && form.start ? riskLevel(forecastAt(form.siteId, form.start)) : "";

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggleWorker = (id) =>
    setForm({ ...form, workerIds: form.workerIds.includes(id) ? form.workerIds.filter((w) => w !== id) : [...form.workerIds, id] });

  const openNew = (date = company.demoDateIso, start = "") => {
    setForm({ ...emptyForm, siteId, date, start });
    setErrors({});
    setConfirmCancel(false);
  };

  const openTask = (t) => {
    if (["In progress", "Completed"].includes(t.status)) return setMessage(`${t.name} is ${t.status} and cannot be moved.`);
    setForm({ ...t, workerIds: [t.workerId], reason: t.reason || "" });
    setErrors({});
    setConfirmCancel(false);
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Task name is required";
    if (!form.date) err.date = "Date is required";
    else if (form.date < company.demoDateIso) err.date = "Date cannot be in the past";
    if (!form.start || !form.end) err.time = "Start and end time are required";
    else if (form.end <= form.start) err.time = "End time must be after start time";
    else if (inRestricted(form.start, form.end)) err.time = `This slot overlaps the ${rules.restricted.from}-${rules.restricted.to} restricted period`;
    if (!form.workerIds.length) err.workers = "Assign at least one worker";
    const busy = tasks.find((t) => t.id !== form.id && form.workerIds.includes(t.workerId) && overlaps(t, form));
    if (busy) err.workers = `${workers.find((w) => w.id === busy.workerId).name} already has "${busy.name}" at that time`;
    if (level === "Extreme") err.risk = "Blocked: the forecast heat index is Extreme for this slot";
    if (level === "High" && !form.reason.trim()) err.reason = "High risk: a written reason is required to save";
    return err;
  };

  const save = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;
    // One task row per assigned worker, like the mock data
    const rows = form.workerIds.map((workerId, i) => ({
      ...form, id: form.id && i === 0 ? form.id : `A-${Date.now()}${i}`, workerId, status: "Scheduled",
      instructions: form.instructions || "", checkInWindow: form.checkInWindow || "",
    }));
    setTasks([...tasks.filter((t) => t.id !== form.id), ...rows]);
    setMessage(form.id ? "Task updated, assigned workers notified." : "Task saved as Scheduled, assigned workers notified.");
    setForm(null);
  };

  const cancelTask = () => {
    setTasks(tasks.filter((t) => t.id !== form.id));
    setMessage("Task cancelled, assigned workers notified.");
    setForm(null);
  };

  return (
    <div>
      <PageTitle title="Shift Planner" />
      {message && <Banner type="success">{message}</Banner>}
      <div className="row" style={{ alignItems: "flex-end" }}>
        <Field label="Worksite">
          <select value={siteId} onChange={(e) => setSiteId(e.target.value)}>
            {worksites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>
        <div className="actions" style={{ margin: "0 0 18px", justifyContent: "flex-end" }}>
          <button className="btn" onClick={() => setWeek(week - 1)}>Previous week</button>
          <button className="btn" onClick={() => setWeek(week + 1)}>Next week</button>
          <button className="btn btn-primary" onClick={() => openNew()}>New Task</button>
        </div>
      </div>

      <div className="card">
        <h2>Week {dayLabel(days[0])} - {dayLabel(days[6])} July 2026 / {site.name}</h2>
        <div className="table-wrap">
          <table className="planner">
            <thead>
              <tr><th></th>{days.map((d) => <th key={d}>{dayLabel(d)}</th>)}</tr>
            </thead>
            <tbody>
              {HOURS.map((h) => {
                const restricted = h >= rules.restricted.from && h < rules.restricted.to;
                const hot = ["High", "Extreme"].includes(riskLevel(forecastAt(siteId, h)));
                return (
                  <tr key={h}>
                    <td className="hour">{h}{hot && !restricted ? <><br /><small>HI {forecastAt(siteId, h)}</small></> : null}</td>
                    {days.map((d) => (
                      <td key={d} className={`slot ${restricted ? "restricted" : hot ? "hot" : ""}`} onClick={() => !restricted && openNew(d, h)}>
                        {restricted && d === days[0] && <small>Restricted</small>}
                        {tasks.filter((t) => t.siteId === siteId && t.date === d && t.start.slice(0, 2) === h.slice(0, 2)).map((t) => (
                          <button key={t.id} className="chip" onClick={(e) => { e.stopPropagation(); openTask(t); }}>
                            {t.name} ({t.start}-{t.end}) / {workers.find((w) => w.id === t.workerId)?.name.split(" ")[0]}
                          </button>
                        ))}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p>Grey rows are the restricted period, tinted rows are forecast High or Extreme. Click an empty slot to plan a task there. Maximum planning horizon: seven days ahead.</p>

      {form && (
        <Modal title={form.id ? "Edit task" : "New task"} onClose={() => setForm(null)}>
          <form onSubmit={save} noValidate>
            {errors.risk && <Banner type="danger">{errors.risk}</Banner>}
            {level === "High" && !errors.risk && <Banner type="warning">Forecast heat index {forecastAt(form.siteId, form.start)} C / High risk. A reason is required.</Banner>}
            {level === "Caution" && <Banner type="warning">Forecast heat index {forecastAt(form.siteId, form.start)} C / Caution. Allowed with a warning.</Banner>}
            <Field label="Task name *" error={errors.name}>
              <input name="name" value={form.name} onChange={set} />
            </Field>
            <div className="grid-2">
              <Field label="Worksite *">
                <select name="siteId" value={form.siteId} onChange={set}>
                  {worksites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>
              <Field label="Date *" error={errors.date}>
                <input name="date" type="date" value={form.date} onChange={set} />
              </Field>
              <Field label="Start time *" error={errors.time}>
                <input name="start" type="time" value={form.start} onChange={set} />
              </Field>
              <Field label="End time *">
                <input name="end" type="time" value={form.end} onChange={set} />
              </Field>
            </div>
            <Field label="Assigned workers *" error={errors.workers}>
              <div className="check-list">
                {workers.map((w) => (
                  <label key={w.id} className="check-row" style={{ justifyContent: "flex-start" }}>
                    <input type="checkbox" style={{ width: "auto", minHeight: 0 }} checked={form.workerIds.includes(w.id)} onChange={() => toggleWorker(w.id)} />
                    {w.name}
                  </label>
                ))}
              </div>
            </Field>
            {level === "High" && (
              <Field label="Reason for scheduling at High risk *" error={errors.reason}>
                <textarea name="reason" value={form.reason} onChange={set} />
              </Field>
            )}
            <div className="actions">
              <button className="btn btn-primary" type="submit">{form.id ? "Save changes" : "Save task"}</button>
              {form.id && <button className="btn btn-danger" type="button" onClick={() => setConfirmCancel(true)}>Cancel task</button>}
              <button className="btn" type="button" onClick={() => setForm(null)}>Close</button>
            </div>
            {confirmCancel && (
              <Banner type="danger">
                Cancel "{form.name}" on {form.date}? Assigned workers will be notified.{" "}
                <button className="btn btn-danger" type="button" onClick={cancelTask}>Yes, cancel task</button>
              </Banner>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
}
