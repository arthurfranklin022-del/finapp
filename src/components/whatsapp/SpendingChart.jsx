import { useState } from 'react'
import { formatBRLRounded as R, formatPercent } from '../../lib/format.js'

const pct = (x) => formatPercent(Math.round(x * 100) / 100)
const SURFACE = '#F7F8FA' // fundo do cartão do gráfico (também usado no espaço entre as fatias)

// Gráfico de rosca dos gastos + lista dos grupos.
// - Com sobra, a rosca inteira é a renda (grupos + fatia cinza "Sobrou").
// - Gastando mais do que ganha (Carla), a rosca inteira é o total gasto e o centro mostra quanto faltou.
// Tocar numa fatia ou num grupo da lista abre os gastos que estão dentro dele.
export default function SpendingChart({ groups, overview, donut, incomeLabel = 'renda' }) {
  const [open, setOpen] = useState(null)
  const toggle = (id) => setOpen((cur) => (cur === id ? null : id))
  const surplus = donut.slices.find((s) => s.id === 'sobrou')

  return (
    <figure className="mt-2 rounded-lg p-2.5" style={{ background: SURFACE }}>
      <figcaption className="text-sm font-bold">Para onde foi a sua {incomeLabel}</figcaption>
      <p className="text-xs text-[#5E6A70]">Toque numa fatia ou num grupo para ver os gastos dentro dele.</p>

      <Donut donut={donut} overview={overview} selected={open} onSelect={toggle} incomeLabel={incomeLabel} />

      <ul className="mt-1 flex flex-col gap-0.5">
        {groups.map((g) => {
          const isOpen = open === g.id
          return (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => toggle(g.id)}
                aria-expanded={isOpen}
                className={`flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-sm hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#008069] ${isOpen ? 'bg-black/5' : ''}`}
              >
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: g.color }} aria-hidden="true" />
                <span className="min-w-0 flex-1 font-semibold">
                  {g.label} <span className="text-xs text-[#5E6A70]">{isOpen ? '▴' : '▾'}</span>
                </span>
                <span className="shrink-0 tabular-nums">
                  {R(g.amount)} <span className="text-[#5E6A70]">· {pct(g.shareOfIncome)}</span>
                </span>
              </button>
              {isOpen && (
                <ul className="mb-1 ml-6 mt-0.5 flex flex-col gap-0.5 border-l-2 pl-2 text-sm" style={{ borderColor: g.color }}>
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
        {surplus && (
          <li className="flex items-center gap-2 px-1.5 py-1 text-sm">
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: surplus.color }} aria-hidden="true" />
            <span className="flex-1 font-semibold">Sobrou</span>
            <span className="shrink-0 tabular-nums">
              {R(surplus.amount)} <span className="text-[#5E6A70]">· {pct(surplus.fraction)}</span>
            </span>
          </li>
        )}
      </ul>
      <p className="mt-1 text-xs text-[#5E6A70]">
        % = parte da {incomeLabel} do mês.
        {overview.balance < 0 && ` Como os gastos passaram da ${incomeLabel}, a rosca mostra o total gasto.`}
      </p>

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

// Rosca em SVG. Cada fatia é um arco; um traço da cor do fundo separa as fatias.
function Donut({ donut, overview, selected, onSelect, incomeLabel }) {
  const C = 100
  const R_OUT = 92
  const R_IN = 58
  const TOP = -Math.PI / 2 // começa no topo, sentido horário
  const point = (r, a) => `${(C + r * Math.cos(a)).toFixed(2)} ${(C + r * Math.sin(a)).toFixed(2)}`
  // fração acumulada antes de cada fatia
  const before = donut.slices.map((_, i) => donut.slices.slice(0, i).reduce((sum, x) => sum + x.fraction, 0))
  const arcs = donut.slices.map((s, i) => {
    const start = TOP + before[i] * 2 * Math.PI
    const end = start + s.fraction * 2 * Math.PI
    const large = end - start > Math.PI ? 1 : 0
    const d = [
      `M ${point(R_OUT, start)}`,
      `A ${R_OUT} ${R_OUT} 0 ${large} 1 ${point(R_OUT, end)}`,
      `L ${point(R_IN, end)}`,
      `A ${R_IN} ${R_IN} 0 ${large} 0 ${point(R_IN, start)}`,
      'Z',
    ].join(' ')
    return { ...s, d }
  })
  const deficit = overview.balance < 0
  const center = deficit
    ? { top: 'Faltaram', value: R(-overview.balance), bottom: `gastou ${pct(overview.shareOfIncome)}` }
    : { top: 'Gastos', value: R(overview.spent), bottom: `${pct(overview.shareOfIncome)} da ${incomeLabel}` }

  return (
    <svg
      viewBox="0 0 200 200"
      className="mx-auto my-2 block w-full max-w-[220px]"
      role="img"
      aria-label={`Rosca dos gastos: ${donut.slices.map((s) => `${s.label} ${pct(s.fraction)}`).join(', ')}`}
    >
      {arcs.map((s) => {
        const clickable = s.id !== 'sobrou'
        const dim = selected && selected !== s.id
        return (
          <path
            key={s.id}
            d={s.d}
            fill={s.color}
            stroke={SURFACE}
            strokeWidth="2"
            strokeLinejoin="round"
            opacity={dim ? 0.3 : 1}
            className={clickable ? 'cursor-pointer transition-opacity' : 'transition-opacity'}
            onClick={clickable ? () => onSelect(s.id) : undefined}
          >
            <title>{`${s.label}: ${R(s.amount)} (${pct(s.fraction)} da rosca)`}</title>
          </path>
        )
      })}
      <text x={C} y={C - 16} textAnchor="middle" fontSize="12" fill="#5E6A70">
        {center.top}
      </text>
      <text x={C} y={C + 6} textAnchor="middle" fontSize="20" fontWeight="800" fill={deficit ? '#B42318' : '#111B21'}>
        {center.value}
      </text>
      <text x={C} y={C + 24} textAnchor="middle" fontSize="10.5" fill="#5E6A70">
        {center.bottom}
      </text>
    </svg>
  )
}
