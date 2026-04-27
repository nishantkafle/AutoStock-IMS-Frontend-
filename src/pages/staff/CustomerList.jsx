import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCustomers, searchCustomers } from "../../services/customerService";

export default function CustomerList() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        fetchCustomers();
    }, []);

    async function fetchCustomers() {
        try {
            setLoading(true);
            const result = await getAllCustomers();
            setCustomers(result.data || []);
        } catch (err) {
            setError("Failed to load customers");
        } finally {
            setLoading(false);
        }
    }

    async function handleSearch(e) {
        e.preventDefault();
        if (!keyword.trim()) {
            fetchCustomers();
            return;
        }
        try {
            setLoading(true);
            const result = await searchCustomers(keyword);
            setCustomers(result.data || []);
        } catch (err) {
            setError("Search failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>
                        Customers
                    </h1>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "2px" }}>
                        View and manage registered customers
                    </p>
                </div>
                <button
                    onClick={() => navigate("/staff/register-customer")}
                    style={{
                        padding: "9px 18px", background: "#111", color: "white",
                        border: "none", borderRadius: "6px", fontSize: "13.5px",
                        fontWeight: 500, cursor: "pointer"
                    }}
                >
                    + Register Customer
                </button>
            </div>

            {/* Search Bar - Feature 10 */}
            <form onSubmit={handleSearch} style={{
                display: "flex", gap: "10px", marginBottom: "20px"
            }}>
                <input
                    type="text"
                    placeholder="Search by name, phone, ID or vehicle number..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    style={{
                        flex: 1, padding: "9px 14px",
                        fontSize: "13.5px", borderRadius: "6px",
                        border: "1px solid var(--card-border)",
                        outline: "none"
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "9px 20px", background: "#111", color: "white",
                        border: "none", borderRadius: "6px", fontSize: "13.5px",
                        fontWeight: 500, cursor: "pointer"
                    }}
                >
                    Search
                </button>
                {keyword && (
                    <button
                        type="button"
                        onClick={() => { setKeyword(""); fetchCustomers(); }}
                        style={{
                            padding: "9px 16px", background: "transparent",
                            border: "1px solid var(--card-border)",
                            borderRadius: "6px", fontSize: "13.5px",
                            cursor: "pointer"
                        }}
                    >
                        Clear
                    </button>
                )}
            </form>

            {error && (
                <div style={{
                    background: "#fef2f2", border: "1px solid #fca5a5",
                    color: "#dc2626", padding: "10px 14px",
                    borderRadius: "6px", fontSize: "13px", marginBottom: "16px"
                }}>
                    {error}
                </div>
            )}

            {loading ? (
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading customers...</p>
            ) : customers.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No customers found.</p>
            ) : (
                <div style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "6px",
                    overflow: "hidden"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "var(--card-border)" }}>
                                {["Full Name", "Email", "Phone", "Vehicles", "Registered", "Action"].map(h => (
                                    <th key={h} style={{
                                        padding: "10px 16px", textAlign: "left",
                                        fontSize: "12px", fontWeight: 600,
                                        textTransform: "uppercase", letterSpacing: "0.5px",
                                        color: "var(--text-muted)"
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((c, i) => (
                                <tr key={c.id} style={{
                                    borderTop: "1px solid var(--card-border)",
                                    background: i % 2 === 0 ? "transparent" : "var(--card-bg)"
                                }}>
                                    <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 500 }}>
                                        {c.fullName}
                                    </td>
                                    <td style={{ padding: "12px 16px", fontSize: "13.5px", color: "var(--text-muted)" }}>
                                        {c.email}
                                    </td>
                                    <td style={{ padding: "12px 16px", fontSize: "13.5px", color: "var(--text-muted)" }}>
                                        {c.phoneNumber}
                                    </td>
                                    <td style={{ padding: "12px 16px", fontSize: "13.5px" }}>
                                        {c.vehicles?.length || 0} vehicle(s)
                                    </td>
                                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text-muted)" }}>
                                        {new Date(c.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <button
                                            onClick={() => navigate(`/staff/customers/${c.id}`)}
                                            style={{
                                                padding: "5px 12px", background: "transparent",
                                                border: "1px solid var(--card-border)",
                                                borderRadius: "4px", fontSize: "12.5px",
                                                cursor: "pointer", fontWeight: 500
                                            }}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}