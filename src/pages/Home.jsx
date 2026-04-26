import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import Logo from "../components/Logo";

const features = [
  {
    role: "Admin",
    title: "Full business control",
    items: [
      "Manage staff accounts and access roles",
      "Track inventory and set reorder thresholds",
      "Create and manage vendor purchase invoices",
      "View daily, monthly and yearly financial reports",
      "Receive automatic low stock alerts",
    ],
  },
  {
    role: "Staff",
    title: "Customer and sales tools",
    items: [
      "Register customers with vehicle details",
      "Process part sales and generate invoices",
      "Send invoices directly to customer email",
      "Search customers by name, phone, ID or vehicle",
      "Generate reports on regulars and pending credits",
    ],
  },
  {
    role: "Customer",
    title: "Self-service portal",
    items: [
      "Create account and manage your profile",
      "Book service appointments online",
      "Request parts not currently in stock",
      "View full purchase and service history",
      "Get maintenance reminders for your vehicle",
    ],
  },
];

// Nav link with hover background only - no underline
function NavLink({ to, children, variant = "ghost" }) {
  const base = {
    padding: "7px 16px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: variant === "filled" ? 600 : 500,
    display: "inline-block",
    transition: "background 0.15s, color 0.15s",
    cursor: "pointer",
  };
  const styles = {
    ghost: {
      color: "var(--text)",
      border: "1px solid var(--border)",
      background: "transparent",
    },
    filled: {
      color: "var(--accent-fg)",
      background: "var(--accent)",
      border: "1px solid var(--accent)",
    },
  }[variant];

  return (
    <Link
      to={to}
      style={{ ...base, ...styles }}
      onMouseEnter={(e) => {
        if (variant === "ghost")
          e.currentTarget.style.background = "var(--surface-2)";
        if (variant === "filled")
          e.currentTarget.style.background = "var(--accent-hover)";
      }}
      onMouseLeave={(e) => {
        if (variant === "ghost")
          e.currentTarget.style.background = "transparent";
        if (variant === "filled")
          e.currentTarget.style.background = "var(--accent)";
      }}
    >
      {children}
    </Link>
  );
}

export default function Home({ theme, toggleTheme }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Top navigation */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          height: 60,
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Logo size="md" color="var(--text)" />

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Theme toggle icon */}
          <button
            onClick={toggleTheme}
            title={theme === "light" ? "Dark mode" : "Light mode"}
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
              marginRight: "6px",
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

          <NavLink to="/login" variant="ghost">
            Sign In
          </NavLink>
          <NavLink to="/register" variant="filled">
            Get Started
          </NavLink>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          padding: "88px 48px 72px",
          textAlign: "center",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "18px",
          }}
        >
          Vehicle Parts Management System
        </p>
        <h1
          style={{
            fontSize: "52px",
            fontWeight: 800,
            letterSpacing: "-2.5px",
            lineHeight: 1.1,
            color: "var(--text)",
            maxWidth: "720px",
            margin: "0 auto 22px",
          }}
        >
          Professional Vehicle
          <br />
          Parts Management
        </h1>
        <p
          style={{
            fontSize: "17px",
            color: "var(--text-muted)",
            maxWidth: "480px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          Streamline your inventory, manage staff, and serve customers better -
          all in one platform.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          <Link
            to="/register"
            style={{
              background: "var(--accent)",
              color: "var(--accent-fg)",
              padding: "11px 28px",
              borderRadius: "4px",
              fontWeight: 600,
              fontSize: "15px",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--accent-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--accent)")
            }
          >
            Create Account
          </Link>
          <Link
            to="/login"
            style={{
              background: "transparent",
              color: "var(--text)",
              padding: "11px 28px",
              borderRadius: "4px",
              fontWeight: 500,
              fontSize: "15px",
              border: "1px solid var(--border)",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--surface-2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features by role */}
      <section style={{ padding: "72px 48px", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "-0.8px",
              textAlign: "center",
              marginBottom: "6px",
            }}
          >
            Powerful features for every role
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "15px",
              marginBottom: "48px",
            }}
          >
            Each user type gets exactly the tools they need.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  padding: "26px 24px",
                  background: "var(--card-bg)",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "8px",
                  }}
                >
                  {f.role}
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    letterSpacing: "-0.2px",
                    marginBottom: "16px",
                  }}
                >
                  {f.title}
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {f.items.map((item, j) => (
                    <div
                      key={j}
                      style={{
                        fontSize: "13.5px",
                        color: "var(--text-muted)",
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--text)",
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        -
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          padding: "72px 48px",
          textAlign: "center",
          borderTop: "1px solid var(--border)",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: 700,
            letterSpacing: "-1px",
            marginBottom: "12px",
          }}
        >
          Ready to get started?
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "15px",
            marginBottom: "32px",
          }}
        >
          Join automotive teams using AutoStock to run their business.
        </p>
        <Link
          to="/register"
          style={{
            background: "var(--accent)",
            color: "var(--accent-fg)",
            padding: "12px 36px",
            borderRadius: "4px",
            fontWeight: 600,
            fontSize: "15px",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--accent-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--accent)")
          }
        >
          Create Your Account
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "22px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--surface)",
        }}
      >
        <Logo size="sm" color="var(--text-muted)" />
        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          2026 AutoStock - Professional vehicle parts management
        </span>
      </footer>
    </div>
  );
}
