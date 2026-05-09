import { useState, useEffect } from "react";
import { appointmentService, vehicleService } from "../../services/api";
import Modal from "../../components/Modal";
import {
  Field,
  Btn,
  Alert,
  Badge,
  tableStyle,
  thStyle,
  tdStyle,
} from "../../components/FormElements";

function statusBadge(status) {
  const map = {
    Pending: "blue",
    Confirmed: "green",
    Completed: "muted",
    Cancelled: "red",
  };
  return <Badge text={status} color={map[status] || "default"} />;
}

function BookForm({ vehicles, onSubmit, onClose, saving }) {
  const [form, setForm] = useState({
    vehicleId: "",
    serviceType: "",
    appointmentDate: "",
    notes: "",
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Minimum date is tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <Field
        label="Vehicle (optional)"
        as="select"
        value={form.vehicleId}
        onChange={set("vehicleId")}
      >
        <option value="">No specific vehicle</option>
        {vehicles.map((v) => (
          <option key={v.id} value={v.id}>
            {v.make} {v.model} - {v.vehicleNumber}
          </option>
        ))}
      </Field>
      <Field
        label="Service Type"
        value={form.serviceType}
        onChange={set("serviceType")}
        placeholder="e.g. Oil Change, Full Service, Brake Check"
        required
      />
      <Field
        label="Preferred Date and Time"
        type="datetime-local"
        value={form.appointmentDate}
        onChange={set("appointmentDate")}
        required
        min={minDate}
      />
      <Field
        label="Notes"
        as="textarea"
        value={form.notes}
        onChange={set("notes")}
        placeholder="Any extra details for the service team"
      />
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "flex-end",
          marginTop: "6px",
        }}
      >
        <Btn variant="ghost" onClick={onClose}>
          Cancel
        </Btn>
        <Btn type="submit" disabled={saving}>
          {saving ? "Booking..." : "Book Appointment"}
        </Btn>
      </div>
    </form>
  );
}

export default function CustomerAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBook, setShowBook] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: false });

  async function load() {
    setLoading(true);
    try {
      const [aRes, vRes] = await Promise.all([
        appointmentService.getMine(),
        vehicleService.getMine(),
      ]);
      if (aRes.success) setAppointments(aRes.data);
      if (vRes.success) setVehicles(vRes.data);
    } catch {
      setMsg({ text: "Failed to load appointments", ok: false });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleBook(form) {
    setSaving(true);
    try {
      const res = await appointmentService.book({
        vehicleId: form.vehicleId || null,
        serviceType: form.serviceType,
        appointmentDate: form.appointmentDate,
        notes: form.notes,
      });
      if (res.success) {
        setShowBook(false);
        setMsg({ text: "Appointment booked successfully", ok: true });
        load();
      } else {
        setMsg({ text: res.message, ok: false });
      }
    } catch {
      setMsg({ text: "Failed to book appointment", ok: false });
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      const res = await appointmentService.cancel(id);
      if (res.success) {
        setMsg({ text: "Appointment cancelled", ok: true });
        load();
      }
    } catch {
      setMsg({ text: "Failed to cancel", ok: false });
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.4px",
            }}
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
            Book and manage your service appointments
          </p>
        </div>
        <Btn onClick={() => setShowBook(true)}>Book Appointment</Btn>
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
            No appointments yet. Book your first service appointment.
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                {[
                  "Service",
                  "Vehicle",
                  "Date",
                  "Status",
                  "Notes",
                  "Action",
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
                  <td style={tdStyle}>{a.serviceType}</td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {a.vehicleNumber || "-"}
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {new Date(a.appointmentDate).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>{statusBadge(a.status)}</td>
                  <td
                    style={{
                      ...tdStyle,
                      color: "var(--text-muted)",
                      maxWidth: "160px",
                    }}
                  >
                    {a.notes || "-"}
                  </td>
                  <td style={tdStyle}>
                    {(a.status === "Pending" || a.status === "Confirmed") && (
                      <Btn
                        variant="danger"
                        style={{ padding: "5px 12px", fontSize: "12px" }}
                        onClick={() => handleCancel(a.id)}
                      >
                        Cancel
                      </Btn>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showBook && (
        <Modal title="Book Appointment" onClose={() => setShowBook(false)}>
          <BookForm
            vehicles={vehicles}
            onSubmit={handleBook}
            onClose={() => setShowBook(false)}
            saving={saving}
          />
        </Modal>
      )}
    </div>
  );
}
