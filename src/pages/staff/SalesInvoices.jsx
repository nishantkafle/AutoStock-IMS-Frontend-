import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { invoicesService } from "../../services/api";

export default function SalesInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    try {
      const res = await invoicesService.getAll();
      setInvoices(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>Sales Invoices</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "2px" }}>Manage and view all sales invoices</p>
        </div>
        <Link 
          to="/staff/sales/new" 
          style={{ 
            padding: "9px 18px", 
            borderRadius: "6px", 
            background: "#111", 
            color: "white", 
            textDecoration: "none", 
            fontSize: "13.5px", 
            fontWeight: "500" 
          }}
        >
          + Create Invoice
        </Link>
      </div>

      <div style={{ background: "var(--card-bg)", borderRadius: "6px", border: "1px solid var(--card-border)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--card-border)", textAlign: "left" }}>
              {["ID", "Customer", "Total", "Date", "Action"].map(h => (
                <th key={h} style={{ 
                  padding: "10px 16px", 
                  fontWeight: "600", 
                  fontSize: "12px", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.5px", 
                  color: "var(--text-muted)" 
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>Loading invoices...</td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>No invoices found.</td>
              </tr>
            ) : (
              invoices.map((inv, i) => (
                <tr key={inv.id} style={{ 
                  borderTop: "1px solid var(--card-border)", 
                  background: i % 2 === 0 ? "transparent" : "var(--card-bg)" 
                }}>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--text-muted)", fontFamily: "monospace" }}>{inv.id.substring(0, 8)}...</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: "500", fontSize: "14px" }}>{inv.customerName}</div>
                    <div style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>{inv.customerPhone}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13.5px" }}>NPR {inv.totalAmount.toFixed(2)}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text-muted)" }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <Link 
                      to={`/staff/sales/${inv.id}`}
                      style={{
                        padding: "5px 12px", background: "transparent",
                        border: "1px solid var(--card-border)", color: "var(--text)",
                        borderRadius: "4px", fontSize: "12.5px", textDecoration: "none",
                        cursor: "pointer", fontWeight: 500, display: "inline-block"
                      }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
