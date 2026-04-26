// Small summary card shown on dashboard overview pages
export default function StatCard({ label, value, sub }) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "6px",
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "10px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "28px",
          fontWeight: 700,
          letterSpacing: "-0.8px",
          color: "var(--text)",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            marginTop: "5px",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
