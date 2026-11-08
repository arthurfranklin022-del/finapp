import ComingSoon from '../components/ComingSoon.jsx'

const KPIS = [
  { label: 'Participantes ativos na trilha', hint: 'Adesão e engajamento' },
  { label: 'Evolução do nível por perfil', hint: 'Endividados, poupadores, aposentados, jovens' },
  { label: 'Temas com mais dúvida', hint: 'Previdência, orçamento e dívidas, investimentos' },
]

// Área 4: painel da EFPC, pensado para o notebook do gestor (dados e gráficos na Etapa 5)
export default function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-bold text-brand">Painel da entidade</p>
          <h1 className="text-3xl font-extrabold text-ink">PrevExemplo</h1>
        </div>
        <p className="text-sm text-muted">Dados fictícios para demonstração</p>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-black/5">
            <p className="text-muted">{kpi.label}</p>
            <p className="mt-1 text-4xl font-extrabold text-brand">—</p>
            <p className="mt-1 text-sm text-muted">{kpi.hint}</p>
          </div>
        ))}
      </section>

      <div className="mt-6">
        <ComingSoon stage={5}>
          Gráficos de adesão, engajamento e evolução calculados sobre uma população fictícia de participantes.
        </ComingSoon>
      </div>
    </div>
  )
}
