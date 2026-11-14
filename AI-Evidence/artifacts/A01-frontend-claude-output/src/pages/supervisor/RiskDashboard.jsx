import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forecast, rules, weather, worksites } from "../../data/mock";
import { nowTime, riskLevel } from "../../validate";
import PageTitle from "../../components/PageTitle";
import Banner from "../../components/Banner";
import Badge from "../../components/Badge";

const restrictedHour = (h) => h >= rules.restricted.from && h < rules.restricted.to;

// FR-SV2 weather-risk dashboard with site cards and hourly forecast
export default function RiskDashboard() {
  const navigate = useNavigate();
  const [updated, setUpdated] = useState(weather.B.updated);
  const [stale, setStale] = useState(false);
  const [chartSite, setChartSite] = useState(null);

  return (
    <div>
      <PageTitle title="Risk dashboard" />
      <Banner type="warning">Outdoor restriction today: {rules.restricted.from}-{rules.restricted.to} / Forecast and readiness must both be checked.</Banner>
      {stale && <Banner type="danger">Data from 09:30, live updates unavailable. Showing the last stored weather.</Banner>}

      <div className="card-grid">
        {worksites.map((s) => {
          const w = weather[s.id];
          return (
            <div className="card" key={s.id}>
              <h2>{s.name}</h2>
              <p>Temperature {w.temp} C / Humidity {w.humidity}%</p>
              <p className="big">Heat index {w.heatIndex} C / <Badge kind={w.level} /></p>
              <p>
                <Badge kind={w.readiness.startsWith("Ready") ? "Ready" : "Not ready"} /> {w.readiness.includes("/") ? w.readiness.split("/")[1] : ""} / Updated {stale ? "09:30" : updated}
              </p>
              <div className="actions" style={{ marginBottom: 0 }}>
                <button className={`btn ${chartSite === s.id ? "btn-primary" : ""}`} onClick={() => setChartSite(chartSite === s.id ? null : s.id)}>Hourly forecast</button>
                {!w.readiness.startsWith("Ready") && <button className="btn" onClick={() => navigate("/checklist")}>Review readiness</button>}
              </div>
            </div>
          );
        })}
      </div>

      {chartSite && (
        <div className="card">
          <h2>Hourly forecast / {worksites.find((s) => s.id === chartSite).name} / Today</h2>
          <div className="chart">
            {forecast[chartSite].map((f) => {
              const level = riskLevel(f.hi);
              return (
                <div key={f.hour} className={`bar-col ${restrictedHour(f.hour) ? "restricted" : ""}`} title={`${f.hour}: HI ${f.hi} C (${level})`}>
                  <span>{f.hi}</span>
                  <div className={`bar ${level.toLowerCase()}`} style={{ height: `${f.hi * 2.5}px` }} />
                  <span>{f.hour}</span>
                </div>
              );
            })}
          </div>
          <p className="hint">Grey columns are the restricted period. Bar colors follow the risk level: <Badge kind="Low" /> <Badge kind="Caution" /> <Badge kind="High" /> <Badge kind="Extreme" /></p>
        </div>
      )}

      <div className="actions">
        <button className="btn" onClick={() => { setUpdated(nowTime()); setStale(false); }}>Refresh</button>
        <button className="btn" onClick={() => setStale(!stale)}>Stale data demo</button>
        <button className="btn" onClick={() => navigate("/planner")}>Open planner</button>
      </div>
    </div>
  );
}
