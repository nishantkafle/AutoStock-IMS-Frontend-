import { Routes, Route } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import Placeholder from "../../components/Placeholder";
import Profile from "../profile/Profile";
import RegisterCustomer from "./RegisterCustomer";
import CustomerList from "./CustomerList";

function Overview() {
  const { user } = useAuth();

  const stats = [
    { label: "Customers Registered", value: "-" },
    { label: "Sales Today", value: "-" },
    { label: "Invoices Sent", value: "-" },
    { label: "Pending Credits", value: "-" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <h1
          style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}
        >
          Dashboard
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          Welcome back, {user?.fullName}. Here is what is happening today.
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
          <StatCard key={i} label={s.label} value={s.value} />
        ))}
      </div>

      <div
        style={{
          marginTop: "24px",
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
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: "var(--text-muted)",
            marginBottom: "14px",
          }}
        >
          Recent Customer Activity
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          No activity recorded yet.
        </div>
      </div>
    </div>
  );
}

export default function StaffDashboard({ theme, toggleTheme }) {
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
    path="/customers"
    element={
        <Page title="Customer List">
            <CustomerList />
        </Page>
    }
/>
      <Route
    path="/register-customer"
    element={
        <Page title="Register Customer">
            <RegisterCustomer />
        </Page>
    }
/>
      
      <Route
        path="/vehicles"
        element={
          <Page title="Vehicle Records">
            <Placeholder name="Vehicle Records" />
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
        path="/reports"
        element={
          <Page title="Customer Reports">
            <Placeholder name="Customer Reports" />
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
