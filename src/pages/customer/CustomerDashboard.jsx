import { Routes, Route } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import Placeholder from "../../components/Placeholder";
import Profile from "../profile/Profile";
import MyVehicles from "./MyVehicles";
import CustomerAppointments from "./CustomerAppointments";
import CustomerPartRequests from "./CustomerPartRequests";
import CustomerReviews from "./CustomerReviews";

// Quick action tiles on the dashboard home
function Overview() {
  const { user } = useAuth();

  const actions = [
    {
      label: "Book Appointment",
      desc: "Schedule a service visit",
      path: "/customer/appointments",
    },
    {
      label: "My Vehicles",
      desc: "View and manage your vehicles",
      path: "/customer/vehicles",
    },
    {
      label: "Request a Part",
      desc: "Request a part not in stock",
      path: "/customer/part-requests",
    },
    {
      label: "My Orders",
      desc: "View your purchase history",
      path: "/customer/orders",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}
        >
          Welcome, {user?.fullName}
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          Manage your vehicles, appointments, and orders.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "14px",
        }}
      >
        {actions.map((a, i) => (
          <a
            key={i}
            href={a.path}
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "6px",
              padding: "22px",
              display: "block",
              textDecoration: "none",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--border-strong)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "var(--card-border)")
            }
          >
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: "5px",
              }}
            >
              {a.label}
            </div>
            <div style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>
              {a.desc}
            </div>
          </a>
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
