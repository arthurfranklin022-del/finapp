import Broto from '../brand/Broto.jsx'
import { brandColors } from '../../data/identities.js'
import { levelFor, nextLevel, DAYS_IN_WEEK } from '../../lib/progress.js'

const DOT = {
  best: { cls: 'bg-brand text-white', mark: '★', label: 'melhor escolha' },
  ok: { cls: 'bg-honey text-ink', mark: '✓', label: 'caminho do meio' },
  weak: { cls: 'bg-leaf text-ink', mark: '•', label: 'dá para melhorar' },
}

// Topo da trilha: sequência, pontos, nível (com o Broto da fase) e os 7 dias da semana
export default function ProgressHeader({ progress }) {
  const level = levelFor(progress.points)
  const next = nextLevel(progress.points)
  return (
    <section aria-label="Seu progresso" className="rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-black/5">
      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Sequência" value={`🔥 ${progress.streak}`} hint={progress.streak === 1 ? 'dia' : 'dias'} />
        <Stat label="Pontos" value={progress.points} hint="no total" />
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs font-bold uppercase text-muted">Nível</p>
          <div className="flex items-center gap-1">
            <Broto colors={brandColors} stage={level.stage} size={30} title={`Nível ${level.name}`} />
            <p className="font-extrabold text-brand">{level.name}</p>
          </div>
        </div>
      </div>

      {/* barra até o próximo nível */}
      <div className="mt-2">
        <div className="h-2 overflow-hidden rounded-full bg-leaf" aria-hidden="true">
          <div className="h-full rounded-full bg-honey transition-all duration-700" style={{ width: `${next ? next.progress * 100 : 100}%` }} />
        </div>
        <p className="mt-1 text-center text-xs text-muted">
          {next ? `Faltam ${next.missing} pontos para virar ${next.level.name}` : 'Você chegou ao nível mais alto: Árvore!'}
          {progress.freezeUsed && ' · 🛡️ folga da semana usada'}
        </p>
      </div>

      {/* os 7 dias da semana */}
      <ol className="mt-2 flex justify-between" aria-label="Dias da semana">
        {Array.from({ length: DAYS_IN_WEEK }, (_, i) => {
          const day = i + 1
          const a = progress.answers[day]
          const skipped = progress.skipped.includes(day)
          const today = day === progress.day && !progress.finished
          const look = a ? DOT[a.quality] : null
          const label = a ? `Dia ${day}: ${look.label}` : skipped ? `Dia ${day}: pulado` : today ? `Dia ${day}: hoje` : `Dia ${day}`
          return (
            <li key={day} aria-label={label} title={label}>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold ${
                  look ? look.cls : skipped ? 'bg-zinc-200 text-zinc-500' : today ? 'bg-cream text-brand ring-2 ring-brand' : 'bg-cream text-muted ring-1 ring-black/10'
                }`}
              >
                {look ? look.mark : skipped ? '–' : day}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function Stat({ label, value, hint }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="text-xl font-extrabold text-brand">{value}</p>
      <p className="text-xs text-muted">{hint}</p>
    </div>
  )
}
