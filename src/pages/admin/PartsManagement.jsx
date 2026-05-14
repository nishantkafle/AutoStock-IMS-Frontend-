import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { partsService, vendorService } from "../../services/api";
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
  vendorId: "",
  name: "",
  description: "",
  category: "",
  price: "",
  stockQty: "",
  reorderLevel: "10",
};

// Edit icon
function EditIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

// Delete icon
function DeleteIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

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
          label="Price (Rs.)"
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
      if (Array.isArray(vendorsRes)) setVendors(vendorsRes);
      else if (vendorsRes?.success) setVendors(vendorsRes.data);
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

  const filtered = parts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase()),
  );

  // Count low stock items for the subtitle
  const lowStockCount = parts.filter((p) => p.isLowStock).length;

  return (
    <div>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
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
            Inventory
          </h1>
          <p
            style={{
              fontSize: "13.5px",
              color: "var(--text-muted)",
              marginTop: "3px",
            }}
          >
            {parts.length} parts
            {lowStockCount > 0 && (
              <>
                {" "}
                &bull;{" "}
                <span style={{ color: "var(--error)", fontWeight: 600 }}>
                  {lowStockCount} low stock
                </span>
              </>
            )}
          </p>
        </div>
        <Btn onClick={() => setShowAdd(true)}>+ Add Part</Btn>
      </div>

      {msg.text && <Alert text={msg.text} ok={msg.ok} />}

      {/* Search bar */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search parts..."
        style={{
          width: "100%",
          maxWidth: 320,
          padding: "9px 12px",
          border: "1px solid var(--input-border)",
          borderRadius: "4px",
          background: "var(--input-bg)",
          color: "var(--text)",
          fontSize: "14px",
          marginBottom: "16px",
        }}
      />

      {/* Table card */}
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
                {["Part", "Category", "Price", "Stock", "Actions"].map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  style={{ transition: "background 0.12s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--surface-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* Part name + vendor */}
                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "11px",
                      }}
                    >
                      {/* Small icon box */}
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "6px",
                          background: "var(--surface-2)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--text-muted)",
                          flexShrink: 0,
                        }}
                      >
                        <Package size={16} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--text)",
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-muted)",
                            marginTop: "1px",
                          }}
                        >
                          {p.vendorName || "-"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category chip */}
                  <td style={tdStyle}>
                    {p.category ? (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "3px",
                          fontSize: "12px",
                          fontWeight: 500,
                          background: "var(--surface-2)",
                          color: "var(--text-muted)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {p.category}
                      </span>
                    ) : (
                      <span
                        style={{ color: "var(--text-faint)", fontSize: "13px" }}
                      >
                        -
                      </span>
                    )}
                  </td>

                  {/* Price */}
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      Rs. {p.price.toFixed(2)}
                    </span>
                  </td>

                  {/* Stock with low-stock warning */}
                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color:
                            p.stockQty === 0
                              ? "var(--error)"
                              : p.isLowStock
                                ? "var(--warn, #E8A84E)"
                                : "var(--success, #5CC44A)",
                        }}
                      >
                        {p.stockQty}
                      </span>
                      {p.isLowStock && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            color:
                              p.stockQty === 0
                                ? "var(--error)"
                                : "var(--warn, #E8A84E)",
                            background:
                              p.stockQty === 0
                                ? "var(--error-bg)"
                                : "rgba(232,168,78,0.1)",
                            border: `1px solid ${p.stockQty === 0 ? "var(--error-border)" : "rgba(232,168,78,0.3)"}`,
                            padding: "1px 7px",
                            borderRadius: "3px",
                          }}
                        >
                          {p.stockQty === 0 ? "Out" : "Low"}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Edit / Delete icon buttons */}
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {/* Edit */}
                      <button
                        onClick={() => setEditing(p)}
                        title="Edit part"
                        style={{
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid var(--border)",
                          borderRadius: "5px",
                          background: "transparent",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          transition: "background 0.13s, color 0.13s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--surface-2)";
                          e.currentTarget.style.color = "var(--text)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "var(--text-muted)";
                        }}
                      >
                        <EditIcon />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(p.id)}
                        title="Delete part"
                        style={{
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid var(--error-border, #cc2200)",
                          borderRadius: "5px",
                          background: "transparent",
                          color: "var(--error)",
                          cursor: "pointer",
                          transition: "background 0.13s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--error-bg)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
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
