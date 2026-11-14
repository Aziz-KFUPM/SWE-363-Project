import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tasks, weather, worksites } from "../../data/mock";
import { nowTime } from "../../validate";
import PageTitle from "../../components/PageTitle";
import Banner from "../../components/Banner";
import Badge from "../../components/Badge";
import Modal from "../../components/Modal";
import Field from "../../components/Field";

// Seconds as HH:MM:SS for the break timer
const fmt = (s) => [s / 3600, (s % 3600) / 60, s % 60].map((n) => String(Math.floor(n)).padStart(2, "0")).join(":");

// FR-W2 check in, FR-W3 breaks, FR-W4 complete or couldn't finish
export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find((t) => t.id === id);
  const [status, setStatus] = useState(task?.status || "Scheduled");
  const [modal, setModal] = useState(null); // location | complete | fail
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [breakStart, setBreakStart] = useState("");
  const [breaks, setBreaks] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Break timer runs only while on break
  useEffect(() => {
    if (status !== "On break") return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  if (!task) return <div className="card">Task not found.</div>;

  const site = worksites.find((s) => s.id === task.siteId);
  const w = weather[site.id];

  const doCheckIn = (flag) => {
    const time = nowTime();
    setCheckIn(time);
    setStatus("In progress");
    setMessage(`Checked in at ${time}${flag ? " (outside radius, flagged for your supervisor)" : ""}`);
    closeModal();
  };

  const closeModal = () => { setModal(null); setReason(""); setError(""); };

  const confirmLocation = () => {
    if (!reason.trim()) return setError("A reason is required to check in outside the radius");
    doCheckIn(true);
  };

  const startBreak = () => { setBreakStart(nowTime()); setSeconds(0); setStatus("On break"); setMessage(""); };

  const endBreak = () => { setBreaks(breaks + 1); setStatus("In progress"); setMessage(`Break ended at ${nowTime()}`); };

  const complete = () => {
    if (status === "On break") setBreaks(breaks + 1);
    setStatus("Completed");
    setMessage(`Task completed at ${nowTime()}`);
    closeModal();
  };

  const fail = () => {
    if (!reason.trim()) return setError("A reason is required");
    setStatus("Incomplete");
    setMessage(`Marked incomplete: ${reason}`);
    closeModal();
  };

  return (
    <div>
      <PageTitle title={status === "On break" ? "Break in progress" : "Assignment details"} />
      {blocked && <Banner type="danger">Outdoor work paused, follow your supervisor's instructions.</Banner>}
      {status === "On break" && <Banner>You are on break. Outdoor work has not resumed.</Banner>}
      {message && <Banner type="success">{message}</Banner>}

      <div className="card">
        <div className="row">
          <div style={{ flex: 2 }}>
            <h2>{task.name} / Assignment {task.id}</h2>
            <p>{site.name} | {site.project} Project | {task.start}-{task.end}</p>
            <p className="big">My status: <Badge kind={status} /></p>
            {status === "On break" && <p className="big">Break started {breakStart} / Elapsed {fmt(seconds)}</p>}
            <p>Instructions: {task.instructions}</p>
            <p><Badge kind={w.level} /> HI {w.heatIndex} C / checklist {w.readiness}</p>
            <p>Check-in window {task.checkInWindow}</p>
            {checkIn && <p>Check-in {checkIn} / Previous breaks {breaks}</p>}
            <div className="actions">
              <button className="btn" onClick={() => navigate("/conditions")}>View Conditions</button>
              <button className="btn" onClick={() => navigate("/report-incident")}>Report Incident</button>
            </div>
          </div>
          <div className="card muted" style={{ flex: 1, marginBottom: 0 }}>
            <h3>Schematic site map</h3>
            <p className="big">{site.id} - {site.name}</p>
            <p>{site.lat}, {site.lng}</p>
            <small className="hint">Location accuracy is checked only when checking in.</small>
          </div>
        </div>
      </div>

      <div className="actions">
        {status === "Scheduled" && (
          <>
            <button className="btn btn-primary" onClick={() => doCheckIn(false)} disabled={blocked}>Check In</button>
            <button className="btn" onClick={() => setModal("location")} disabled={blocked}>Location exception</button>
            <button className="btn" onClick={() => setBlocked(!blocked)}>Blocked work</button>
          </>
        )}
        {status === "In progress" && (
          <>
            <button className="btn btn-primary" onClick={startBreak}>Start Break</button>
            <button className="btn" onClick={() => setModal("complete")}>Mark Complete</button>
            <button className="btn" onClick={() => setModal("fail")}>Couldn't finish</button>
          </>
        )}
        {status === "On break" && (
          <>
            <button className="btn btn-primary" onClick={endBreak}>End Break</button>
            <button className="btn" onClick={() => setModal("complete")}>Mark Complete</button>
          </>
        )}
        <button className="btn" onClick={() => navigate("/my-day")}>Back to My Day</button>
      </div>

      {modal === "location" && (
        <Modal title="Outside the worksite radius" onClose={closeModal}>
          <Banner type="warning">You appear to be 1.2 km from the site. Check-ins are expected within 300 m.</Banner>
          <Field label="Reason *" error={error}>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
          </Field>
          <div className="actions">
            <button className="btn btn-primary" onClick={confirmLocation}>Check in anyway</button>
            <button className="btn" onClick={closeModal}>Cancel</button>
          </div>
        </Modal>
      )}

      {modal === "complete" && (
        <Modal title="Complete your assignment" onClose={closeModal}>
          <p>{task.name} / {site.name} / Assignment {task.id}</p>
          <p>Any open break closes at the same completion time.</p>
          <Field label="Completion note (optional)">
            <textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <div className="actions">
            <button className="btn btn-primary" onClick={complete}>Confirm completion</button>
            <button className="btn" onClick={closeModal}>Cancel</button>
          </div>
        </Modal>
      )}

      {modal === "fail" && (
        <Modal title="Couldn't finish" onClose={closeModal}>
          <Field label="Reason *" error={error}>
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">Select a reason</option>
              <option>Heat conditions</option>
              <option>Missing equipment</option>
              <option>Site access issue</option>
              <option>Other</option>
            </select>
          </Field>
          <div className="actions">
            <button className="btn btn-danger" onClick={fail}>Mark Incomplete</button>
            <button className="btn" onClick={closeModal}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
