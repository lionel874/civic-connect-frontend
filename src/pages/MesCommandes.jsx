import { useEffect, useState } from 'react'
import { API_URL } from '../api.js'
import NavBar from '../components/NavBar.jsx'
import '../style/Recherche.css'

function MesCommandes() {
  const [commandes, setCommandes] = useState([])
  const [produits, setProduits] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    async function charger() {
      const token = localStorage.getItem('token')

      if (!token) {
        setErreur('Vous devez être connecté pour voir vos commandes.')
        setChargement(false)
        return
      }

      const [commandesRes, produitsRes] = await Promise.all([
        fetch(`${API_URL}/orders/mes-commandes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/produit/`),
      ])

      if (commandesRes.ok) {
        const data = await commandesRes.json()
        const liste = Array.isArray(data) ? data : data.resultats ?? data.data ?? []
        setCommandes(liste)
      } else {
        setErreur('Impossible de charger vos commandes.')
      }

      if (produitsRes.ok) {
        const data = await produitsRes.json()
        const liste = Array.isArray(data) ? data : data.resultats ?? data.data ?? []
        setProduits(liste)
      }

      setChargement(false)
    }

    charger()
  }, [])

  function nomProduit(productId) {
    const produit = produits.find((p) => String(p.id ?? p.id_p) === String(productId))
    return produit ? produit.nom : `Produit #${productId}`
  }

  return (
    <div className="recherche-page">
      <h1>Mes commandes</h1>

      {chargement && <p style={{ textAlign: 'center' }}>Chargement…</p>}

      {erreur && <p style={{ textAlign: 'center' }}>{erreur}</p>}

      {!chargement && !erreur && commandes.length === 0 && (
        <p style={{ textAlign: 'center' }}>Vous n'avez pas encore passé de commande.</p>
      )}

      <div className="resultats-liste">
        {commandes.map((commande) => (
          <div key={commande.num_o} className="service-card">
            <h3>{commande.titre_o}</h3>
            <p>Produit : {nomProduit(commande.product_id)}</p>
            <p>Quantité : {commande.quantite_o}</p>
            <p className="service-prix">Total : {commande.mte_total} FCFA</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '32px' }}>
        <NavBar />
      </div>
    </div>
  )
}

export default MesCommandes