import { Link } from "react-router-dom";

// FR-G1 public landing page
export default function Landing() {
  return (
    <div className="landing">
      <h1>Plan outdoor work around the heat</h1>
      <p>
        HeatShield combines live weather data with shift scheduling so small construction, maintenance and
        delivery teams can place tasks in safe periods, confirm site readiness, track check-ins and record incidents.
      </p>
      <p>Restricted periods (12:00-15:00, 15 June-15 September) and heat-risk levels are applied to every schedule.</p>
      <div className="actions" style={{ justifyContent: "center" }}>
        <Link className="btn btn-primary" to="/register">Register Company</Link>
        <Link className="btn" to="/login">Log in</Link>
      </div>
      <div className="card-grid" style={{ textAlign: "left", marginTop: 32 }}>
        <div className="card"><h3>Workers</h3>See today's tasks and heat level, check in, log breaks and report incidents.</div>
        <div className="card"><h3>Supervisors</h3>Plan shifts, complete the daily site checklist, monitor check-ins and view reports.</div>
        <div className="card"><h3>Administrators</h3>Register the company, manage accounts and set safety rules.</div>
      </div>
    </div>
  );
}
