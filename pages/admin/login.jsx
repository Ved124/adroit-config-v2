import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      const redirectTo = typeof router.query.next === "string" ? router.query.next : "/admin";
      router.push(redirectTo);
    } catch (err) {
      setError("Network error — please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a" }}>
      <Head>
        <title>Machine Manager — Login</title>
      </Head>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#1e293b", padding: "40px", borderRadius: "16px",
          width: "100%", maxWidth: "360px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        }}
      >
        <h1 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>Machine Manager</h1>
        <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "24px" }}>Enter the admin password to continue.</p>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            width: "100%", boxSizing: "border-box", padding: "10px 14px",
            borderRadius: "8px", border: "1px solid #334155", background: "#0f172a",
            color: "#fff", fontSize: "14px", marginBottom: "12px",
          }}
        />

        {error && (
          <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "12px" }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: "8px", border: "none",
            background: loading || !password ? "#334155" : "#2563eb", color: "#fff",
            fontWeight: 700, fontSize: "14px", cursor: loading || !password ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <Link
          href="/customer"
          style={{
            display: "block", textAlign: "center", marginTop: "16px",
            color: "#94a3b8", fontSize: "13px", textDecoration: "none",
          }}
        >
          ← Back to Configurator
        </Link>
      </form>
    </div>
  );
}
