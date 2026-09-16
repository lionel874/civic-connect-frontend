import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { API_URL } from '../api.js'
import NavBar from '../components/NavBar.jsx'
import '../style/DetailService.css'

function DetailService() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    async function chargerService() {
      const response = await fetch(`${API_URL}/services/`)
      const data = await response.json()

      const trouve = data.resultats.find((s) => s.id_s === Number(id))
      setService(trouve)
      setChargement(false)
    }

    chargerService()
  }, [id])

  return (
    <div className="detail-page">
      <div className="detail-card">
        {chargement && <p>Chargement...</p>}

        {!chargement && !service && (
          <p className="detail-introuvable">Aucun service trouvé avec l'identifiant {id}.</p>
        )}

        {!chargement && service && (
          <>
            <h1>{service.nom_s}</h1>
            <p>{service.description}</p>
            <p className="detail-prix">{service.prix} FCFA</p>
            <p>Catégorie : {service.categorie}</p>
            <p>📍 {service.ville}, {service.quartier}</p>
          </>
        )}
      </div>

      <NavBar />
    </div>
  )
}

export default DetailService