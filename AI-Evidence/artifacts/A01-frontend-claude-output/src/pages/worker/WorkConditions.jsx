import { useAuth } from "../../AuthContext";
import { riskIcons, rules, weather, worksites } from "../../data/mock";
import PageTitle from "../../components/PageTitle";
import Badge from "../../components/Badge";
import Banner from "../../components/Banner";

// FR-W1 current conditions for the worker's site
export default function WorkConditions() {
  const { user } = useAuth();
  const site = worksites.find((s) => s.id === user.siteId) || worksites[0];
  const w = weather[site.id];

  return (
    <div>
      <PageTitle title="Work conditions" />
      <Banner type="warning">Outdoor restriction today: {rules.restricted.from}-{rules.restricted.to} ({rules.restricted.startDate} - {rules.restricted.endDate}).</Banner>
      <div className="card">
        <h2>{site.name} / {site.project}</h2>
        <p>Temperature {w.temp} C / Humidity {w.humidity}%</p>
        <p className="big">Heat index {w.heatIndex} C / <Badge kind={w.level} /></p>
        <p>Site {w.readiness} / Updated {w.updated}</p>
      </div>
      <div className="card">
        <h3>Risk levels</h3>
        <div className="legend">
          {Object.keys(riskIcons).map((level) => <Badge key={level} kind={level} />)}
        </div>
        <p>Low below {rules.caution} C, Caution {rules.caution}-{rules.high - 1} C, High {rules.high}-{rules.extreme - 1} C, Extreme {rules.extreme} C and above.</p>
      </div>
    </div>
  );
}
