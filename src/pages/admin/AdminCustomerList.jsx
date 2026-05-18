import { useState, useEffect } from "react";
import {
  getAllCustomers,
  searchCustomers,
} from "../../services/customerService";
import Pagination from "../../components/Pagination";

export default function AdminCustomerList() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  async function fetchCustomers() {
    try {
      setLoading(true);
      setError("");
      const result = await getAllCustomers(page, 7);
      setCustomers(result.data || []);
      setTotalPages(result.meta?.totalPages || 1);
      setTotalCount(result.meta?.totalCount || 0);
    } catch {
      setError("Failed to load customers.");
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
      setError("");
      setCustomers([]);
      const result = await searchCustomers(keyword);
      setCustomers(result.data || []);
    } catch {
      setError("No customers found.");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header - no Register button for admin */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px" }}
        >
          Customers
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginTop: "3px",
          }}
        >
          View all registered customers and their vehicle details.
        </p>
      </div>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: "8px", marginBottom: "18px" }}
      >
        <input
          type="text"
          placeholder="Search by name, phone, ID or vehicle number..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            flex: 1,
            padding: "9px 13px",
            fontSize: "14px",
            borderRadius: "5px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        <button
          type="submit"
          style={{
            padding: "9px 20px",
            background: "var(--accent)",
            color: "var(--accent-fg)",
            border: "none",
            borderRadius: "5px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Search
        </button>
        {keyword && (
          <button
            type="button"
            onClick={() => {
              setKeyword("");
              fetchCustomers();
            }}
            style={{
              padding: "9px 14px",
              background: "transparent",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              borderRadius: "5px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        )}
      </form>

      {/* Error */}
      {error && (
        <div
          style={{
            background: "var(--err-bg, rgba(255,90,61,0.1))",
            border: "1px solid var(--err, #FF5A3D)",
            color: "var(--err, #FF5A3D)",
            padding: "10px 14px",
            borderRadius: "5px",
            fontSize: "13.5px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading / empty */}
      {loading ? (
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Loading customers...
        </p>
      ) : customers.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          No customers found.
        </p>
      ) : (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr>
                {[
                  "ID",
                  "Full Name",
                  "Email",
                  "Phone",
                  "Vehicles",
                  "Registered",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.7px",
                      color: "var(--text-muted)",
                      borderBottom: "1px solid var(--border)",
                      background: "var(--surface-2)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr
                  key={c.id}
                  style={{ transition: "background 0.12s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--surface-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td
                    style={{
                      padding: "11px 16px",
                      borderBottom:
                        i < customers.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                      fontSize: "12px",
                      color: "var(--text-faint)",
                      fontFamily: "monospace",
                    }}
                  >
                    {c.id.substring(0, 8)}...
                  </td>
                  <td
                    style={{
                      padding: "11px 16px",
                      borderBottom:
                        i < customers.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                      fontWeight: 500,
                    }}
                  >
                    {c.fullName}
                  </td>
                  <td
                    style={{
                      padding: "11px 16px",
                      borderBottom:
                        i < customers.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                      color: "var(--text-muted)",
                    }}
                  >
                    {c.email}
                  </td>
                  <td
                    style={{
                      padding: "11px 16px",
                      borderBottom:
                        i < customers.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                      color: "var(--text-muted)",
                    }}
                  >
                    {c.phoneNumber || "-"}
                  </td>
                  <td
                    style={{
                      padding: "11px 16px",
                      borderBottom:
                        i < customers.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                    }}
                  >
                    {c.vehicles?.length || 0} vehicle
                    {c.vehicles?.length !== 1 ? "s" : ""}
                  </td>
                  <td
                    style={{
                      padding: "11px 16px",
                      borderBottom:
                        i < customers.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                      color: "var(--text-muted)",
                      fontSize: "13px",
                    }}
                  >
                    {new Date(c.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={7}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
