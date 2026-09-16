import { useState } from 'react'
import { API_URL } from '../api.js'
import NavBar from '../components/NavBar.jsx'
import '../style/Signalement.css'

function Signalement() {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [ville, setVille] = useState('')
  const [quartier, setQuartier] = useState('')
  const [message, setMessage] = useState('')
  const [signalements, setSignalements] = useState([])
  const [selection, setSelection] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()

    const token = localStorage.getItem('token')

    if (!token) {
      setMessage('Erreur : vous devez être connecté pour signaler un problème.')
      return
    }

    const url = `${API_URL}/reports/?titre=${titre}&description=${description}&ville=${ville}&quartier=${quartier}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      setMessage('Signalement envoyé avec succès !')
      setTitre('')
      setDescription('')
      setVille('')
      setQuartier('')
    } else if (response.status === 401) {
      setMessage('Erreur : votre session a expiré, reconnectez-vous.')
    } else {
      const erreur = await response.json()
      setMessage(`Erreur : ${erreur.detail}`)
    }
  }

  async function afficherListeComplete() {
    const response = await fetch(`${API_URL}/reports/`)
    const data = await response.json()
    setSignalements(data.resultats || data)
  }

  return (
    <div className="signalement-page">
      <div className="signalement-tab-wrapper">
        <button className="signalement-tab" onClick={afficherListeComplete}>
          Liste signalement
        </button>
      </div>

      <div className="signalement-liste">
        {signalements.map((s) => (
          <div
            key={s.id_r}
            className="signalement-item"
            onClick={() => setSelection(s)}
          >
            <h3>{s.titre}</h3>
            <p>{s.description}</p>
            <p>Statut : {s.statut}</p>
          </div>
        ))}
      </div>

      <div className="signalement-card">
        <h1>Signaler un problème</h1>
        <p className="signalement-subtitle">Coupure, panne, incident dans votre quartier</p>

        <form onSubmit={handleSubmit}>
          <div className="signalement-field">
            <label>Titre</label>
            <input
              type="text"
              placeholder="ex: Coupure d'électricité"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
            />
          </div>

          <div className="signalement-field">
            <label>Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="signalement-field">
            <label>Ville</label>
            <input
              type="text"
              placeholder="ex: Douala"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
            />
          </div>

          <div className="signalement-field">
            <label>Quartier</label>
            <input
              type="text"
              placeholder="ex: Akwa"
              value={quartier}
              onChange={(e) => setQuartier(e.target.value)}
            />
          </div>

          <button type="submit" className="signalement-submit">Envoyer le signalement</button>
        </form>

        {message && <p className="signalement-message">{message}</p>}
      </div>

      {selection && (
        <div className="signalement-modal-overlay" onClick={() => setSelection(null)}>
          <div className="signalement-modal" onClick={(e) => e.stopPropagation()}>
            <button className="signalement-modal-close" onClick={() => setSelection(null)}>×</button>
            <h2>{selection.titre}</h2>
            <p>{selection.description}</p>
            <p><strong>Statut :</strong> {selection.statut}</p>
            <p><strong>Type :</strong> {selection.type}</p>
            <p><strong>Zone :</strong> {selection.ville}, {selection.quartier}</p>
            <p><strong>Date :</strong> {selection.date}</p>
          </div>
        </div>
      )}

      <NavBar />
    </div>
  )
}

export default Signalement