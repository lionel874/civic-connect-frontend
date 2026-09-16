import { useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../api.js'
import NavBar from '../components/NavBar.jsx'
import '../style/Recherche.css'

function Recherche() {
  const [motCle, setMotCle] = useState('')
  const [categorie, setCategorie] = useState('')
  const [zone, setZone] = useState('')
  const [resultats, setResultats] = useState([])

  async function handleSubmit(event) {
    event.preventDefault()

    const url = `${API_URL}/services/?mot_cle=${motCle}&categorie=${categorie}&zone=${zone}`

    const response = await fetch(url)
    const data = await response.json()

    setResultats(data.resultats)
  }

  async function afficherListeComplete() {
    const response = await fetch(`${API_URL}/services/`)
    const data = await response.json()
    setResultats(data.resultats)
  }

  return (
    <div className="recherche-page">
      <div className="recherche-tab-wrapper">
        <button className="recherche-tab" onClick={afficherListeComplete}>
          Liste service
        </button>
      </div>

      <h1>Rechercher un service</h1>

      <form className="recherche-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Mot-clé (ex: plombier)"
          value={motCle}
          onChange={(e) => setMotCle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Catégorie (ex: Ménage)"
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
        />
        <input
          type="text"
          placeholder="Zone (ex: Bafoussam)"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        />
        <button type="submit" className="recherche-submit">Rechercher</button>
      </form>

      <div className="resultats-liste">
        {resultats.length === 0 && <p style={{ textAlign: 'center' }}>Aucun résultat pour l'instant.</p>}

        {resultats.map((service) => (
          <Link to={`/service/${service.id_s}`} key={service.id_s} className="service-card">
            <h3>{service.nom_s}</h3>
            <p>{service.description}</p>
            <p className="service-prix">{service.prix} FCFA — {service.categorie}</p>
            <p>📍 {service.ville}, {service.quartier}</p>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: '32px' }}>
        <NavBar />
      </div>
    </div>
  )
}

export default Recherche