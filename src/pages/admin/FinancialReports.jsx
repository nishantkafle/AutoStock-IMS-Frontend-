import { useState, useEffect } from "react";

const API = "https://localhost:7089/api";

// API helpers

function authFetch(url) {
  const token = localStorage.getItem("token");
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).then((r) => r.json());
}

// Formatters

function fmtMoney(n) {
  return `Rs. ${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtTime(d) {
  return new Date(d).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Summary stat card

function StatCard({ label, value, sub, accent }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.6px",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "10px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "24px",
          fontWeight: 700,
          letterSpacing: "-0.8px",
          color: accent || "var(--text)",
        }}
      >
        {value}
      </div>
      {sub != null && (
        <div
          style={{
            fontSize: "12.5px",
            color: "var(--text-muted)",
            marginTop: "4px",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

// Bar chart (pure CSS/divs, no library)

function BarChart({ bars, color1 = "var(--accent)", color2, height = 140 }) {
  const max = Math.max(...bars.map((b) => Math.max(b.value, b.value2 ?? 0)), 1);

  return (
    <div style={{ width: "100%" }}>
      {/* Bars */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          height,
          paddingBottom: "4px",
        }}
      >
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              gap: "2px",
              height: "100%",
            }}
          >
            {/* Revenue bar */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <div
                title={`Revenue: ${fmtMoney(b.value)}`}
                style={{
                  width: "100%",
                  height: `${Math.max((b.value / max) * 100, b.value > 0 ? 2 : 0)}%`,
                  background: color1,
                  borderRadius: "3px 3px 0 0",
                  opacity: 0.85,
                  transition: "height 0.3s ease",
                  minHeight: b.value > 0 ? "3px" : "0",
                }}
              />
            </div>
            {/* Cost bar (optional, shown in yearly view) */}
            {color2 && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  height: "100%",
                }}
              >
                <div
                  title={`Cost: ${fmtMoney(b.value2)}`}
                  style={{
                    width: "100%",
                    height: `${Math.max(((b.value2 ?? 0) / max) * 100, (b.value2 ?? 0) > 0 ? 2 : 0)}%`,
                    background: color2,
                    borderRadius: "3px 3px 0 0",
                    opacity: 0.7,
                    transition: "height 0.3s ease",
                    minHeight: (b.value2 ?? 0) > 0 ? "3px" : "0",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Labels */}
      <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: "10px",
              color: "var(--text-faint)",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// Status badge

function StatusBadge({ status }) {
  const map = {
    Paid: { bg: "rgba(92,196,74,0.12)", color: "#5CC44A" },
    Unpaid: { bg: "rgba(232,168,78,0.12)", color: "#E8A84E" },
    Overdue: { bg: "rgba(255,90,61,0.12)", color: "#FF5A3D" },
  };
  const s = map[status] || {
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
      }}
    >
      {status}
    </span>
  );
}

// DAILY TAB

function DailyTab() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function load(d) {
    setLoading(true);
    setError("");
    authFetch(`${API}/reports/financial/daily?date=${d}`)
      .then((res) => {
        if (res.success) setData(res.data);
        else setError(res.message || "Failed to load.");
      })
      .catch(() => setError("Cannot connect to server."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load(date);
  }, []);

  function handleDate(e) {
    setDate(e.target.value);
    load(e.target.value);
  }

  return (
    <div>
      {/* Date picker */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "22px",
        }}
      >
        <label
          style={{
            fontSize: "13.5px",
            fontWeight: 500,
            color: "var(--text-muted)",
          }}
        >
          Select Date:
        </label>
        <input
          type="date"
          value={date}
          max={today}
          onChange={handleDate}
          style={{
            padding: "7px 12px",
            borderRadius: "5px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
            fontSize: "14px",
            width: "160px",
          }}
        />
      </div>

      {loading && (
        <div
          style={{
            color: "var(--text-muted)",
            padding: "40px",
            textAlign: "center",
          }}
        >
          Loading...
        </div>
      )}
      {error && (
        <div
          style={{
            color: "#FF5A3D",
            background: "rgba(255,90,61,0.1)",
            border: "1px solid rgba(255,90,61,0.3)",
            padding: "10px 14px",
            borderRadius: "5px",
            fontSize: "13.5px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {data && !loading && (
        <>
          {/* Summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <StatCard
              label="Revenue"
              value={fmtMoney(data.totalRevenue)}
              sub={`${data.salesCount} sale${data.salesCount !== 1 ? "s" : ""}`}
              accent="#4F7EFF"
            />
            <StatCard
              label="Cost"
              value={fmtMoney(data.totalCost)}
              sub="purchase invoices"
            />
            <StatCard
              label="Gross Profit"
              value={fmtMoney(data.grossProfit)}
              sub={data.grossProfit >= 0 ? "positive" : "negative"}
              accent={data.grossProfit >= 0 ? "#5CC44A" : "#FF5A3D"}
            />
            <StatCard
              label="Sales Count"
              value={data.salesCount}
              sub="invoices issued"
            />
          </div>

          {/* Sales table */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: 600 }}>
                Sales on {fmtDate(data.date)}
              </span>
            </div>
            {data.sales.length === 0 ? (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "14px",
                }}
              >
                No sales on this date.
              </div>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr>
                    {["Time", "Invoice", "Customer", "Amount", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 16px",
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
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.sales.map((s, i) => (
                    <tr
                      key={i}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--surface-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                      style={{ transition: "background 0.12s" }}
                    >
                      <td
                        style={{
                          padding: "11px 16px",
                          borderBottom: "1px solid var(--border)",
                          color: "var(--text-muted)",
                          fontSize: "13px",
                        }}
                      >
                        {fmtTime(s.time)}
                      </td>
                      <td
                        style={{
                          padding: "11px 16px",
                          borderBottom: "1px solid var(--border)",
                          fontFamily: "monospace",
                          fontSize: "13px",
                          color: "var(--text-muted)",
                        }}
                      >
                        {s.invoiceNumber}
                      </td>
                      <td
                        style={{
                          padding: "11px 16px",
                          borderBottom: "1px solid var(--border)",
                          fontWeight: 500,
                        }}
                      >
                        {s.customerName}
                      </td>
                      <td
                        style={{
                          padding: "11px 16px",
                          borderBottom: "1px solid var(--border)",
                          fontWeight: 700,
                        }}
                      >
                        {fmtMoney(s.amount)}
                      </td>
                      <td
                        style={{
                          padding: "11px 16px",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <StatusBadge status={s.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// MONTHLY TAB

function MonthlyTab() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function load(y, m) {
    setLoading(true);
    setError("");
    authFetch(`${API}/reports/financial/monthly?year=${y}&month=${m}`)
      .then((res) => {
        if (res.success) setData(res.data);
        else setError(res.message || "Failed to load.");
      })
      .catch(() => setError("Cannot connect to server."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load(year, month);
  }, []);

  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function go(y, m) {
    setYear(y);
    setMonth(m);
    load(y, m);
  }

  // Previous / Next month navigation
  function prev() {
    if (month === 1) go(year - 1, 12);
    else go(year, month - 1);
  }
  function next() {
    const n = new Date();
    if (
      year > n.getFullYear() ||
      (year === n.getFullYear() && month >= n.getMonth() + 1)
    )
      return;
    if (month === 12) go(year + 1, 1);
    else go(year, month + 1);
  }

  const bars =
    data?.dailyBreakdown?.map((d) => ({
      label: String(d.day),
      value: d.revenue,
    })) || [];

  return (
    <div>
      {/* Month navigator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "22px",
        }}
      >
        <button
          onClick={prev}
          style={{
            width: 30,
            height: 30,
            borderRadius: "5px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ‹
        </button>
        <span
          style={{
            fontSize: "15px",
            fontWeight: 600,
            minWidth: "120px",
            textAlign: "center",
          }}
        >
          {MONTHS[month - 1]} {year}
        </span>
        <button
          onClick={next}
          style={{
            width: 30,
            height: 30,
            borderRadius: "5px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ›
        </button>
      </div>

      {loading && (
        <div
          style={{
            color: "var(--text-muted)",
            padding: "40px",
            textAlign: "center",
          }}
        >
          Loading...
        </div>
      )}
      {error && (
        <div
          style={{
            color: "#FF5A3D",
            background: "rgba(255,90,61,0.1)",
            border: "1px solid rgba(255,90,61,0.3)",
            padding: "10px 14px",
            borderRadius: "5px",
            fontSize: "13.5px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {data && !loading && (
        <>
          {/* Summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <StatCard
              label="Revenue"
              value={fmtMoney(data.totalRevenue)}
              sub={`${data.salesCount} sales`}
              accent="#4F7EFF"
            />
            <StatCard
              label="Cost"
              value={fmtMoney(data.totalCost)}
              sub="stock purchases"
            />
            <StatCard
              label="Gross Profit"
              value={fmtMoney(data.grossProfit)}
              accent={data.grossProfit >= 0 ? "#5CC44A" : "#FF5A3D"}
            />
            <StatCard label="Sales Count" value={data.salesCount} />
          </div>

          {/* Revenue bar chart */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "22px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "18px",
                color: "var(--text-muted)",
              }}
            >
              Daily Revenue - {data.monthName} {data.year}
            </div>
            <BarChart bars={bars} color1="#4F7EFF" height={130} />
            <div
              style={{
                marginTop: "10px",
                fontSize: "12px",
                color: "var(--text-faint)",
              }}
            >
              Hover bars to see exact amounts.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// YEARLY TAB
function YearlyTab() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function load(y) {
    setLoading(true);
    setError("");
    authFetch(`${API}/reports/financial/yearly?year=${y}`)
      .then((res) => {
        if (res.success) setData(res.data);
        else setError(res.message || "Failed to load.");
      })
      .catch(() => setError("Cannot connect to server."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load(year);
  }, []);

  function go(y) {
    setYear(y);
    load(y);
  }

  const bars =
    data?.monthlyBreakdown?.map((m) => ({
      label: m.monthName,
      value: m.revenue,
      value2: m.cost,
    })) || [];

  return (
    <div>
      {/* Year selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "22px",
        }}
      >
        <button
          onClick={() => go(year - 1)}
          style={{
            width: 30,
            height: 30,
            borderRadius: "5px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ‹
        </button>
        <span
          style={{
            fontSize: "15px",
            fontWeight: 600,
            minWidth: "60px",
            textAlign: "center",
          }}
        >
          {year}
        </span>
        <button
          onClick={() => {
            if (year < currentYear) go(year + 1);
          }}
          style={{
            width: 30,
            height: 30,
            borderRadius: "5px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ›
        </button>
      </div>

      {loading && (
        <div
          style={{
            color: "var(--text-muted)",
            padding: "40px",
            textAlign: "center",
          }}
        >
          Loading...
        </div>
      )}
      {error && (
        <div
          style={{
            color: "#FF5A3D",
            background: "rgba(255,90,61,0.1)",
            border: "1px solid rgba(255,90,61,0.3)",
            padding: "10px 14px",
            borderRadius: "5px",
            fontSize: "13.5px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {data && !loading && (
        <>
          {/* Summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <StatCard
              label="Total Revenue"
              value={fmtMoney(data.totalRevenue)}
              sub={`${data.totalSales} sales`}
              accent="#4F7EFF"
            />
            <StatCard
              label="Total Cost"
              value={fmtMoney(data.totalCost)}
              sub="all purchases"
            />
            <StatCard
              label="Gross Profit"
              value={fmtMoney(data.grossProfit)}
              accent={data.grossProfit >= 0 ? "#5CC44A" : "#FF5A3D"}
            />
            <StatCard
              label="Total Sales"
              value={data.totalSales}
              sub="invoices issued"
            />
          </div>

          {/* Revenue vs Cost bar chart */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "22px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "18px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                }}
              >
                Monthly Revenue vs Cost - {year}
              </span>
              {/* Legend */}
              <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "2px",
                      background: "#4F7EFF",
                      display: "inline-block",
                    }}
                  />
                  Revenue
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "2px",
                      background: "#E8A84E",
                      display: "inline-block",
                    }}
                  />
                  Cost
                </span>
              </div>
            </div>
            <BarChart
              bars={bars}
              color1="#4F7EFF"
              color2="#E8A84E"
              height={150}
            />
          </div>

          {/* Monthly breakdown table */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr>
                  {["Month", "Revenue", "Cost", "Profit", "Sales"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
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
                {data.monthlyBreakdown.map((m, i) => {
                  const profit = m.revenue - m.cost;
                  return (
                    <tr
                      key={i}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--surface-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                      style={{ transition: "background 0.12s" }}
                    >
                      <td
                        style={{
                          padding: "11px 16px",
                          borderBottom: "1px solid var(--border)",
                          fontWeight: 500,
                        }}
                      >
                        {m.monthName}
                      </td>
                      <td
                        style={{
                          padding: "11px 16px",
                          borderBottom: "1px solid var(--border)",
                          color: "#4F7EFF",
                          fontWeight: 600,
                        }}
                      >
                        {fmtMoney(m.revenue)}
                      </td>
                      <td
                        style={{
                          padding: "11px 16px",
                          borderBottom: "1px solid var(--border)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {fmtMoney(m.cost)}
                      </td>
                      <td
                        style={{
                          padding: "11px 16px",
                          borderBottom: "1px solid var(--border)",
                          fontWeight: 600,
                          color: profit >= 0 ? "#5CC44A" : "#FF5A3D",
                        }}
                      >
                        {fmtMoney(profit)}
                      </td>
                      <td
                        style={{
                          padding: "11px 16px",
                          borderBottom: "1px solid var(--border)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {m.salesCount}
                      </td>
                    </tr>
                  );
                })}
                {/* Totals row */}
                <tr style={{ background: "var(--surface-2)" }}>
                  <td style={{ padding: "11px 16px", fontWeight: 700 }}>
                    Total
                  </td>
                  <td
                    style={{
                      padding: "11px 16px",
                      fontWeight: 700,
                      color: "#4F7EFF",
                    }}
                  >
                    {fmtMoney(data.totalRevenue)}
                  </td>
                  <td style={{ padding: "11px 16px", fontWeight: 700 }}>
                    {fmtMoney(data.totalCost)}
                  </td>
                  <td
                    style={{
                      padding: "11px 16px",
                      fontWeight: 700,
                      color: data.grossProfit >= 0 ? "#5CC44A" : "#FF5A3D",
                    }}
                  >
                    {fmtMoney(data.grossProfit)}
                  </td>
                  <td style={{ padding: "11px 16px", fontWeight: 700 }}>
                    {data.totalSales}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// MAIN PAGE
const TABS = [
  { key: "daily", label: "Daily" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

export default function FinancialReports() {
  const [tab, setTab] = useState("daily");

  return (
    <div>
      {/* Page heading */}
      <div style={{ marginBottom: "22px" }}>
        <h1
          style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px" }}
        >
          Financial Reports
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginTop: "3px",
          }}
        >
          View daily, monthly, and yearly revenue, cost, and profit.
        </p>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          borderBottom: "1px solid var(--border)",
          marginBottom: "24px",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "9px 22px",
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

      {/* Tab content */}
      {tab === "daily" && <DailyTab />}
      {tab === "monthly" && <MonthlyTab />}
      {tab === "yearly" && <YearlyTab />}
    </div>
  );
}
