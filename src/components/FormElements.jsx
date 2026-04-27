// Clean input field used inside modals and forms
export function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  note,
  as,
  children,
  min,
  max,
}) {
  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid var(--input-border)",
    borderRadius: "4px",
    background: "var(--input-bg)",
    color: "var(--text)",
    fontSize: "14px",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ marginBottom: "16px" }}>
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
        {required && (
          <span style={{ color: "var(--error)", marginLeft: "3px" }}>*</span>
        )}
      </label>

      {as === "select" ? (
        <select
          value={value}
          onChange={onChange}
          style={inputStyle}
          onFocus={(e) =>
            (e.target.style.outline = "2px solid var(--input-focus)")
          }
          onBlur={(e) => (e.target.style.outline = "none")}
        >
          {children}
        </select>
      ) : as === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
          onFocus={(e) =>
            (e.target.style.outline = "2px solid var(--input-focus)")
          }
          onBlur={(e) => (e.target.style.outline = "none")}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          style={inputStyle}
          onFocus={(e) =>
            (e.target.style.outline = "2px solid var(--input-focus)")
          }
          onBlur={(e) => (e.target.style.outline = "none")}
        />
      )}

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

// Primary action button
export function Btn({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  style = {},
}) {
  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--accent-fg)",
      border: "none",
    },
    ghost: {
      background: "transparent",
      color: "var(--text)",
      border: "1px solid var(--border)",
    },
    danger: {
      background: "transparent",
      color: "var(--error)",
      border: "1px solid var(--error-border)",
    },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 18px",
        borderRadius: "4px",
        fontWeight: 600,
        fontSize: "14px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
        transition: "background 0.15s, opacity 0.15s",
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Inline alert for success or error
export function Alert({ text, ok }) {
  if (!text) return null;
  return (
    <div
      style={{
        padding: "9px 14px",
        borderRadius: "4px",
        fontSize: "13.5px",
        marginBottom: "14px",
        background: ok ? "var(--success-bg)" : "var(--error-bg)",
        border: `1px solid ${ok ? "var(--success-border)" : "var(--error-border)"}`,
        color: ok ? "var(--success)" : "var(--error)",
      }}
    >
      {text}
    </div>
  );
}

// Status badge chip
export function Badge({ text, color = "default" }) {
  const colors = {
    default: { bg: "var(--badge-bg)", text: "var(--badge-text)" },
    green: { bg: "var(--success-bg)", text: "var(--success)" },
    red: { bg: "var(--error-bg)", text: "var(--error)" },
    blue: { bg: "rgba(91,114,245,0.1)", text: "var(--accent)" },
    muted: { bg: "var(--surface-2)", text: "var(--text-muted)" },
  };
  const c = colors[color] || colors.default;
  return (
    <span
      style={{
        padding: "2px 10px",
        borderRadius: "3px",
        fontSize: "12px",
        fontWeight: 600,
        background: c.bg,
        color: c.text,
        display: "inline-block",
      }}
    >
      {text}
    </span>
  );
}

// Table styles helper
export const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "13.5px",
};
export const thStyle = {
  textAlign: "left",
  padding: "10px 14px",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  borderBottom: "1px solid var(--border)",
  background: "var(--surface-2)",
};
export const tdStyle = {
  padding: "11px 14px",
  borderBottom: "1px solid var(--border)",
  color: "var(--text)",
  verticalAlign: "middle",
};
