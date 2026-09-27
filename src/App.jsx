import { Routes, Route } from 'react-router-dom'
import Accueil from './pages/Accueil.jsx'
import Connexion from './pages/Connexion.jsx'
import Inscription from './pages/Inscription.jsx'
import Recherche from './pages/Recherche.jsx'
import DetailService from './pages/DetailService.jsx'
import Signalement from './pages/Signalement.jsx'
import Connectivite from './pages/Connectivite.jsx'
import TableauDeBord from './pages/TableauDeBord.jsx'
import Publier from './pages/Publier.jsx'
import TableauDeBordAdmin from "./pages/TableauDeBordAdmin.jsx";
import AdminUtilisateurs from "./pages/AdminUtilisateurs.jsx";
import AdminServices from "./pages/AdminServices.jsx";
import AdminSignalements from "./pages/AdminSignalements.jsx";
import AdminConnectivite from "./pages/AdminConnectivite.jsx";
import Commander from "./pages/Commander.jsx";
import MesCommandes from "./pages/MesCommandes.jsx";
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/recherche" element={<Recherche />} />
      <Route path="/service/:id" element={<DetailService />} />
      <Route path="/signalement" element={<Signalement />} />
      <Route path="/tableau-de-bord" element={<TableauDeBord />} />
      <Route path="/publier" element={<Publier />} />
      <Route path="/connectivite" element={<Connectivite />} />
      <Route path="/admin" element={<TableauDeBordAdmin />} />
      <Route path="/admin/utilisateurs" element={<AdminUtilisateurs />} />
      <Route path="/admin/services" element={<AdminServices />} />
      <Route path="/admin/signalements" element={<AdminSignalements />} />
      <Route path="/admin/connectivite" element={<AdminConnectivite />} />
      <Route path="/commander" element={<Commander />} />
      <Route path="/mes-commandes" element={<MesCommandes />} />
    </Routes>
  )
}

export default App