import { AREAS, hashForPage } from '../lib/router.js'
import { personas } from '../data/personas.js'
import Logo from './Logo.jsx'

// Barra do modo demo: troca de área e de persona durante a reunião.
// Pode ser escondida (botão "Esconder" ou tecla D) para deixar a tela limpa.
export default function DemoBar({
  page,
  personaId,
  onPersonaChange,
  hidden,
  onToggle,
  day,
  weekFinished,
  onAdvanceDay,
  onRestartWeek,
}) {
  if (hidden) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="fixed right-3 top-3 z-50 rounded-full bg-brand-dark/90 px-3 py-1.5 text-sm font-bold text-white shadow-lg hover:bg-brand-dark focus-visible:outline-3 focus-visible:outline-honey"
        aria-label="Mostrar a barra do modo demo"
      >
        ▾ Demo
      </button>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-brand-dark text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 xl:flex-nowrap">
        {/* marca + selo de demo */}
        <div className="flex items-center gap-2">
          <Logo size={30} light />
          <span className="rounded-full bg-honey px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-ink">
            Demo
          </span>
        </div>

        {/* botão de esconder (no celular, na primeira linha à direita) */}
        <button
          type="button"
          onClick={onToggle}
          className="ml-auto rounded-lg px-2 py-1.5 text-sm font-semibold whitespace-nowrap text-white/80 hover:bg-white/10 hover:text-white xl:order-4 xl:ml-0"
          aria-label="Esconder a barra do modo demo (tecla D)"
          title="Esconder (tecla D)"
        >
          ▴ Esconder
        </button>

        {/* seletor de persona + controles do dia (no celular, linha inteira) */}
        <div className="flex w-full items-center gap-2 xl:order-3 xl:w-auto">
          <label className="flex min-w-0 flex-1 items-center gap-2 text-sm xl:flex-none">
            <span className="hidden shrink-0 text-white/80 sm:inline xl:hidden min-[1720px]:inline">Persona</span>
            <select
              value={personaId}
              onChange={(e) => onPersonaChange(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-white/30 bg-white/10 px-2 py-1.5 font-semibold text-white xl:w-52 xl:flex-none"
              aria-label="Escolher persona"
            >
              {personas.map((p) => (
                <option key={p.id} value={p.id} className="text-ink">
                  {p.name}, {p.age} · {p.profile}
                </option>
              ))}
            </select>
          </label>

          {/* "avançar um dia" e "recomeçar a semana" da persona escolhida */}
          <button
            type="button"
            onClick={onAdvanceDay}
            disabled={weekFinished}
            className="shrink-0 rounded-lg bg-honey px-2.5 py-1.5 text-sm font-extrabold whitespace-nowrap text-ink hover:brightness-105 disabled:cursor-not-allowed disabled:bg-white/15 disabled:font-semibold disabled:text-white/80"
            title={weekFinished ? 'A semana terminou' : `Hoje é o dia ${day} de 7. Passar para o próximo dia.`}
          >
            {weekFinished ? (
              'Semana concluída ✓'
            ) : (
              <>
                <span className="hidden sm:inline xl:hidden min-[1720px]:inline">Dia {day}/7 · </span>Avançar ⏭
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onRestartWeek}
            className="shrink-0 rounded-lg px-2 py-1.5 text-sm font-bold text-white/85 ring-1 ring-white/30 hover:bg-white/10 hover:text-white"
            aria-label="Recomeçar a semana desta persona"
            title="Recomeçar a semana desta persona"
          >
            ↺
          </button>
        </div>

        {/* as 4 áreas + ficha da persona */}
        <nav aria-label="Áreas da demo" className="w-full xl:order-2 xl:w-auto xl:flex-1 xl:pl-4">
          <ul className="flex justify-between gap-0.5 xl:justify-center xl:gap-1">
            {AREAS.map((area) => {
              const active = area.id === page
              return (
                <li key={area.id}>
                  <a
                    href={hashForPage(area.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-full px-2 py-1.5 text-center text-[0.8rem] min-[400px]:text-[0.85rem] font-bold whitespace-nowrap xl:px-4 xl:text-sm ${
                      active ? 'bg-white text-brand-dark' : 'text-white/85 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="2xl:hidden">{area.short}</span>
                    <span className="hidden 2xl:inline">{area.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
