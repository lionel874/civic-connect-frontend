import { useEffect, useState } from 'react'
import { API_URL } from '../api.js'
import NavBar from '../components/NavBar.jsx'
import '../style/Publier.css'

function Commander() {
  const [produits, setProduits] = useState([])
  const [productId, setProductId] = useState('')
  const [titre, setTitre] = useState('')
  const [quantite, setQuantite] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function chargerProduits() {
      const response = await fetch(`${API_URL}/produit/`)
      if (response.ok) {
        const data = await response.json()
        const liste = Array.isArray(data) ? data : data.resultats ?? data.data ?? []
        setProduits(liste)
      }
    }
    chargerProduits()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    const token = localStorage.getItem('token')

    if (!token) {
      setMessage('Erreur : vous devez être connecté pour passer une commande.')
      return
    }

    if (!productId) {
      setMessage('Erreur : veuillez choisir un produit.')
      return
    }

    const url = `${API_URL}/orders/?titre=${titre}&quantite=${quantite}&product_id=${productId}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      setMessage('Commande passée avec succès !')
      setTitre('')
      setQuantite('')
      setProductId('')
    } else if (response.status === 401) {
      setMessage('Erreur : votre session a expiré, reconnectez-vous.')
    } else {
      const erreur = await response.json()
      setMessage(`Erreur : ${erreur.detail}`)
    }
  }

  const produitSelectionne = produits.find(
    (p) => String(p.id ?? p.id_p) === String(productId)
  )

  return (
    <div className="publier-page">
      <div className="publier-card">
        <h1>Passer une commande</h1>

        <form onSubmit={handleSubmit}>
          <div className="publier-field">
            <label>Produit</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
            >
              <option value="">-- Choisir un produit --</option>
              {produits.map((p) => (
                <option key={p.id ?? p.id_p} value={p.id ?? p.id_p}>
                  {p.nom} — {p.prix} FCFA
                </option>
              ))}
            </select>
          </div>

          <div className="publier-field">
            <label>Titre de la commande</label>
            <input
              type="text"
              placeholder="ex: Commande pour le bureau"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
            />
          </div>

          <div className="publier-field">
            <label>Quantité</label>
            <input
              type="number"
              min="1"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
            />
          </div>

          {produitSelectionne && quantite && (
            <p style={{ textAlign: 'center', fontWeight: 600 }}>
              Total estimé : {produitSelectionne.prix * Number(quantite)} FCFA
            </p>
          )}

          <button type="submit" className="publier-submit">Commander</button>
        </form>

        {message && <p className="publier-message">{message}</p>}
      </div>

      <NavBar />
    </div>
  )
}

export default Commander