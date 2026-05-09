import { useEffect } from "react";

// Simple modal overlay - used for add/edit forms across all pages
export default function Modal({ title, onClose, children }) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          width: "100%",
          maxWidth: 480,
          padding: "28px 28px 24px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "22px",
            paddingBottom: "14px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "-0.2px",
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "20px",
              lineHeight: 1,
              cursor: "pointer",
              padding: "2px 6px",
            }}
          >
            x
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
