import { useState, useEffect } from "react";
import { getAllVendors, createVendor, updateVendor, deleteVendor } from "../../services/vendorService";

export default function Vendors() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        isActive: true
    });

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const data = await getAllVendors();
            setVendors(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data || "Failed to load vendors");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleOpenModal = (vendor = null) => {
        if (vendor) {
            setEditingVendor(vendor);
            setFormData({
                name: vendor.name,
                contactPerson: vendor.contactPerson || "",
                phone: vendor.phone || "",
                email: vendor.email || "",
                address: vendor.address || "",
                isActive: vendor.isActive
            });
        } else {
            setEditingVendor(null);
            setFormData({
                name: "",
                contactPerson: "",
                phone: "",
                email: "",
                address: "",
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingVendor(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVendor) {
                await updateVendor(editingVendor.id, formData);
            } else {
                await createVendor(formData);
            }
            fetchVendors();
            handleCloseModal();
        } catch (err) {
            alert(err.response?.data || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this vendor?")) {
            try {
                await deleteVendor(id);
                fetchVendors();
            } catch (err) {
                alert(err.response?.data || "Failed to delete vendor");
            }
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px", color: "var(--text)" }}>
                        Vendors Management
                    </h1>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Manage your suppliers and their contact details.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        background: "var(--accent)",
                        color: "var(--accent-fg)",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        cursor: "pointer",
                        transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
                >
                    + Add Vendor
                </button>
            </div>

            {error && <div style={{ color: "var(--error)", marginBottom: "16px", fontSize: "14px", padding: "12px", background: "var(--error-bg)", borderRadius: "6px", border: "1px solid var(--error-border)" }}>{error}</div>}

            {loading ? (
                <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading vendors...</div>
            ) : (
                <div style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "6px",
                    overflow: "hidden"
                }}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                                <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                                    <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "var(--text-sub)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Name</th>
                                    <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "var(--text-sub)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Contact Person</th>
                                    <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "var(--text-sub)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Phone</th>
                                    <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "var(--text-sub)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</th>
                                    <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "var(--text-sub)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</th>
                                    <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "var(--text-sub)", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.length > 0 ? (
                                    vendors.map((v) => (
                                        <tr key={v.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                                            <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>{v.name}</td>
                                            <td style={{ padding: "14px 16px", fontSize: "14px", color: "var(--text-sub)" }}>{v.contactPerson || "-"}</td>
                                            <td style={{ padding: "14px 16px", fontSize: "14px", color: "var(--text-sub)" }}>{v.phone || "-"}</td>
                                            <td style={{ padding: "14px 16px", fontSize: "14px", color: "var(--text-sub)" }}>{v.email || "-"}</td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <span style={{
                                                    display: "inline-block",
                                                    padding: "4px 8px",
                                                    fontSize: "11px",
                                                    fontWeight: 600,
                                                    borderRadius: "12px",
                                                    background: v.isActive ? "var(--success-bg)" : "var(--error-bg)",
                                                    color: v.isActive ? "var(--success)" : "var(--error)",
                                                    border: `1px solid ${v.isActive ? "var(--success-border)" : "var(--error-border)"}`
                                                }}>
                                                    {v.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "14px 16px", textAlign: "right" }}>
                                                <button
                                                    onClick={() => handleOpenModal(v)}
                                                    style={{ color: "var(--accent)", fontSize: "13px", fontWeight: 600, marginRight: "12px", background: "none", border: "none", cursor: "pointer" }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(v.id)}
                                                    style={{ color: "var(--error)", fontSize: "13px", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                                            No vendors found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(2px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 100,
                    padding: "20px"
                }}>
                    <div style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "8px",
                        width: "100%",
                        maxWidth: "480px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden"
                    }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)" }}>
                                {editingVendor ? "Edit Vendor" : "Add Vendor"}
                            </h2>
                            <button onClick={handleCloseModal} style={{ color: "var(--text-muted)", background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>&times;</button>
                        </div>
                        
                        <div style={{ padding: "24px", overflowY: "auto", maxHeight: "calc(100vh - 120px)" }}>
                            <form id="vendorForm" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-sub)", marginBottom: "6px" }}>Vendor Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        style={{ width: "100%", padding: "10px 12px", background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text)", borderRadius: "6px", fontSize: "14px" }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-sub)", marginBottom: "6px" }}>Contact Person</label>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleInputChange}
                                        style={{ width: "100%", padding: "10px 12px", background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text)", borderRadius: "6px", fontSize: "14px" }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-sub)", marginBottom: "6px" }}>Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        style={{ width: "100%", padding: "10px 12px", background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text)", borderRadius: "6px", fontSize: "14px" }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-sub)", marginBottom: "6px" }}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        style={{ width: "100%", padding: "10px 12px", background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text)", borderRadius: "6px", fontSize: "14px" }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-sub)", marginBottom: "6px" }}>Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="2"
                                        style={{ width: "100%", padding: "10px 12px", background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text)", borderRadius: "6px", fontSize: "14px", resize: "vertical" }}
                                    ></textarea>
                                </div>
                                {editingVendor && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                                        <input
                                            type="checkbox"
                                            id="isActiveCheckbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            style={{ width: "16px", height: "16px", cursor: "pointer" }}
                                        />
                                        <label htmlFor="isActiveCheckbox" style={{ fontSize: "14px", color: "var(--text)", cursor: "pointer", userSelect: "none" }}>
                                            Active Vendor
                                        </label>
                                    </div>
                                )}
                            </form>
                        </div>
                        
                        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                style={{ padding: "8px 16px", fontSize: "13px", fontWeight: 600, color: "var(--text-sub)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "6px", cursor: "pointer", transition: "background 0.2s" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="vendorForm"
                                style={{ padding: "8px 16px", fontSize: "13px", fontWeight: 600, color: "var(--accent-fg)", background: "var(--accent)", border: "none", borderRadius: "6px", cursor: "pointer", transition: "background 0.2s" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
                            >
                                {editingVendor ? "Update Vendor" : "Save Vendor"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
