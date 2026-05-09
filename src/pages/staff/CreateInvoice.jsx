import { useState, useEffect } from "react";
import { partsService, invoicesService } from "../../services/api";

export default function CreateInvoice() {
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  // Left Column State
  const [barcodeQuery, setBarcodeQuery] = useState("");
  const [showPartDropdown, setShowPartDropdown] = useState(false);
  
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    vatNumber: "" // Using address field as vat/notes in backend for now or we just map it to address
  });

  // Right Column State
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [discountType, setDiscountType] = useState("none");
  const [orderNotes, setOrderNotes] = useState("");

  useEffect(() => {
    fetchParts();
  }, []);

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

  // Derived state
  const subTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  if (discountType === "3") {
    discountAmount = subTotal * 0.03;
  } else if (discountType === "5") {
    discountAmount = subTotal * 0.05;
  }
  
  const totalAmount = subTotal - discountAmount;

  // Handlers
  const handleAddPartToCart = (part) => {
    setBarcodeQuery("");
    setShowPartDropdown(false);
    
    if (part.stockQty <= 0) {
      setMessage({ text: `Cannot add ${part.name} because it is currently out of stock.`, type: "error" });
      return;
    }
    
    // Check if part already in cart
    const existing = cartItems.find(item => item.partId === part.id);
    if (existing) {
      if (existing.quantity >= part.stockQty) {
        setMessage({ text: `Cannot add more ${part.name}. Only ${part.stockQty} in stock.`, type: "error" });
        return;
      }
      setCartItems(cartItems.map(item => 
        item.partId === part.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      setMessage({ text: "", type: "" });
    } else {
      setCartItems([...cartItems, {
        partId: part.id,
        name: part.name,
        price: part.price,
        quantity: 1,
        stockQty: part.stockQty,
        imageUrl: part.imageUrl // assuming parts might have this
      }]);
      setMessage({ text: "", type: "" });
    }
  };

  const handleRemoveItem = (partId) => {
    setCartItems(cartItems.filter(item => item.partId !== partId));
  };

  const handleQuantityChange = (partId, newQuantity) => {
    if (newQuantity < 1) return;
    const numValue = parseInt(newQuantity) || 1;
    
    const existingItem = cartItems.find(i => i.partId === partId);
    if (existingItem && numValue > existingItem.stockQty) {
      setMessage({ text: `Only ${existingItem.stockQty} units of ${existingItem.name} are available in stock.`, type: "error" });
      return;
    }

    setMessage({ text: "", type: "" });
    setCartItems(cartItems.map(item => 
      item.partId === partId 
        ? { ...item, quantity: numValue }
        : item
    ));
  };

  const handleCheckout = async () => {
    if (!customer.phone || !customer.name) {
      setMessage({ text: "Customer Name and Mobile Number are required.", type: "error" });
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
        customerAddress: customer.vatNumber + (orderNotes ? ` | Notes: ${orderNotes}` : ""), // combined for backend compatibility
        items: cartItems.map(item => ({
          partId: item.partId,
          quantity: item.quantity
        })),
        discountAmount: discountAmount
      };

      await invoicesService.create(payload);
      setMessage({ text: "Invoice created successfully! Stock has been deducted.", type: "success" });
      
      // Reset form
      setCustomer({ name: "", phone: "", vatNumber: "" });
      setCartItems([]);
      setDiscountType("none");
      setOrderNotes("");
      setPaymentMethod("");
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to create invoice. Ensure sufficient stock.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Filter parts for the dropdown
  const filteredParts = parts.filter(p => p.name.toLowerCase().includes(barcodeQuery.toLowerCase()));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>Create Invoice</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "2px" }}>
          Scan or search parts to add them to the customer's invoice
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

        {/* Add Part */}
        <div style={{ marginBottom: "20px", position: "relative" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>
            Add Part
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Type part name to search..."
              value={barcodeQuery}
              onChange={(e) => {
                setBarcodeQuery(e.target.value);
                setShowPartDropdown(e.target.value.length > 0);
              }}
              onFocus={() => { if(barcodeQuery) setShowPartDropdown(true); }}
              style={{ 
                width: "100%", 
                padding: "12px 14px", 
                borderRadius: "6px", 
                border: "1px solid var(--primary)", 
                background: "var(--bg)", 
                outline: "none",
                fontSize: "15px"
              }}
            />
            {/* simple icon placeholder */}
            <span style={{ position: "absolute", right: "14px", top: "12px", color: "var(--text-muted)" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
            </span>
          </div>

          {/* Autocomplete Dropdown */}
          {showPartDropdown && (
            <div style={{ 
              position: "absolute", 
              top: "100%", 
              left: 0, 
              right: 0, 
              background: "var(--card-bg)", 
              border: "1px solid var(--card-border)", 
              borderRadius: "6px", 
              marginTop: "4px", 
              zIndex: 10,
              maxHeight: "200px",
              overflowY: "auto",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
            }}>
              {filteredParts.length === 0 ? (
                <div style={{ padding: "12px", color: "var(--text-muted)", fontSize: "14px" }}>No parts found.</div>
              ) : (
                filteredParts.map(part => (
                  <div 
                    key={part.id}
                    onClick={() => handleAddPartToCart(part)}
                    style={{ padding: "10px 14px", borderBottom: "1px solid var(--card-border)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <div>
                      <div style={{ fontWeight: "500", fontSize: "14px" }}>{part.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Stock: {part.stockQty}</div>
                    </div>
                    <div style={{ fontWeight: "600", color: "var(--primary)" }}>NPR {part.price}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Customer Information */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--card-border)", fontWeight: "600", fontSize: "14px", letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-muted)" }}>
            Customer Information
          </div>
          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "var(--text-muted)" }}>Mobile Number *</label>
              <input
                type="text"
                placeholder="98XXXXXXXX"
                value={customer.phone}
                onChange={e => setCustomer({...customer, phone: e.target.value})}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--card-border)", background: "var(--bg)", outline: "none" }}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "var(--text-muted)" }}>Customer Name *</label>
              <input
                type="text"
                placeholder="Enter customer name"
                value={customer.name}
                onChange={e => setCustomer({...customer, name: e.target.value})}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--card-border)", background: "var(--bg)", outline: "none" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div>
        {/* Cart Items */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", marginBottom: "20px" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--card-border)", fontWeight: "600", fontSize: "14px", letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-muted)" }}>
            Cart Items ({cartItems.length})
          </div>
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {cartItems.length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "10px 0" }}>No items in cart</div>
            ) : (
              cartItems.map((item, index) => (
                <div key={item.partId} style={{ display: "flex", gap: "16px", position: "relative" }}>
                  <button 
                    onClick={() => handleRemoveItem(item.partId)}
                    style={{ position: "absolute", top: "-4px", right: "0", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "16px" }}
                  >
                    ✕
                  </button>
                  <div style={{ width: "60px", height: "60px", background: "var(--bg-hover)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Image</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "500", fontSize: "14px", marginBottom: "8px", color: "var(--primary)" }}>{index + 1}. {item.name}</div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Quantity</span>
                        <input 
                          type="number" 
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.partId, e.target.value)}
                          style={{ width: "60px", padding: "6px", borderRadius: "4px", border: "1px solid var(--card-border)", background: "var(--bg)", textAlign: "center" }}
                        />
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                        NPR {item.price.toFixed(2)} × {item.quantity}
                      </div>
                      <div style={{ fontWeight: "600", fontSize: "15px", marginLeft: "auto" }}>
                        NPR {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", marginBottom: "20px" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--card-border)", fontWeight: "600", fontSize: "14px", letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-muted)" }}>
            Payment Details
          </div>
          <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "var(--text-muted)" }}>Payment Method *</label>
                <select 
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--card-border)", background: "var(--bg)", outline: "none" }}
                >
                  <option value="">Select Payment Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="eSewa">eSewa</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "var(--text-muted)" }}>Discount</label>
                <select 
                  value={discountType}
                  onChange={e => setDiscountType(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--card-border)", background: "var(--bg)", outline: "none" }}
                >
                  <option value="none">Select Discount</option>
                  <option value="3">3% Discount</option>
                  <option value="5">5% Discount</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "var(--text-muted)" }}>Order Notes</label>
              <textarea
                placeholder="Add any special instructions..."
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--card-border)", background: "var(--bg)", outline: "none", minHeight: "80px", resize: "vertical" }}
              />
            </div>
          </div>
        </div>

        {/* Summary & Checkout */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", padding: "20px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px" }}>
            <span style={{ color: "var(--text-muted)" }}>Subtotal:</span>
            <span style={{ fontWeight: "500" }}>NPR {subTotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px", color: "#e11d48" }}>
              <span>Discount ({discountType}%):</span>
              <span>- NPR {discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--card-border)", fontSize: "16px", fontWeight: "bold", color: "var(--primary)" }}>
            <span>Total Amount:</span>
            <span>NPR {totalAmount.toFixed(2)}</span>
          </div>
          <div style={{ textAlign: "center", fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
            Price includes all taxes
          </div>
        </div>

        <button 
          onClick={handleCheckout}
          disabled={loading || cartItems.length === 0}
          style={{ 
            width: "100%", 
            padding: "16px", 
            borderRadius: "6px", 
            background: (loading || cartItems.length === 0) ? "#9ca3af" : "#111", 
            color: "#fff", 
            border: "none", 
            fontSize: "14px", 
            fontWeight: "500",
            cursor: (loading || cartItems.length === 0) ? "not-allowed" : "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {loading ? "Processing..." : (
            <>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              Complete Checkout (NPR {totalAmount.toFixed(2)})
            </>
          )}
        </button>
      </div>
    </div>
  </div>
  );
}
