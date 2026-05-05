import { Sun, Moon, Bell } from "lucide-react";

// Top bar
export default function Topbar({ title, theme, toggleTheme }) {
  // Shared style for both icon buttons
  const iconBtn = {
    width: 35,
    height: 35,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    background: "transparent",
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
    position: "relative",
  };

  return (
    <div
      style={{
        height: 52,
        background: "var(--topbar-bg)",
        borderBottom: "1px solid var(--topbar-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 40,
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      {/* Page title */}
      <span
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "var(--text)",
          letterSpacing: "-0.2px",
        }}
      >
        {title}
      </span>

      {/* Right side*/}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Notification bell*/}
        <button
          title="Notifications"
          style={iconBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--surface-2)";
            e.currentTarget.style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <Bell size={17} />
          <span
            style={{
              position: "absolute",
              top: "7px",
              right: "7px",
              width: 7,
              height: 7,
              background: "var(--error)",
              borderRadius: "50%",
              border: "1.5px solid var(--topbar-bg)",
            }}
          />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          style={iconBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--surface-2)";
            e.currentTarget.style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>
      </div>
    </div>
  );
}
