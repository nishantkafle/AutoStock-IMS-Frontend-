import { useState, useEffect } from "react";
import { appointmentService } from "../../services/api";
import {
  Btn,
  Alert,
  Badge,
  tableStyle,
  thStyle,
  tdStyle,
} from "../../components/FormElements";

// Map status string to a badge colour
function statusBadge(status) {
  const map = {
    Pending: "blue",
    Confirmed: "green",
    Completed: "muted",
    Cancelled: "red",
  };
  return <Badge text={status} color={map[status] || "default"} />;
}

export default function AppointmentsAdmin() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: "", ok: false });

  async function load() {
    setLoading(true);
    try {
      const res = await appointmentService.getAll();
      if (res.success) setAppointments(res.data);
    } catch {
      setMsg({ text: "Failed to load appointments", ok: false });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Quick status change directly from the table row
  async function changeStatus(id, status) {
    try {
      const res = await appointmentService.updateStatus(id, status);
      if (res.success) {
        setMsg({ text: `Appointment marked as ${status}`, ok: true });
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
          Appointments
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          View and manage all customer appointments
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
        ) : appointments.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            No appointments yet.
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                {[
                  "Customer",
                  "Vehicle",
                  "Service",
                  "Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td style={tdStyle}>{a.customerName}</td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {a.vehicleNumber || "-"}
                  </td>
                  <td style={tdStyle}>{a.serviceType}</td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {new Date(a.appointmentDate).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>{statusBadge(a.status)}</td>
                  <td style={tdStyle}>
                    <div
                      style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                    >
                      {a.status === "Pending" && (
                        <Btn
                          variant="ghost"
                          style={{ padding: "4px 10px", fontSize: "12px" }}
                          onClick={() => changeStatus(a.id, "Confirmed")}
                        >
                          Confirm
                        </Btn>
                      )}
                      {a.status === "Confirmed" && (
                        <Btn
                          variant="ghost"
                          style={{ padding: "4px 10px", fontSize: "12px" }}
                          onClick={() => changeStatus(a.id, "Completed")}
                        >
                          Complete
                        </Btn>
                      )}
                      {(a.status === "Pending" || a.status === "Confirmed") && (
                        <Btn
                          variant="danger"
                          style={{ padding: "4px 10px", fontSize: "12px" }}
                          onClick={() => changeStatus(a.id, "Cancelled")}
                        >
                          Cancel
                        </Btn>
                      )}
                    </div>
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
