import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import Placeholder from "../../components/Placeholder";
import Profile from "../profile/Profile";
import Vendors from "./Vendors";

// Admin overview - shows key business numbers
function Overview() {
  const stats = [
    { label: "Revenue - 30d", value: "-", sub: "No data yet" },
    { label: "Total Sales", value: "-", sub: "No data yet" },
    { label: "Customers", value: "-", sub: "No data yet" },
    { label: "Low Stock Alerts", value: "-", sub: "No data yet" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <h1
          style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}
        >
          Overview
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          Here is what is happening in your business today.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
          marginTop: "24px",
        }}
      >
        {stats.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />
        ))}
      </div>

      {/* Recent sales placeholder */}
      <div
        style={{
          marginTop: "24px",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "14px",
        }}
      >
        <div
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: "6px",
            padding: "22px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text-muted)",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Revenue Trend
          </div>
          <div
            style={{
              height: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              fontSize: "13px",
            }}
          >
            Chart will appear once sales data is available
          </div>
        </div>

        <div
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: "6px",
            padding: "22px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text-muted)",
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Recent Sales
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            No sales recorded yet.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ theme, toggleTheme }) {
  // Wrap every route in the same layout shell
  function Page({ title, children }) {
    return (
      <DashboardLayout title={title} theme={theme} toggleTheme={toggleTheme}>
        {children}
      </DashboardLayout>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Page title="Dashboard">
            <Overview />
          </Page>
        }
      />
      <Route
        path="/inventory"
        element={
          <Page title="Inventory">
            <Placeholder name="Inventory Management" />
          </Page>
        }
      />
      <Route
        path="/vendors"
        element={
          <Page title="Vendors">
            <Vendors />
          </Page>
        }
      />
      <Route
        path="/purchase-invoices"
        element={
          <Page title="Purchase Invoices">
            <Placeholder name="Purchase Invoices" />
          </Page>
        }
      />
      <Route
        path="/sales"
        element={
          <Page title="Sales & Invoices">
            <Placeholder name="Sales and Invoices" />
          </Page>
        }
      />
      <Route
        path="/customers"
        element={
          <Page title="Customers">
            <Placeholder name="Customer List" />
          </Page>
        }
      />
      <Route
        path="/vehicles"
        element={
          <Page title="Vehicles">
            <Placeholder name="Vehicle Records" />
          </Page>
        }
      />
      <Route
        path="/appointments"
        element={
          <Page title="Appointments">
            <Placeholder name="Appointments" />
          </Page>
        }
      />
      <Route
        path="/part-requests"
        element={
          <Page title="Part Requests">
            <Placeholder name="Part Requests" />
          </Page>
        }
      />
      <Route
        path="/reviews"
        element={
          <Page title="Reviews">
            <Placeholder name="Reviews" />
          </Page>
        }
      />
      <Route
        path="/staff"
        element={
          <Page title="Staff & Roles">
            <Placeholder name="Staff Management" />
          </Page>
        }
      />
      <Route
        path="/reports"
        element={
          <Page title="Financial Reports">
            <Placeholder name="Financial Reports" />
          </Page>
        }
      />
      <Route
        path="/profile"
        element={
          <Page title="Profile">
            <Profile />
          </Page>
        }
      />
    </Routes>
  );
}
