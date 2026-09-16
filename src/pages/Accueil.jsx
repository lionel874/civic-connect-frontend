import { Link } from 'react-router-dom'
import '../style/Accueil.css'

function Accueil() {
  return (
    <div className="accueil-hero">
      <h1>Civic Connect</h1>
      <p>Trouvez des services, signalez un problème, gérez votre activité — le tout depuis votre quartier.</p>

      <div className="accueil-actions">
        <Link to="/inscription" className="accueil-cta">Créer un compte</Link>
        <Link to="/connexion" className="accueil-cta-secondaire">Se connecter</Link>
        <Link to="/recherche" className="accueil-cta-secondaire">Recherche de service</Link>
        <Link to="/signalement" className="accueil-cta-secondaire">Signaler un problème</Link>
        <Link to="/tableau-de-bord" className="accueil-cta-secondaire">Profil</Link>
      </div>
    </div>
  )
}

export default Accueil