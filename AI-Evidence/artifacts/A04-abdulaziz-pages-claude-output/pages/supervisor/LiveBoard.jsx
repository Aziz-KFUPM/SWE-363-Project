import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { liveBoard, worksites } from "../../data/mock";
import { nowTime } from "../../validate";
import PageTitle from "../../components/PageTitle";
import Banner from "../../components/Banner";
import Badge from "../../components/Badge";
import Modal from "../../components/Modal";
import Field from "../../components/Field";

// FR-SV5 monitor worker check-ins for today
export default function LiveBoard() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(liveBoard);
  const [siteId, setSiteId] = useState("B");
  const [updated, setUpdated] = useState("10:02");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const shown = rows.filter((r) => r.siteId === siteId);

  // Late workers 30+ minutes after start become Missed and the supervisor is notified
  const refresh = () => {
    const late = rows.filter((r) => r.state === "Late");
    setRows(rows.map((r) => (r.state === "Late" ? { ...r, state: "Missed" } : r)));
    setUpdated(nowTime());
    setMessage(late.length ? `${late.map((r) => r.worker).join(", ")} marked Missed (not checked in 30 min after start). Supervisor notified.` : "Board refreshed, no changes.");
  };

  return (
    <div>
      <PageTitle title="Live Board" />
      {message && <Banner type={message.includes("Missed") ? "warning" : "success"}>{message}</Banner>}

      <div className="row" style={{ alignItems: "center" }}>
        <Field label="Worksite">
          <select value={siteId} onChange={(e) => setSiteId(e.target.value)}>
            {worksites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>
        <p className="big" style={{ fontWeight: 400, fontSize: "1.2rem" }}>Today / Updated {updated} / {shown.length} assignments</p>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Worker</th><th>Task</th><th>State</th><th>Event</th></tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className="clickable" onClick={() => setSelected(r)}>
                <td>{r.worker}</td>
                <td>{r.task}</td>
                <td><Badge kind={r.state} /></td>
                <td>{r.event}{r.flags.length > 0 && <> / <strong>{r.flags.join(", ")}</strong></>}</td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan="4">No assignments at this worksite today.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="hint">Click a worker to see check-in time, breaks and flags.</p>

      <div className="actions">
        <button className="btn" onClick={refresh}>Refresh</button>
        <button className="btn" onClick={() => navigate("/dashboard")}>View weather gates</button>
      </div>

      {selected && (
        <Modal title={`Worker details / ${selected.worker}`} onClose={() => setSelected(null)}>
          <p><strong>Task:</strong> {selected.task} (starts {selected.start})</p>
          <p><strong>State:</strong> <Badge kind={selected.state} /></p>
          <p><strong>Check-in time:</strong> {selected.checkIn || "Not checked in"}</p>
          <p><strong>Breaks:</strong> {selected.breaks.length ? selected.breaks.join(", ") : "None"}</p>
          <p><strong>Flags:</strong> {selected.flags.length ? selected.flags.join(", ") : "None"}</p>
          {selected.flags.includes("Outside radius") && <Banner type="warning">Check-in location was outside the worksite radius. Confirm the reason with the worker.</Banner>}
          <div className="actions">
            <button className="btn btn-primary" onClick={() => setSelected(null)}>Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
