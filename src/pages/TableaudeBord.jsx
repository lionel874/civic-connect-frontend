import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../api.js'
import NavBar from '../components/NavBar.jsx'
import '../style/TableauDeBord.css'

function TableauDeBord() {
  const [services, setServices] = useState([])
  const [commandes, setCommandes] = useState([])

  useEffect(() => {
    async function chargerServices() {
      const response = await fetch(`${API_URL}/services/`)
      const data = await response.json()
      setServices(data.resultats ?? [])
    }

    async function chargerCommandes() {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${API_URL}/orders/mes-commandes`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        const liste = Array.isArray(data) ? data : data.resultats ?? data.data ?? []
        setCommandes(liste)
      }
    }

    chargerServices()
    chargerCommandes()
  }, [])

  async function supprimerService(id) {
    const token = localStorage.getItem('token')
    await fetch(`${API_URL}/services/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setServices(services.filter((s) => s.id_s !== id))
  }

  async function supprimerCommande(id) {
    const token = localStorage.getItem('token')
    await fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setCommandes(commandes.filter((c) => c.num_o !== id))
  }

  return (
    <div className="dashboard-page">
      <h1>Tableau de bord</h1>
      
      <Link to="/publier" className="dashboard-publier">+ Publier un service</Link>

      <div className="dashboard-section">
        <h2>Services / produits</h2>
        <div className="dashboard-liste">
          {services.length === 0 && <p>Aucun service pour l'instant.</p>}
          {services.map((service) => (
            <div key={service.id_s} className="dashboard-card">
              <div className="dashboard-card-infos">
                <strong>{service.nom_s}</strong>
                <span>{service.prix} FCFA — {service.categorie}</span>
              </div>
              <button className="dashboard-delete" onClick={() => supprimerService(service.id_s)}>
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Mes commandes</h2>
        <div className="dashboard-liste">
          {commandes.length === 0 && <p>Aucune commande pour l'instant.</p>}
          {commandes.map((commande) => (
            <div key={commande.num_o} className="dashboard-card">
              <div className="dashboard-card-infos">
                <strong>{commande.titre_o}</strong>
                <span>Quantité : {commande.quantite_o} — {commande.mte_total} FCFA</span>
              </div>
              <button className="dashboard-delete" onClick={() => supprimerCommande(commande.num_o)}>
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>

      <NavBar />
    </div>
  )
}

export default TableauDeBord