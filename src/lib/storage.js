// Guarda pequenas preferências da demo no navegador (persona escolhida, barra escondida).
// Se o navegador bloquear, a demo continua funcionando com os valores padrão.
export function loadPref(key, fallback) {
  try {
    const v = window.localStorage.getItem(`finapp:${key}`)
    return v === null ? fallback : JSON.parse(v)
  } catch {
    return fallback
  }
}

export function savePref(key, value) {
  try {
    window.localStorage.setItem(`finapp:${key}`, JSON.stringify(value))
  } catch {
    // sem armazenamento: ignora
  }
}
