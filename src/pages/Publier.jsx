import { useState } from 'react'
import { API_URL } from '../api.js'
import NavBar from '../components/NavBar.jsx'
import '../style/Publier.css'

function Publier() {
  const [nomS, setNomS] = useState('')
  const [description, setDescription] = useState('')
  const [prix, setPrix] = useState('')
  const [categorie, setCategorie] = useState('')
  const [ville, setVille] = useState('')
  const [quartier, setQuartier] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const token = localStorage.getItem('token')

    if (!token) {
      setMessage('Erreur : vous devez être connecté pour publier un service.')
      return
    }

    const url = `${API_URL}/services/?nom_s=${nomS}&description=${description}&prix=${prix}&categorie=${categorie}&ville=${ville}&quartier=${quartier}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      setMessage('Service publié avec succès !')
      setNomS('')
      setDescription('')
      setPrix('')
      setCategorie('')
      setVille('')
      setQuartier('')
    } else if (response.status === 401) {
      setMessage('Erreur : votre session a expiré, reconnectez-vous.')
    } else {
      const erreur = await response.json()
      setMessage(`Erreur : ${erreur.detail}`)
    }
  }

  return (
    <div className="publier-page">
      <div className="publier-card">
        <h1>Publier un service</h1>

        <form onSubmit={handleSubmit}>
          <div className="publier-field">
            <label>Nom du service</label>
            <input type="text" value={nomS} onChange={(e) => setNomS(e.target.value)} />
          </div>

          <div className="publier-field">
            <label>Description</label>
            <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="publier-row">
            <div className="publier-field">
              <label>Prix (FCFA)</label>
              <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} />
            </div>
            <div className="publier-field">
              <label>Catégorie</label>
              <input type="text" value={categorie} onChange={(e) => setCategorie(e.target.value)} />
            </div>
          </div>

          <div className="publier-row">
            <div className="publier-field">
              <label>Ville</label>
              <input type="text" placeholder="ex: Douala" value={ville} onChange={(e) => setVille(e.target.value)} />
            </div>
            <div className="publier-field">
              <label>Quartier</label>
              <input type="text" placeholder="ex: Akwa" value={quartier} onChange={(e) => setQuartier(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="publier-submit">Publier</button>
        </form>

        {message && <p className="publier-message">{message}</p>}
      </div>

      <NavBar />
    </div>
  )
}

export default Publier