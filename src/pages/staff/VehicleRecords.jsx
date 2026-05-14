import { useState, useEffect } from "react";
import { vehicleService } from "../../services/api";
import {
  Alert,
  tableStyle,
  thStyle,
  tdStyle,
} from "../../components/FormElements";

export default function VehicleRecords() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: "", ok: false });

  useEffect(() => {
    async function load() {
      try {
        const res = await vehicleService.getAll();
        if (res.success) setVehicles(res.data);
      } catch {
        setMsg({ text: "Failed to load vehicles", ok: false });
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
          Vehicle Records
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          All registered customer vehicles
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
        ) : vehicles.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            No vehicles registered yet.
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                {[
                  "Customer",
                  "Vehicle",
                  "Year",
                  "Number Plate",
                  "Mileage",
                  "Last Service",
                ].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td style={tdStyle}>{v.customerName || "-"}</td>
                  <td style={tdStyle}>
                    {v.make} {v.model}
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {v.year}
                  </td>
                  <td style={tdStyle}>{v.vehicleNumber}</td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {v.mileage.toLocaleString()} km
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {v.lastServiceDate
                      ? new Date(v.lastServiceDate).toLocaleDateString()
                      : "-"}
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
