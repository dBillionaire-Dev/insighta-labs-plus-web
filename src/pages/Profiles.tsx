import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

interface Profile {
  id: string; name: string; gender: string; age: number;
  age_group: string; country_id: string; country_name: string; gender_probability: number;
}

export default function Profiles() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ gender: "", country_id: "", age_group: "", min_age: "", max_age: "", sort_by: "created_at", order: "desc" });

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit: 10 };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const res = await api.get("/api/profiles", { params });
      setProfiles(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.total_pages);
    } catch (err: any) {
      if (err.response?.status === 401) navigate("/login");
    } finally { setLoading(false); }
  }, [page, filters, navigate]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  const set = (k: string, v: string) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); };

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
        <h1 style={S.title}>Profiles</h1>
        <div style={S.filterBar}>
          <select style={S.select} value={filters.gender} onChange={(e) => set("gender", e.target.value)}>
            <option value="">All Genders</option><option value="male">Male</option><option value="female">Female</option>
          </select>
          <select style={S.select} value={filters.age_group} onChange={(e) => set("age_group", e.target.value)}>
            <option value="">All Groups</option><option value="child">Child</option><option value="teenager">Teenager</option><option value="adult">Adult</option><option value="senior">Senior</option>
          </select>
          <input style={S.input} placeholder="Country (e.g. NG)" value={filters.country_id} onChange={(e) => set("country_id", e.target.value)} />
          <input style={S.input} placeholder="Min Age" type="number" value={filters.min_age} onChange={(e) => set("min_age", e.target.value)} />
          <input style={S.input} placeholder="Max Age" type="number" value={filters.max_age} onChange={(e) => set("max_age", e.target.value)} />
          <select style={S.select} value={filters.sort_by} onChange={(e) => set("sort_by", e.target.value)}>
            <option value="created_at">Sort: Date</option><option value="age">Sort: Age</option><option value="gender_probability">Sort: Confidence</option>
          </select>
          <select style={S.select} value={filters.order} onChange={(e) => set("order", e.target.value)}>
            <option value="desc">Desc</option><option value="asc">Asc</option>
          </select>
          <a href={`${import.meta.env.VITE_API_URL}/api/profiles/export`} style={S.exportBtn}>Export CSV</a>
        </div>
        {loading ? <p style={{ color: "#888" }}>Loading...</p> : (
          <>
            <p style={{ color: "#888", fontSize: 13, margin: "0 0 12px" }}>{total.toLocaleString()} profiles found</p>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead><tr>{["Name","Gender","Age","Age Group","Country","Confidence"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {profiles.map(p => (
                    <tr key={p.id} style={S.tr} onClick={() => navigate(`/profiles/${p.id}`)}>
                      <td style={S.td}>{p.name}</td>
                      <td style={S.td}>{p.gender}</td>
                      <td style={S.td}>{p.age}</td>
                      <td style={S.td}>{p.age_group}</td>
                      <td style={S.td}>{p.country_name ?? p.country_id}</td>
                      <td style={S.td}>{(p.gender_probability * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={S.pagination}>
              <button style={S.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ color: "#888", fontSize: 13 }}>Page {page} of {totalPages}</span>
              <button style={S.pageBtn} disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          </>
        )}
      </main>
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
  filterBar: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  select: { padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, background: "white" },
  input: { padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, width: 110 },
  exportBtn: { padding: "8px 16px", borderRadius: 8, background: "#6c63ff", color: "white", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center" },
  tableWrap: { background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#888", borderBottom: "1px solid #f0f0f0", background: "#fafafa" },
  tr: { cursor: "pointer" },
  td: { padding: "14px 16px", fontSize: 14, color: "#333", borderBottom: "1px solid #f5f5f5" },
  pagination: { display: "flex", alignItems: "center", gap: 16, marginTop: 24, justifyContent: "center" },
  pageBtn: { padding: "8px 20px", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer", fontSize: 13 },
};
