// Décode la partie "payload" d'un JWT, sans vérifier sa signature
export function decoderToken(token) {
  const partiePayload = token.split('.')[1]
  const jsonDecode = atob(partiePayload)
  return JSON.parse(jsonDecode)
}

export function sauvegarderSession(token) {
  const payload = decoderToken(token)
  localStorage.setItem('token', token)
  localStorage.setItem('userId', payload.sub)
  localStorage.setItem('role', payload.role)
}

export function getUserId() {
  return localStorage.getItem('userId')
}

export function estConnecte() {
  return localStorage.getItem('token') !== null
}

export function deconnexion() {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('role')
}