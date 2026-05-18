import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize = 7,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // Generate a concise set of page buttons (ideal for responsiveness)
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderTop: "1px solid var(--border)",
        background: "var(--card-bg)",
        borderBottomLeftRadius: "6px",
        borderBottomRightRadius: "6px",
      }}
    >
      <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
        Showing <span style={{ fontWeight: 600, color: "var(--text)" }}>{startItem}</span> to{" "}
        <span style={{ fontWeight: 600, color: "var(--text)" }}>{endItem}</span> of{" "}
        <span style={{ fontWeight: 600, color: "var(--text)" }}>{totalCount}</span> entries
      </div>
      
      <div style={{ display: "flex", gap: "6px" }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: "6px 12px",
            fontSize: "12.5px",
            fontWeight: 500,
            border: "1px solid var(--border)",
            borderRadius: "4px",
            background: "var(--input-bg)",
            color: "var(--text)",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) e.currentTarget.style.background = "var(--surface-hover)";
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) e.currentTarget.style.background = "var(--input-bg)";
          }}
        >
          Previous
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              padding: "6px 12px",
              minWidth: "34px",
              fontSize: "12.5px",
              fontWeight: 600,
              border: `1px solid ${p === currentPage ? "var(--accent)" : "var(--border)"}`,
              borderRadius: "4px",
              background: p === currentPage ? "var(--accent)" : "var(--input-bg)",
              color: p === currentPage ? "var(--accent-fg)" : "var(--text)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (p !== currentPage) e.currentTarget.style.background = "var(--surface-hover)";
            }}
            onMouseLeave={(e) => {
              if (p !== currentPage) e.currentTarget.style.background = "var(--input-bg)";
            }}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(p => p + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: "6px 12px",
            fontSize: "12.5px",
            fontWeight: 500,
            border: "1px solid var(--border)",
            borderRadius: "4px",
            background: "var(--input-bg)",
            color: "var(--text)",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) e.currentTarget.style.background = "var(--surface-hover)";
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) e.currentTarget.style.background = "var(--input-bg)";
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
