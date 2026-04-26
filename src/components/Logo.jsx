// SVG + AutoStock wordmark used in nav, sidebar, and auth pages
export default function Logo({ size = "md", color = "currentColor" }) {
  const cfg = {
    sm: { icon: 18, text: 15, gap: 8 },
    md: { icon: 22, text: 17, gap: 10 },
    lg: { icon: 28, text: 22, gap: 12 },
  }[size] || { icon: 22, text: 17, gap: 10 };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: cfg.gap }}>
      {/* SVG Logo */}
      <svg
        width={cfg.icon * 1.5}
        height={cfg.icon}
        viewBox="0 0 36 24"
        fill="none"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <path d="M2 16V10L8 4h16l4 6v6" />
        <path d="M2 10h32" />
        <path d="M2 16h32" />
        <path d="M2 16v2a2 2 0 0 0 2 2h1" />
        <path d="M34 16v2a2 2 0 0 1-2 2h-1" />
        <circle cx="9" cy="20" r="2" fill={color} stroke="none" />
        <circle cx="27" cy="20" r="2" fill={color} stroke="none" />
        <line x1="11" y1="20" x2="25" y2="20" strokeWidth="1.5" />
      </svg>
      <span
        style={{
          fontWeight: 700,
          fontSize: cfg.text,
          letterSpacing: "-0.4px",
          color,
        }}
      >
        AutoStock
      </span>
    </div>
  );
}
