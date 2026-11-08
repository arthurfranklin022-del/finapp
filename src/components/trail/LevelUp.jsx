import Broto from '../brand/Broto.jsx'
import { brandColors } from '../../data/identities.js'

const COLORS = ['#1F5D3F', '#E9A23B', '#3F8A5F', '#F08A6B', '#DDEBDF']

// Comemoração ao subir de nível: o Broto muda de fase, com confete rápido
export default function LevelUp({ from, to, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex md:absolute md:z-20 items-center justify-center overflow-hidden bg-ink/50 p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-title"
    >
      {/* confete */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0">
        {Array.from({ length: 28 }, (_, i) => (
          <span
            key={i}
            className="confetti-piece absolute top-0 block h-3 w-2 rounded-sm"
            style={{
              left: `${(i * 37) % 100}%`,
              background: COLORS[i % COLORS.length],
              animationDelay: `${(i % 7) * 0.08}s`,
            }}
          />
        ))}
      </div>

      <div className="fade-up relative w-full max-w-sm rounded-3xl bg-cream p-6 text-center shadow-2xl">
        <p className="text-sm font-extrabold uppercase tracking-wide text-honey">Subiu de nível!</p>
        <div className="mt-3 flex items-end justify-center gap-3">
          <span className="opacity-50">
            <Broto colors={brandColors} stage={from.stage} size={64} title={`Antes: ${from.name}`} />
          </span>
          <span className="pb-6 text-2xl text-muted" aria-hidden="true">→</span>
          <span className="grow-in">
            <Broto colors={brandColors} stage={to.stage} size={120} title={`Agora: ${to.name}`} />
          </span>
        </div>
        <h2 id="levelup-title" className="mt-2 text-2xl font-extrabold text-brand">
          Você virou {to.name}!
        </h2>
        <p className="mt-2 text-ink">Cada escolha consciente faz o seu Broto crescer. Continue assim!</p>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="mt-5 w-full rounded-xl bg-brand px-4 py-3 font-extrabold text-white hover:bg-brand-dark"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
