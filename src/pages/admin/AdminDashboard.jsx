import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
import { invoicesService, customerService, partsService, reportsService } from "../../services/api";
import { Package } from "lucide-react";

function Overview() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    customersCount: 0,
    newCustomersCount: 0,
    lowStockCount: 0,
    revenueTrend: [],
    recentSales: [],
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const now = new Date();
        const [invRes, custRes, lowRes, repRes] = await Promise.all([
          invoicesService.getAll().catch(() => []),
          customerService.getAll().catch(() => ({ data: [] })),
          partsService.getLowStock().catch(() => ({ data: [] })),
          reportsService.getMonthly(now.getFullYear(), now.getMonth() + 1).catch(() => null),
        ]);

        const invoices = Array.isArray(invRes) ? invRes : (invRes?.data || []);
        const customers = Array.isArray(custRes) ? custRes : (custRes?.data || []);
        const lowStock = Array.isArray(lowRes) ? lowRes : (lowRes?.data || []);
        const monthlyReport = repRes?.success !== undefined ? repRes.data : repRes;

        const totalRevenue = monthlyReport
          ? monthlyReport.totalRevenue
          : invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
        const totalSales = monthlyReport ? monthlyReport.salesCount : invoices.length;

        const newCustomers = customers.filter((c) => {
          if (!c.createdAt) return false;
          const dt = new Date(c.createdAt);
          return (
            dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth()
          );
        }).length;

        const revenueTrend = monthlyReport?.dailyBreakdown || [];
        const recentSales = invoices.slice(0, 5);

        setStats({
          totalRevenue,
          totalSales,
          customersCount: customers.length,
          newCustomersCount: newCustomers,
          lowStockCount: lowStock.length,
          revenueTrend,
          recentSales,
        });
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Prepare points for SVG chart
  const maxRev = Math.max(...stats.revenueTrend.map((d) => d.revenue), 100);
  const chartHeight = 200;
  const chartWidth = 580;
  const points = stats.revenueTrend.map((d, i) => {
    const x = (i / Math.max(stats.revenueTrend.length - 1, 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (d.revenue / maxRev) * (chartHeight - 40) - 20;
    return `${x},${y}`;
  });
  const polylinePoints = points.join(" ");
  const areaPoints = points.length > 0 ? `20,${chartHeight} ${polylinePoints} ${chartWidth - 20},${chartHeight}` : "";

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
          Welcome back, {user?.fullName || "Admin"}. Here's what's happening today.
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
              label="Total Revenue"
              value={`Rs. ${Number(stats.totalRevenue).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              sub="vs last month"
            />
            <StatCard label="Total Sales" value={stats.totalSales} />
            <StatCard
              label="Customers"
              value={stats.customersCount}
              sub={`${stats.newCustomersCount} new this month`}
            />
            <StatCard label="Low Stock Alerts" value={stats.lowStockCount} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.7fr 1fr",
              gap: "18px",
              marginTop: "24px",
            }}
          >
            {/* Revenue Trend Chart */}
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
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: "4px",
                }}
              >
                Revenue Trend
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginBottom: "20px",
                }}
              >
                Last 30 days
              </div>

              <div style={{ flex: 1, position: "relative", minHeight: "220px" }}>
                {stats.revenueTrend.length === 0 ? (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-muted)",
                      fontSize: "13px",
                    }}
                  >
                    No revenue data available.
                  </div>
                ) : (
                  <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    style={{ overflow: "visible" }}
                  >
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4F7EFF" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#4F7EFF" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                      const y = 20 + ratio * (chartHeight - 40);
                      const val = Math.round(maxRev * (1 - ratio));
                      return (
                        <g key={idx}>
                          <line
                            x1="20"
                            y1={y}
                            x2={chartWidth - 20}
                            y2={y}
                            stroke="var(--card-border)"
                            strokeDasharray="3 3"
                            strokeOpacity="0.6"
                          />
                          <text
                            x="18"
                            y={y + 4}
                            fill="var(--text-muted)"
                            fontSize="9"
                            textAnchor="end"
                          >
                            Rs.{val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Area path */}
                    <polygon points={areaPoints} fill="url(#areaGradient)" />

                    {/* Line path */}
                    <polyline
                      points={polylinePoints}
                      fill="none"
                      stroke="#4F7EFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* X axis dates */}
                    {stats.revenueTrend.filter((_, i) => i % 5 === 0).map((d, i) => {
                      const x = (d.day / 30) * (chartWidth - 40) + 20;
                      return (
                        <text
                          key={i}
                          x={x}
                          y={chartHeight + 14}
                          fill="var(--text-muted)"
                          fontSize="9"
                          textAnchor="middle"
                        >
                          {new Date().getMonth() + 1}/{d.day}
                        </text>
                      );
                    })}
                  </svg>
                )}
              </div>
            </div>

            {/* Recent Sales List */}
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
                  Recent Sales
                </div>
                <Link
                  to="/admin/reports"
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
                {stats.recentSales.length === 0 ? (
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
                    No sales recorded yet.
                  </div>
                ) : (
                  stats.recentSales.map((inv) => (
                    <div
                      key={inv.id}
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
                            {inv.customerName || "Walk-in Customer"}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--text-muted)",
                              fontFamily: "monospace",
                            }}
                          >
                            INV-{inv.id.substring(0, 8).toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "14px",
                          color: "var(--text)",
                        }}
                      >
                        Rs. {Number(inv.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
