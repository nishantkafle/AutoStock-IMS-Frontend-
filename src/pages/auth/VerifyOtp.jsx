import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyOtp } from "../../services/authService";

export default function VerifyOtp() {
  const { state } = useLocation();
  const email = state?.email || "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp });
      if (res.success) {
        setSuccess("Email verified. Taking you to login...");
        setTimeout(() => navigate("/login"), 1800);
      } else {
        setError(res.message || "Invalid OTP");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Invalid or expired OTP");
      } else {
        setError("Cannot connect to server. Make sure the backend is running.");
      }
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
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>
          Verify your email
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginBottom: "28px",
          }}
        >
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        {error && (
          <div
            style={{
              background: "var(--error-bg)",
              border: "1px solid var(--error)",
              color: "var(--error)",
              padding: "10px 14px",
              borderRadius: "4px",
              fontSize: "14px",
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
              border: "1px solid var(--success)",
              color: "var(--success)",
              padding: "10px 14px",
              borderRadius: "4px",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: "20px",
                letterSpacing: "8px",
                textAlign: "center",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "var(--accent)",
              color: "white",
              border: "none",
              padding: "11px",
              borderRadius: "4px",
              fontWeight: 600,
              fontSize: "15px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "14px",
            color: "var(--text-muted)",
          }}
        >
          <Link to="/register">Back to Register</Link>
        </p>
      </div>
    </div>
  );
}
