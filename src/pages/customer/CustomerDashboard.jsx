import { Link, Routes, Route } from "react-router-dom";
import { Calendar, Package, ShoppingBag, Car } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import Placeholder from "../../components/Placeholder";
import Profile from "../profile/Profile";
import MyVehicles from "./MyVehicles";
import CustomerAppointments from "./CustomerAppointments";
import CustomerPartRequests from "./CustomerPartRequests";
import CustomerReviews from "./CustomerReviews";

const ACTIONS = [
  {
    label: "Book Appointment",
    desc: "Schedule a service visit",
    path: "/customer/appointments",
    Icon: Calendar,
    iconColor: "#4F7EFF",
    iconBg: "rgba(79, 126, 255, 0.12)",
  },
  {
    label: "My Vehicles",
    desc: "View and manage your vehicles",
    path: "/customer/vehicles",
    Icon: Car,
    iconColor: "#1EC8A0",
    iconBg: "rgba(30, 200, 160, 0.12)",
  },
  {
    label: "Request a Part",
    desc: "Request a part not in stock",
    path: "/customer/part-requests",
    Icon: Package,
    iconColor: "#A970FF",
    iconBg: "rgba(169, 112, 255, 0.12)",
  },
  {
    label: "My Orders",
    desc: "View your purchase history",
    path: "/customer/orders",
    Icon: ShoppingBag,
    iconColor: "#F5A623",
    iconBg: "rgba(245, 166, 35, 0.12)",
  },
];

function ActionCard({ label, desc, path, Icon, iconColor, iconBg }) {
  return (
    <Link
      to={path}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "7px",
        padding: "26px 24px",
        display: "block",
        textDecoration: "none",
        transition: "background 0.18s, border-color 0.18s, transform 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--surface-hover)";
        e.currentTarget.style.borderColor = "var(--text-faint)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--surface)";
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Colored icon inside a soft tinted circle */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "9px",
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <Icon size={21} strokeWidth={1.8} color={iconColor} />
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "15.5px",
          fontWeight: 600,
          color: "var(--text)",
          marginBottom: "6px",
          letterSpacing: "-0.2px",
        }}
      >
        {label}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: "13.5px",
          color: "var(--text-muted)",
          lineHeight: 1.55,
        }}
      >
        {desc}
      </div>
    </Link>
  );
}

function Overview() {
  const { user } = useAuth();

  return (
    <div>
      {/* Welcome text */}
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "25px",
            fontWeight: 700,
            letterSpacing: "-0.5px",
          }}
        >
          Welcome, {user?.fullName}
        </h1>
        <p
          style={{
            fontSize: "14.5px",
            color: "var(--text-muted)",
            marginTop: "5px",
          }}
        >
          Manage your vehicles, appointments, and orders.
        </p>
      </div>

      {/* 2x2 grid - full content width */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "25px",
          maxWidth: "860px",
        }}
      >
        {ACTIONS.map((a) => (
          <ActionCard key={a.path} {...a} />
        ))}
      </div>
    </div>
  );
}

export default function CustomerDashboard({ theme, toggleTheme }) {
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
        path="/appointments"
        element={
          <Page title="Appointments">
            <CustomerAppointments />
          </Page>
        }
      />
      <Route
        path="/part-requests"
        element={
          <Page title="Part Requests">
            <CustomerPartRequests />
          </Page>
        }
      />
      <Route
        path="/reviews"
        element={
          <Page title="Reviews">
            <CustomerReviews />
          </Page>
        }
      />
      <Route
        path="/orders"
        element={
          <Page title="My Orders">
            <Placeholder name="Order History" />
          </Page>
        }
      />
      <Route
        path="/vehicles"
        element={
          <Page title="My Vehicles">
            <MyVehicles />
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
