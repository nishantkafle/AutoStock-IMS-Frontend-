import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { invoicesService } from "../../services/api";
import Pagination from "../../components/Pagination";

export default function SalesInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchInvoices();
  }, [page]);

  async function fetchInvoices() {
    setLoading(true);
    try {
      const res = await invoicesService.getAll(page, 7);
      setInvoices(res);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.totalCount || res.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteInvoice(id) {
    if (!window.confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) return;
    try {
      await invoicesService.delete(id);
      fetchInvoices();
    } catch (err) {
      console.error("Failed to delete invoice", err);
      alert("Failed to delete invoice.");
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
              {["ID", "Customer", "Payment", "Total", "Date", "Action"].map(h => (
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
                <td colSpan="6" style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>Loading invoices...</td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>No invoices found.</td>
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
                    <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{inv.customerPhone}</div>
                    <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{inv.customerEmail}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ 
                      padding: "4px 10px", 
                      borderRadius: "20px", 
                      fontSize: "11px", 
                      fontWeight: "700",
                      background: inv.paymentMethod === "Credit" ? "#fee2e2" : "#f1f5f9",
                      color: inv.paymentMethod === "Credit" ? "#dc2626" : "#475569",
                      border: inv.paymentMethod === "Credit" ? "1px solid #fecaca" : "1px solid #e2e8f0",
                      textTransform: "uppercase"
                    }}>
                      {inv.paymentMethod || "Cash"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13.5px", fontWeight: "600" }}>NPR {inv.totalAmount.toFixed(2)}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text-muted)" }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
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
                      <Link 
                        to={`/staff/sales/edit/${inv.id}`}
                        style={{
                          padding: "5px 12px", background: "transparent",
                          border: "1px solid #2563eb", color: "#2563eb",
                          borderRadius: "4px", fontSize: "12.5px", textDecoration: "none",
                          cursor: "pointer", fontWeight: 500, display: "inline-block"
                        }}
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteInvoice(inv.id)}
                        style={{
                          padding: "6px 14px", background: "transparent",
                          border: "1px solid #fee2e2", color: "#dc2626",
                          borderRadius: "4px", fontSize: "12.5px",
                          cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: "6px",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "#fef2f2"}
                        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={7}
          onPageChange={setPage}
        />
      </div>

    </div>
  );
}
