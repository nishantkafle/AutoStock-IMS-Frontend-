import { useState, useEffect } from "react";
import { reviewService } from "../../services/api";
import {
  Alert,
  Badge,
  tableStyle,
  thStyle,
  tdStyle,
} from "../../components/FormElements";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: "", ok: false });

  useEffect(() => {
    async function load() {
      try {
        const res = await reviewService.getAll();
        if (res.success) setReviews(res.data);
      } catch {
        setMsg({ text: "Failed to load reviews", ok: false });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px" }}
        >
          Customer Reviews
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          All reviews submitted by customers
        </p>
      </div>

      {msg.text && <Alert text={msg.text} ok={msg.ok} />}

      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
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
        ) : reviews.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            No reviews yet.
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                {["Customer", "Part", "Rating", "Comment", "Date"].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td style={tdStyle}>{r.customerName}</td>
                  <td style={tdStyle}>{r.partName || "-"}</td>
                  <td style={tdStyle}>
                    <Badge
                      text={`${r.rating}/5`}
                      color={r.rating >= 4 ? "green" : r.rating >= 3 ? "blue" : "red"}
                    />
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {r.comment || "-"}
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
