import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_URL } from '../api.js'
import { sauvegarderSession } from '../auth.js'
import '../style/Inscription.css'

function Connexion() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()

    const url = `${API_URL}/users/login?email=${email}&mot_de_passe=${motDePasse}`

    const response = await fetch(url, {
      method: 'POST',
    })

    if (response.ok) {
      const data = await response.json()
      sauvegarderSession(data.access_token)
      navigate('/tableau-de-bord')
    } else {
      const erreur = await response.json()
      setMessage(`Erreur : ${erreur.detail}`)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Se connecter</h1>
        <p className="auth-subtitle">Accédez à votre espace Civic Connect</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="auth-field">
            <label>Mot de passe</label>
            <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} />
          </div>

          <button type="submit" className="auth-submit">Se connecter</button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="accueil-connexion-lien" style={{ textAlign: 'center' }}>
          Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
        </p>
      </div>
    </div>
  )
}

export default Connexion