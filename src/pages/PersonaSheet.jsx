import { personas, totalExpenses, monthlyBalance, totalDebt, reserveMonths } from '../data/personas.js'
import { ASSUMPTIONS, ASSUMPTION_ROWS } from '../data/assumptions.js'
import { personaHighlights } from '../lib/highlights.js'
import { employerMatch } from '../lib/finance.js'
import { formatBRLRounded, formatPercent } from '../lib/format.js'

// Ficha da persona: ferramenta do apresentador para mostrar quem é a pessoa e seus números
// antes de abrir a trilha. Tudo sai de src/data e do motor de cálculo em src/lib.
export default function PersonaSheet({ persona, onPersonaChange }) {
  const highlights = personaHighlights(persona, ASSUMPTIONS)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
      <PersonaSwitcher current={persona.id} onChange={onPersonaChange} />

      {/* quem é */}
      <section className="mt-5 rounded-3xl bg-surface p-5 shadow-sm ring-1 ring-black/5 sm:p-7">
        <p className="text-sm font-bold text-brand">
          {persona.link} · {persona.profile}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">
          {persona.name}, {persona.age} anos
        </h1>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-ink">{persona.story}</p>
        <div className="mt-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-muted">Objetivos</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {persona.goals.map((g) => (
              <li key={g} className="rounded-full bg-leaf px-3 py-1 font-semibold text-ink">
                🎯 {g}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* números principais */}
      <section className="mt-6" aria-labelledby="numeros">
        <h2 id="numeros" className="text-xl font-extrabold text-ink">
          Os números de {persona.name}
        </h2>
        <p className="text-muted">Valores por mês, salvo indicação.</p>
        <KeyNumbers persona={persona} />
      </section>

      {/* contas de destaque */}
      <section className="mt-8" aria-labelledby="destaques">
        <h2 id="destaques" className="text-xl font-extrabold text-ink">
          3 contas que contam a história
        </h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {highlights.map((h) => (
            <article key={h.id} className="flex flex-col rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-black/5">
              <span className="h-1.5 w-12 rounded-full bg-honey" aria-hidden="true" />
              <h3 className="mt-3 font-bold text-muted">{h.title}</h3>
              <p className="mt-1 text-3xl font-extrabold text-brand">{h.value}</p>
              <p className="mt-2 text-ink">{h.detail}</p>
              <p className="mt-auto pt-3 text-sm text-muted">
                <span className="font-bold">Premissa:</span> {h.basis}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* gastos e premissas */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SpendingChart persona={persona} />
        <AssumptionsTable />
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Persona e números fictícios. Conteúdo educativo: não é recomendação de investimento nem de produto
        financeiro.
      </p>
    </div>
  )
}

// Troca rápida de persona dentro da própria ficha (útil quando a barra de demo está escondida)
function PersonaSwitcher({ current, onChange }) {
  return (
    <nav aria-label="Trocar de persona" className="flex gap-2 overflow-x-auto pb-1">
      {personas.map((p) => {
        const active = p.id === current
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            aria-pressed={active}
            className={`shrink-0 rounded-full px-4 py-2 font-bold ring-1 transition ${
              active ? 'bg-brand text-white ring-brand' : 'bg-surface text-ink ring-black/10 hover:bg-leaf'
            }`}
          >
            {p.name}
          </button>
        )
      })}
    </nav>
  )
}

function KeyNumbers({ persona }) {
  const spent = totalExpenses(persona)
  const balance = monthlyBalance(persona)
  const debt = totalDebt(persona)
  const cards = [
    {
      label: 'Renda líquida',
      value: formatBRLRounded(persona.income.net),
      note:
        persona.income.sources.length > 1
          ? persona.income.sources.map((s) => `${s.label}: ${formatBRLRounded(s.amount)}`).join(' · ')
          : persona.income.gross > persona.income.net
            ? `Salário bruto: ${formatBRLRounded(persona.income.gross)}`
            : persona.income.sources[0].label,
    },
    { label: 'Gasta', value: formatBRLRounded(spent), note: `Em ${persona.expenses.length} categorias` },
    balance >= 0
      ? { label: 'Sobra', value: formatBRLRounded(balance), note: 'O que fica depois dos gastos' }
      : { label: 'Falta', value: formatBRLRounded(-balance), note: 'Vai para o cartão todo mês', alert: true },
    {
      label: 'Dívidas',
      value: debt > 0 ? formatBRLRounded(debt) : 'Nenhuma',
      note: debt > 0 ? persona.debts.map((d) => d.label).join(', ') : 'Sem dívidas em aberto',
      alert: debt > 0,
    },
    {
      label: 'Reserva',
      value: persona.reserve.amount > 0 ? formatBRLRounded(persona.reserve.amount) : 'Nenhuma',
      note:
        persona.reserve.amount > 0
          ? `${persona.reserve.where} · cobre ${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(reserveMonths(persona))} meses de gastos`
          : 'Nada guardado para imprevistos',
    },
    ...planCards(persona),
  ]

  return (
    <dl className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-black/5">
          <dt className="flex items-center gap-1.5 text-sm font-bold text-muted">
            {c.alert && (
              <span aria-label="Atenção" role="img">
                ⚠️
              </span>
            )}
            {c.label}
          </dt>
          <dd className="mt-1 text-2xl font-extrabold text-ink">{c.value}</dd>
          <dd className="mt-1 text-sm text-muted">{c.note}</dd>
        </div>
      ))}
    </dl>
  )
}

// Cartões do plano PrevExemplo, conforme o tipo de vínculo
function planCards(persona) {
  const { plan, income } = persona
  if (plan.kind === 'ativo') {
    const own = income.gross * plan.contributionPct
    const company = employerMatch(income.gross, plan.contributionPct, ASSUMPTIONS.match)
    return [
      { label: 'Saldo no plano', value: formatBRLRounded(plan.balance), note: 'Plano PrevExemplo' },
      {
        label: 'Contribuição',
        value: `${formatPercent(plan.contributionPct)} do salário`,
        note: `${formatBRLRounded(own)} de ${persona.name} + ${formatBRLRounded(company)} da empresa (a empresa acompanha até 8%)`,
      },
    ]
  }
  if (plan.kind === 'assistido') {
    return [
      { label: 'Saldo no plano', value: formatBRLRounded(plan.balance), note: 'Segue rendendo enquanto paga o benefício' },
      { label: 'Benefício do plano', value: formatBRLRounded(plan.monthlyBenefit), note: 'Recebido todo mês' },
    ]
  }
  return [
    {
      label: 'Plano família',
      value: plan.member ? formatBRLRounded(plan.balance) : 'Ainda não participa',
      note: 'Pode entrar no plano para familiares (sem contrapartida)',
    },
  ]
}

// Gráfico de barras dos gastos por categoria, da maior para a menor
function SpendingChart({ persona }) {
  const total = totalExpenses(persona)
  const sorted = [...persona.expenses].sort((a, b) => b.amount - a.amount)
  const max = sorted[0].amount
  return (
    <section className="rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-black/5" aria-labelledby="gastos">
      <h2 id="gastos" className="text-xl font-extrabold text-ink">
        Para onde vai o dinheiro
      </h2>
      <p className="text-muted">Gastos por mês: {formatBRLRounded(total)} no total.</p>
      <ul className="mt-4 space-y-3">
        {sorted.map((e) => {
          const share = e.amount / total
          return (
            <li key={e.id} title={`${e.label}: ${formatBRLRounded(e.amount)} (${formatPercent(share)} dos gastos)`}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-ink">{e.label}</span>
                <span className="shrink-0 font-bold text-ink">
                  {formatBRLRounded(e.amount)}{' '}
                  <span className="text-sm font-semibold text-muted">· {formatPercent(Math.round(share * 100) / 100)}</span>
                </span>
              </div>
              <div className="mt-1 h-2.5 rounded-r bg-leaf/60" aria-hidden="true">
                <div className="h-full rounded-r bg-brand" style={{ width: `${(e.amount / max) * 100}%` }} />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function AssumptionsTable() {
  return (
    <section className="rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-black/5" aria-labelledby="premissas">
      <h2 id="premissas" className="text-xl font-extrabold text-ink">
        Premissas da demo
      </h2>
      <p className="text-muted">
        Valores aproximados. Rendimentos já descontam a inflação: os resultados estão em dinheiro de hoje.
      </p>
      <dl className="mt-4 divide-y divide-black/10">
        {ASSUMPTION_ROWS.map((r) => (
          <div key={r.label} className="py-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <dt className="font-semibold text-ink">{r.label}</dt>
              <dd className="font-extrabold text-brand">{r.value}</dd>
            </div>
            <dd className="text-sm text-muted">{r.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
