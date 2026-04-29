import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { changePassword } from "../../services/authService";

// Single field component reused throughout the form
function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly,
  note,
}) {
  return (
    <div style={{ marginBottom: "18px" }}>
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
        readOnly={readOnly}
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "9px 12px",
          border: "1px solid var(--input-border)",
          borderRadius: "4px",
          background: readOnly ? "var(--surface-2)" : "var(--input-bg)",
          color: readOnly ? "var(--text-muted)" : "var(--text)",
          fontSize: "14px",
          cursor: readOnly ? "default" : "text",
        }}
        onFocus={(e) => {
          if (!readOnly)
            e.target.style.outline = "2px solid var(--input-focus)";
        }}
        onBlur={(e) => {
          e.target.style.outline = "none";
        }}
      />
      {note && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            marginTop: "4px",
          }}
        >
          {note}
        </p>
      )}
    </div>
  );
}

// Section wrapper with a title line
function Section({ title, children }) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "6px",
        padding: "26px",
        marginBottom: "20px",
      }}
    >
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          letterSpacing: "-0.2px",
          marginBottom: "20px",
          paddingBottom: "14px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function Profile() {
  const { user, token, updateUser } = useAuth();

  // Name edit state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [nameMsg, setNameMsg] = useState("");
  const [nameSaving, setNameSaving] = useState(false);

  // Password change state
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwMsg, setPwMsg] = useState({ text: "", ok: false });
  const [pwSaving, setPwSaving] = useState(false);

  // Save display name - updates local context
  async function handleSaveName(e) {
    e.preventDefault();
    if (!fullName.trim()) {
      setNameMsg("Name cannot be empty");
      return;
    }
    setNameSaving(true);
    setNameMsg("");
    // Backend call goes here when ready
    setTimeout(() => {
      updateUser({ fullName: fullName.trim() });
      setNameMsg("Name updated successfully");
      setNameSaving(false);
    }, 600);
  }

  // Change password via backend
  async function handleChangePassword(e) {
    e.preventDefault();
    setPwMsg({ text: "", ok: false });

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ text: "New passwords do not match", ok: false });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg({ text: "Password must be at least 6 characters", ok: false });
      return;
    }

    setPwSaving(true);
    try {
      const res = await changePassword(
        {
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        },
        token,
      );

      if (res.success) {
        setPwMsg({ text: "Password changed successfully", ok: true });
        setPwForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPwMsg({
          text: res.message || "Failed to change password",
          ok: false,
        });
      }
    } catch {
      setPwMsg({ text: "Could not connect to server", ok: false });
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px" }}
        >
          Profile
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          Manage your account details
        </p>
      </div>

      {/* Account info - read only */}
      <Section title="Account Information">
        <Field
          label="Email"
          value={user?.email || ""}
          readOnly
          note="Email cannot be changed"
        />
        <Field label="Role" value={user?.role || ""} readOnly />
      </Section>

      {/* Edit display name */}
      <Section title="Display Name">
        <form onSubmit={handleSaveName}>
          <Field
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />

          {nameMsg && (
            <p
              style={{
                fontSize: "13px",
                color: nameMsg.includes("success")
                  ? "var(--success)"
                  : "var(--error)",
                marginBottom: "12px",
              }}
            >
              {nameMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={nameSaving}
            style={{
              background: "var(--accent)",
              color: "var(--accent-fg)",
              padding: "8px 20px",
              borderRadius: "4px",
              fontWeight: 600,
              fontSize: "14px",
              opacity: nameSaving ? 0.7 : 1,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!nameSaving)
                e.currentTarget.style.background = "var(--accent-hover)";
            }}
            onMouseLeave={(e) => {
              if (!nameSaving)
                e.currentTarget.style.background = "var(--accent)";
            }}
          >
            {nameSaving ? "Saving..." : "Save Name"}
          </button>
        </form>
      </Section>

      {/* Change password */}
      <Section title="Change Password">
        <form onSubmit={handleChangePassword}>
          <Field
            label="Current Password"
            type="password"
            value={pwForm.currentPassword}
            onChange={(e) =>
              setPwForm({ ...pwForm, currentPassword: e.target.value })
            }
            placeholder="Enter current password"
          />
          <Field
            label="New Password"
            type="password"
            value={pwForm.newPassword}
            onChange={(e) =>
              setPwForm({ ...pwForm, newPassword: e.target.value })
            }
            placeholder="At least 6 characters"
          />
          <Field
            label="Confirm New Password"
            type="password"
            value={pwForm.confirmPassword}
            onChange={(e) =>
              setPwForm({ ...pwForm, confirmPassword: e.target.value })
            }
            placeholder="Repeat new password"
          />

          {pwMsg.text && (
            <p
              style={{
                fontSize: "13px",
                color: pwMsg.ok ? "var(--success)" : "var(--error)",
                marginBottom: "12px",
              }}
            >
              {pwMsg.text}
            </p>
          )}

          <button
            type="submit"
            disabled={pwSaving}
            style={{
              background: "var(--accent)",
              color: "var(--accent-fg)",
              padding: "8px 20px",
              borderRadius: "4px",
              fontWeight: 600,
              fontSize: "14px",
              opacity: pwSaving ? 0.7 : 1,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!pwSaving)
                e.currentTarget.style.background = "var(--accent-hover)";
            }}
            onMouseLeave={(e) => {
              if (!pwSaving) e.currentTarget.style.background = "var(--accent)";
            }}
          >
            {pwSaving ? "Changing..." : "Change Password"}
          </button>
        </form>
      </Section>
    </div>
  );
}
