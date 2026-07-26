// components/admin/AdminLayout.jsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const NAV = [
  { href: "/admin", label: "🏠 Hub", exact: true },
  { href: "/admin/models", label: "🏭 Machine Models" },
  { href: "/admin/components", label: "🔧 Components & Addons" },
];

export default function AdminLayout({ children, title }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: "#f1f5f9" }}>
      <aside
        style={{
          width: "220px", minHeight: "100vh", background: "linear-gradient(160deg,#0f172a 0%,#1e293b 100%)",
          padding: "24px 0", flexShrink: 0, display: "flex", flexDirection: "column", position: "sticky", top: 0,
        }}
      >
        <div style={{ padding: "0 20px 20px", borderBottom: "1px solid #334155" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
            Adroit Admin
          </div>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>Machine Manager</div>
        </div>
        <nav style={{ padding: "12px 10px", flex: 1 }}>
          {NAV.map(({ href, label, exact }) => {
            const isActive = exact ? router.pathname === href : router.pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "block", padding: "9px 12px", borderRadius: "8px",
                  marginBottom: "2px", textDecoration: "none", fontSize: "13px", fontWeight: isActive ? "700" : "500",
                  color: isActive ? "#f8fafc" : "#94a3b8",
                  background: isActive ? "rgba(99,102,241,0.25)" : "transparent",
                  borderLeft: isActive ? "3px solid #6366f1" : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "12px 20px", borderTop: "1px solid #334155", display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link href="/customer" style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>←</span> Configurator
          </Link>
          <Link href="/admin/leads" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>←</span> Leads Dashboard
          </Link>
          <button
            onClick={handleLogout}
            style={{
              fontSize: "13px", color: "#ef4444", background: "none", border: "none", padding: 0,
              textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
              marginTop: "8px", fontWeight: "600",
            }}
          >
            <span>🚪</span> Secure Logout
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "32px", maxWidth: "1200px" }}>
        {title && (
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 24px", letterSpacing: "-0.02em" }}>
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
