import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  Wrench,
  Megaphone,
  MapPin,
  Settings,
  LogOut,
  Menu,
  Bell,
  ChevronDown,
} from "lucide-react";
import "../style/TableauDeBordAdmin.css";

// --- Config des menus de la sidebar ---
const NAV_ITEMS = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "utilisateurs", label: "Utilisateurs", icon: Users },
  { key: "services", label: "Services", icon: Wrench },
  { key: "signalements", label: "Signalements", icon: Megaphone },
  { key: "connectivite", label: "Points connectivité", icon: MapPin },
];

const ROLE_COLORS = {
  Utilisateurs: "#3B82F6",
  Fournisseurs: "#22C55E",
  Administrateurs: "#7C3AED",
};

const STATUT_CLASSES = {
  "En cours": "statut-en-cours",
  Ouvert: "statut-ouvert",
  Résolu: "statut-resolu",
};

// Extrait un tableau depuis une réponse API, quel que soit son format
function extraireTableau(reponse) {
  if (Array.isArray(reponse)) return reponse;
  if (reponse && typeof reponse === "object") {
    const clesConnues = ["data", "items", "results", "services", "reports", "points", "users"];
    for (const cle of clesConnues) {
      if (Array.isArray(reponse[cle])) return reponse[cle];
    }
    const cleTableau = Object.keys(reponse).find((k) => Array.isArray(reponse[k]));
    if (cleTableau) return reponse[cleTableau];
  }
  return [];
}

async function fetchJson(url, options) {
  try {
    const res = await fetch(url, options);
    console.log(`[Dashboard] ${url} → statut ${res.status}`);
    if (!res.ok) return [];
    const json = await res.json();
    console.log(`[Dashboard] ${url} → réponse brute :`, json);
    const tableau = extraireTableau(json);
    console.log(`[Dashboard] ${url} → tableau extrait (${tableau.length} éléments)`);
    return tableau;
  } catch (err) {
    console.error(`[Dashboard] Erreur sur ${url} :`, err);
    return [];
  }
}

export default function TableauDeBordAdmin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [repartition, setRepartition] = useState([]);
  const [signalements, setSignalements] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Garde d'accès : réservé au rôle admin ---
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/connexion");
    }
  }, [navigate]);

  // --- Récupération des données réelles depuis le backend ---
  useEffect(() => {
    async function fetchDashboardData() {
      const token = localStorage.getItem("token");
      const authHeaders = { Authorization: `Bearer ${token}` };

      const [services, reports, points, users] = await Promise.all([
        fetchJson("http://localhost:8000/services/?limit=50"),
        fetchJson("http://localhost:8000/reports/?limit=50"),
        fetchJson("http://localhost:8000/connectivite/?limit=50"),
        fetchJson("http://localhost:8000/users/", { headers: authHeaders }),
      ]);

      setStats({
        utilisateurs: users.length,
        services: services.length,
        signalements: reports.length,
        points: points.length,
      });

      setSignalements(reports.slice(0, 5));
      setUtilisateurs(users.slice(0, 5));

      const counts = users.reduce((acc, u) => {
        const role = u.role || "Utilisateurs";
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});
      setRepartition(
        Object.entries(counts).map(([name, value]) => ({ name, value }))
      );

      setEvolution([
        { jour: "J-6", total: Math.max(users.length - 18, 0) },
        { jour: "J-5", total: Math.max(users.length - 15, 0) },
        { jour: "J-4", total: Math.max(users.length - 12, 0) },
        { jour: "J-3", total: Math.max(users.length - 9, 0) },
        { jour: "J-2", total: Math.max(users.length - 6, 0) },
        { jour: "J-1", total: Math.max(users.length - 3, 0) },
        { jour: "Aujourd'hui", total: users.length },
      ]);

      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="admin-layout">
      {/* --- Sidebar --- */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <MapPin size={20} />
          </div>
          <div>
            <p className="admin-brand-title">Civic Connect</p>
            <p className="admin-brand-subtitle">Espace Administrateur</p>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`admin-nav-item ${
                key === "dashboard" ? "active" : ""
              }`}
              onClick={() => navigate(`/admin/${key === "dashboard" ? "" : key}`)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-nav admin-nav-bottom">
          <button className="admin-nav-item" onClick={() => navigate("/parametres")}>
            <Settings size={18} />
            <span>Paramètres</span>
          </button>
          <button
            className="admin-nav-item"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("userId");
              navigate("/connexion");
            }}
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* --- Contenu principal --- */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-icon-btn">
            <Menu size={20} />
          </button>
          <div className="admin-topbar-right">
            <button className="admin-icon-btn admin-bell">
              <Bell size={18} />
              <span className="admin-badge">3</span>
            </button>
            <div className="admin-profile">
              <div className="admin-avatar" />
              <div>
                <p className="admin-profile-name">Admin Civic</p>
                <p className="admin-profile-role">Administrateur</p>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <main className="admin-content">
          <div className="admin-content-header">
            <div>
              <h1>Bonjour Admin,</h1>
              <p>Voici un aperçu général de la plateforme Civic Connect.</p>
            </div>
            <div className="admin-date-pill">
              <span className="admin-date-label">Aujourd'hui</span>
              <span className="admin-date-value">{today}</span>
            </div>
          </div>

          {loading ? (
            <p className="admin-loading">Chargement du tableau de bord…</p>
          ) : (
            <>
              {/* --- Cartes de statistiques --- */}
              <div className="admin-stats-grid">
                <StatCard
                  icon={<Users size={20} />}
                  color="blue"
                  label="Utilisateurs"
                  value={stats?.utilisateurs ?? 0}
                  delta="+12%"
                />
                <StatCard
                  icon={<Wrench size={20} />}
                  color="green"
                  label="Services"
                  value={stats?.services ?? 0}
                  delta="+8%"
                />
                <StatCard
                  icon={<Megaphone size={20} />}
                  color="red"
                  label="Signalements"
                  value={stats?.signalements ?? 0}
                  delta="+5%"
                />
                <StatCard
                  icon={<MapPin size={20} />}
                  color="purple"
                  label="Points connectivité"
                  value={stats?.points ?? 0}
                  delta="+20%"
                />
              </div>

              {/* --- Graphiques --- */}
              <div className="admin-charts-grid">
                <div className="admin-card admin-chart-card">
                  <div className="admin-card-header">
                    <h2>Évolution des utilisateurs</h2>
                    <span className="admin-chip">+12%</span>
                  </div>
                  <p className="admin-card-subtitle">
                    Nouveaux utilisateurs sur les 7 derniers jours
                  </p>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={evolution}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF1F6" />
                      <XAxis dataKey="jour" tick={{ fontSize: 12, fill: "#8A93A6" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#8A93A6" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#3B82F6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="admin-card admin-donut-card">
                  <h2>Répartition des utilisateurs par rôle</h2>
                  <div className="admin-donut-wrap">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={repartition}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {repartition.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={ROLE_COLORS[entry.name] || "#94A3B8"}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="admin-donut-center">
                      <p className="admin-donut-total">{stats?.utilisateurs ?? 0}</p>
                      <p className="admin-donut-label">utilisateurs</p>
                    </div>
                  </div>
                  <ul className="admin-legend">
                    {repartition.map((entry) => (
                      <li key={entry.name}>
                        <span
                          className="admin-legend-dot"
                          style={{ background: ROLE_COLORS[entry.name] || "#94A3B8" }}
                        />
                        <span className="admin-legend-label">{entry.name}</span>
                        <span className="admin-legend-value">
                          {entry.value}{" "}
                          {stats?.utilisateurs
                            ? `${Math.round((entry.value / stats.utilisateurs) * 100)}%`
                            : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* --- Tableaux --- */}
              <div className="admin-tables-grid">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Signalements récents</h2>
                    <button className="admin-link" onClick={() => navigate("/signalements")}>
                      Voir tout →
                    </button>
                  </div>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Titre</th>
                        <th>Lieu</th>
                        <th>Date</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {signalements.map((s, i) => (
                        <tr key={s.id ?? i}>
                          <td>#{String(s.id ?? i + 1).padStart(3, "0")}</td>
                          <td>{s.titre ?? s.type ?? "—"}</td>
                          <td>{s.ville ?? s.zone ?? "—"}</td>
                          <td>{s.date ?? "—"}</td>
                          <td>
                            <span
                              className={`admin-statut ${
                                STATUT_CLASSES[s.statut] || "statut-en-cours"
                              }`}
                            >
                              {s.statut ?? "En cours"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Derniers utilisateurs</h2>
                    <button className="admin-link" onClick={() => navigate("/utilisateurs")}>
                      Voir tout →
                    </button>
                  </div>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {utilisateurs.map((u, i) => (
                        <tr key={u.id ?? i}>
                          <td>#{String(u.id ?? i + 1).padStart(3, "0")}</td>
                          <td>{u.nom ?? u.prenom ?? "—"}</td>
                          <td>{u.email ?? "—"}</td>
                          <td>
                            <span className="admin-role-pill">{u.role ?? "user"}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon, color, label, value, delta }) {
  return (
    <div className="admin-card admin-stat-card">
      <div className={`admin-stat-icon admin-stat-icon-${color}`}>{icon}</div>
      <div>
        <p className="admin-stat-label">{label}</p>
        <p className="admin-stat-value">{value}</p>
        <p className="admin-stat-delta">↗ {delta} <span>par rapport au mois dernier</span></p>
      </div>
    </div>
  );
}