import { useEffect, useRef } from 'react'
import { THEMES, POINTS } from '../../data/situations.js'
import { ASSUMPTION_ROWS } from '../../data/assumptions.js'
import { QUALITY } from './quality.js'

const LETTERS = ['A', 'B', 'C']

// A situação do dia: contexto → pergunta → 3 opções → feedback com a conta de cada escolha
export default function SituationCard({ situation, answered, onChoose, isLastDay, onFinishWeek }) {
  const feedbackRef = useRef(null)
  const theme = THEMES[situation.theme]

  // Depois de responder, rola a tela até o feedback
  useEffect(() => {
    if (answered) feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [answered])

  const chosen = answered && situation.options.find((o) => o.id === answered.optionId)

  return (
    <article className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-black/5" aria-labelledby={`sit-${situation.id}`}>
      <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
        <span className="rounded-full bg-leaf px-2.5 py-0.5 text-ink">
          {theme.emoji} {theme.label}
        </span>
        <span className="text-muted">Dia {situation.day} de 7</span>
      </p>
      <h2 id={`sit-${situation.id}`} className="mt-2 text-xl font-extrabold text-ink">
        {situation.title}
      </h2>
      <p className="mt-2 leading-relaxed text-ink">{situation.context}</p>
      <p className="mt-3 font-extrabold text-brand">{situation.question}</p>

      {/* as 3 opções */}
      <ul className="mt-3 flex flex-col gap-2">
        {situation.options.map((o, i) => {
          const isChosen = chosen?.id === o.id
          return (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => onChoose(o.id)}
                disabled={!!answered}
                aria-pressed={isChosen}
                className={`flex w-full items-start gap-3 rounded-xl p-3 text-left font-semibold transition ${
                  answered
                    ? isChosen
                      ? `bg-leaf ring-2 ${QUALITY[o.quality].ring}`
                      : 'bg-cream text-muted ring-1 ring-black/5'
                    : 'bg-cream ring-1 ring-black/10 hover:bg-leaf hover:ring-brand focus-visible:outline-3 focus-visible:outline-honey'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                    isChosen ? 'bg-brand text-white' : 'bg-surface text-brand ring-1 ring-brand/30'
                  }`}
                  aria-hidden="true"
                >
                  {LETTERS[i]}
                </span>
                <span className="pt-0.5">{o.label}</span>
              </button>
            </li>
          )
        })}
      </ul>

      {/* feedback, depois de responder */}
      {answered && (
        <div ref={feedbackRef} className="fade-up mt-5 scroll-mt-44 md:scroll-mt-4" aria-live="polite">
          <div className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ${QUALITY[chosen.quality].cls}`}>
            <p className="font-extrabold">
              {QUALITY[chosen.quality].icon} {QUALITY[chosen.quality].title}
            </p>
            <p className="shrink-0 rounded-full bg-white/90 px-2.5 py-0.5 text-sm font-extrabold text-brand">
              +{POINTS[chosen.quality]} pontos
            </p>
          </div>

          <h3 className="mt-4 font-extrabold text-ink">As 3 escolhas, na ponta do lápis</h3>
          <ul className="mt-2 flex flex-col gap-2">
            {situation.options.map((o, i) => (
              <li key={o.id} className={`rounded-xl bg-cream p-3 ring-1 ${o.id === chosen.id ? 'ring-2 ' + QUALITY[o.quality].ring : 'ring-black/5'}`}>
                <p className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-wide">
                  <span className={`rounded-full px-2 py-0.5 ${QUALITY[o.quality].cls}`}>
                    {QUALITY[o.quality].icon} {QUALITY[o.quality].tag}
                  </span>
                  {o.id === chosen.id && <span className="text-brand">Sua escolha</span>}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-muted">
                  {LETTERS[i]}. {o.label}
                </p>
                <p className="mt-1 text-lg font-extrabold leading-snug text-brand">{o.result}</p>
                <p className="mt-1 text-ink">{o.detail}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-xl border-l-4 border-honey bg-honey/10 p-3">
            <h3 className="font-extrabold text-ink">💡 Por que isso importa</h3>
            <p className="mt-1 text-ink">{situation.why}</p>
          </div>

          <details className="mt-3 rounded-xl bg-cream p-3 text-sm ring-1 ring-black/5">
            <summary className="cursor-pointer font-bold text-brand">Premissas das contas</summary>
            <p className="mt-2 text-muted">Valores aproximados, em dinheiro de hoje (já sem a inflação).</p>
            <ul className="mt-2 flex flex-col gap-1">
              {ASSUMPTION_ROWS.map((r) => (
                <li key={r.label}>
                  <span className="font-semibold text-ink">{r.label}:</span> <span className="text-muted">{r.value}</span>
                </li>
              ))}
            </ul>
          </details>

          {isLastDay ? (
            <button
              type="button"
              onClick={onFinishWeek}
              className="mt-4 w-full rounded-xl bg-brand px-4 py-3 font-extrabold text-white hover:bg-brand-dark"
            >
              Ver o resumo da semana 🎉
            </button>
          ) : (
            <p className="mt-4 rounded-xl bg-leaf px-4 py-3 text-center font-semibold text-ink">
              🌱 Amanhã tem uma nova situação. O link chega pelo WhatsApp.
            </p>
          )}
        </div>
      )}
    </article>
  )
}
