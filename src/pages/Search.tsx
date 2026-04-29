import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

interface Profile {
  id: string; name: string; gender: string; age: number;
  age_group: string; country_id: string; country_name: string;
}

export default function Search() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const doSearch = async (p = 1) => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/profiles/search", { params: { q: query, page: p, limit: 10 } });
      setResults(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.total_pages);
      setPage(p);
      setSearched(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Search failed");
      setResults([]);
    } finally { setLoading(false); }
  };

  const examples = ["young males from nigeria", "females above 30", "adult males from kenya", "seniors from ghana", "teenagers below 18"];

  return (
    <div style={S.page}>
      <aside style={S.sidebar}>
        <h2 style={S.logo}>Insighta+</h2>
        <nav style={S.nav}>
          <button style={S.navItem} onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button style={S.navItem} onClick={() => navigate("/profiles")}>Profiles</button>
          <button style={S.navItemActive}>Search</button>
          <button style={S.navItem} onClick={() => navigate("/account")}>Account</button>
        </nav>
        <button style={S.logoutBtn} onClick={logout}>Logout</button>
      </aside>
      <main style={S.main}>
        <h1 style={S.title}>Natural Language Search</h1>
        <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>
          Query profiles using plain English. No syntax required.
        </p>
        <div style={S.searchBar}>
          <input
            style={S.searchInput}
            placeholder='e.g. "young males from nigeria"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch(1)}
          />
          <button style={S.searchBtn} onClick={() => doSearch(1)} disabled={loading}>
            {loading ? "..." : "Search"}
          </button>
        </div>

        <div style={S.examples}>
          <span style={{ fontSize: 12, color: "#aaa", marginRight: 8 }}>Try:</span>
          {examples.map((ex) => (
            <button key={ex} style={S.exampleBtn} onClick={() => { setQuery(ex); doSearch(1); }}>
              {ex}
            </button>
          ))}
        </div>

        {error && <p style={{ color: "#e74c3c", marginTop: 16 }}>{error}</p>}

        {searched && !error && (
          <>
            <p style={{ color: "#888", fontSize: 13, margin: "16px 0 12px" }}>{total.toLocaleString()} results for "{query}"</p>
            {results.length === 0 ? (
              <p style={{ color: "#888" }}>No profiles matched your query.</p>
            ) : (
              <>
                <div style={S.tableWrap}>
                  <table style={S.table}>
                    <thead><tr>{["Name","Gender","Age","Age Group","Country"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {results.map(p => (
                        <tr key={p.id} style={S.tr} onClick={() => navigate(`/profiles/${p.id}`)}>
                          <td style={S.td}>{p.name}</td>
                          <td style={S.td}>{p.gender}</td>
                          <td style={S.td}>{p.age}</td>
                          <td style={S.td}>{p.age_group}</td>
                          <td style={S.td}>{p.country_name ?? p.country_id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={S.pagination}>
                  <button style={S.pageBtn} disabled={page === 1} onClick={() => doSearch(page - 1)}>← Prev</button>
                  <span style={{ color: "#888", fontSize: 13 }}>Page {page} of {totalPages}</span>
                  <button style={S.pageBtn} disabled={page >= totalPages} onClick={() => doSearch(page + 1)}>Next →</button>
                </div>
              </>
            )}
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
  title: { margin: "0 0 8px", fontSize: 26, color: "#1a1a2e" },
  searchBar: { display: "flex", gap: 12, marginBottom: 16 },
  searchInput: { flex: 1, padding: "12px 16px", borderRadius: 10, border: "1px solid #ddd", fontSize: 15, outline: "none" },
  searchBtn: { padding: "12px 28px", borderRadius: 10, background: "#6c63ff", color: "white", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  examples: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8, alignItems: "center" },
  exampleBtn: { padding: "4px 12px", borderRadius: 20, border: "1px solid #ddd", background: "white", fontSize: 12, color: "#666", cursor: "pointer" },
  tableWrap: { background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#888", borderBottom: "1px solid #f0f0f0", background: "#fafafa" },
  tr: { cursor: "pointer" },
  td: { padding: "14px 16px", fontSize: 14, color: "#333", borderBottom: "1px solid #f5f5f5" },
  pagination: { display: "flex", alignItems: "center", gap: 16, marginTop: 24, justifyContent: "center" },
  pageBtn: { padding: "8px 20px", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer", fontSize: 13 },
};
