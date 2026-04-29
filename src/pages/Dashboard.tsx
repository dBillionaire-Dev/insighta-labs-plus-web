import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";

interface Stats {
  total: number;
  male: number;
  female: number;
  countries: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [total, male, female] = await Promise.all([
          api.get("/api/profiles?limit=1"),
          api.get("/api/profiles?gender=male&limit=1"),
          api.get("/api/profiles?gender=female&limit=1"),
        ]);
        setStats({
          total: total.data.total,
          male: male.data.total,
          female: female.data.total,
          countries: 65,
        });
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Insighta+</h2>
        <nav style={styles.nav}>
          <button style={styles.navItemActive}>Dashboard</button>
          <button style={styles.navItem} onClick={() => navigate("/profiles")}>Profiles</button>
          <button style={styles.navItem} onClick={() => navigate("/search")}>Search</button>
          <button style={styles.navItem} onClick={() => navigate("/account")}>Account</button>
        </nav>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Welcome back, {user?.username}</h1>
            <p style={styles.subtitle}>Role: <strong>{user?.role}</strong></p>
          </div>
          {user?.avatar_url && (
            <img src={user.avatar_url} alt="avatar" style={styles.avatar} />
          )}
        </div>

        {loading ? (
          <p style={{ color: "#888" }}>Loading stats...</p>
        ) : (
          <div style={styles.statsGrid}>
            <StatCard label="Total Profiles" value={stats?.total ?? 0} color="#6c63ff" />
            <StatCard label="Male Profiles" value={stats?.male ?? 0} color="#3ecf8e" />
            <StatCard label="Female Profiles" value={stats?.female ?? 0} color="#f6a623" />
            <StatCard label="Countries" value={stats?.countries ?? 0} color="#e74c3c" />
          </div>
        )}

        <div>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionGrid}>
            <ActionCard title="Browse Profiles" desc="Filter, sort and paginate through all profiles" onClick={() => navigate("/profiles")} />
            <ActionCard title="Natural Language Search" desc='Try: "young males from nigeria"' onClick={() => navigate("/search")} />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
      <p style={styles.statValue}>{value.toLocaleString()}</p>
      <p style={styles.statLabel}>{label}</p>
    </div>
  );
}

function ActionCard({ title, desc, onClick }: { title: string; desc: string; onClick: () => void }) {
  return (
    <div style={styles.actionCard} onClick={onClick}>
      <h3 style={styles.actionTitle}>{title}</h3>
      <p style={styles.actionDesc}>{desc}</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: "flex", minHeight: "100vh", background: "#f4f6fb" },
  sidebar: { width: 220, background: "#1a1a2e", color: "white", display: "flex", flexDirection: "column", padding: "32px 16px" },
  logo: { margin: "0 0 40px 8px", fontSize: 22, fontWeight: 700, color: "#6c63ff" },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navItem: { background: "none", border: "none", color: "#aaa", textAlign: "left", padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14 },
  navItemActive: { background: "#6c63ff22", border: "none", color: "white", textAlign: "left", padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 },
  logoutBtn: { background: "none", border: "1px solid #444", color: "#aaa", padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, marginTop: 16 },
  main: { flex: 1, padding: "40px 48px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 },
  title: { margin: 0, fontSize: 26, color: "#1a1a2e" },
  subtitle: { margin: "4px 0 0", color: "#888", fontSize: 14 },
  avatar: { width: 48, height: 48, borderRadius: "50%", border: "2px solid #6c63ff" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 48 },
  statCard: { background: "white", borderRadius: 12, padding: "24px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  statValue: { margin: "0 0 4px", fontSize: 32, fontWeight: 700, color: "#1a1a2e" },
  statLabel: { margin: 0, color: "#888", fontSize: 13 },
  sectionTitle: { margin: "0 0 20px", fontSize: 18, color: "#1a1a2e" },
  actionGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 },
  actionCard: { background: "white", borderRadius: 12, padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer" },
  actionTitle: { margin: "0 0 8px", fontSize: 16, color: "#1a1a2e" },
  actionDesc: { margin: 0, color: "#888", fontSize: 13 },
};
