import { AREAS, hashForPage } from '../lib/router.js'
import { personas } from '../data/personas.js'
import Logo from './Logo.jsx'

// Barra do modo demo: troca de área e de persona durante a reunião.
// Pode ser escondida (botão "Esconder" ou tecla D) para deixar a tela limpa.
export default function DemoBar({ page, personaId, onPersonaChange, hidden, onToggle }) {
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
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 lg:flex-nowrap">
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
          className="ml-auto rounded-lg px-2 py-1.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white lg:order-4 lg:ml-0"
          aria-label="Esconder a barra do modo demo (tecla D)"
          title="Esconder (tecla D)"
        >
          ▴ Esconder
        </button>

        {/* seletor de persona (no celular, linha inteira) */}
        <label className="flex w-full items-center gap-2 text-sm lg:order-3 lg:w-auto">
          <span className="shrink-0 text-white/80">Persona</span>
          <select
            value={personaId}
            onChange={(e) => onPersonaChange(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-white/30 bg-white/10 px-2 py-1.5 font-semibold text-white"
            aria-label="Escolher persona"
          >
            {personas.map((p) => (
              <option key={p.id} value={p.id} className="text-ink">
                {p.name}, {p.age} · {p.profile}
              </option>
            ))}
          </select>
        </label>

        {/* as 4 áreas */}
        <nav aria-label="Áreas da demo" className="w-full lg:order-2 lg:w-auto lg:flex-1 lg:pl-4">
          <ul className="grid grid-cols-4 gap-1 lg:flex lg:justify-center">
            {AREAS.map((area) => {
              const active = area.id === page
              return (
                <li key={area.id}>
                  <a
                    href={hashForPage(area.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-full px-1 py-1.5 text-center text-[0.85rem] font-bold whitespace-nowrap lg:px-4 lg:text-sm ${
                      active ? 'bg-white text-brand-dark' : 'text-white/85 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="lg:hidden">{area.short}</span>
                    <span className="hidden lg:inline">{area.label}</span>
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
