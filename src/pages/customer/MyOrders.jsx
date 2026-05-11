import { useState, useEffect } from "react";

const API = "https://localhost:7089/api";

async function fetchHistory() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/customer/history`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.json();
}

// Status badge - color changes based on status text
function StatusBadge({ status }) {
  const styles = {
    Paid: { bg: "rgba(92,196,74,0.12)", color: "#5CC44A" },
    Unpaid: { bg: "rgba(232,168,78,0.12)", color: "#E8A84E" },
    Overdue: { bg: "rgba(255,90,61,0.12)", color: "#FF5A3D" },
    Completed: { bg: "rgba(92,196,74,0.12)", color: "#5CC44A" },
    Confirmed: { bg: "rgba(79,126,255,0.12)", color: "#4F7EFF" },
    Pending: { bg: "rgba(232,168,78,0.12)", color: "#E8A84E" },
    Cancelled: { bg: "rgba(255,90,61,0.12)", color: "#FF5A3D" },
    Requested: { bg: "var(--surface-2)", color: "var(--text-muted)" },
  };
  const s = styles[status] || {
    bg: "var(--surface-2)",
    color: "var(--text-muted)",
  };

  return (
    <span
      style={{
        fontSize: "11.5px",
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        padding: "2px 9px",
        borderRadius: "3px",
        display: "inline-block",
      }}
    >
      {status}
    </span>
  );
}

function fmtDate(d) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Purchases tab
function PurchasesTab({ purchases }) {
  const [expanded, setExpanded] = useState(null);

  if (purchases.length === 0) {
    return (
      <div
        style={{
          padding: "48px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "14px",
        }}
      >
        No purchase history yet.
      </div>
    );
  }

  return (
    <div>
      {purchases.map((inv) => (
        <div
          key={inv.id}
          style={{
            border: "1px solid var(--border)",
            borderRadius: "6px",
            marginBottom: "10px",
            overflow: "hidden",
            background: "var(--surface)",
          }}
        >
          {/* Row - click to expand */}
          <div
            onClick={() => setExpanded(expanded === inv.id ? null : inv.id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              cursor: "pointer",
              transition: "background 0.13s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--surface-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                }}
              >
                {inv.invoiceNumber}
              </span>
              <span style={{ fontSize: "14px" }}>{fmtDate(inv.date)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700 }}>
                Rs. {Number(inv.totalAmount).toFixed(2)}
              </span>
              <StatusBadge status={inv.status} />
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-faint)",
                  display: "inline-block",
                  transform: expanded === inv.id ? "rotate(180deg)" : "none",
                  transition: "transform 0.15s",
                }}
              >
                ▾
              </span>
            </div>
          </div>

          {/* Expanded line items */}
          {expanded === inv.id && inv.items?.length > 0 && (
            <div
              style={{
                borderTop: "1px solid var(--border)",
                background: "var(--surface-2)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                }}
              >
                <thead>
                  <tr>
                    {["Part", "Qty", "Unit Price", "Total"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "8px 18px",
                          textAlign: "left",
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.7px",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inv.items.map((item, i) => (
                    <tr key={i}>
                      <td
                        style={{
                          padding: "9px 18px",
                          borderBottom: "1px solid var(--border)",
                          fontWeight: 500,
                        }}
                      >
                        {item.partName}
                      </td>
                      <td
                        style={{
                          padding: "9px 18px",
                          borderBottom: "1px solid var(--border)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          padding: "9px 18px",
                          borderBottom: "1px solid var(--border)",
                          color: "var(--text-muted)",
                        }}
                      >
                        Rs. {Number(item.unitPrice).toFixed(2)}
                      </td>
                      <td
                        style={{
                          padding: "9px 18px",
                          borderBottom: "1px solid var(--border)",
                          fontWeight: 600,
                        }}
                      >
                        Rs. {Number(item.totalPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Service history tab
function ServiceTab({ services }) {
  if (services.length === 0) {
    return (
      <div
        style={{
          padding: "48px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "14px",
        }}
      >
        No service history yet.
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "6px",
        overflow: "hidden",
        background: "var(--surface)",
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}
      >
        <thead>
          <tr>
            {["Date", "Service", "Notes", "Status"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "10px 18px",
                  textAlign: "left",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.7px",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  borderBottom: "1px solid var(--border)",
                  background: "var(--surface-2)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {services.map((s, i) => (
            <tr
              key={s.id}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--surface-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              style={{ transition: "background 0.12s" }}
            >
              <td
                style={{
                  padding: "12px 18px",
                  borderBottom:
                    i < services.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {fmtDate(s.date)}
              </td>
              <td
                style={{
                  padding: "12px 18px",
                  borderBottom:
                    i < services.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                  fontWeight: 500,
                }}
              >
                {s.serviceType}
              </td>
              <td
                style={{
                  padding: "12px 18px",
                  borderBottom:
                    i < services.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                  color: "var(--text-muted)",
                  fontSize: "13px",
                }}
              >
                {s.notes || "-"}
              </td>
              <td
                style={{
                  padding: "12px 18px",
                  borderBottom:
                    i < services.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                <StatusBadge status={s.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main page
export default function MyOrders() {
  const [tab, setTab] = useState("purchases");
  const [data, setData] = useState({ purchases: [], services: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory()
      .then((res) => {
        if (res.success) setData(res.data);
        else setError(res.message || "Failed to load history.");
      })
      .catch(() =>
        setError("Cannot connect to server. Make sure the backend is running."),
      )
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { key: "purchases", label: `Purchases (${data.purchases.length})` },
    { key: "services", label: `Service History (${data.services.length})` },
  ];

  return (
    <div>
      <div style={{ marginBottom: "22px" }}>
        <h1
          style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px" }}
        >
          My Orders & History
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginTop: "3px",
          }}
        >
          Your purchase invoices and service appointment history.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          borderBottom: "1px solid var(--border)",
          marginBottom: "20px",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "9px 18px",
              fontSize: "14px",
              fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? "var(--text)" : "var(--text-muted)",
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${tab === t.key ? "var(--accent)" : "transparent"}`,
              marginBottom: "-1px",
              cursor: "pointer",
              transition: "color 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div
          style={{
            padding: "48px",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          Loading...
        </div>
      ) : error ? (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "5px",
            fontSize: "13.5px",
            background: "rgba(255,90,61,0.1)",
            color: "#FF5A3D",
            border: "1px solid rgba(255,90,61,0.3)",
          }}
        >
          {error}
        </div>
      ) : tab === "purchases" ? (
        <PurchasesTab purchases={data.purchases} />
      ) : (
        <ServiceTab services={data.services} />
      )}
    </div>
  );
}
