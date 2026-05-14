import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import Profile from "../profile/Profile";
import StaffManagement from "./StaffManagement";
import PartsManagement from "./PartsManagement";
import AppointmentsAdmin from "./AppointmentsAdmin";
import PartRequestsAdmin from "./PartRequestsAdmin";
import Vendors from "./Vendors";
import PurchaseInvoices from "./PurchaseInvoices";
import FinancialReports from "./FinancialReports";
import AdminCustomerList from "./AdminCustomerList";
import AdminReviews from "./AdminReviews";
import VehicleRecords from "../staff/VehicleRecords";
import InvoiceDetails from "../staff/InvoiceDetails";
import CreditInvoices from "../staff/CreditInvoices";
import SalesInvoices from "../staff/SalesInvoices";

function Overview() {
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
        {[
          { label: "Revenue - 30d", value: "-" },
          { label: "Total Sales", value: "-" },
          { label: "Customers", value: "-" },
          { label: "Low Stock Alerts", value: "-" },
        ].map((s, i) => (
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
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: "var(--text-muted)",
            marginBottom: "10px",
          }}
        >
          Recent Sales
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          No sales recorded yet.
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ theme, toggleTheme }) {
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
            <PartsManagement />
          </Page>
        }
      />
      <Route
        path="/staff"
        element={
          <Page title="Staff & Roles">
            <StaffManagement />
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
            <PurchaseInvoices />
          </Page>
        }
      />

      {/* Customers - admin view */}
      <Route
        path="/credit-invoices"
        element={
          <Page title="Credit Invoices">
            <CreditInvoices basePath="/admin" />
          </Page>
        }
      />

      {/* Customers - admin view */}
      <Route
        path="/customers"
        element={
          <Page title="Customers">
            <AdminCustomerList />
          </Page>
        }
      />

      <Route
        path="/vehicles"
        element={
          <Page title="Vehicles">
            <VehicleRecords />
          </Page>
        }
      />
      <Route
        path="/appointments"
        element={
          <Page title="Appointments">
            <AppointmentsAdmin />
          </Page>
        }
      />
      <Route
        path="/part-requests"
        element={
          <Page title="Part Requests">
            <PartRequestsAdmin />
          </Page>
        }
      />
      <Route
        path="/reviews"
        element={
          <Page title="Reviews">
            <AdminReviews />
          </Page>
        }
      />
      <Route
        path="/reports"
        element={
          <Page title="Financial Reports">
            <FinancialReports />
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
