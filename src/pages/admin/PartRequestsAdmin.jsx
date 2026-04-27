import { useState, useEffect } from "react";
import { partRequestService } from "../../services/api";
import {
  Btn,
  Alert,
  Badge,
  tableStyle,
  thStyle,
  tdStyle,
} from "../../components/FormElements";

function statusBadge(status) {
  const map = { Pending: "blue", Fulfilled: "green", Rejected: "red" };
  return <Badge text={status} color={map[status] || "default"} />;
}

function urgencyBadge(urgency) {
  const map = { High: "red", Medium: "blue", Low: "muted" };
  return <Badge text={urgency} color={map[urgency] || "default"} />;
}

export default function PartRequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: "", ok: false });

  async function load() {
    setLoading(true);
    try {
      const res = await partRequestService.getAll();
      if (res.success) setRequests(res.data);
    } catch {
      setMsg({ text: "Failed to load part requests", ok: false });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function changeStatus(id, status) {
    try {
      const res = await partRequestService.updateStatus(id, status);
      if (res.success) {
        setMsg({ text: `Request marked as ${status}`, ok: true });
        load();
      } else {
        setMsg({ text: res.message, ok: false });
      }
    } catch {
      setMsg({ text: "Failed to update status", ok: false });
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px" }}
        >
          Part Requests
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          Customer requests for parts not currently in stock
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
        ) : requests.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            No part requests yet.
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                {[
                  "Customer",
                  "Part Name",
                  "Urgency",
                  "Status",
                  "Requested",
                  "Actions",
                ].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td style={tdStyle}>{r.customerName}</td>
                  <td style={tdStyle}>{r.partName}</td>
                  <td style={tdStyle}>{urgencyBadge(r.urgency)}</td>
                  <td style={tdStyle}>{statusBadge(r.status)}</td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {new Date(r.requestedAt).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>
                    {r.status === "Pending" && (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <Btn
                          variant="ghost"
                          style={{ padding: "4px 10px", fontSize: "12px" }}
                          onClick={() => changeStatus(r.id, "Fulfilled")}
                        >
                          Fulfil
                        </Btn>
                        <Btn
                          variant="danger"
                          style={{ padding: "4px 10px", fontSize: "12px" }}
                          onClick={() => changeStatus(r.id, "Rejected")}
                        >
                          Reject
                        </Btn>
                      </div>
                    )}
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
