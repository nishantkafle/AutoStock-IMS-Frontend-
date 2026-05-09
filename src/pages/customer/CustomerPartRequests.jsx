import { useState, useEffect } from "react";
import { partRequestService } from "../../services/api";
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
  const map = { Pending: "blue", Fulfilled: "green", Rejected: "red" };
  return <Badge text={status} color={map[status] || "default"} />;
}

function RequestForm({ onSubmit, onClose, saving }) {
  const [form, setForm] = useState({
    partName: "",
    description: "",
    urgency: "Medium",
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <Field
        label="Part Name"
        value={form.partName}
        onChange={set("partName")}
        placeholder="e.g. Left headlight assembly"
        required
      />
      <Field
        label="Description"
        as="textarea"
        value={form.description}
        onChange={set("description")}
        placeholder="More details about the part you need"
      />
      <Field
        label="Urgency"
        as="select"
        value={form.urgency}
        onChange={set("urgency")}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </Field>
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
          {saving ? "Submitting..." : "Submit Request"}
        </Btn>
      </div>
    </form>
  );
}

export default function CustomerPartRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: false });

  async function load() {
    setLoading(true);
    try {
      const res = await partRequestService.getMine();
      if (res.success) setRequests(res.data);
    } catch {
      setMsg({ text: "Failed to load requests", ok: false });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(form) {
    setSaving(true);
    try {
      const res = await partRequestService.create(form);
      if (res.success) {
        setShowAdd(false);
        setMsg({ text: "Request submitted successfully", ok: true });
        load();
      } else {
        setMsg({ text: res.message, ok: false });
      }
    } catch {
      setMsg({ text: "Failed to submit request", ok: false });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this request?")) return;
    try {
      const res = await partRequestService.delete(id);
      if (res.success) {
        setMsg({ text: "Request deleted", ok: true });
        load();
      }
    } catch {
      setMsg({ text: "Failed to delete", ok: false });
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
            Part Requests
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              marginTop: "2px",
            }}
          >
            Request parts that are not currently in stock
          </p>
        </div>
        <Btn onClick={() => setShowAdd(true)}>New Request</Btn>
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
            No requests yet. Submit a request for any part you need.
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                {["Part Name", "Urgency", "Status", "Requested", "Action"].map(
                  (h) => (
                    <th key={h} style={thStyle}>
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td style={tdStyle}>
                    <div>{r.partName}</div>
                    {r.description && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          marginTop: "2px",
                        }}
                      >
                        {r.description}
                      </div>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <Badge
                      text={r.urgency}
                      color={
                        r.urgency === "High"
                          ? "red"
                          : r.urgency === "Medium"
                            ? "blue"
                            : "muted"
                      }
                    />
                  </td>
                  <td style={tdStyle}>{statusBadge(r.status)}</td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {new Date(r.requestedAt).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>
                    {r.status === "Pending" && (
                      <Btn
                        variant="danger"
                        style={{ padding: "5px 12px", fontSize: "12px" }}
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </Btn>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <Modal title="Request a Part" onClose={() => setShowAdd(false)}>
          <RequestForm
            onSubmit={handleSubmit}
            onClose={() => setShowAdd(false)}
            saving={saving}
          />
        </Modal>
      )}
    </div>
  );
}
