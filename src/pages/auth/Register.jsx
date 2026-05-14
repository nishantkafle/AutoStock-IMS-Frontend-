import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { registerCustomer } from "../../services/authService";
import Logo from "../../components/Logo";

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  minLength,
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--text)",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        style={{
          width: "100%",
          padding: "9px 12px",
          border: "1px solid var(--input-border)",
          borderRadius: "4px",
          background: "var(--input-bg)",
          color: "var(--text)",
          fontSize: "14px",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--input-focus)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--input-border)")}
      />
    </div>
  );
}

export default function Register({ theme, toggleTheme }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await registerCustomer({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      if (res.success) {
        // Pass email to OTP page
        navigate("/verify-otp", { state: { email: form.email } });
      } else {
        setError(res.message || "Registration failed");
      }
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          height: 60,
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link to="/">
          <Logo size="md" color="var(--text)" />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={toggleTheme}
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
          <Link
            to="/login"
            style={{
              padding: "7px 16px",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
            }}
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Center form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: "8px",
            padding: "36px 32px",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              marginBottom: "4px",
            }}
          >
            Create account
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              marginBottom: "28px",
            }}
          >
            Register as a customer to access AutoStock
          </p>

          {error && (
            <div
              style={{
                background: "var(--error-bg)",
                border: "1px solid var(--error-border)",
                color: "var(--error)",
                padding: "10px 14px",
                borderRadius: "4px",
                fontSize: "13.5px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                background: "var(--success-bg)",
                border: "1px solid var(--success-border)",
                color: "var(--success)",
                padding: "10px 14px",
                borderRadius: "4px",
                fontSize: "13.5px",
                marginBottom: "20px",
              }}
            >
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Field
              label="Full Name"
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Your full name"
              required
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
            <Field
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              placeholder="Repeat your password"
              required
              minLength={6}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "var(--accent)",
                color: "var(--accent-fg)",
                padding: "10px",
                borderRadius: "4px",
                fontWeight: 600,
                fontSize: "15px",
                marginTop: "4px",
                opacity: loading ? 0.7 : 1,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  e.currentTarget.style.background = "var(--accent-hover)";
              }}
              onMouseLeave={(e) => {
                if (!loading)
                  e.currentTarget.style.background = "var(--accent)";
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "22px",
              fontSize: "14px",
              color: "var(--text-muted)",
            }}
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--text)", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "18px 48px",
          textAlign: "center",
          background: "var(--surface)",
          fontSize: "13px",
          color: "var(--text-muted)",
        }}
      >
        2026 AutoStock - Professional vehicle parts management
      </footer>
    </div>
  );
}
