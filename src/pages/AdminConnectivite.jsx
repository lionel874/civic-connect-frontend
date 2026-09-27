import AdminListPage from "../components/AdminListPage.jsx";

export default function AdminConnectivite() {
  return (
    <AdminListPage
      activeKey="connectivite"
      title="Points de connectivité"
      subtitle="Liste de tous les points de connectivité recensés."
      fetchUrl="http://localhost:8000/connectivite/?limit=50"
      getRowId={(item) => item.id}
      deleteUrl={(item) => `http://localhost:8000/connectivite/${item.id}`}
      columns={[
        { key: "id", label: "ID" },
        { key: "nom", label: "Nom" },
        { key: "qualite_reseau", label: "Qualité réseau" },
        { key: "horaires", label: "Horaires" },
        { key: "ville", label: "Ville" },
        { key: "quartier", label: "Quartier" },
      ]}
    />
  );
}
