import AdminListPage from "../components/AdminListPage.jsx";

export default function AdminSignalements() {
  return (
    <AdminListPage
      activeKey="signalements"
      title="Signalements"
      subtitle="Liste de tous les signalements remontés par les utilisateurs."
      fetchUrl="http://localhost:8000/reports/?limit=50"
      getRowId={(item) => item.id}
      deleteUrl={(item) => `http://localhost:8000/reports/${item.id}`}
      columns={[
        { key: "id", label: "ID" },
        { key: "titre", label: "Titre" },
        { key: "description", label: "Description" },
        { key: "ville", label: "Ville" },
        { key: "quartier", label: "Quartier" },
        {
          key: "statut",
          label: "Statut",
          render: (item) => item.statut ?? "En cours",
        },
      ]}
    />
  );
}
