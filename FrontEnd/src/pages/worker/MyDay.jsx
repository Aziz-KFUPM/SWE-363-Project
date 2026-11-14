import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { rules, tasks, weather, worksites } from "../../data/mock";
import PageTitle from "../../components/PageTitle";
import Banner from "../../components/Banner";
import Badge from "../../components/Badge";

// FR-W1 today's tasks and current heat risk for the worker's site
export default function MyDay() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scenario, setScenario] = useState("normal"); // normal | empty | paused

  const site = worksites.find((s) => s.id === user.siteId) || worksites[0];
  const w = weather[site.id];
  const myTasks = scenario === "empty" ? [] : tasks.filter((t) => t.workerId === user.id);
  const paused = scenario === "paused" || w.level === "High" || w.level === "Extreme";
  const restricted = `${rules.restricted.from}-${rules.restricted.to}`;

  return (
    <div>
      <PageTitle title="My Day" />
      {paused ? (
        <Banner type="danger">Outdoor work paused, follow your supervisor's instructions. Next restricted period {restricted}.</Banner>
      ) : (
        <Banner>
          {site.name} / <Badge kind={w.level} /> HI {w.heatIndex} C / Site {w.readiness} / Restricted {restricted}
        </Banner>
      )}

      {myTasks.length === 0 ? (
        <div className="card">No tasks assigned for today.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Task</th><th>Site</th><th>Time</th><th>My status</th></tr>
            </thead>
            <tbody>
              {myTasks.map((t) => (
                <tr key={t.id} className="clickable" onClick={() => navigate(`/tasks/${t.id}`)}>
                  <td>{t.name}</td>
                  <td>{worksites.find((s) => s.id === t.siteId).name}</td>
                  <td>{t.start}-{t.end}</td>
                  <td><Badge kind={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="actions">
        <button className="btn" onClick={() => navigate("/conditions")}>View Conditions</button>
        <button className="btn" onClick={() => navigate("/report-incident")}>Report Incident</button>
        <button className="btn" onClick={() => setScenario(scenario === "empty" ? "normal" : "empty")}>No tasks scenario</button>
        <button className="btn" onClick={() => setScenario(scenario === "paused" ? "normal" : "paused")}>Paused work scenario</button>
      </div>
      <p>Select an assignment to check in, take a break or finish your own work.</p>
    </div>
  );
}
