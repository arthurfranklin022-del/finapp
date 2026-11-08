import { useState } from 'react'
import { formatBRLRounded as R, formatPercent } from '../../lib/format.js'

const pct = (x) => formatPercent(Math.round(x * 100) / 100)

// Gráfico de barras: quanto da renda foi para cada grande grupo de gastos.
// Cada grupo é um botão: tocar abre os gastos que estão dentro dele.
// As barras são medidas contra a renda (100% = toda a renda do mês).
export default function SpendingChart({ groups, overview, incomeLabel = 'renda' }) {
  const [open, setOpen] = useState(null)
  return (
    <figure className="mt-2 rounded-lg bg-[#F7F8FA] p-2.5">
      <figcaption className="text-sm font-bold">Para onde foi a sua {incomeLabel}</figcaption>
      <p className="text-xs text-[#5E6A70]">Toque num grupo para ver os gastos dentro dele.</p>
      <ul className="mt-2 flex flex-col gap-1">
        {groups.map((g) => {
          const isOpen = open === g.id
          return (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : g.id)}
                aria-expanded={isOpen}
                className="w-full rounded-md px-1.5 py-1 text-left hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#008069]"
              >
                <span className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-semibold">
                    <span aria-hidden="true">{g.emoji} </span>
                    {g.label} <span className="text-xs text-[#5E6A70]">{isOpen ? '▴' : '▾'}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {R(g.amount)} <span className="text-[#5E6A70]">· {pct(g.shareOfIncome)}</span>
                  </span>
                </span>
                <span className="mt-1 block h-2 rounded bg-black/[0.07]" aria-hidden="true">
                  <span
                    className="block h-full rounded bg-brand"
                    style={{ width: `${Math.min(100, g.shareOfIncome * 100)}%` }}
                  />
                </span>
              </button>
              {isOpen && (
                <ul className="mb-1 ml-6 mt-1 flex flex-col gap-0.5 border-l-2 border-leaf pl-2 text-sm">
                  {g.items.map((e) => (
                    <li key={e.id} className="flex justify-between gap-2">
                      <span>{e.label}</span>
                      <span className="shrink-0 tabular-nums">
                        {R(e.amount)} <span className="text-[#5E6A70]">· {pct(e.shareOfIncome)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-2 border-t border-black/10 pt-2 text-sm">
        Entraram <strong>{R(overview.income)}</strong> e saíram <strong>{R(overview.spent)}</strong> (
        {pct(overview.shareOfIncome)} da {incomeLabel}).{' '}
        {overview.balance >= 0 ? (
          <>
            Sobraram <strong>{R(overview.balance)}</strong>.
          </>
        ) : (
          <>
            Faltaram <strong>{R(-overview.balance)}</strong>.
          </>
        )}
      </p>
    </figure>
  )
}
