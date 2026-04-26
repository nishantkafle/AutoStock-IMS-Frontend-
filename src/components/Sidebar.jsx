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

// Menu structure per role with section groupings
const menus = {
  Admin: [
    {
      section: "WORKSPACE",
      items: [
        { label: "Overview", path: "/admin", icon: LayoutDashboard },
        { label: "Inventory", path: "/admin/inventory", icon: Package },
        { label: "Vendors", path: "/admin/vendors", icon: Building2 },
        {
          label: "Purchase Invoices",
          path: "/admin/purchase-invoices",
          icon: Receipt,
        },
      ],
    },
    {
      section: "COMMERCE",
      items: [
        { label: "Sales & Invoices", path: "/admin/sales", icon: ShoppingCart },
        { label: "Customers", path: "/admin/customers", icon: Users },
        { label: "Vehicles", path: "/admin/vehicles", icon: Car },
        { label: "Appointments", path: "/admin/appointments", icon: Calendar },
        { label: "Part Requests", path: "/admin/part-requests", icon: Inbox },
        { label: "Reviews", path: "/admin/reviews", icon: Star },
      ],
    },
    {
      section: "MANAGEMENT",
      items: [
        { label: "Staff & Roles", path: "/admin/staff", icon: UserCog },
        { label: "Financial Reports", path: "/admin/reports", icon: BarChart2 },
      ],
    },
  ],

  Staff: [
    {
      section: "WORKSPACE",
      items: [{ label: "Overview", path: "/staff", icon: LayoutDashboard }],
    },
    {
      section: "CUSTOMERS",
      items: [
        { label: "Customer List", path: "/staff/customers", icon: Users },
        {
          label: "Register Customer",
          path: "/staff/register-customer",
          icon: User,
        },
        { label: "Vehicle Records", path: "/staff/vehicles", icon: Car },
      ],
    },
    {
      section: "SALES",
      items: [
        { label: "Sales & Invoices", path: "/staff/sales", icon: ShoppingCart },
        { label: "Appointments", path: "/staff/appointments", icon: Calendar },
        { label: "Part Requests", path: "/staff/part-requests", icon: Inbox },
      ],
    },
    {
      section: "REPORTS",
      items: [
        { label: "Customer Reports", path: "/staff/reports", icon: BarChart2 },
      ],
    },
  ],

  Customer: [
    {
      section: "MY ACCOUNT",
      items: [{ label: "Dashboard", path: "/customer", icon: LayoutDashboard }],
    },
    {
      section: "SERVICES",
      items: [
        {
          label: "Appointments",
          path: "/customer/appointments",
          icon: Calendar,
        },
        {
          label: "Part Requests",
          path: "/customer/part-requests",
          icon: Inbox,
        },
        { label: "Reviews", path: "/customer/reviews", icon: Star },
      ],
    },
    {
      section: "HISTORY",
      items: [
        { label: "My Orders", path: "/customer/orders", icon: FileText },
        { label: "My Vehicles", path: "/customer/vehicles", icon: Car },
      ],
    },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const sections = menus[user?.role] || [];

  const profilePath = `/${user?.role?.toLowerCase()}/profile`;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isActive = (path) => {
    if (
      path.endsWith(
        user?.role?.toLowerCase() === "admin"
          ? "/admin"
          : path.split("/").slice(0, -1).join("/") + "",
      )
    ) {
      return location.pathname === path;
    }
    return location.pathname === path;
  };

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

      {/* Nav sections */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
        {sections.map((sec) => (
          <div key={sec.section} style={{ marginBottom: "4px" }}>
            {/* Section label */}
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: "var(--sidebar-section)",
                padding: "10px 18px 4px",
              }}
            >
              {sec.section}
            </div>

            {sec.items.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    padding: "7px 18px",
                    fontSize: "13.5px",
                    color: active
                      ? "var(--sidebar-active-text)"
                      : "var(--sidebar-text)",
                    background: active
                      ? "var(--sidebar-active-bg)"
                      : "transparent",
                    borderLeft: `2px solid ${active ? "var(--sidebar-active-bar)" : "transparent"}`,
                    transition: "background 0.12s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      e.currentTarget.style.background =
                        "var(--sidebar-hover-bg)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom - user info + profile + signout */}
      <div
        style={{
          borderTop: "1px solid var(--sidebar-border)",
          padding: "12px 0 8px",
        }}
      >
        {/* User info - compact */}
        <div
          style={{
            padding: "6px 18px 10px",
            display: "flex",
            alignItems: "center",
            gap: "9px",
          }}
        >
          {/* Avatar initial */}
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
                fontSize: "12.5px",
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
            gap: "9px",
            padding: "7px 18px",
            width: "100%",
            fontSize: "13px",
            color:
              location.pathname === profilePath
                ? "var(--sidebar-active-text)"
                : "var(--sidebar-text)",
            background:
              location.pathname === profilePath
                ? "var(--sidebar-active-bg)"
                : "transparent",
            borderLeft: `2px solid ${location.pathname === profilePath ? "var(--sidebar-active-bar)" : "transparent"}`,
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
          <User size={15} />
          Profile
        </button>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "7px 18px",
            width: "100%",
            fontSize: "13px",
            color: "var(--error)",
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--error-bg)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
