import { useEffect, useState } from 'react'
import { useHashRoute } from './lib/useHashRoute.js'
import { loadPref, savePref } from './lib/storage.js'
import { getPersona, DEFAULT_PERSONA_ID } from './data/personas.js'
import { initialProgress, advanceDay, isValidProgress } from './lib/progress.js'
import DemoBar from './components/DemoBar.jsx'
import Identities from './pages/Identities.jsx'
import Presentation from './pages/Presentation.jsx'
import WhatsApp from './pages/WhatsApp.jsx'
import Situation from './pages/Situation.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PersonaSheet from './pages/PersonaSheet.jsx'

const TITLES = {
  apresentacao: 'Apresentação',
  whatsapp: 'WhatsApp',
  situacao: 'Situação do dia',
  painel: 'Painel da EFPC',
  persona: 'Ficha da persona',
  identidades: 'Identidade visual',
}

export default function App() {
  const page = useHashRoute()
  const [personaId, setPersonaId] = useState(() => getPersona(loadPref('persona', DEFAULT_PERSONA_ID)).id)
  const [barHidden, setBarHidden] = useState(() => loadPref('barHidden', false) === true)
  const persona = getPersona(personaId)

  // Progresso na trilha, guardado por persona (pontos, sequência, dia da semana...)
  const [progressMap, setProgressMap] = useState(() => {
    const saved = loadPref('progress', {})
    return saved && typeof saved === 'object' ? saved : {}
  })
  const progress = isValidProgress(progressMap[personaId]) ? progressMap[personaId] : initialProgress(persona)
  const setProgress = (next) => setProgressMap((m) => ({ ...m, [personaId]: next }))
  const advance = () => setProgress(advanceDay(progress))
  const restart = () => setProgress(initialProgress(persona))

  useEffect(() => savePref('persona', personaId), [personaId])
  useEffect(() => savePref('progress', progressMap), [progressMap])
  useEffect(() => savePref('barHidden', barHidden), [barHidden])
  useEffect(() => {
    document.title = `${TITLES[page]} · Finapp — PrevExemplo`
  }, [page])

  // Tecla D mostra/esconde a barra de demo (ignora quando se está digitando)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() !== 'd' || e.ctrlKey || e.metaKey || e.altKey) return
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return
      setBarHidden((h) => !h)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // A página de comparação de identidades é um registro, fora da demo
  if (page === 'identidades') return <Identities />

  return (
    <div className="flex min-h-dvh flex-col">
      <DemoBar
        page={page}
        personaId={personaId}
        onPersonaChange={setPersonaId}
        hidden={barHidden}
        onToggle={() => setBarHidden((h) => !h)}
        day={progress.day}
        weekFinished={progress.finished}
        onAdvanceDay={advance}
        onRestartWeek={restart}
      />
      <main className="flex flex-1 flex-col">
        {page === 'apresentacao' && <Presentation />}
        {page === 'whatsapp' && <WhatsApp persona={persona} />}
        {page === 'situacao' && (
          <Situation
            key={persona.id}
            persona={persona}
            progress={progress}
            onProgressChange={setProgress}
            onRestart={restart}
          />
        )}
        {page === 'painel' && <Dashboard />}
        {page === 'persona' && <PersonaSheet persona={persona} onPersonaChange={setPersonaId} />}
      </main>
    </div>
  )
}
