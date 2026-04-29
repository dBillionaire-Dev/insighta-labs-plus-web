import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={S.page}>
      <aside style={S.sidebar}>
        <h2 style={S.logo}>Insighta+</h2>
        <nav style={S.nav}>
          <button style={S.navItem} onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button style={S.navItem} onClick={() => navigate("/profiles")}>Profiles</button>
          <button style={S.navItem} onClick={() => navigate("/search")}>Search</button>
          <button style={S.navItemActive}>Account</button>
        </nav>
        <button style={S.logoutBtn} onClick={logout}>Logout</button>
      </aside>
      <main style={S.main}>
        <h1 style={S.title}>Account</h1>
        <div style={S.card}>
          {user?.avatar_url && <img src={user.avatar_url} alt="avatar" style={S.avatar} />}
          <h2 style={S.username}>{user?.username}</h2>
          <span style={{ ...S.badge, background: user?.role === "admin" ? "#6c63ff" : "#3ecf8e" }}>
            {user?.role}
          </span>
          <div style={S.fields}>
            <Field label="Email" value={user?.email ?? "Not provided"} />
            <Field label="User ID" value={user?.id ?? ""} />
            <Field label="Last Login" value={user?.last_login_at ? new Date(user.last_login_at).toLocaleString() : "—"} />
          </div>
          <button style={S.logoutFull} onClick={logout}>Sign Out</button>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ margin: "0 0 2px", fontSize: 12, color: "#aaa", textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
      <p style={{ margin: 0, fontSize: 15, color: "#333" }}>{value}</p>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: { display: "flex", minHeight: "100vh", background: "#f4f6fb" },
  sidebar: { width: 220, background: "#1a1a2e", display: "flex", flexDirection: "column", padding: "32px 16px" },
  logo: { margin: "0 0 40px 8px", fontSize: 22, fontWeight: 700, color: "#6c63ff" },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navItem: { background: "none", border: "none", color: "#aaa", textAlign: "left", padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14 },
  navItemActive: { background: "#6c63ff22", border: "none", color: "white", textAlign: "left", padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 },
  logoutBtn: { background: "none", border: "1px solid #444", color: "#aaa", padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, marginTop: 16 },
  main: { flex: 1, padding: "40px 48px" },
  title: { margin: "0 0 24px", fontSize: 26, color: "#1a1a2e" },
  card: { background: "white", borderRadius: 16, padding: "40px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", maxWidth: 480, textAlign: "center" },
  avatar: { width: 80, height: 80, borderRadius: "50%", border: "3px solid #6c63ff", marginBottom: 16 },
  username: { margin: "0 0 8px", fontSize: 22, color: "#1a1a2e" },
  badge: { display: "inline-block", padding: "4px 14px", borderRadius: 20, color: "white", fontSize: 12, fontWeight: 600, marginBottom: 32 },
  fields: { textAlign: "left", borderTop: "1px solid #f0f0f0", paddingTop: 24, marginBottom: 32 },
  logoutFull: { padding: "12px 32px", borderRadius: 8, background: "#e74c3c", color: "white", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600 },
};
