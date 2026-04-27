import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById } from "../../services/customerService";

export default function CustomerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCustomer() {
            try {
                const result = await getCustomerById(id);
                setCustomer(result.data);
            } catch (err) {
                setError("Customer not found");
            } finally {
                setLoading(false);
            }
        }
        fetchCustomer();
    }, [id]);

    if (loading) return <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading...</p>;

    if (error) return (
        <div style={{
            background: "#fef2f2", border: "1px solid #fca5a5",
            color: "#dc2626", padding: "10px 14px",
            borderRadius: "6px", fontSize: "13px"
        }}>
            {error}
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <button
                    onClick={() => navigate("/staff/customers")}
                    style={{
                        padding: "6px 12px", background: "transparent",
                        border: "1px solid var(--card-border)",
                        borderRadius: "4px", fontSize: "13px",
                        cursor: "pointer"
                    }}
                >
                    ← Back
                </button>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>
                        {customer?.fullName}
                    </h1>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Customer Details
                    </p>
                </div>
            </div>

            {/* Customer Info Card */}
            <div style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                borderRadius: "6px",
                padding: "22px",
                marginBottom: "20px"
            }}>
                <div style={{
                    fontSize: "13px", fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.5px",
                    color: "var(--text-muted)", marginBottom: "16px"
                }}>
                    Customer Information
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {[
                        { label: "Full Name", value: customer?.fullName },
                        { label: "Email", value: customer?.email },
                        { label: "Phone Number", value: customer?.phoneNumber },
                        { label: "Status", value: customer?.isActive ? "Active" : "Inactive" },
                        { label: "Registered On", value: new Date(customer?.createdAt).toLocaleDateString() },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                                {label}
                            </p>
                            <p style={{ fontSize: "14px", fontWeight: 500 }}>
                                {value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vehicles Card */}
            <div style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                borderRadius: "6px",
                padding: "22px"
            }}>
                <div style={{
                    fontSize: "13px", fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.5px",
                    color: "var(--text-muted)", marginBottom: "16px"
                }}>
                    Vehicles ({customer?.vehicles?.length || 0})
                </div>

                {customer?.vehicles?.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                        No vehicles registered.
                    </p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {customer?.vehicles?.map((v) => (
                            <div key={v.id} style={{
                                border: "1px solid var(--card-border)",
                                borderRadius: "6px",
                                padding: "16px",
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: "12px"
                            }}>
                                {[
                                    { label: "Vehicle Number", value: v.vehicleNumber },
                                    { label: "Make", value: v.make },
                                    { label: "Model", value: v.model },
                                    { label: "Year", value: v.year },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                                            {label}
                                        </p>
                                        <p style={{ fontSize: "14px", fontWeight: 500 }}>
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}