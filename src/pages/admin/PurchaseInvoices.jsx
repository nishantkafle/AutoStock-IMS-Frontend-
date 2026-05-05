import { useState, useEffect } from "react";
import { vendorService, partsService } from "../../services/api";
import axios from "axios";

const API = "https://localhost:7089/api";

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

async function fetchInvoices(page = 1) {
  const res = await axios.get(
    `${API}/purchaseinvoices?page=${page}&pageSize=10`,
    { headers: authHeader() },
  );
  return res.data;
}

async function createInvoice(data) {
  const res = await axios.post(`${API}/purchaseinvoices`, data, {
    headers: authHeader(),
  });
  return res.data;
}

function inputStyle(extra = {}) {
  return {
    width: "100%",
    padding: "8px 11px",
    border: "1px solid var(--input-border)",
    borderRadius: "4px",
    background: "var(--input-bg)",
    color: "var(--text)",
    fontSize: "14px",
    ...extra,
  };
}

function Label({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "12px",
        fontWeight: 600,
        color: "var(--text-muted)",
        marginBottom: "5px",
        letterSpacing: "0.3px",
      }}
    >
      {children}
    </label>
  );
}

function Alert({ text, ok }) {
  if (!text) return null;
  return (
    <div
      style={{
        padding: "9px 13px",
        borderRadius: "4px",
        fontSize: "13.5px",
        marginBottom: "16px",
        background: ok ? "var(--success-bg)" : "var(--error-bg)",
        border: `1px solid ${ok ? "var(--success-border)" : "var(--error-border)"}`,
        color: ok ? "var(--success)" : "var(--error)",
      }}
    >
      {text}
    </div>
  );
}

// Opens a new window with a printable invoice
function printInvoice(invoice) {
  const win = window.open("", "_blank", "width=750,height=900");

  const rows = invoice.items
    .map(
      (item) => `
    <tr>
      <td>${item.partName}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">Rs. ${item.unitCost.toFixed(2)}</td>
      <td style="text-align:right">Rs. ${item.subtotal.toFixed(2)}</td>
    </tr>
  `,
    )
    .join("");

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Purchase Invoice - ${invoice.invoiceNumber}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 13px;
          color: #111;
          padding: 48px;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 36px;
          padding-bottom: 20px;
          border-bottom: 2px solid #111;
        }
        .brand {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .brand-sub {
          font-size: 11px;
          color: #666;
          margin-top: 2px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .invoice-title {
          text-align: right;
        }
        .invoice-title h2 {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }
        .invoice-title .inv-number {
          font-size: 13px;
          color: #555;
          margin-top: 3px;
          font-family: monospace;
        }
        .meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        .meta-block label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #888;
          display: block;
          margin-bottom: 3px;
        }
        .meta-block span {
          font-size: 13px;
          color: #111;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 0;
        }
        thead tr {
          background: #f4f4f4;
        }
        th {
          padding: 9px 12px;
          text-align: left;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #555;
          border-bottom: 1px solid #ddd;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #ebebeb;
          font-size: 13px;
          color: #222;
        }
        .total-row {
          display: flex;
          justify-content: flex-end;
          padding: 16px 12px 0;
          border-top: 2px solid #111;
          margin-top: 4px;
        }
        .total-label {
          font-size: 12px;
          color: #666;
          margin-right: 24px;
          line-height: 1.8;
        }
        .total-amount {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .notes {
          margin-top: 28px;
          padding: 12px;
          background: #f9f9f9;
          border: 1px solid #e5e5e5;
          border-radius: 4px;
          font-size: 12px;
          color: #555;
        }
        .footer {
          margin-top: 48px;
          padding-top: 16px;
          border-top: 1px solid #ddd;
          font-size: 11px;
          color: #aaa;
          text-align: center;
        }
        @media print {
          body { padding: 24px; }
          @page { margin: 16mm; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">AutoStock</div>
          <div class="brand-sub">Vehicle Parts Management</div>
        </div>
        <div class="invoice-title">
          <h2>Purchase Invoice</h2>
          <div class="inv-number">${invoice.invoiceNumber}</div>
        </div>
      </div>

      <div class="meta">
        <div class="meta-block">
          <label>Vendor</label>
          <span>${invoice.vendorName}</span>
        </div>
        <div class="meta-block">
          <label>Purchase Date</label>
          <span>${new Date(invoice.purchaseDate).toLocaleDateString()}</span>
        </div>
        <div class="meta-block">
          <label>Created By</label>
          <span>${invoice.createdByAdminName}</span>
        </div>
        <div class="meta-block">
          <label>Invoice Date</label>
          <span>${new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Part Name</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Unit Cost</th>
            <th style="text-align:right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="total-row">
        <span class="total-label">Total Amount</span>
        <span class="total-amount">Rs. ${invoice.totalAmount.toFixed(2)}</span>
      </div>

      ${invoice.notes ? `<div class="notes"><strong>Notes:</strong> ${invoice.notes}</div>` : ""}

      <div class="footer">
        AutoStock - Vehicle Parts Management System &bull; Printed on ${new Date().toLocaleString()}
      </div>

      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() { window.close(); };
        };
      </script>
    </body>
    </html>
  `);

  win.document.close();
}

// Side panel for creating a new invoice
function InvoiceModal({ vendors, parts, onClose, onCreated }) {
  const [vendorId, setVendorId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([
    { partId: "", quantity: "", unitCost: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: false });

  function addItem() {
    setItems([...items, { partId: "", quantity: "", unitCost: "" }]);
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index, field, value) {
    const updated = [...items];
    updated[index][field] = value;
    if (field === "partId") {
      const part = parts.find((p) => p.id === value);
      if (part) updated[index].unitCost = String(part.price);
    }
    setItems(updated);
  }

  const total = items.reduce((sum, item) => {
    return (
      sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitCost) || 0)
    );
  }, 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg({ text: "", ok: false });
    if (!vendorId) {
      setMsg({ text: "Please select a vendor", ok: false });
      return;
    }
    if (items.some((i) => !i.partId || !i.quantity || !i.unitCost)) {
      setMsg({ text: "Please fill in all item fields", ok: false });
      return;
    }
    setSaving(true);
    try {
      const res = await createInvoice({
        vendorId,
        purchaseDate: new Date(purchaseDate).toISOString(),
        notes,
        items: items.map((i) => ({
          partId: i.partId,
          quantity: parseInt(i.quantity),
          unitCost: parseFloat(i.unitCost),
        })),
      });
      if (res.success) {
        setMsg({ text: "Invoice created and stock updated", ok: true });
        setTimeout(() => {
          onCreated();
          onClose();
        }, 1200);
      } else {
        setMsg({ text: res.message || "Failed to create invoice", ok: false });
      }
    } catch {
      setMsg({ text: "Could not connect to server", ok: false });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          height: "100vh",
          overflowY: "auto",
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          padding: "28px 28px 40px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
            paddingBottom: "16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "17px",
                fontWeight: 700,
                letterSpacing: "-0.3px",
              }}
            >
              New Purchase Invoice
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginTop: "2px",
              }}
            >
              Stock will update automatically when saved
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontSize: "20px",
              lineHeight: 1,
            }}
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <Alert text={msg.text} ok={msg.ok} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "16px",
            }}
          >
            <div>
              <Label>Vendor</Label>
              <select
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                style={inputStyle()}
              >
                <option value="">Select vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Purchase Date</Label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                style={inputStyle()}
              />
            </div>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <Label>Notes (optional)</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Any notes about this purchase"
              style={inputStyle({ resize: "none" })}
            />
          </div>
          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "18px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text)",
                }}
              >
                Parts Purchased
              </span>
              <button
                type="button"
                onClick={addItem}
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Add Row
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 80px 100px 28px",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              {["Part", "Qty", "Unit Cost", ""].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 80px 100px 28px",
                  gap: "8px",
                  marginBottom: "8px",
                  alignItems: "center",
                }}
              >
                <select
                  value={item.partId}
                  onChange={(e) => updateItem(i, "partId", e.target.value)}
                  style={inputStyle({ fontSize: "13px" })}
                >
                  <option value="">Select part</option>
                  {parts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  placeholder="0"
                  onChange={(e) => updateItem(i, "quantity", e.target.value)}
                  style={inputStyle({ fontSize: "13px" })}
                />
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.unitCost}
                  placeholder="0.00"
                  onChange={(e) => updateItem(i, "unitCost", e.target.value)}
                  style={inputStyle({ fontSize: "13px" })}
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  disabled={items.length === 1}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--error)",
                    cursor: items.length === 1 ? "not-allowed" : "pointer",
                    fontSize: "16px",
                    opacity: items.length === 1 ? 0.3 : 1,
                  }}
                >
                  x
                </button>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: "12px",
              borderTop: "1px solid var(--border)",
              marginBottom: "24px",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginBottom: "2px",
                }}
              >
                Total Amount
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                }}
              >
                Rs. {total.toFixed(2)}
              </div>
            </div>
          </div>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                color: "var(--text)",
                padding: "9px 20px",
                borderRadius: "4px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: "var(--accent)",
                color: "var(--accent-fg)",
                border: "none",
                padding: "9px 24px",
                borderRadius: "4px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Side panel for viewing an existing invoice
function InvoiceDetail({ invoice, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          height: "100vh",
          overflowY: "auto",
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          padding: "28px",
        }}
      >
        {/* Header with close and print */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "22px",
            paddingBottom: "16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--text-muted)",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "3px",
              }}
            >
              Purchase Invoice
            </div>
            <div style={{ fontSize: "17px", fontWeight: 700 }}>
              {invoice.invoiceNumber}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* Print button */}
            <button
              onClick={() => printInvoice(invoice)}
              style={{
                background: "var(--accent)",
                color: "var(--accent-fg)",
                border: "none",
                padding: "7px 16px",
                borderRadius: "4px",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Print
            </button>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                fontSize: "20px",
              }}
            >
              x
            </button>
          </div>
        </div>

        {/* Invoice summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
            marginBottom: "22px",
          }}
        >
          {[
            { label: "Vendor", value: invoice.vendorName },
            { label: "Created By", value: invoice.createdByAdminName },
            {
              label: "Date",
              value: new Date(invoice.purchaseDate).toLocaleDateString(),
            },
            {
              label: "Total Amount",
              value: `Rs. ${invoice.totalAmount.toFixed(2)}`,
            },
          ].map((row) => (
            <div key={row.label}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginBottom: "3px",
                }}
              >
                {row.label}
              </div>
              <div style={{ fontSize: "14px", color: "var(--text)" }}>
                {row.value}
              </div>
            </div>
          ))}
        </div>

        {invoice.notes && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "4px",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              fontSize: "13.5px",
              color: "var(--text-muted)",
              marginBottom: "20px",
            }}
          >
            {invoice.notes}
          </div>
        )}

        {/* Items table */}
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--text-muted)",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Items
        </div>
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13.5px",
            }}
          >
            <thead>
              <tr style={{ background: "var(--surface-2)" }}>
                {["Part", "Qty", "Unit Cost", "Subtotal"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "9px 12px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {item.partName}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    Rs. {item.unitCost.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid var(--border)",
                      fontWeight: 600,
                    }}
                  >
                    Rs. {item.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "14px 0",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <span
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginRight: "16px",
              }}
            >
              Total
            </span>
            <span style={{ fontSize: "18px", fontWeight: 700 }}>
              Rs. {invoice.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page
export default function PurchaseInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  async function load() {
    setLoading(true);
    try {
      const [invRes, vRes, pRes] = await Promise.all([
        fetchInvoices(page),
        vendorService.getAll(),
        partsService.getAll(1, 100),
      ]);
      if (invRes.success) setInvoices(invRes.data);
      if (Array.isArray(vRes)) setVendors(vRes);
      else if (vRes?.success) setVendors(vRes.data);
      if (pRes.success) setParts(pRes.data);
    } catch {
      setError("Failed to load data. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page]);

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
            Purchase Invoices
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              marginTop: "2px",
            }}
          >
            Create invoices to record stock purchases from vendors
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            background: "var(--accent)",
            color: "var(--accent-fg)",
            border: "none",
            padding: "9px 20px",
            borderRadius: "4px",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          New Invoice
        </button>
      </div>

      {error && <Alert text={error} />}

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
        ) : invoices.length === 0 ? (
          <div style={{ padding: "56px", textAlign: "center" }}>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: "6px",
              }}
            >
              No purchase invoices yet
            </div>
            <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              Create your first invoice to record a stock purchase from a
              vendor.
            </div>
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13.5px",
            }}
          >
            <thead>
              <tr>
                {[
                  "Invoice No.",
                  "Vendor",
                  "Created By",
                  "Date",
                  "Items",
                  "Total",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                      borderBottom: "1px solid var(--border)",
                      background: "var(--surface-2)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--surface-2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td
                    style={{
                      padding: "11px 14px",
                      borderBottom: "1px solid var(--border)",
                      fontWeight: 600,
                      fontFamily: "monospace",
                      fontSize: "13px",
                    }}
                  >
                    {inv.invoiceNumber}
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {inv.vendorName}
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {inv.createdByAdminName}
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {new Date(inv.purchaseDate).toLocaleDateString()}
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {inv.items.length}{" "}
                    {inv.items.length === 1 ? "item" : "items"}
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      borderBottom: "1px solid var(--border)",
                      fontWeight: 600,
                    }}
                  >
                    Rs. {inv.totalAmount.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "11px 14px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => setSelected(inv)}
                        style={{
                          background: "none",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                      {/* Quick print directly from the list row */}
                      <button
                        onClick={() => printInvoice(inv)}
                        style={{
                          background: "none",
                          border: "1px solid var(--border)",
                          color: "var(--text-muted)",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {invoices.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "16px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--text)",
              padding: "6px 14px",
              borderRadius: "4px",
              fontSize: "13px",
              cursor: page === 1 ? "not-allowed" : "pointer",
              opacity: page === 1 ? 0.5 : 1,
            }}
          >
            Prev
          </button>
          <span
            style={{
              padding: "6px 14px",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            Page {page}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={invoices.length < 10}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--text)",
              padding: "6px 14px",
              borderRadius: "4px",
              fontSize: "13px",
              cursor: invoices.length < 10 ? "not-allowed" : "pointer",
              opacity: invoices.length < 10 ? 0.5 : 1,
            }}
          >
            Next
          </button>
        </div>
      )}

      {showCreate && (
        <InvoiceModal
          vendors={vendors}
          parts={parts}
          onClose={() => setShowCreate(false)}
          onCreated={load}
        />
      )}
      {selected && (
        <InvoiceDetail invoice={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
