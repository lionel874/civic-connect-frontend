import AdminListPage from "../components/AdminListPage.jsx";

export default function AdminUtilisateurs() {
  return (
    <AdminListPage
      activeKey="utilisateurs"
      title="Utilisateurs"
      subtitle="Liste de tous les comptes inscrits sur la plateforme."
      fetchUrl="http://localhost:8000/users/"
      needsAuth
      getRowId={(item) => item.id}
      deleteUrl={(item) => `http://localhost:8000/users/${item.id}`}
      columns={[
        { key: "id", label: "ID" },
        { key: "nom", label: "Nom" },
        { key: "prenom", label: "Prénom" },
        { key: "email", label: "Email" },
        {
          key: "role",
          label: "Rôle",
          render: (item) => <span className="admin-role-pill">{item.role}</span>,
        },
      ]}
    />
  );
}
