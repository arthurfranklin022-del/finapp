import { useEffect, useState } from 'react'
import { pageFromHash } from './router.js'

// Guarda a página atual e acompanha as mudanças no "#" do endereço
export function useHashRoute() {
  const [page, setPage] = useState(() => pageFromHash(window.location.hash))
  useEffect(() => {
    const onChange = () => {
      setPage(pageFromHash(window.location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return page
}
