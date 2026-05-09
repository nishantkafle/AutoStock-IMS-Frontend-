import { useState } from "react";
import { getRegularCustomers, getHighSpenders, getPendingCredits } from "../../services/customerService";

export default function CustomerReports() {
    const [customers, setCustomers] = useState([]);
    const [reportType, setReportType] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function fetchReport(type) {
        setLoading(true);
        setError("");
        setCustomers([]);
        setReportType(type);
        try {
            let result;
            if (type === "regulars") result = await getRegularCustomers();
            else if (type === "high-spenders") result = await getHighSpenders();
            else if (type === "pending-credits") result = await getPendingCredits();
            setCustomers(result.data || []);
        } catch (err) {
            setError("Failed to load report");
        } finally {
            setLoading(false);
        }
    }

    const reportTitle = {
        "regulars": "Regular Customers",
        "high-spenders": "High Spenders",
        "pending-credits": "Pending Credits"
    };

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>
                    Customer Reports
                </h1>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "2px" }}>
                    Generate reports to analyse customer behaviour
                </p>
            </div>

            {/* Report Buttons */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
                {[
                    { key: "regulars", label: "Regular Customers" },
                    { key: "high-spenders", label: "High Spenders" },
                    { key: "pending-credits", label: "Pending Credits" },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => fetchReport(key)}
                        style={{
                            padding: "10px 20px",
                            background: reportType === key ? "#111" : "transparent",
                            color: reportType === key ? "white" : "var(--text-primary)",
                            border: "1px solid var(--card-border)",
                            borderRadius: "6px",
                            fontSize: "13.5px",
                            fontWeight: 500,
                            cursor: "pointer"
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {error && (
                <div style={{
                    background: "#fef2f2", border: "1px solid #fca5a5",
                    color: "#dc2626", padding: "10px 14px",
                    borderRadius: "6px", fontSize: "13px", marginBottom: "16px"
                }}>
                    {error}
                </div>
            )}

            {loading && (
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading report...</p>
            )}

            {!loading && reportType && customers.length === 0 && !error && (
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No customers found for this report.</p>
            )}

            {!loading && customers.length > 0 && (
                <div>
                    <div style={{
                        fontSize: "13px", fontWeight: 600,
                        textTransform: "uppercase", letterSpacing: "0.5px",
                        color: "var(--text-muted)", marginBottom: "12px"
                    }}>
                        {reportTitle[reportType]} — {customers.length} result(s)
                    </div>
                    <div style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "6px",
                        overflow: "hidden"
                    }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "var(--card-border)" }}>
                                    {["Full Name", "Email", "Phone",
                                        ...(reportType === "high-spenders" ? ["Total Spent"] : []),
                                        "Registered"
                                    ].map(h => (
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
                                        {reportType === "high-spenders" && (
                                            <td style={{ padding: "12px 16px", fontSize: "13.5px", fontWeight: 600 }}>
                                                Rs. {c.totalSpent?.toFixed(2)}
                                            </td>
                                        )}
                                        <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text-muted)" }}>
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}