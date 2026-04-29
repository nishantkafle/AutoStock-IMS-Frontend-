import { useState, useEffect } from "react";
import { partsService, vendorService } from "../../services/api";
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

// Empty form state reused for both add and edit
const emptyForm = {
  vendorId: "",
  name: "",
  description: "",
  category: "",
  price: "",
  stockQty: "",
  reorderLevel: "10",
};

function PartForm({ initial = emptyForm, vendors, onSubmit, onClose, saving }) {
  const [form, setForm] = useState(initial);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <Field
        label="Vendor"
        as="select"
        value={form.vendorId}
        onChange={set("vendorId")}
        required
      >
        <option value="">Select a vendor</option>
        {vendors.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </Field>
      <Field
        label="Part Name"
        value={form.name}
        onChange={set("name")}
        placeholder="e.g. Brake Pad"
        required
      />
      <Field
        label="Category"
        value={form.category}
        onChange={set("category")}
        placeholder="e.g. Brakes"
      />
      <Field
        label="Description"
        as="textarea"
        value={form.description}
        onChange={set("description")}
        placeholder="Optional description"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px",
        }}
      >
        <Field
          label="Price"
          type="number"
          value={form.price}
          onChange={set("price")}
          placeholder="0.00"
          required
        />
        <Field
          label="Stock Qty"
          type="number"
          value={form.stockQty}
          onChange={set("stockQty")}
          placeholder="0"
          required
        />
        <Field
          label="Reorder Level"
          type="number"
          value={form.reorderLevel}
          onChange={set("reorderLevel")}
          note="Alert when below this"
        />
      </div>
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
          {saving ? "Saving..." : "Save Part"}
        </Btn>
      </div>
    </form>
  );
}

export default function PartsManagement() {
  const [parts, setParts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: false });
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [partsRes, vendorsRes] = await Promise.all([
        partsService.getAll(1, 100),
        vendorService.getAll(),
      ]);
      if (partsRes.success) setParts(partsRes.data);
      
      // vendorsRes is an array directly returned from the API
      if (Array.isArray(vendorsRes)) {
        setVendors(vendorsRes);
      } else if (vendorsRes && vendorsRes.success) {
        setVendors(vendorsRes.data);
      }
    } catch {
      setMsg({ text: "Failed to load data", ok: false });
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
      const res = await partsService.create({
        ...form,
        price: parseFloat(form.price),
        stockQty: parseInt(form.stockQty),
        reorderLevel: parseInt(form.reorderLevel),
      });
      if (res.success) {
        setShowAdd(false);
        setMsg({ text: "Part created", ok: true });
        load();
      } else {
        setMsg({ text: res.message, ok: false });
      }
    } catch {
      setMsg({ text: "Failed to create part", ok: false });
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(form) {
    setSaving(true);
    try {
      const res = await partsService.update(editing.id, {
        ...form,
        price: parseFloat(form.price),
        stockQty: parseInt(form.stockQty),
        reorderLevel: parseInt(form.reorderLevel),
      });
      if (res.success) {
        setEditing(null);
        setMsg({ text: "Part updated", ok: true });
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
    if (!window.confirm("Delete this part?")) return;
    try {
      await partsService.delete(id);
      setMsg({ text: "Part deleted", ok: true });
      load();
    } catch {
      setMsg({ text: "Failed to delete", ok: false });
    }
  }

  // Client-side filter on name or category
  const filtered = parts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

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
            Parts Management
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              marginTop: "2px",
            }}
          >
            Add, edit and remove vehicle parts from inventory
          </p>
        </div>
        <Btn onClick={() => setShowAdd(true)}>Add Part</Btn>
      </div>

      {msg.text && <Alert text={msg.text} ok={msg.ok} />}

      {/* Search bar */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or category..."
        style={{
          width: "100%",
          maxWidth: 340,
          padding: "9px 12px",
          border: "1px solid var(--input-border)",
          borderRadius: "4px",
          background: "var(--input-bg)",
          color: "var(--text)",
          fontSize: "14px",
          marginBottom: "16px",
        }}
      />

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
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            No parts found.
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                {[
                  "ID",
                  "Name",
                  "Category",
                  "Vendor",
                  "Price",
                  "Stock",
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
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "13px", color: "var(--text-muted)" }} title={p.id}>
                    {p.id.split('-')[0]}
                  </td>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {p.category || "-"}
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>
                    {p.vendorName}
                  </td>
                  <td style={tdStyle}>Rs. {p.price.toFixed(2)}</td>
                  <td style={tdStyle}>{p.stockQty}</td>
                  <td style={tdStyle}>
                    <Badge
                      text={p.isLowStock ? "Low Stock" : "In Stock"}
                      color={p.isLowStock ? "red" : "green"}
                    />
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Btn
                        variant="ghost"
                        style={{ padding: "5px 12px", fontSize: "12px" }}
                        onClick={() => setEditing(p)}
                      >
                        Edit
                      </Btn>
                      <Btn
                        variant="danger"
                        style={{ padding: "5px 12px", fontSize: "12px" }}
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <Modal title="Add New Part" onClose={() => setShowAdd(false)}>
          <PartForm
            vendors={vendors}
            onSubmit={handleAdd}
            onClose={() => setShowAdd(false)}
            saving={saving}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Part" onClose={() => setEditing(null)}>
          <PartForm
            vendors={vendors}
            initial={{
              vendorId: editing.vendorId,
              name: editing.name,
              description: editing.description,
              category: editing.category,
              price: String(editing.price),
              stockQty: String(editing.stockQty),
              reorderLevel: String(editing.reorderLevel),
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
