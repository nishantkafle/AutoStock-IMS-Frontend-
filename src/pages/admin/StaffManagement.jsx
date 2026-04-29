import { useState, useEffect } from "react";
import { staffService } from "../../services/api";
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

// Status badge colour mapping
function statusBadge(isActive) {
  return (
    <Badge
      text={isActive ? "Active" : "Inactive"}
      color={isActive ? "green" : "muted"}
    />
  );
}

// Form inside the modal for creating a new staff member
function AddStaffForm({ onDone, onClose }) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [msg, setMsg] = useState({ text: "", ok: false });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: "", ok: false });
    try {
      const res = await staffService.create(form);
      if (res.success) {
        setMsg({ text: "Staff account created successfully", ok: true });
        setTimeout(() => {
          onDone();
          onClose();
        }, 1200);
      } else {
        setMsg({ text: res.message, ok: false });
      }
    } catch {
      setMsg({ text: "Could not connect to server", ok: false });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Alert text={msg.text} ok={msg.ok} />
      <Field
        label="Full Name"
        value={form.fullName}
        required
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        placeholder="Staff member name"
      />
      <Field
        label="Email"
        type="email"
        value={form.email}
        required
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="staff@autostock.com"
      />
      <Field
        label="Password"
        type="password"
        value={form.password}
        required
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="At least 6 characters"
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
          {saving ? "Creating..." : "Create Staff"}
        </Btn>
      </div>
    </form>
  );
}

// Edit name or active status of existing staff
function EditStaffForm({ staff, onDone, onClose }) {
  const [form, setForm] = useState({
    fullName: staff.fullName,
    isActive: staff.isActive,
  });
  const [msg, setMsg] = useState({ text: "", ok: false });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await staffService.update(staff.id, form);
      if (res.success) {
        setMsg({ text: "Staff updated", ok: true });
        setTimeout(() => {
          onDone();
          onClose();
        }, 1000);
      } else {
        setMsg({ text: res.message, ok: false });
      }
    } catch {
      setMsg({ text: "Could not connect to server", ok: false });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Alert text={msg.text} ok={msg.ok} />
      <Field
        label="Full Name"
        value={form.fullName}
        required
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
      />
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active account
        </label>
      </div>
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>
          Cancel
        </Btn>
        <Btn type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Btn>
      </div>
    </form>
  );
}

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await staffService.getAll();
      if (res.success) setStaff(res.data);
    } catch {
      setError("Failed to load staff list");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDeactivate(id) {
    if (!window.confirm("Deactivate this staff member?")) return;
    try {
      await staffService.deactivate(id);
      load();
    } catch {
      setError("Failed to deactivate");
    }
  }

  return (
    <div>
      {/* Page header */}
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
            Staff Management
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              marginTop: "2px",
            }}
          >
            Create and manage staff accounts
          </p>
        </div>
        <Btn onClick={() => setShowAdd(true)}>Add Staff</Btn>
      </div>

      {error && <Alert text={error} />}

      {/* Staff table */}
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
        ) : staff.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            No staff members yet. Add your first staff account.
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                {["Name", "Email", "Status", "Created", "Actions"].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td style={tdStyle}>{s.fullName}</td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {s.email}
                  </td>
                  <td style={tdStyle}>{statusBadge(s.isActive)}</td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Btn
                        variant="ghost"
                        style={{ padding: "5px 12px", fontSize: "12px" }}
                        onClick={() => setEditing(s)}
                      >
                        Edit
                      </Btn>
                      {s.isActive && (
                        <Btn
                          variant="danger"
                          style={{ padding: "5px 12px", fontSize: "12px" }}
                          onClick={() => handleDeactivate(s.id)}
                        >
                          Deactivate
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

      {/* Add Staff modal */}
      {showAdd && (
        <Modal title="Add Staff Member" onClose={() => setShowAdd(false)}>
          <AddStaffForm onDone={load} onClose={() => setShowAdd(false)} />
        </Modal>
      )}

      {/* Edit Staff modal */}
      {editing && (
        <Modal title="Edit Staff Member" onClose={() => setEditing(null)}>
          <EditStaffForm
            staff={editing}
            onDone={load}
            onClose={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}
