import { company } from "../data/mock";

// Page heading with the demo date line used on every screen
export default function PageTitle({ title }) {
  return (
    <>
      <h1>{title}</h1>
      <p className="subtitle">{company.demoDate} / {company.timezone} / Fictional demonstration records</p>
    </>
  );
}
