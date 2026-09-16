import { useState } from 'react'
import { API_URL } from '../api.js'
import '../style/Inscription.css'

function Inscription() {
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [tel, setTel] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [role, setRole] = useState('user')
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const url = `${API_URL}/users/?nom=${nom}&prenom=${prenom}&email=${email}&tel=${tel}&role=${role}&mot_de_passe=${motDePasse}`

    const response = await fetch(url, {
      method: 'POST',
    })

    if (response.ok) {
      setMessage('Compte créé avec succès !')
    } else {
      const erreur = await response.json()
      setMessage(`Erreur : ${erreur.detail}`)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Créer un compte</h1>
        <p className="auth-subtitle">Rejoignez Civic Connect en quelques secondes</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Nom</label>
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>

          <div className="auth-field">
            <label>Prénom</label>
            <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="auth-field">
            <label>Téléphone</label>
            <input type="text" value={tel} onChange={(e) => setTel(e.target.value)} />
          </div>

          <div className="auth-field">
            <label>Mot de passe</label>
            <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} />
          </div>

          <div className="auth-field">
            <label>Je suis</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Un client / étudiant</option>
              <option value="provider">Un prestataire de service</option>
            </select>
          </div>

          <button type="submit" className="auth-submit">Créer mon compte</button>
        </form>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  )
}

export default Inscription