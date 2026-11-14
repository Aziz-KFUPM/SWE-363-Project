import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { notifications } from "../data/mock";
import PageTitle from "../components/PageTitle";
import Banner from "../components/Banner";

// Pages each role may open from a notification
const allowed = {
  worker: ["/my-day", "/conditions", "/report-incident"],
  supervisor: ["/dashboard", "/worksites", "/planner", "/checklist", "/live-board", "/incidents", "/reports", "/report-incident"],
  admin: ["/users", "/safety-rules"],
};

// FR-N1 in-app notifications
export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [list, setList] = useState(() => notifications.map((n) => ({ ...n })));
  const [denied, setDenied] = useState(false);

  const unread = list.filter((n) => !n.read).length;

  // Also update the shared demo data so the header Alerts count matches
  const markRead = (ids) => {
    notifications.forEach((n) => { if (ids.includes(n.id)) n.read = true; });
    setList(list.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n)));
    navigate("/notifications", { replace: true }); // re-renders the header count
  };

  const open = (n) => {
    markRead([n.id]);
    if (allowed[user.role].includes(n.to)) navigate(n.to);
    else setDenied(true);
  };

  return (
    <div>
      <PageTitle title="Notifications" />
      {denied && <Banner type="warning">You no longer have access to this item. It may have been removed or your role has changed.</Banner>}
      <div className="card">
        <h2>In-app notifications / {unread} unread</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Time</th><th>Message</th><th>Destination</th></tr>
            </thead>
            <tbody>
              {list.map((n) => (
                <tr key={n.id} className="clickable" onClick={() => open(n)} style={{ fontWeight: n.read ? 400 : 700 }}>
                  <td>{n.time}</td>
                  <td>{!n.read && <span className="dot" aria-label="Unread" />}{n.message}</td>
                  <td>{n.destination}</td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan="3">No notifications.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="actions" style={{ marginBottom: 0 }}>
          <button className="btn" onClick={() => markRead(list.map((n) => n.id))} disabled={unread === 0}>Mark all read</button>
          <button className="btn" onClick={() => setDenied(true)}>Removed access</button>
        </div>
      </div>
    </div>
  );
}
