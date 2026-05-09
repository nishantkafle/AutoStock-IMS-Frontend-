import { useState, useEffect } from "react";
import { vehicleService } from "../../services/api";
import Modal from "../../components/Modal";
import {
  Field,
  Btn,
  Alert,
  tableStyle,
  thStyle,
  tdStyle,
} from "../../components/FormElements";

const emptyForm = {
  make: "",
  model: "",
  year: "",
  vehicleNumber: "",
  mileage: "",
};

function VehicleForm({ initial = emptyForm, onSubmit, onClose, saving }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        <Field
          label="Make"
          value={form.make}
          onChange={set("make")}
          placeholder="e.g. Toyota"
          required
        />
        <Field
          label="Model"
          value={form.model}
          onChange={set("model")}
          placeholder="e.g. Corolla"
          required
        />
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        <Field
          label="Year"
          type="number"
          value={form.year}
          onChange={set("year")}
          placeholder="2020"
          required
          min="1900"
          max="2100"
        />
        <Field
          label="Mileage (km)"
          type="number"
          value={form.mileage}
          onChange={set("mileage")}
          placeholder="0"
        />
      </div>
      <Field
        label="Vehicle Number"
        value={form.vehicleNumber}
        onChange={set("vehicleNumber")}
        placeholder="e.g. BA 1 PA 1234"
        required
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
          {saving ? "Saving..." : "Save Vehicle"}
        </Btn>
      </div>
    </form>
  );
}

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: false });

  async function load() {
    setLoading(true);
    try {
      const res = await vehicleService.getMine();
      if (res.success) setVehicles(res.data);
    } catch {
      setMsg({ text: "Failed to load vehicles", ok: false });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(form) {
    setSaving(true);
    try {
      const res = await vehicleService.add({
        ...form,
        year: parseInt(form.year),
        mileage: parseInt(form.mileage) || 0,
      });
      if (res.success) {
        setShowAdd(false);
        setMsg({ text: "Vehicle added", ok: true });
        load();
      } else {
        setMsg({ text: res.message, ok: false });
      }
    } catch {
      setMsg({ text: "Failed to add vehicle", ok: false });
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(form) {
    setSaving(true);
    try {
      const res = await vehicleService.update(editing.id, {
        ...form,
        year: parseInt(form.year),
        mileage: parseInt(form.mileage) || 0,
      });
      if (res.success) {
        setEditing(null);
        setMsg({ text: "Vehicle updated", ok: true });
        load();
      } else {
        setMsg({ text: res.message, ok: false });
      }
    } catch {
      setMsg({ text: "Failed to update", ok: false });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this vehicle?")) return;
    try {
      const res = await vehicleService.delete(id);
      if (res.success) {
        setMsg({ text: "Vehicle removed", ok: true });
        load();
      }
    } catch {
      setMsg({ text: "Failed to remove vehicle", ok: false });
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
            My Vehicles
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              marginTop: "2px",
            }}
          >
            Manage your registered vehicles
          </p>
        </div>
        <Btn onClick={() => setShowAdd(true)}>Add Vehicle</Btn>
      </div>

      {msg.text && <Alert text={msg.text} ok={msg.ok} />}

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
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: "6px",
            padding: "56px",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          No vehicles added yet. Add your first vehicle to book appointments.
        </div>
      ) : (
        <div
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <table style={tableStyle}>
            <thead>
              <tr>
                {[
                  "Vehicle",
                  "Year",
                  "Number Plate",
                  "Mileage",
                  "Last Service",
                  "Actions",
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
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Btn
                        variant="ghost"
                        style={{ padding: "5px 12px", fontSize: "12px" }}
                        onClick={() => setEditing(v)}
                      >
                        Edit
                      </Btn>
                      <Btn
                        variant="danger"
                        style={{ padding: "5px 12px", fontSize: "12px" }}
                        onClick={() => handleDelete(v.id)}
                      >
                        Remove
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <Modal title="Add Vehicle" onClose={() => setShowAdd(false)}>
          <VehicleForm
            onSubmit={handleAdd}
            onClose={() => setShowAdd(false)}
            saving={saving}
          />
        </Modal>
      )}
      {editing && (
        <Modal title="Edit Vehicle" onClose={() => setEditing(null)}>
          <VehicleForm
            initial={{
              make: editing.make,
              model: editing.model,
              year: String(editing.year),
              vehicleNumber: editing.vehicleNumber,
              mileage: String(editing.mileage),
            }}
            onSubmit={handleEdit}
            onClose={() => setEditing(null)}
            saving={saving}
          />
        </Modal>
      )}
    </div>
  );
}
