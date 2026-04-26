import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// Every dashboard page uses this wrapper
export default function DashboardLayout({
  children,
  title,
  theme,
  toggleTheme,
}) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg)",
        transition: "background 0.2s",
      }}
    >
      <Sidebar />
      <div
        style={{
          marginLeft: 220,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Topbar title={title} theme={theme} toggleTheme={toggleTheme} />
        <main
          style={{
            flex: 1,
            padding: "28px 32px",
            background: "var(--bg)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
