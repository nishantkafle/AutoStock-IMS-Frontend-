// Generic placeholder used for pages that will be built in future milestones
export default function Placeholder({ name }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 320,
        border: "1px solid var(--border)",
        borderRadius: "6px",
        background: "var(--card-bg)",
        color: "var(--text-muted)",
        gap: "10px",
        padding: "48px",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)" }}>
        {name}
      </span>
      <span style={{ fontSize: "14px" }}>
        This section will be built in the next milestone.
      </span>
    </div>
  );
}
