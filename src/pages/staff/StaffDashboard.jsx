import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import VehicleRecords from "./VehicleRecords";
import Profile from "../profile/Profile";
import RegisterCustomer from "./RegisterCustomer";
import CustomerList from "./CustomerList";
import CustomerDetails from "./CustomerDetails";
import CustomerReports from "./CustomerReports";
import AppointmentsAdmin from "../admin/AppointmentsAdmin";
import PartRequestsAdmin from "../admin/PartRequestsAdmin";
import SalesInvoices from "./SalesInvoices";
import CreditInvoices from "./CreditInvoices";
import CreateInvoice from "./CreateInvoice";
import InvoiceDetails from "./InvoiceDetails";
import EditInvoice from "./EditInvoice";
import { customerService, invoicesService, appointmentService, partRequestService } from "../../services/api";
import { Calendar, Package } from "lucide-react";

function Overview() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customersCount: 0,
    newCustomersCount: 0,
    salesTodayAmount: 0,
    salesTodayCount: 0,
    invoicesCount: 0,
    pendingCreditsAmount: 0,
    pendingCreditsCount: 0,
    recentAppointments: [],
    recentPartRequests: [],
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const now = new Date();
        const [custRes, invRes, aptRes, reqRes] = await Promise.all([
          customerService.getAll().catch(() => ({ data: [] })),
          invoicesService.getAll().catch(() => []),
          appointmentService.getAll().catch(() => ({ data: [] })),
          partRequestService.getAll().catch(() => ({ data: [] })),
        ]);

        const customers = Array.isArray(custRes) ? custRes : custRes?.data || [];
        const invoices = Array.isArray(invRes) ? invRes : invRes?.data || [];
        const appointments = Array.isArray(aptRes) ? aptRes : aptRes?.data || [];
        const reqList = Array.isArray(reqRes) ? reqRes : reqRes?.data || [];

        // Customers count
        const newCustomersCount = customers.filter((c) => {
          if (!c.createdAt) return false;
          const dt = new Date(c.createdAt);
          return dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth();
        }).length;

        // Sales today
        const todayStr = now.toDateString();
        const todaySales = invoices.filter(
          (i) => i.createdAt && new Date(i.createdAt).toDateString() === todayStr
        );
        const salesTodayAmount = todaySales.reduce((s, i) => s + (i.totalAmount || 0), 0);

        // Pending credits
        const pendingInvoices = invoices.filter((i) => (i.remainingBalance || 0) > 0);
        const pendingCreditsAmount = pendingInvoices.reduce((s, i) => s + (i.remainingBalance || 0), 0);

        // Recent appointments (upcoming / recent top 5)
        const recentAppointments = appointments
          .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
          .slice(0, 5);

        // Recent part requests top 5
        const recentPartRequests = reqList
          .sort((a, b) => new Date(b.requestedAt || Date.now()) - new Date(a.requestedAt || Date.now()))
          .slice(0, 5);

        setStats({
          customersCount: customers.length,
          newCustomersCount,
          salesTodayAmount,
          salesTodayCount: todaySales.length,
          invoicesCount: invoices.length,
          pendingCreditsAmount,
          pendingCreditsCount: pendingInvoices.length,
          recentAppointments,
          recentPartRequests,
        });
      } catch (err) {
        console.error("Error loading staff dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function getStatusBadge(status) {
    const map = {
      Confirmed: { bg: "rgba(92,196,74,0.12)", color: "#5CC44A" },
      Fulfilled: { bg: "rgba(92,196,74,0.12)", color: "#5CC44A" },
      Pending: { bg: "rgba(232,168,78,0.12)", color: "#E8A84E" },
      Completed: { bg: "rgba(79,126,255,0.12)", color: "#4F7EFF" },
      Cancelled: { bg: "rgba(255,90,61,0.12)", color: "#FF5A3D" },
      Rejected: { bg: "rgba(255,90,61,0.12)", color: "#FF5A3D" },
    };
    const s = map[status] || { bg: "rgba(150,150,150,0.12)", color: "#999" };
    return (
      <span
        style={{
          background: s.bg,
          color: s.color,
          padding: "4px 10px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        {status}
      </span>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "2px" }}>
          Welcome back, {user?.fullName || "Staff"}. Here is what is happening today.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: "40px", color: "var(--text-muted)", textAlign: "center" }}>
          Loading dashboard data...
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "14px",
              marginTop: "24px",
            }}
          >
            <StatCard
              label="Customers Registered"
              value={stats.customersCount}
              sub={`${stats.newCustomersCount} new this month`}
            />
            <StatCard
              label="Sales Today"
              value={`Rs. ${Number(stats.salesTodayAmount).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              sub={`${stats.salesTodayCount} orders today`}
            />
            <StatCard
              label="Invoices Sent"
              value={stats.invoicesCount}
              sub="Total processed orders"
            />
            <StatCard
              label="Pending Credits"
              value={`Rs. ${Number(stats.pendingCreditsAmount).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              sub={`${stats.pendingCreditsCount} unpaid invoices`}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr",
              gap: "18px",
              marginTop: "24px",
            }}
          >
            {/* Recent Appointments */}
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                borderRadius: "6px",
                padding: "22px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>
                  Recent Appointments
                </div>
                <Link
                  to="/staff/appointments"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#4F7EFF",
                    textDecoration: "none",
                  }}
                >
                  View all →
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                {stats.recentAppointments.length === 0 ? (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-muted)",
                      fontSize: "13px",
                    }}
                  >
                    No appointments scheduled.
                  </div>
                ) : (
                  stats.recentAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "12px",
                        borderBottom: "1px solid var(--card-border)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "8px",
                            background: "rgba(92,196,74,0.12)",
                            color: "#5CC44A",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Calendar size={18} />
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "13.5px",
                              color: "var(--text)",
                            }}
                          >
                            {apt.customerName || "Customer"}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--text-muted)",
                            }}
                          >
                            {apt.serviceType} • {new Date(apt.appointmentDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div>{getStatusBadge(apt.status)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Part Requests */}
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                borderRadius: "6px",
                padding: "22px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>
                  Recent Part Requests
                </div>
                <Link
                  to="/staff/part-requests"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#4F7EFF",
                    textDecoration: "none",
                  }}
                >
                  View all →
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                {stats.recentPartRequests.length === 0 ? (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-muted)",
                      fontSize: "13px",
                    }}
                  >
                    No part requests recorded yet.
                  </div>
                ) : (
                  stats.recentPartRequests.map((req) => (
                    <div
                      key={req.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "12px",
                        borderBottom: "1px solid var(--card-border)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "8px",
                            background: "rgba(79,126,255,0.12)",
                            color: "#4F7EFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Package size={18} />
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "13.5px",
                              color: "var(--text)",
                            }}
                          >
                            {req.partName}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--text-muted)",
                            }}
                          >
                            {req.customerName} • Qty: {req.quantity}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {getStatusBadge(req.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
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
      <Route path="/" element={<Page title="Dashboard"><Overview /></Page>} />
      <Route path="/customers" element={<Page title="Customer List"><CustomerList /></Page>} />
      <Route path="/register-customer" element={<Page title="Register Customer"><RegisterCustomer /></Page>} />
      <Route path="/customers/:id" element={<Page title="Customer Details"><CustomerDetails /></Page>} />
      <Route path="/vehicles" element={<Page title="Vehicle Records"><VehicleRecords /></Page>} />
      <Route path="/sales" element={<Page title="Sales & Invoices"><SalesInvoices /></Page>} />
      <Route path="/credit-invoices" element={<Page title="Credit Invoices"><CreditInvoices basePath="/staff" /></Page>} />
      <Route path="/sales/new" element={<Page title="Create Invoice"><CreateInvoice /></Page>} />
      <Route path="/sales/:id" element={<Page title="Invoice Details"><InvoiceDetails /></Page>} />
      <Route path="/sales/edit/:id" element={<Page title="Edit Invoice"><EditInvoice /></Page>} />
      <Route path="/appointments" element={<Page title="Appointments"><AppointmentsAdmin /></Page>} />
      <Route path="/part-requests" element={<Page title="Part Requests"><PartRequestsAdmin /></Page>} />
      <Route path="/reports" element={<Page title="Customer Reports"><CustomerReports /></Page>} />
      <Route path="/profile" element={<Page title="Profile"><Profile /></Page>} />
    </Routes>
  );
}