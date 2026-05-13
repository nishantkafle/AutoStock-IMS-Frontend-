import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { invoicesService } from "../../services/api";

export default function InvoiceDetails() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Email Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

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

  async function handleSendEmail(e) {
    e.preventDefault();
    if (!emailAddress) return;
    try {
      setSendingEmail(true);
      setEmailMessage("");
      await invoicesService.sendEmail(id, emailAddress);
      setEmailMessage("Email sent successfully!");
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailMessage("");
        setEmailAddress("");
      }, 2000);
    } catch (err) {
      setEmailMessage("Failed to send email. Please try again.");
    } finally {
      setSendingEmail(false);
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
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={() => setShowEmailModal(true)} 
            style={{ 
              padding: "9px 18px", 
              borderRadius: "6px", 
              background: "#2563eb", 
              color: "white", 
              border: "none", 
              fontSize: "13.5px", 
              fontWeight: "600", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 2px 6px rgba(37, 99, 235, 0.3)"
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Send Email
          </button>
          <button onClick={() => window.print()} style={{ padding: "9px 18px", borderRadius: "6px", background: "#111", color: "white", border: "none", fontSize: "13.5px", fontWeight: "500", cursor: "pointer" }}>
            Print Invoice
          </button>
        </div>
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
    {showEmailModal && (
      <div className="no-print" style={{
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
