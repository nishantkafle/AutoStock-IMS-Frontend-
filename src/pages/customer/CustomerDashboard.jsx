import { Routes, Route } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import Placeholder from "../../components/Placeholder";
import Profile from "../profile/Profile";

function Overview() {
  const { user } = useAuth();

  // Quick action cards for things customers do most often
  const actions = [
    {
      label: "Book Appointment",
      desc: "Schedule a service visit for your vehicle",
      path: "/customer/appointments",
    },
    {
      label: "My Vehicles",
      desc: "View and manage your registered vehicles",
      path: "/customer/vehicles",
    },
    {
      label: "Part Requests",
      desc: "Request a part that is not currently in stock",
      path: "/customer/part-requests",
    },
    {
      label: "My Orders",
      desc: "View your full purchase history",
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
              cursor: "pointer",
              transition: "border-color 0.15s",
              textDecoration: "none",
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
                marginBottom: "6px",
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
            <Placeholder name="Book Appointment" />
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
            <Placeholder name="Leave a Review" />
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
            <Placeholder name="My Vehicles" />
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
