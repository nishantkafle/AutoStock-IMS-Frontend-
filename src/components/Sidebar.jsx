import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Building2,
  ShoppingCart,
  Users,
  Car,
  Receipt,
  Calendar,
  Star,
  Inbox,
  BarChart2,
  UserCog,
  LogOut,
  User,
  FileText,
} from "lucide-react";
import Logo from "./Logo";

// Menu items per role
const menus = {
  Admin: [
    { label: "Overview", path: "/admin", icon: LayoutDashboard },
    { label: "Inventory", path: "/admin/inventory", icon: Package },
    { label: "Vendors", path: "/admin/vendors", icon: Building2 },
    {
      label: "Purchase Invoices",
      path: "/admin/purchase-invoices",
      icon: Receipt,
    },
    { label: "Sales & Invoices", path: "/admin/sales", icon: ShoppingCart },
    { label: "Customers", path: "/admin/customers", icon: Users },
    { label: "Vehicles", path: "/admin/vehicles", icon: Car },
    { label: "Appointments", path: "/admin/appointments", icon: Calendar },
    { label: "Part Requests", path: "/admin/part-requests", icon: Inbox },
    { label: "Reviews", path: "/admin/reviews", icon: Star },
    { label: "Staff & Roles", path: "/admin/staff", icon: UserCog },
    { label: "Financial Reports", path: "/admin/reports", icon: BarChart2 },
  ],

  Staff: [
    { label: "Overview", path: "/staff", icon: LayoutDashboard },
    { label: "Customer List", path: "/staff/customers", icon: Users },
    {
      label: "Register Customer",
      path: "/staff/register-customer",
      icon: User,
    },
    { label: "Vehicle Records", path: "/staff/vehicles", icon: Car },
    { label: "Sales & Invoices", path: "/staff/sales", icon: ShoppingCart },
    { label: "Appointments", path: "/staff/appointments", icon: Calendar },
    { label: "Part Requests", path: "/staff/part-requests", icon: Inbox },
    { label: "Customer Reports", path: "/staff/reports", icon: BarChart2 },
  ],

  Customer: [
    { label: "Dashboard", path: "/customer", icon: LayoutDashboard },
    { label: "Appointments", path: "/customer/appointments", icon: Calendar },
    { label: "Part Requests", path: "/customer/part-requests", icon: Inbox },
    { label: "Reviews", path: "/customer/reviews", icon: Star },
    { label: "My Orders", path: "/customer/orders", icon: FileText },
    { label: "My Vehicles", path: "/customer/vehicles", icon: Car },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const items = menus[user?.role] || [];
  const profilePath = `/${user?.role?.toLowerCase()}/profile`;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div
      style={{
        width: 220,
        minHeight: "100vh",
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        transition: "background 0.2s, border-color 0.2s",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "18px 18px 14px",
          borderBottom: "1px solid var(--sidebar-border)",
        }}
      >
        <Logo size="md" color="var(--sidebar-text)" />
        <div
          style={{
            fontSize: "10px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "var(--sidebar-muted)",
            marginTop: "3px",
            paddingLeft: "2px",
          }}
        >
          Parts Management
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
        {items.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 10px",
                marginBottom: "2px",
                borderRadius: "5px",
                fontSize: "14.2px",
                fontWeight: active ? 600 : 400,
                color: active
                  ? "var(--sidebar-active-text)"
                  : "var(--sidebar-text)",
                background: active ? "var(--sidebar-active-bg)" : "transparent",
                borderLeft: `2px solid ${active ? "var(--sidebar-active-bar)" : "transparent"}`,
                transition: "background 0.12s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!active)
                  e.currentTarget.style.background = "var(--sidebar-hover-bg)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Icon */}
              <Icon
                size={16}
                style={{ flexShrink: 0, opacity: active ? 1 : 0.75 }}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user info + profile + sign out */}
      <div
        style={{
          borderTop: "1px solid var(--sidebar-border)",
          padding: "12px 0 8px",
        }}
      >
        {/* User avatar + name + role */}
        <div
          style={{
            padding: "6px 18px 10px",
            display: "flex",
            alignItems: "center",
            gap: "9px",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              background: "var(--sidebar-active-bg)",
              border: "1px solid var(--sidebar-active-bar)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--sidebar-active-text)",
              fontSize: "11px",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--sidebar-text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.fullName}
            </div>
            <div style={{ fontSize: "11px", color: "var(--sidebar-muted)" }}>
              {user?.role}
            </div>
          </div>
        </div>

        {/* Profile link */}
        <button
          onClick={() => navigate(profilePath)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 12px",
            marginBottom: "2px",
            width: "100%",
            fontSize: "14.2px",
            fontWeight: location.pathname === profilePath ? 600 : 400,
            color:
              location.pathname === profilePath
                ? "var(--sidebar-active-text)"
                : "var(--sidebar-text)",
            background:
              location.pathname === profilePath
                ? "var(--sidebar-active-bg)"
                : "transparent",
            borderLeft: `2px solid ${location.pathname === profilePath ? "var(--sidebar-active-bar)" : "transparent"}`,
            borderRadius: "5px",
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--sidebar-hover-bg)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              location.pathname === profilePath
                ? "var(--sidebar-active-bg)"
                : "transparent")
          }
        >
          <User size={17} style={{ flexShrink: 0, opacity: 0.75 }} />
          Profile
        </button>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 12px",
            width: "100%",
            fontSize: "14.2px",
            color: "var(--error)",
            background: "transparent",
            borderRadius: "5px",
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--error-bg)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
