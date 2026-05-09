import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { invoicesService } from "../../services/api";

export default function InvoiceDetails() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  async function fetchInvoice() {
    try {
      setLoading(true);
      const res = await invoicesService.getById(id);
      setInvoice(res);
    } catch (err) {
      setError("Failed to load invoice details");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ color: "var(--text-muted)" }}>Loading invoice details...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!invoice) return <div style={{ color: "var(--text-muted)" }}>Invoice not found</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-invoice, #printable-invoice * {
              visibility: visible;
            }
            #printable-invoice {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
            .print-only-header {
              display: block !important;
            }
          }
        `}
      </style>

      {/* Header */}
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <Link to="/staff/sales" style={{ fontSize: "14px", color: "var(--primary)", textDecoration: "none", marginBottom: "8px", display: "inline-block" }}>
            &larr; Back to Invoices
          </Link>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>Invoice #{invoice.id.substring(0, 8)}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "2px" }}>
            Created on {new Date(invoice.createdAt).toLocaleString()}
          </p>
        </div>
        <button onClick={() => window.print()} style={{ padding: "9px 18px", borderRadius: "6px", background: "#111", color: "white", border: "none", fontSize: "13.5px", fontWeight: "500", cursor: "pointer" }}>
          Print Invoice
        </button>
      </div>

      <div id="printable-invoice">
        {/* Print-only Header (visible only on print or we can just make the main card the whole invoice) */}
        <div className="print-only-header" style={{ display: "none" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "4px" }}>Invoice #{invoice.id.substring(0, 8)}</h1>
          <p style={{ color: "gray", fontSize: "14px", marginBottom: "24px" }}>
            Created on {new Date(invoice.createdAt).toLocaleString()}
          </p>
        </div>

        <div style={{ background: "var(--card-bg)", borderRadius: "6px", border: "1px solid var(--card-border)", padding: "24px" }}>
          
          {/* Customer & Staff Info */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid var(--card-border)" }}>
          <div>
            <h3 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", marginBottom: "8px" }}>Billed To</h3>
            <div style={{ fontWeight: "600", fontSize: "16px" }}>{invoice.customerName}</div>
            <div style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>{invoice.customerPhone}</div>
            {invoice.customerAddress && <div style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>Notes/VAT: {invoice.customerAddress}</div>}
          </div>
          <div style={{ textAlign: "right" }}>
            <h3 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", marginBottom: "8px" }}>Served By</h3>
            <div style={{ fontWeight: "500", fontSize: "15px" }}>Staff ID: {invoice.staffId.substring(0,8)}...</div>
          </div>
        </div>

        {/* Invoice Items */}
        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Order Items</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "32px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--card-border)", textAlign: "left" }}>
              <th style={{ padding: "12px 0", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Part Name</th>
              <th style={{ padding: "12px 0", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", textAlign: "center" }}>Qty</th>
              <th style={{ padding: "12px 0", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", textAlign: "right" }}>Unit Price</th>
              <th style={{ padding: "12px 0", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map(item => (
              <tr key={item.id} style={{ borderBottom: "1px solid var(--card-border)" }}>
                <td style={{ padding: "16px 0", fontSize: "14px", fontWeight: "500" }}>{item.partName}</td>
                <td style={{ padding: "16px 0", fontSize: "14px", textAlign: "center" }}>{item.quantity}</td>
                <td style={{ padding: "16px 0", fontSize: "14px", textAlign: "right" }}>NPR {item.unitPrice.toFixed(2)}</td>
                <td style={{ padding: "16px 0", fontSize: "14px", textAlign: "right", fontWeight: "500" }}>NPR {item.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "300px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px" }}>
              <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
              <span>NPR {invoice.subTotal.toFixed(2)}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px", color: "#e11d48" }}>
                <span>Discount</span>
                <span>- NPR {invoice.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "16px", borderTop: "2px solid var(--card-border)", fontSize: "18px", fontWeight: "bold", color: "var(--primary)" }}>
              <span>Total Amount</span>
              <span>NPR {invoice.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  );
}
