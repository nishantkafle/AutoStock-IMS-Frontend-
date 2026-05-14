import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field, Btn, Alert } from "../../components/FormElements";

import { registerCustomer } from "../../services/customerService";

export default function RegisterCustomer() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState({ text: "", ok: false });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    vehicleNumber: "",
    make: "",
    model: "",
    year: "",
  });

  function set(key) {
    return (e) => setForm({ ...form, [key]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg({ text: "", ok: false });
    setLoading(true);
    try {
      const data = await registerCustomer({ ...form, year: parseInt(form.year) });
      if (data.success) {
        setMsg({
          text: "Customer registered! Login credentials have been emailed to them.",
          ok: true,
        });
        setForm({
          fullName: "",
          email: "",
          password: "",
          phoneNumber: "",
          vehicleNumber: "",
          make: "",
          model: "",
          year: "",
        });
        setTimeout(() => navigate("/staff/customers"), 2200);
      } else {
        setMsg({
          text: data.message || "Registration failed. Please try again.",
          ok: false,
        });
      }
    } catch (err) {
      setMsg({
        text: err.response?.data?.message || "Cannot connect to server. Make sure the backend is running.",
        ok: false,
      });
    } finally {
      setLoading(false);
    }
  }

  const sectionLabel = {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: "14px",
    marginTop: "6px",
    paddingBottom: "8px",
    borderBottom: "1px solid var(--border)",
  };

  return (
    <div style={{ maxWidth: "560px" }}>
      {/* Page heading */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px" }}
        >
          Register Customer
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginTop: "3px",
          }}
        >
          Fill in customer and vehicle details. Login credentials will be
          emailed automatically.
        </p>
      </div>

      <Alert text={msg.text} ok={msg.ok} />

      {/* Form card */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "28px",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Customer Information */}
          <div style={sectionLabel}>Customer Information</div>

          <Field
            label="Full Name"
            value={form.fullName}
            onChange={set("fullName")}
            placeholder="e.g. Ram Bahadur"
            required
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="customer@email.com"
            required
          />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="Min. 6 characters"
            required
            note="This will be emailed to the customer. They should change it after first login."
          />
          <Field
            label="Phone Number"
            type="tel"
            value={form.phoneNumber}
            onChange={set("phoneNumber")}
            placeholder="+977 98XXXXXXXX"
            required
          />

          {/* Vehicle Information */}
          <div style={{ ...sectionLabel, marginTop: "20px" }}>
            Vehicle Information
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <Field
              label="Make"
              value={form.make}
              onChange={set("make")}
              placeholder="e.g. Toyota"
              required
            />
            <Field
              label="Model"
              value={form.model}
              onChange={set("model")}
              placeholder="e.g. Corolla"
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <Field
              label="Year"
              type="number"
              value={form.year}
              onChange={set("year")}
              placeholder="e.g. 2020"
              min="1990"
              max={new Date().getFullYear()}
              required
            />
            <Field
              label="Vehicle Number"
              value={form.vehicleNumber}
              onChange={set("vehicleNumber")}
              placeholder="e.g. BA 1 PA 1234"
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              marginTop: "8px",
            }}
          >
            <Btn variant="ghost" onClick={() => navigate("/staff/customers")}>
              Cancel
            </Btn>
            <Btn type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register Customer"}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}
