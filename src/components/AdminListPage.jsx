import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wrench,
  Megaphone,
  MapPin,
  Settings,
  LogOut,
  Menu,
  Trash2,
} from "lucide-react";
import "../style/TableauDeBordAdmin.css";

const NAV_ITEMS = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, path: "/admin" },
  { key: "utilisateurs", label: "Utilisateurs", icon: Users, path: "/admin/utilisateurs" },
  { key: "services", label: "Services", icon: Wrench, path: "/admin/services" },
  { key: "signalements", label: "Signalements", icon: Megaphone, path: "/admin/signalements" },
  { key: "connectivite", label: "Points connectivité", icon: MapPin, path: "/admin/connectivite" },
];

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

/**
 * Page liste admin générique.
 *
 * Props :
 * - activeKey : clé du menu actif ("utilisateurs" | "services" | "signalements" | "connectivite")
 * - title, subtitle : titres affichés en haut de page
 * - fetchUrl : URL de l'API à appeler pour lister les données
 * - needsAuth : true si la route exige le token admin (ex: /users/)
 * - columns : [{ key, label, render?(item) }] — définit les colonnes du tableau
 * - deleteUrl(item) : optionnel, fonction retournant l'URL DELETE pour une ligne
 * - getRowId(item) : optionnel, retourne l'id d'une ligne (défaut : item.id)
 */
export default function AdminListPage({
  activeKey,
  title,
  subtitle,
  fetchUrl,
  needsAuth = false,
  columns,
  deleteUrl,
  getRowId = (item) => item.id,
}) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/connexion");
    }
  }, [navigate]);

  async function charger() {
    setLoading(true);
    setErreur("");
    try {
      const token = localStorage.getItem("token");
      const headers = needsAuth ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(fetchUrl, { headers });
      if (!res.ok) {
        setErreur(`Erreur ${res.status} lors du chargement`);
        setItems([]);
        return;
      }
      const json = await res.json();
      setItems(extraireTableau(json));
    } catch (err) {
      setErreur("Impossible de contacter le serveur");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUrl]);

  async function handleDelete(item) {
    if (!deleteUrl) return;
    const confirmation = window.confirm("Confirmer la suppression de cet élément ?");
    if (!confirmation) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(deleteUrl(item), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => getRowId(i) !== getRowId(item)));
      } else {
        alert(`Échec de la suppression (erreur ${res.status})`);
      }
    } catch {
      alert("Impossible de contacter le serveur");
    }
  }

  return (
    <div className="admin-layout">
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
          {NAV_ITEMS.map(({ key, label, icon: Icon, path }) => (
            <button
              key={key}
              className={`admin-nav-item ${key === activeKey ? "active" : ""}`}
              onClick={() => navigate(path)}
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

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-icon-btn">
            <Menu size={20} />
          </button>
        </header>

        <main className="admin-content">
          <div className="admin-content-header">
            <div>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
          </div>

          <div className="admin-card">
            {loading ? (
              <p className="admin-loading">Chargement…</p>
            ) : erreur ? (
              <p className="admin-loading">{erreur}</p>
            ) : items.length === 0 ? (
              <p className="admin-loading">Aucun élément trouvé.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                    {deleteUrl && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={getRowId(item) ?? i}>
                      {columns.map((col) => (
                        <td key={col.key}>
                          {col.render ? col.render(item) : item[col.key] ?? "—"}
                        </td>
                      ))}
                      {deleteUrl && (
                        <td>
                          <button
                            className="admin-icon-btn"
                            title="Supprimer"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 size={16} color="#DC2626" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
