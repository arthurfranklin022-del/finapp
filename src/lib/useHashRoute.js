import { useEffect, useState } from 'react'
import { pageFromHash, paramsFromHash } from './router.js'

const read = () => ({ page: pageFromHash(window.location.hash), params: paramsFromHash(window.location.hash) })

// Guarda a página atual (e os parâmetros depois do "?") e acompanha as mudanças no "#" do endereço
export function useHashRoute() {
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onChange = () => {
      setRoute(read())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
