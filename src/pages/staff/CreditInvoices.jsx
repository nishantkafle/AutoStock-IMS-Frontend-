import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { invoicesService } from "../../services/api";

export default function CreditInvoices({ basePath }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Settlement Modal State
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [settleAmount, setSettleAmount] = useState("");
  const [settleNotes, setSettleNotes] = useState("");
  const [settling, setSettling] = useState(false);

  // Statement Modal State
  const [showStatementModal, setShowStatementModal] = useState(false);

  useEffect(() => {
    fetchCreditInvoices();
  }, []);

  async function fetchCreditInvoices() {
    try {
      setLoading(true);
      const data = await invoicesService.getAll();
      // Filter for Credit invoices that still have a balance
      const creditInvoices = data.filter(inv => inv.paymentMethod === "Credit");
      setInvoices(creditInvoices);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load credit invoices.");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenSettleModal = (invoice) => {
    setSelectedInvoice(invoice);
    setSettleAmount(invoice.remainingBalance.toString());
    setSettleNotes("");
    setShowSettleModal(true);
  };

  const handleOpenStatementModal = (invoice) => {
    setSelectedInvoice(invoice);
    setShowStatementModal(true);
  };

  async function handleSettleSubmit(e) {
    e.preventDefault();
    if (!settleAmount || parseFloat(settleAmount) <= 0) return;

    try {
      setSettling(true);
      await invoicesService.settle(selectedInvoice.id, {
        amount: parseFloat(settleAmount),
        notes: settleNotes
      });
      setShowSettleModal(false);
      fetchCreditInvoices(); // Refresh list
    } catch (err) {
      alert("Failed to record settlement: " + (err.response?.data?.message || err.message));
    } finally {
      setSettling(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>Credit</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "2px" }}>
            Manage customer credit balances and settlements
          </p>
        </div>
      </div>

      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", overflow: "hidden" }}>
        {error && <div style={{ padding: "16px", color: "var(--error)" }}>{error}</div>}
        {loading ? (
          <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
        ) : invoices.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>No credit records found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--card-border)", textAlign: "left", color: "var(--text-muted)" }}>
                <th style={{ padding: "14px 20px", fontWeight: 600 }}>Date</th>
                <th style={{ padding: "14px 20px", fontWeight: 600 }}>Customer Details</th>
                <th style={{ padding: "14px 20px", fontWeight: 600 }}>Total Credit</th>
                <th style={{ padding: "14px 20px", fontWeight: 600 }}>Paid</th>
                <th style={{ padding: "14px 20px", fontWeight: 600 }}>Balance</th>
                <th style={{ padding: "14px 20px", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "14px 20px", fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td style={{ padding: "14px 20px", color: "var(--text-muted)" }}>
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontWeight: "600", color: "var(--primary)" }}>{inv.customerName}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{inv.customerPhone}</div>
                  </td>
                  <td style={{ padding: "14px 20px", fontWeight: "600" }}>
                    NPR {inv.totalAmount.toFixed(2)}
                  </td>
                  <td style={{ padding: "14px 20px", color: "#15803d", fontWeight: "600" }}>
                    NPR {inv.paidAmount.toFixed(2)}
                  </td>
                  <td style={{ padding: "14px 20px", color: inv.remainingBalance > 0 ? "#dc2626" : "#15803d", fontWeight: "700" }}>
                    NPR {inv.remainingBalance.toFixed(2)}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ 
                      padding: "3px 8px", 
                      borderRadius: "4px", 
                      fontSize: "11px", 
                      fontWeight: "700",
                      background: inv.remainingBalance > 0 ? "#fee2e2" : "#dcfce7",
                      color: inv.remainingBalance > 0 ? "#dc2626" : "#15803d",
                      textTransform: "uppercase"
                    }}>
                      {inv.remainingBalance > 0 ? "Pending" : "Settled"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button 
                        onClick={() => handleOpenStatementModal(inv)}
                        style={{ padding: "5px 10px", borderRadius: "4px", border: "1px solid #ddd", background: "white", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                      >
                        Statement
                      </button>
                      {inv.remainingBalance > 0 && (
                        <button 
                          onClick={() => handleOpenSettleModal(inv)}
                          style={{ padding: "5px 10px", borderRadius: "4px", border: "none", background: "#111", color: "white", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                        >
                          Settle
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Settlement Modal */}
      {showSettleModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--card-bg)", padding: "24px", borderRadius: "10px", width: "400px", maxWidth: "90%" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>Make Settlement</h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>
              Recording payment for {selectedInvoice?.customerName}'s balance of <b>NPR {selectedInvoice?.remainingBalance.toFixed(2)}</b>
            </p>
            <form onSubmit={handleSettleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600" }}>Amount to Pay (NPR)</label>
                <input 
                  type="number" 
                  value={settleAmount} 
                  onChange={e => setSettleAmount(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--card-border)", outline: "none", fontSize: "16px", fontWeight: "700" }}
                  max={selectedInvoice?.remainingBalance}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600" }}>Notes</label>
                <input 
                  type="text" 
                  value={settleNotes} 
                  onChange={e => setSettleNotes(e.target.value)}
                  placeholder="e.g. Received via Cash"
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--card-border)", outline: "none" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowSettleModal(false)} style={{ padding: "8px 16px", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                <button 
                  type="submit" 
                  disabled={settling}
                  style={{ padding: "8px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                >
                  {settling ? "Recording..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statement Modal */}
      {showStatementModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--card-bg)", padding: "24px", borderRadius: "10px", width: "600px", maxWidth: "95%", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Credit Statement</h2>
              <button onClick={() => setShowStatementModal(false)} style={{ border: "none", background: "none", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ marginBottom: "24px", padding: "16px", background: "var(--bg)", borderRadius: "8px", border: "1px solid var(--card-border)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Customer</div>
                  <div style={{ fontWeight: "700" }}>{selectedInvoice?.customerName}</div>
                  <div style={{ fontSize: "13px" }}>{selectedInvoice?.customerPhone}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>Current Balance</div>
                  <div style={{ fontWeight: "800", fontSize: "20px", color: "#dc2626" }}>NPR {selectedInvoice?.remainingBalance.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", fontSize: "12px", textTransform: "uppercase", color: "var(--text-muted)", borderBottom: "2px solid var(--card-border)" }}>
                  <th style={{ padding: "10px" }}>Date</th>
                  <th style={{ padding: "10px" }}>Description</th>
                  <th style={{ padding: "10px" }}>Debit</th>
                  <th style={{ padding: "10px" }}>Credit</th>
                </tr>
              </thead>
              <tbody>
                {/* Initial Credit Record */}
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td style={{ padding: "12px 10px", fontSize: "13px" }}>{new Date(selectedInvoice?.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 10px", fontSize: "13px" }}>
                    Credit Purchase (Invoice #{selectedInvoice?.id.substring(0, 8)})
                  </td>
                  <td style={{ padding: "12px 10px", fontWeight: "600", color: "#dc2626" }}>NPR {selectedInvoice?.totalAmount.toFixed(2)}</td>
                  <td style={{ padding: "12px 10px" }}>-</td>
                </tr>
                {/* Initial Paid Amount if any */}
                {selectedInvoice?.paidAmount > 0 && selectedInvoice.settlements.length === 0 && (
                   <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                   <td style={{ padding: "12px 10px", fontSize: "13px" }}>{new Date(selectedInvoice?.createdAt).toLocaleDateString()}</td>
                   <td style={{ padding: "12px 10px", fontSize: "13px" }}>Initial Down Payment</td>
                   <td style={{ padding: "12px 10px" }}>-</td>
                   <td style={{ padding: "12px 10px", fontWeight: "600", color: "#15803d" }}>NPR {selectedInvoice?.paidAmount.toFixed(2)}</td>
                 </tr>
                )}
                {/* Settlements History */}
                {selectedInvoice?.settlements.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <td style={{ padding: "12px 10px", fontSize: "13px" }}>{new Date(s.settlementDate).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 10px", fontSize: "13px" }}>
                      Settlement Payment {s.notes ? `(${s.notes})` : ""}
                    </td>
                    <td style={{ padding: "12px 10px" }}>-</td>
                    <td style={{ padding: "12px 10px", fontWeight: "600", color: "#15803d" }}>NPR {s.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
              <button 
                onClick={() => window.print()} 
                style={{ padding: "10px 20px", borderRadius: "6px", border: "none", background: "#111", color: "white", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                Print Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
