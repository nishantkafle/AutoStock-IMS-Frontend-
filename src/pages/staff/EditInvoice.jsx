import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { partsService, invoicesService } from "../../services/api";

export default function EditInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  // UI State
  const [barcodeQuery, setBarcodeQuery] = useState("");
  const [showPartDropdown, setShowPartDropdown] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    vatNumber: ""
  });

  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [orderNotes, setOrderNotes] = useState("");

  useEffect(() => {
    fetchParts();
    fetchInvoiceDetails();
  }, [id]);

  async function fetchParts() {
    try {
      const res = await partsService.getAll(1, 100);
      if (res.data && Array.isArray(res.data)) {
        setParts(res.data);
      } else if (Array.isArray(res)) {
        setParts(res);
      }
    } catch (err) {
      console.error("Error fetching parts", err);
    }
  }

  async function fetchInvoiceDetails() {
    try {
      setLoading(true);
      const inv = await invoicesService.getById(id);
      setCustomer({
        name: inv.customerName,
        phone: inv.customerPhone,
        email: inv.customerEmail || "",
        vatNumber: inv.customerAddress?.split(" | Notes: ")[0] || ""
      });
      setCartItems(inv.items.map(item => ({
        partId: item.partId,
        name: item.partName,
        price: item.unitPrice,
        quantity: item.quantity,
        stockQty: 999 // We don't know the stock yet, but we'll fetch parts
      })));
      setPaymentMethod(inv.paymentMethod || "Cash");
      setDiscountAmount(inv.discountAmount);
      setPaidAmount(inv.paidAmount);
      setOrderNotes(inv.customerAddress?.split(" | Notes: ")[1] || "");
    } catch (err) {
      setMessage({ text: "Failed to load invoice details.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // Derived state
  const subTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = subTotal - discountAmount;
  const balanceAmount = totalAmount - paidAmount;

  const handleAddPartToCart = (part) => {
    setBarcodeQuery("");
    setShowPartDropdown(false);

    const existing = cartItems.find(item => item.partId === part.id);
    if (existing) {
      setCartItems(cartItems.map(item =>
        item.partId === part.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        partId: part.id,
        name: part.name,
        price: part.price,
        quantity: 1,
        stockQty: part.stockQty
      }]);
    }
  };

  const handleRemoveItem = (partId) => {
    setCartItems(cartItems.filter(item => item.partId !== partId));
  };

  const handleQuantityChange = (partId, newQuantity) => {
    const numValue = parseInt(newQuantity) || 1;
    if (numValue < 1) return;

    setCartItems(cartItems.map(item =>
      item.partId === partId
        ? { ...item, quantity: numValue }
        : item
    ));
  };

  const handleUpdate = async () => {
    if (!customer.name || !customer.phone) {
      setMessage({ text: "Customer Name and Phone are required.", type: "error" });
      return;
    }
    if (cartItems.length === 0) {
      setMessage({ text: "Cart is empty.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const payload = {
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerAddress: customer.vatNumber + (orderNotes ? ` | Notes: ${orderNotes}` : ""),
        items: cartItems.map(item => ({
          partId: item.partId,
          quantity: item.quantity
        })),
        discountAmount: parseFloat(discountAmount) || 0,
        paymentMethod: paymentMethod || "Cash",
        paidAmount: parseFloat(paidAmount) || 0
      };

      await invoicesService.update(id, payload);
      setMessage({ text: "Invoice updated successfully!", type: "success" });
      setTimeout(() => navigate("/staff/sales"), 1500);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to update invoice.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const filteredParts = parts.filter(p => p.name.toLowerCase().includes(barcodeQuery.toLowerCase()));

  if (loading && cartItems.length === 0) return <div style={{ padding: "20px" }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>Edit Invoice</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "2px" }}>
          Modify invoice details and items
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
        {/* LEFT COLUMN */}
        <div>
          {message.text && (
            <div style={{
              padding: "12px",
              marginBottom: "16px",
              borderRadius: "6px",
              backgroundColor: message.type === "error" ? "#fee2e2" : "#dcfce7",
              color: message.type === "error" ? "#b91c1c" : "#15803d",
              border: `1px solid ${message.type === "error" ? "#fca5a5" : "#86efac"}`
            }}>
              {message.text}
            </div>
          )}

          <div style={{ marginBottom: "20px", position: "relative" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
              Search Parts
            </label>
            <input
              type="text"
              placeholder="Search parts by name..."
              value={barcodeQuery}
              onChange={(e) => {
                setBarcodeQuery(e.target.value);
                setShowPartDropdown(e.target.value.length > 0);
              }}
              style={{ width: "100%", padding: "12px 14px", borderRadius: "6px", border: "1px solid var(--card-border)", background: "var(--bg)", outline: "none", fontSize: "15px" }}
            />

            {showPartDropdown && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", marginTop: "4px", zIndex: 10, maxHeight: "200px", overflowY: "auto", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
                {filteredParts.map(part => (
                  <div key={part.id} onClick={() => handleAddPartToCart(part)} style={{ padding: "10px 14px", borderBottom: "1px solid var(--card-border)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "500", fontSize: "14px" }}>{part.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Stock: {part.stockQty}</div>
                    </div>
                    <div style={{ fontWeight: "600", color: "#2563eb" }}>NPR {part.price}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--card-border)", fontWeight: "600", fontSize: "13px", color: "var(--text-muted)" }}>CUSTOMER INFORMATION</div>
            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600" }}>Customer Name *</label>
                <input type="text" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600" }}>Phone Number *</label>
                  <input type="text" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg)" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600" }}>Email Address</label>
                  <input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", marginBottom: "20px" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--card-border)", fontWeight: "600", fontSize: "13px" }}>CART ITEMS ({cartItems.length})</div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {cartItems.map(item => (
                <div key={item.partId} style={{ display: "flex", gap: "16px", alignItems: "center", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>{item.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>NPR {item.price.toFixed(2)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.partId, e.target.value)} style={{ width: "60px", padding: "4px", textAlign: "center", border: "1px solid var(--card-border)", borderRadius: "4px" }} />
                    <button onClick={() => handleRemoveItem(item.partId)} style={{ border: "none", background: "none", color: "red", cursor: "pointer" }}>✕</button>
                  </div>
                  <div style={{ fontWeight: "600", width: "80px", textAlign: "right" }}>NPR {(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Subtotal:</span><span>NPR {subTotal.toFixed(2)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "red" }}><span>Discount:</span><span>- NPR {parseFloat(discountAmount || 0).toFixed(2)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontWeight: "700", fontSize: "18px", color: "#2563eb" }}><span>Total:</span><span>NPR {totalAmount.toFixed(2)}</span></div>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600" }}>Paid Amount</label>
              <input type="number" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--card-border)" }} />
            </div>

            <button
              onClick={handleUpdate}
              disabled={loading}
              style={{ width: "100%", padding: "14px", borderRadius: "8px", background: "#2563eb", color: "white", border: "none", cursor: "pointer", fontWeight: "600" }}
            >
              {loading ? "Updating..." : "Update Invoice"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
