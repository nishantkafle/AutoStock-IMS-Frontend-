import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer } from "../../services/customerService";

export default function RegisterCustomer() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await registerCustomer({
                ...form,
                year: parseInt(form.year),
            });
            setSuccess("Customer registered successfully!");
            setTimeout(() => navigate("/staff/customers"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to register customer");
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--bg)"
        }}>
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "12px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                width: "100%",
                maxWidth: "480px"
            }}>
                <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "6px" }}>
                    Register Customer
                </h2>
                <p style={{ color: "#888", fontSize: "13.5px", marginBottom: "24px" }}>
                    Fill in customer and vehicle details
                </p>

                {error && (
                    <div style={{
                        background: "#fef2f2", border: "1px solid #fca5a5",
                        color: "#dc2626", padding: "10px 14px",
                        borderRadius: "6px", fontSize: "13px", marginBottom: "16px"
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        background: "#f0fdf4", border: "1px solid #86efac",
                        color: "#16a34a", padding: "10px 14px",
                        borderRadius: "6px", fontSize: "13px", marginBottom: "16px"
                    }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

                    {/* Customer Info */}
                    <p style={{ fontWeight: "600", fontSize: "13px", color: "#555", marginBottom: "-8px" }}>
                        Customer Information
                    </p>

                    {[
                        { label: "Full Name", name: "fullName", type: "text" },
                        { label: "Email", name: "email", type: "email" },
                        { label: "Password", name: "password", type: "password" },
                        { label: "Phone Number", name: "phoneNumber", type: "text" },
                    ].map(({ label, name, type }) => (
                        <div key={name}>
                            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                                {label}
                            </label>
                            <input
                                type={type}
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%", padding: "9px 12px",
                                    fontSize: "13.5px", borderRadius: "6px",
                                    border: "1px solid var(--input-border)",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>
                    ))}

                    {/* Vehicle Info */}
                    <p style={{ fontWeight: "600", fontSize: "13px", color: "#555", marginBottom: "-8px" }}>
                        Vehicle Information
                    </p>

                    {[
                        { label: "Vehicle Number", name: "vehicleNumber", type: "text" },
                        { label: "Make (e.g. Toyota)", name: "make", type: "text" },
                        { label: "Model (e.g. Corolla)", name: "model", type: "text" },
                        { label: "Year", name: "year", type: "number" },
                    ].map(({ label, name, type }) => (
                        <div key={name}>
                            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                                {label}
                            </label>
                            <input
                                type={type}
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%", padding: "9px 12px",
                                    fontSize: "13.5px", borderRadius: "6px",
                                    border: "1px solid var(--input-border)",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        style={{
                            width: "100%", padding: "10px",
                            background: "#111", color: "white",
                            border: "none", borderRadius: "6px",
                            fontSize: "14px", fontWeight: "500",
                            cursor: "pointer", marginTop: "4px"
                        }}
                    >
                        Register Customer
                    </button>

                </form>
            </div>

            <p style={{ marginTop: "20px", fontSize: "13px", color: "#aaa" }}>
                2026 AutoStock · Professional vehicle parts management
            </p>
        </div>
    );
}