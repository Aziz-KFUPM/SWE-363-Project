// Label + any input passed as children + optional hint and inline error
export default function Field({ label, hint, error, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <small className="hint">{hint}</small>}
      {error && <small className="error">{error}</small>}
    </label>
  );
}
