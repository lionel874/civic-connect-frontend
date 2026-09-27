import { useState } from 'react'
import { API_URL } from '../api.js'
import NavBar from '../components/NavBar.jsx'
import '../style/Connectivite.css'

function Connectivite() {
  const [nom, setNom] = useState('')
  const [qualiteReseau, setQualiteReseau] = useState('')
  const [horaires, setHoraires] = useState('')
  const [ville, setVille] = useState('')
  const [quartier, setQuartier] = useState('')
  const [message, setMessage] = useState('')
  const [points, setPoints] = useState([])
  const [selection, setSelection] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()

    const token = localStorage.getItem('token')

    if (!token) {
      setMessage('Erreur : vous devez être connecté pour ajouter un point de connectivité.')
      return
    }

    const url = `${API_URL}/connectivite/?nom=${nom}&qualite_reseau=${qualiteReseau}&horaires=${horaires}&ville=${ville}&quartier=${quartier}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      setMessage('Point de connectivité ajouté avec succès !')
      setNom('')
      setQualiteReseau('')
      setHoraires('')
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
    const response = await fetch(`${API_URL}/connectivite/`)
    const data = await response.json()
    setPoints(data.resultats || data)
  }

  return (
    <div className="connectivite-page">
      <div className="connectivite-tab-wrapper">
        <button className="connectivite-tab" onClick={afficherListeComplete}>
          Liste des points
        </button>
      </div>

      <div className="connectivite-liste">
        {points.map((p) => (
          <div key={p.id_pc} className="connectivite-item" onClick={() => setSelection(p)}>
            <h3>{p.nom}</h3>
            <p>Qualité : {p.qualite_reseau}</p>
          </div>
        ))}
      </div>

      <div className="connectivite-card">
        <h1>Ajouter un point de connectivité</h1>
        <p className="connectivite-subtitle">Cybercafé, zone wifi, bon réseau mobile...</p>

        <form onSubmit={handleSubmit}>
          <div className="connectivite-field">
            <label>Nom du lieu</label>
            <input type="text" placeholder="ex: Cybercafé Chez Paul" value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>

          <div className="connectivite-field">
            <label>Qualité du réseau</label>
            <select value={qualiteReseau} onChange={(e) => setQualiteReseau(e.target.value)}>
              <option value="">-- Choisir --</option>
              <option value="Bon">Bon</option>
              <option value="Moyen">Moyen</option>
              <option value="Faible">Faible</option>
            </select>
          </div>

          <div className="connectivite-field">
            <label>Horaires</label>
            <input type="text" placeholder="ex: 8h-20h" value={horaires} onChange={(e) => setHoraires(e.target.value)} />
          </div>

          <div className="connectivite-row">
            <div className="connectivite-field">
              <label>Ville</label>
              <input type="text" placeholder="ex: Bafang" value={ville} onChange={(e) => setVille(e.target.value)} />
            </div>
            <div className="connectivite-field">
              <label>Quartier</label>
              <input type="text" placeholder="ex: Centre" value={quartier} onChange={(e) => setQuartier(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="connectivite-submit">Ajouter</button>
        </form>

        {message && <p className="connectivite-message">{message}</p>}
      </div>

      {selection && (
        <div className="connectivite-modal-overlay" onClick={() => setSelection(null)}>
          <div className="connectivite-modal" onClick={(e) => e.stopPropagation()}>
            <button className="connectivite-modal-close" onClick={() => setSelection(null)}>×</button>
            <h2>{selection.nom}</h2>
            <p><strong>Qualité du réseau :</strong> {selection.qualite_reseau}</p>
            <p><strong>Horaires :</strong> {selection.horaires}</p>
            <p><strong>Zone :</strong> {selection.ville}, {selection.quartier}</p>
          </div>
        </div>
      )}

      <NavBar />
    </div>
  )
}

export default Connectivite