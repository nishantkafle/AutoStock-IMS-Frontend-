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
  const [customerQuery, setCustomerQuery] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);


  const [customer, setCustomer] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    vatNumber: ""
  });

  // Right Column State
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
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

  // Derived state
  const subTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = subTotal - discountAmount;
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

  const balanceAmount = totalAmount - paidAmount;

  // Bulk Discount Logic: if > 5000, 10% discount is suggested
  const isBulkPurchase = totalAmount > 5000;
  const suggestedDiscount = isBulkPurchase ? (subTotal * 0.1).toFixed(2) : 0;

  // Handlers

  const handleAddPartToCart = (part) => {
    setBarcodeQuery("");
    setShowPartDropdown(false);

    if (part.stockQty <= 0) {
      setMessage({ text: `Cannot add ${part.name} because it is currently out of stock.`, type: "error" });
      return;
    }

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
    } else {
      setCartItems([...cartItems, {
        partId: part.id,
        name: part.name,
        price: part.price,
        quantity: 1,
        stockQty: part.stockQty,
        imageUrl: part.imageUrl
      }]);
    }
    setMessage({ text: "", type: "" });
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

    setCartItems(cartItems.map(item =>
      item.partId === partId
        ? { ...item, quantity: numValue }
        : item
    ));
  };

  const handleCheckout = async (shouldSendEmail = false) => {
    if (!customer.name || !customer.phone) {
      setMessage({ text: "Customer Name and Phone are required.", type: "error" });
      return;
    }
    if (shouldSendEmail && !customer.email) {
      setMessage({ text: "Customer Email is required to send the invoice.", type: "error" });
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
        customerId: customer.id || null,
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
        paidAmount: actualPaidAmount
        discountAmount: parseFloat(discountAmount) || 0,
        paymentMethod: paymentMethod || "Cash",
        paidAmount: parseFloat(paidAmount) || 0
      };

      const createdInvoice = await invoicesService.create(payload);

      if (shouldSendEmail) {
        await invoicesService.sendEmail(createdInvoice.id, customer.email);
        setMessage({ text: "Invoice created & Email sent successfully!", type: "success" });
      } else {
        setMessage({ text: "Invoice created successfully!", type: "success" });
      }

      // Reset form
      setCustomer({ id: "", name: "", phone: "", email: "", vatNumber: "" });
      setCustomerQuery("");
      setCustomer({ id: "", name: "", phone: "", email: "", vatNumber: "" });
      setCartItems([]);
      setDiscountAmount(0);
      setPaidAmount(0);
      setOrderNotes("");
      setPaymentMethod("");
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to create invoice.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const filteredParts = parts.filter(p => p.name.toLowerCase().includes(barcodeQuery.toLowerCase()));
  const filteredCustomers = customers.filter(c => 
    c.fullName.toLowerCase().includes(customerQuery.toLowerCase()) || 
    c.phoneNumber.includes(customerQuery)
  );

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>Create Invoice</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "2px" }}>
          Select customer and add parts to create a new sale
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
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.partId, e.target.value)} style={{ width: "50px", padding: "4px", textAlign: "center", border: "1px solid var(--card-border)", borderRadius: "4px", background: "var(--bg)", color: "var(--text)" }} />
                      <button onClick={() => handleRemoveItem(item.partId)} style={{ border: "none", background: "none", color: "red", cursor: "pointer" }}>✕</button>
                    </div>
                    <div style={{ fontWeight: "600", width: "80px", textAlign: "right" }}>NPR {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))
              )}
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
                style={{ width: "100%", padding: "12px 14px", borderRadius: "6px", border: "1px solid var(--card-border)", background: "var(--bg)", outline: "none", fontSize: "15px" }}
              />
            </div>

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
            </div>
          </div>
        </div>
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
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Customer Name *</label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg)", outline: "none", fontSize: "14px" }}
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
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg)", outline: "none", fontSize: "14px" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg)", outline: "none", fontSize: "14px" }}
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
              ) : (
                cartItems.map(item => (
                  <div key={item.partId} style={{ display: "flex", gap: "16px", alignItems: "center", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600", fontSize: "14px" }}>{item.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>NPR {item.price.toFixed(2)} / unit</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.partId, e.target.value)} style={{ width: "50px", padding: "4px", textAlign: "center", border: "1px solid var(--card-border)", borderRadius: "4px" }} />
                      <button onClick={() => handleRemoveItem(item.partId)} style={{ border: "none", background: "none", color: "red", cursor: "pointer" }}>✕</button>
                    </div>
                    <div style={{ fontWeight: "600", width: "80px", textAlign: "right" }}>NPR {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payment & Discount */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "6px", padding: "20px", marginBottom: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--card-border)", background: "var(--bg)" }}>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="eSewa">eSewa</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Custom Discount (NPR)</label>
                <input type="number" value={discountAmount} onChange={e => setDiscountAmount(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--card-border)", background: "var(--bg)" }} />
                {isBulkPurchase && (
                  <div style={{ fontSize: "11px", color: "#15803d", marginTop: "4px" }}>Bulk Order! Suggested Discount: NPR {suggestedDiscount} (10%)</div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Amount Paid by Customer (NPR)</label>
              <input
                type="number"
                value={paidAmount}
                onChange={e => setPaidAmount(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #2563eb", background: "var(--bg)", fontSize: "16px", fontWeight: "600" }}
              />
            </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

