import { useNavigate } from "react-router-dom";
import { Sun, Moon, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Top bar shown inside all dashboard pages
export default function Topbar({ title, theme, toggleTheme }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const profilePath = `/${user?.role?.toLowerCase()}/profile`;

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
          fontSize: "15px",
          fontWeight: 600,
          color: "var(--text)",
          letterSpacing: "-0.2px",
        }}
      >
        {title}
      </span>

      {/* Right side controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {/* Theme toggle icon */}
        <button
          onClick={toggleTheme}
          title={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          style={{
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            background: "transparent",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--surface-2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Notification bell */}
        <button
          title="Notifications"
          style={{
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            background: "transparent",
            position: "relative",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--surface-2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <Bell size={16} />
          {/* Red dot badge for notifications */}
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

        {/* User avatar - click to go to profile */}
        <button
          onClick={() => navigate(profilePath)}
          title="Profile"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            fontWeight: 700,
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "2px",
            cursor: "pointer",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "var(--accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }
        >
          {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
        </button>
      </div>
    </div>
  );
}
