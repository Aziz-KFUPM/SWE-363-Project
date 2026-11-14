import { riskIcons } from "../data/mock";

// Colored pill for risk levels and statuses; risk levels also get an icon (NFR-4)
export default function Badge({ kind }) {
  const slug = kind.toLowerCase().replace(/\s+/g, "-");
  return (
    <span className={`badge badge-${slug}`}>
      {riskIcons[kind] ? `${riskIcons[kind]} ` : ""}
      {kind}
    </span>
  );
}
