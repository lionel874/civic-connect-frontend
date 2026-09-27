import AdminListPage from "../components/AdminListPage.jsx";

export default function AdminServices() {
  return (
    <AdminListPage
      activeKey="services"
      title="Services"
      subtitle="Liste de tous les services publiés sur la plateforme."
      fetchUrl="http://localhost:8000/services/?limit=50"
      getRowId={(item) => item.id}
      deleteUrl={(item) => `http://localhost:8000/services/${item.id}`}
      columns={[
        { key: "id", label: "ID" },
        { key: "nom_s", label: "Nom", render: (item) => item.nom_s ?? item.nom ?? "—" },
        { key: "categorie", label: "Catégorie" },
        { key: "prix", label: "Prix" },
        { key: "ville", label: "Ville" },
        { key: "quartier", label: "Quartier" },
      ]}
    />
  );
}
