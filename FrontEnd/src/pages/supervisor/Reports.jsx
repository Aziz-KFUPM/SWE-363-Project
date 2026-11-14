import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { reportSummary, worksites } from "../../data/mock";
import PageTitle from "../../components/PageTitle";
import Field from "../../components/Field";

// Demo records only exist in this date range
const DATA_FROM = "2026-06-22";
const DATA_TO = "2026-07-10";
const initial = { from: DATA_FROM, to: DATA_TO, site: "All" };

// Line chart drawn with plain SVG
function LineChart({ points }) {
  const max = Math.max(...points.map((p) => p.count), 1);
  const x = (i) => 30 + (i * 240) / Math.max(points.length - 1, 1);
  const y = (c) => 110 - (c / max) * 80;
  return (
    <svg viewBox="0 0 300 140" className="line-chart" role="img" aria-label="Incidents per week">
      <polyline fill="none" stroke="currentColor" strokeWidth="2.5" points={points.map((p, i) => `${x(i)},${y(p.count)}`).join(" ")} />
      {points.map((p, i) => (
        <g key={p.week}>
          <circle cx={x(i)} cy={y(p.count)} r="4" fill="currentColor" />
          <text x={x(i)} y={y(p.count) - 10} textAnchor="middle">{p.count}</text>
          <text x={x(i)} y="134" textAnchor="middle">{p.week}</text>
        </g>
      ))}
    </svg>
  );
}

// FR-SV7 compliance reports with summary cards and two charts
export default function Reports() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(initial);
  const [filters, setFilters] = useState(initial);
  const [error, setError] = useState("");
  const [forceEmpty, setForceEmpty] = useState(false);

  const setD = (e) => setDraft({ ...draft, [e.target.name]: e.target.value });

  const apply = () => {
    if (!draft.from || !draft.to || draft.from >= draft.to) return setError("Start date must be before end date.");
    setError("");
    setForceEmpty(false);
    setFilters(draft);
  };

  // No overlap with the demo records means nothing to show
  const empty = forceEmpty || filters.to < DATA_FROM || filters.from > DATA_TO;
  const r = reportSummary;
  const maxType = Math.max(...r.byType.map((t) => t.count));
  const siteLabel = filters.site === "All" ? "All authorized sites" : worksites.find((s) => s.id === filters.site).name;

  return (
    <div>
      <PageTitle title="Reports and summaries" />
      <div className="row no-print" style={{ alignItems: "flex-end" }}>
        <Field label="Start date" error={error}>
          <input type="date" name="from" value={draft.from} onChange={setD} />
        </Field>
        <Field label="End date">
          <input type="date" name="to" value={draft.to} onChange={setD} />
        </Field>
        <Field label="Site">
          <select name="site" value={draft.site} onChange={setD}>
            <option value="All">All authorized</option>
            {worksites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>
      </div>
      <div className="actions no-print" style={{ marginTop: 0 }}>
        <button className="btn btn-primary" onClick={apply}>Apply Filters</button>
      </div>

      <p className="hint">Report for {siteLabel} / {filters.from} to {filters.to}</p>

      {empty ? (
        <div className="card muted">
          <h2>No records match these filters</h2>
          <p>Try a wider date range or another site.</p>
        </div>
      ) : (
        <>
          <div className="card-grid stat-grid">
            <div className="card"><h3>Tasks / completed</h3><p className="stat">{r.scheduled} / {r.completed}</p></div>
            <div className="card"><h3>High authorizations</h3><p className="stat">{r.highAuthorizations}</p></div>
            <div className="card"><h3>Checklist rate</h3><p className="stat">{Math.round((r.checklistDone / r.checklistTotal) * 100)}% ({r.checklistDone}/{r.checklistTotal})</p></div>
            <div className="card"><h3>Missed assignments</h3><p className="stat">{r.missed}</p></div>
          </div>

          <div className="card-grid">
            <div className="card">
              <h2>Incidents per week / counts</h2>
              <LineChart points={r.perWeek} />
            </div>
            <div className="card">
              <h2>Incidents by type</h2>
              {r.byType.map((t) => (
                <div className="hbar-row" key={t.type}>
                  <span className="hbar-label">{t.type}</span>
                  <div className="hbar" style={{ width: `${(t.count / maxType) * 60}%` }} />
                  <span>{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="actions no-print">
        <button className="btn" onClick={() => window.print()} disabled={empty}>Print / Save PDF</button>
        <button className="btn" onClick={() => navigate("/incidents")}>Source records</button>
        <button className="btn" onClick={() => setForceEmpty(!forceEmpty)}>{forceEmpty ? "Show results" : "Empty results"}</button>
      </div>
    </div>
  );
}
