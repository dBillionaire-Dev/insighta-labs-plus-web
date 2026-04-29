import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

export default function ProfileDetail() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get(`/api/profiles/${id}`)
      .then(res => setProfile(res.data.data))
      .catch(() => navigate("/profiles"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!confirm("Delete this profile? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/api/profiles/${id}`);
      navigate("/profiles");
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
      setDeleting(false);
    }
  };

  if (loading) return <div style={{ padding: 40, color: "#888" }}>Loading...</div>;
  if (!profile) return null;

  return (
    <div style={S.page}>
      <aside style={S.sidebar}>
        <h2 style={S.logo}>Insighta+</h2>
        <nav style={S.nav}>
          <button style={S.navItem} onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button style={S.navItemActive}>Profiles</button>
          <button style={S.navItem} onClick={() => navigate("/search")}>Search</button>
          <button style={S.navItem} onClick={() => navigate("/account")}>Account</button>
        </nav>
        <button style={S.logoutBtn} onClick={logout}>Logout</button>
      </aside>
      <main style={S.main}>
        <button style={S.back} onClick={() => navigate("/profiles")}>← Back to Profiles</button>
        <div style={S.card}>
          <h1 style={S.name}>{profile.name}</h1>
          <p style={S.id}>ID: {profile.id}</p>
          <div style={S.grid}>
            <Field label="Gender" value={`${profile.gender} (${(profile.gender_probability * 100).toFixed(0)}% confidence)`} />
            <Field label="Age" value={`${profile.age} years old`} />
            <Field label="Age Group" value={profile.age_group} />
            <Field label="Country" value={`${profile.country_name ?? profile.country_id} (${profile.country_id})`} />
            <Field label="Country Probability" value={`${(profile.country_probability * 100).toFixed(0)}%`} />
            <Field label="Created" value={new Date(profile.created_at).toLocaleString()} />
          </div>
          {user?.role === "admin" && (
            <button style={S.deleteBtn} onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete Profile"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ margin: "0 0 4px", fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
      <p style={{ margin: 0, fontSize: 16, color: "#1a1a2e", fontWeight: 500 }}>{value}</p>
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
  back: { background: "none", border: "none", color: "#6c63ff", cursor: "pointer", fontSize: 14, marginBottom: 24, padding: 0 },
  card: { background: "white", borderRadius: 16, padding: "40px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", maxWidth: 600 },
  name: { margin: "0 0 4px", fontSize: 28, color: "#1a1a2e" },
  id: { margin: "0 0 32px", fontSize: 12, color: "#aaa" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" },
  deleteBtn: { marginTop: 32, padding: "10px 24px", borderRadius: 8, background: "#e74c3c", color: "white", border: "none", cursor: "pointer", fontSize: 14 },
};
