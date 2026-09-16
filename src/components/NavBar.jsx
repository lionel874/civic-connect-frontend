import { Link } from 'react-router-dom'
import '../style/NavBar.css'

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-accueil">Accueil</Link>
      <Link to="/recherche" className="nav-recherche">Recherche de service</Link>
      <Link to="/signalement" className="nav-signalement">Signaler un problème</Link>
      <Link to="/tableau-de-bord" className="nav-profil">Profil</Link>
    </nav>
  )
}

export default NavBar