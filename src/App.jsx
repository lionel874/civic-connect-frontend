import { Routes, Route } from 'react-router-dom'
import Accueil from './pages/Accueil.jsx'
import Connexion from './pages/Connexion.jsx'
import Inscription from './pages/Inscription.jsx'
import Recherche from './pages/Recherche.jsx'
import DetailService from './pages/DetailService.jsx'
import Signalement from './pages/Signalement.jsx'
import TableauDeBord from './pages/TableauDeBord.jsx'
import Publier from './pages/Publier.jsx'
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
    </Routes>
  )
}

export default App