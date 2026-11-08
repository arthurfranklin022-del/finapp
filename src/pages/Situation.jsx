import { useMemo, useRef, useEffect, useState } from 'react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import Logo from '../components/Logo.jsx'
import ProgressHeader from '../components/trail/ProgressHeader.jsx'
import SituationCard from '../components/trail/SituationCard.jsx'
import LevelUp from '../components/trail/LevelUp.jsx'
import WeekSummary from '../components/trail/WeekSummary.jsx'
import { weekFor } from '../data/situations.js'
import { ASSUMPTIONS } from '../data/assumptions.js'
import { answer, advanceDay, levelFor, DAYS_IN_WEEK } from '../lib/progress.js'

// Área 3: a situação do dia (a trilha) que o participante abre pelo link do WhatsApp.
// O progresso (dia, pontos, sequência) vem do App, guardado por persona.
export default function Situation({ persona, progress, onProgressChange, onRestart, fromWhatsApp }) {
  const week = useMemo(() => weekFor(persona, ASSUMPTIONS), [persona])
  const situation = week[progress.day - 1]
  const answered = progress.answers[progress.day]
  const [levelUp, setLevelUp] = useState(null) // { from, to } quando sobe de nível
  const topRef = useRef(null)

  // Ao mudar de dia (ou terminar a semana), volta para o topo da tela do celular
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo({ top: 0 })
    const scroller = topRef.current?.parentElement // área com rolagem dentro da moldura (notebook)
    if (scroller) scroller.scrollTop = 0
  }, [progress.day, progress.finished])

  const choose = (optionId) => {
    const next = answer(progress, situation, optionId)
    const from = levelFor(progress.points)
    const to = levelFor(next.points)
    onProgressChange(next)
    if (from.id !== to.id) setLevelUp({ from, to })
  }

  return (
    <PhoneFrame
      statusClassName="bg-cream text-ink"
      caption={
        <>
          <p className="text-lg font-extrabold text-ink">A situação do dia de {persona.name}</p>
          <p className="mt-2">
            Abre no navegador do celular, direto do link no WhatsApp. Uma situação por dia, com os números da própria
            pessoa. Leva cerca de 2 minutos.
          </p>
          <p className="mt-3 text-sm">
            <span className="font-bold text-ink">Modo demo:</span> use “Avançar ⏭” na barra de cima para passar o dia. Sem
            responder, o dia conta como pulado: o 1º da semana é protegido pela folga, o 2º zera a sequência.
          </p>
        </>
      }
    >
      <div ref={topRef} className="flex flex-1 flex-col gap-4 bg-cream p-4">
        {/* quem chegou pelo link do WhatsApp pode voltar para a conversa */}
        {fromWhatsApp && (
          <a
            href="#/whatsapp"
            className="-mx-4 -mt-4 flex items-center gap-2 bg-[#075E54] px-4 py-2 text-sm font-bold text-white hover:bg-[#064C44]"
          >
            ← Voltar ao WhatsApp
          </a>
        )}
        <div className="flex items-center justify-between">
          <Logo size={34} />
          <span className="text-sm font-semibold text-muted">PrevExemplo</span>
        </div>
        <div>
          <p className="text-muted">{progress.finished ? 'Fim da semana,' : 'Bom dia,'}</p>
          <h1 className="text-2xl font-extrabold text-ink">{persona.name} 🌱</h1>
        </div>

        <ProgressHeader progress={progress} />

        {progress.lastSkip && !progress.finished && (
          <p className="rounded-xl bg-honey/15 px-4 py-3 text-ink" role="status">
            {progress.lastSkip === 'protected'
              ? '🛡️ Ontem você não respondeu, mas a folga da semana protegeu a sua sequência.'
              : '🌱 Você pulou mais um dia e a sequência recomeçou. Bora de novo!'}
          </p>
        )}

        {progress.finished ? (
          <WeekSummary persona={persona} progress={progress} week={week} onRestart={onRestart} />
        ) : (
          <SituationCard
            key={situation.id}
            situation={situation}
            answered={answered}
            onChoose={choose}
            isLastDay={progress.day === DAYS_IN_WEEK}
            onFinishWeek={() => onProgressChange(advanceDay(progress))}
          />
        )}

        <p className="mt-auto pt-2 text-center text-xs text-muted">
          Conteúdo educativo. Não é recomendação de investimento nem de produto financeiro.
        </p>
      </div>

      {levelUp && <LevelUp from={levelUp.from} to={levelUp.to} onClose={() => setLevelUp(null)} />}
    </PhoneFrame>
  )
}
