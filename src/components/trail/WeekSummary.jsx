import Broto from '../brand/Broto.jsx'
import { brandColors } from '../../data/identities.js'
import { weekSummary } from '../../lib/progress.js'
import { QUALITY } from './quality.js'

// Resumo depois do 7º dia: pontos, nível, sequência, melhores escolhas e as lições da semana
export default function WeekSummary({ persona, progress, week, onRestart }) {
  const s = weekSummary(progress)
  const leveledUp = s.level.id !== s.startLevel.id
  return (
    <section className="fade-up flex flex-col gap-4" aria-labelledby="summary-title">
      <div className="rounded-2xl bg-surface p-5 text-center shadow-sm ring-1 ring-black/5">
        <span className="grow-in inline-block">
          <Broto colors={brandColors} stage={s.level.stage} size={110} title={`Nível ${s.level.name}`} />
        </span>
        <p className="text-sm font-extrabold uppercase tracking-wide text-honey">Semana concluída</p>
        <h2 id="summary-title" className="mt-1 text-2xl font-extrabold text-brand">
          Parabéns, {persona.name}!
        </h2>
        <p className="mt-1 text-ink">
          {leveledUp ? `Nesta semana você passou de ${s.startLevel.name} para ${s.level.name}.` : `Você está no nível ${s.level.name}.`}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-center">
        <Tile label="Pontos na semana" value={`+${s.weekPoints}`} />
        <Tile label="Total de pontos" value={progress.points} />
        <Tile label="Melhores escolhas" value={`${s.bestCount} de 7`} />
        <Tile label="Sequência" value={`🔥 ${s.streak} ${s.streak === 1 ? 'dia' : 'dias'}`} />
      </dl>

      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-black/5">
        <h3 className="font-extrabold text-ink">O que você aprendeu</h3>
        <ol className="mt-2 flex flex-col gap-2">
          {week.map((sit) => {
            const a = progress.answers[sit.day]
            return (
              <li key={sit.id} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                    a ? QUALITY[a.quality].cls : 'bg-zinc-200 text-zinc-500'
                  }`}
                  title={a ? QUALITY[a.quality].tag : 'Dia pulado'}
                >
                  {a ? QUALITY[a.quality].icon : '–'}
                </span>
                <span>
                  <span className="font-bold text-ink">{sit.lesson}</span>{' '}
                  <span className="text-sm text-muted">
                    Dia {sit.day} · {sit.title}
                    {!a && ' (pulado)'}
                  </span>
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <p className="text-center text-muted">A próxima semana começa em breve, pelo WhatsApp.</p>
      <button
        type="button"
        onClick={onRestart}
        className="w-full rounded-xl bg-brand px-4 py-3 font-extrabold text-white hover:bg-brand-dark"
      >
        Recomeçar a semana
      </button>
    </section>
  )
}

function Tile({ label, value }) {
  return (
    <div className="rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-black/5">
      <dt className="text-xs font-bold uppercase text-muted">{label}</dt>
      <dd className="mt-0.5 text-xl font-extrabold text-brand">{value}</dd>
    </div>
  )
}
