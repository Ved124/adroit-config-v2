import Head from "next/head";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px" }}>
      <Head>
        <title>Machine Manager</title>
      </Head>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "16px" }}>Machine Manager</h1>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>
        Models and Components/Addons managers are on their way — this dashboard is a placeholder until then.
      </p>
      <Link href="/admin/leads" style={{ color: "#2563eb", fontWeight: 600 }}>
        View Leads Dashboard →
      </Link>
    </div>
  );
}
