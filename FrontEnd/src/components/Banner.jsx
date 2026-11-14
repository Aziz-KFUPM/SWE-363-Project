// type: info | warning | danger | success
export default function Banner({ type = "info", children }) {
  return (
    <div className={`banner banner-${type}`}>
      <span className="banner-icon">{type === "info" ? "i" : "!"}</span>
      <span>{children}</span>
    </div>
  );
}
