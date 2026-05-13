import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { invoicesService } from "../../services/api";

export default function SalesInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Email Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

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

  const handleOpenEmailModal = (invoice) => {
    setSelectedInvoiceId(invoice.id);
    setEmailAddress(""); 
    setShowEmailModal(true);
    setEmailMessage("");
  };

  async function handleSendEmail(e) {
    e.preventDefault();
    if (!emailAddress) return;
    try {
      setSendingEmail(true);
      setEmailMessage("");
      await invoicesService.sendEmail(selectedInvoiceId, emailAddress);
      setEmailMessage("Email sent successfully!");
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailMessage("");
        setEmailAddress("");
        setSelectedInvoiceId(null);
      }, 2000);
    } catch (err) {
      setEmailMessage("Failed to send email. Please try again.");
    } finally {
      setSendingEmail(false);
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
                    <div style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>{inv.customerPhone}</div>
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
                      <button 
                        onClick={() => handleOpenEmailModal(inv)}
                        style={{
                          padding: "6px 14px", background: "#2563eb",
                          border: "none", color: "white",
                          borderRadius: "4px", fontSize: "12.5px",
                          cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px",
                          boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)"
                        }}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        Email
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showEmailModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "var(--card-bg)", padding: "28px", borderRadius: "12px", width: "420px", maxWidth: "95%", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
            <h3 style={{ marginTop: 0, marginBottom: "8px", fontSize: "20px", fontWeight: "700" }}>Send Invoice Email</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>Enter the customer's email address to send the PDF invoice.</p>
            <form onSubmit={handleSendEmail}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>Email Address</label>
                <input 
                  type="email" 
                  value={emailAddress} 
                  onChange={(e) => setEmailAddress(e.target.value)} 
                  required 
                  autoFocus
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: "2px solid #2563eb", background: "var(--bg)", color: "var(--text)", fontSize: "15px", outline: "none" }} 
                  placeholder="e.g. customer@example.com"
                />
              </div>
              {emailMessage && <div style={{ marginBottom: "16px", padding: "10px", borderRadius: "6px", fontSize: "14px", backgroundColor: emailMessage.includes("success") ? "#dcfce7" : "#fee2e2", color: emailMessage.includes("success") ? "#15803d" : "#b91c1c", border: `1px solid ${emailMessage.includes("success") ? "#86efac" : "#fca5a5"}` }}>{emailMessage}</div>}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button type="button" onClick={() => setShowEmailModal(false)} style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid var(--card-border)", background: "transparent", cursor: "pointer", color: "var(--text)", fontWeight: "500" }}>Cancel</button>
                <button type="submit" disabled={sendingEmail} style={{ padding: "10px 24px", borderRadius: "8px", border: "none", background: "#2563eb", color: "white", cursor: sendingEmail ? "not-allowed" : "pointer", opacity: sendingEmail ? 0.7 : 1, fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.4)" }}>
                  {sendingEmail ? "Sending..." : (
                    <>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      Send Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
