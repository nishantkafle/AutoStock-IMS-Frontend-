import { useState, useEffect } from "react";
import { partsService, invoicesService, customerService } from "../../services/api";

export default function CreateInvoice() {
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  // Left Column State
  const [barcodeQuery, setBarcodeQuery] = useState("");
  const [showPartDropdown, setShowPartDropdown] = useState(false);
  
<<<<<<< Updated upstream
=======
  const [customerQuery, setCustomerQuery] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

>>>>>>> Stashed changes
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
    fetchCustomers();
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

<<<<<<< Updated upstream
=======
  async function fetchCustomers() {
    try {
      const res = await customerService.getAll();
      if (res.data && Array.isArray(res.data)) {
        setCustomers(res.data);
      } else if (Array.isArray(res)) {
        setCustomers(res);
      }
    } catch (err) {
      console.error("Error fetching customers", err);
    }
  }

>>>>>>> Stashed changes
  // Derived state
  const subTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  if (discountType === "3") {
    discountAmount = subTotal * 0.03;
  } else if (discountType === "5") {
    discountAmount = subTotal * 0.05;
  }
  
  const totalAmount = subTotal - discountAmount;
<<<<<<< Updated upstream

  // Handlers
=======
  const actualPaidAmount = paymentMethod === "Credit" ? (parseFloat(paidAmount) || 0) : totalAmount;
  const balanceAmount = totalAmount - actualPaidAmount;

  // Bulk Discount Logic: if > 5000, 10% discount is suggested
  const isBulkPurchase = totalAmount > 5000;
  const suggestedDiscount = isBulkPurchase ? (subTotal * 0.1).toFixed(2) : 0;

  // Handlers

  const handleSelectCustomer = (c) => {
    setCustomer({
      id: c.id,
      name: c.fullName,
      phone: c.phoneNumber,
      email: c.email || "",
      vatNumber: ""
    });
    setCustomerQuery(c.fullName);
    setShowCustomerDropdown(false);
  };

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        discountAmount: discountAmount
=======
        discountAmount: parseFloat(discountAmount) || 0,
        paymentMethod: paymentMethod || "Cash",
        paidAmount: actualPaidAmount
>>>>>>> Stashed changes
      };

      await invoicesService.create(payload);
      setMessage({ text: "Invoice created successfully! Stock has been deducted.", type: "success" });
      
      // Reset form
<<<<<<< Updated upstream
      setCustomer({ name: "", phone: "", vatNumber: "" });
=======
      setCustomer({ id: "", name: "", phone: "", email: "", vatNumber: "" });
      setCustomerQuery("");
>>>>>>> Stashed changes
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
  const filteredCustomers = customers.filter(c => 
    c.fullName.toLowerCase().includes(customerQuery.toLowerCase()) || 
    c.phoneNumber.includes(customerQuery)
  );

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
<<<<<<< Updated upstream
              {filteredParts.length === 0 ? (
                <div style={{ padding: "12px", color: "var(--text-muted)", fontSize: "14px" }}>No parts found.</div>
=======
              {message.text}
            </div>
          )}

          {/* Add Part */}
          <div style={{ marginBottom: "20px", position: "relative" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
              Search Parts
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search parts by name..."
                value={barcodeQuery}
                onChange={(e) => {
                  setBarcodeQuery(e.target.value);
                  setShowPartDropdown(e.target.value.length > 0);
                }}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "6px", border: "1px solid var(--card-border)", background: "var(--bg)", color: "var(--text)", outline: "none", fontSize: "15px" }}
              />
            </div>

            {showPartDropdown && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", marginTop: "4px", zIndex: 10, maxHeight: "200px", overflowY: "auto", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
                {filteredParts.length === 0 ? (
                  <div style={{ padding: "12px", color: "var(--text-muted)", fontSize: "14px" }}>No parts found.</div>
                ) : (
                  filteredParts.map(part => (
                    <div key={part.id} onClick={() => handleAddPartToCart(part)} style={{ padding: "10px 14px", borderBottom: "1px solid var(--card-border)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: "500", fontSize: "14px" }}>{part.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Stock: {part.stockQty}</div>
                      </div>
                      <div style={{ fontWeight: "600", color: "#2563eb" }}>NPR {part.price}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--card-border)", fontWeight: "600", fontSize: "13px", letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Customer Information
            </div>
            <div style={{ padding: "20px" }}>
              
              <div style={{ marginBottom: "16px", position: "relative" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Search Existing Customer</label>
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={customerQuery}
                  onChange={(e) => {
                    setCustomerQuery(e.target.value);
                    setShowCustomerDropdown(e.target.value.length > 0);
                  }}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg)", color: "var(--text)", outline: "none", fontSize: "14px" }}
                />
                
                {showCustomerDropdown && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", marginTop: "4px", zIndex: 10, maxHeight: "200px", overflowY: "auto", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
                    {filteredCustomers.length === 0 ? (
                      <div style={{ padding: "12px", color: "var(--text-muted)", fontSize: "14px" }}>No customers found.</div>
                    ) : (
                      filteredCustomers.map(c => (
                        <div key={c.id} onClick={() => handleSelectCustomer(c)} style={{ padding: "10px 14px", borderBottom: "1px solid var(--card-border)", cursor: "pointer" }}>
                          <div style={{ fontWeight: "500", fontSize: "14px" }}>{c.fullName}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{c.phoneNumber} | {c.email}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Customer Name *</label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg)", color: "var(--text)", outline: "none", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Phone Number *</label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg)", color: "var(--text)", outline: "none", fontSize: "14px" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg)", color: "var(--text)", outline: "none", fontSize: "14px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Cart Items */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", marginBottom: "20px" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--card-border)", fontWeight: "600", fontSize: "13px", letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Cart Items ({cartItems.length})
            </div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {cartItems.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center" }}>No items added</div>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                    <div style={{ fontWeight: "600", color: "var(--primary)" }}>NPR {part.price}</div>
=======
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.partId, e.target.value)} style={{ width: "50px", padding: "4px", textAlign: "center", border: "1px solid var(--card-border)", borderRadius: "4px", background: "var(--bg)", color: "var(--text)" }} />
                      <button onClick={() => handleRemoveItem(item.partId)} style={{ border: "none", background: "none", color: "red", cursor: "pointer" }}>✕</button>
                    </div>
                    <div style={{ fontWeight: "600", width: "80px", textAlign: "right" }}>NPR {(item.price * item.quantity).toFixed(2)}</div>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======

          {/* Payment & Discount */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", padding: "20px", marginBottom: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--card-border)", background: "var(--bg)", color: "var(--text)" }}>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="eSewa">eSewa</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Custom Discount (NPR)</label>
                <input type="number" value={discountAmount} onChange={e => setDiscountAmount(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--card-border)", background: "var(--bg)", color: "var(--text)" }} />
                {subTotal > 5000 && (
                  <div style={{ fontSize: "12px", color: "#15803d", marginTop: "6px", fontWeight: "600", padding: "6px", backgroundColor: "#dcfce7", borderRadius: "4px" }}>
                    Loyalty Program: 10% auto-discount applied!
                  </div>
                )}
              </div>
            </div>

            {paymentMethod === "Credit" && (
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Amount Paid by Customer (NPR)</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={e => setPaidAmount(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #2563eb", background: "var(--bg)", color: "var(--text)", fontSize: "16px", fontWeight: "600" }}
                />
              </div>
            )}
          </div>

          {/* Total Summary */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Subtotal:</span>
              <span>NPR {subTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "red" }}>
              <span>Discount:</span>
              <span>- NPR {parseFloat(discountAmount || 0).toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontWeight: "700", fontSize: "18px", color: "#2563eb", borderTop: "1px solid var(--card-border)", paddingTop: "12px" }}>
              <span>Total Amount:</span>
              <span>NPR {totalAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontWeight: "600", color: balanceAmount > 0 ? "red" : "green" }}>
              <span>Remaining Balance:</span>
              <span>NPR {balanceAmount.toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleCheckout(false)}
                disabled={loading || cartItems.length === 0}
                style={{ flex: 1, padding: "14px", borderRadius: "8px", background: "#111", color: "white", border: "none", cursor: "pointer", fontWeight: "600" }}
              >
                Complete Sale
              </button>
              <button
                onClick={() => handleCheckout(true)}
                disabled={loading || cartItems.length === 0}
                style={{ flex: 1, padding: "14px", borderRadius: "8px", background: "#2563eb", color: "white", border: "none", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Sale & Email
              </button>
>>>>>>> Stashed changes
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

