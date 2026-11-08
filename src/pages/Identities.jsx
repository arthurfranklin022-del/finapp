import { identities } from '../data/identities.js'
import BrandSymbol from '../components/brand/BrandSymbol.jsx'
import Broto from '../components/brand/Broto.jsx'

// Página de comparação das 3 identidades visuais (Etapa 1).
// Fica no projeto como registro da escolha, fora da navegação principal (#/identidades).
export default function Identities() {
  return (
    <main className="min-h-dvh bg-zinc-100 text-zinc-900 px-4 py-8 sm:px-8">
      <header className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Etapa 1 · Identidade visual</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold">Qual cara o Finapp vai ter?</h1>
        <p className="mt-3 max-w-3xl text-zinc-700">
          Três opções, cada uma aplicada às mesmas peças: a mensagem no WhatsApp, a situação do dia e um
          indicador do painel da EFPC. Dá para escolher uma ou misturar (por exemplo, as cores de uma com o
          mascote de outra).
        </p>
      </header>

      <div className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-3 lg:gap-6">
        {identities.map((identity) => (
          <IdentityColumn key={identity.id} identity={identity} />
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-sm text-zinc-600">
        Todos os nomes, números e a entidade “PrevExemplo” são fictícios. As combinações de cores foram
        conferidas por teste automático de contraste (mínimo 4,5 : 1, padrão de acessibilidade WCAG AA).
      </p>
    </main>
  )
}

function IdentityColumn({ identity }) {
  const { colors: c, fonts, radius } = identity
  const heading = { fontFamily: fonts.heading }
  return (
    <article
      className="overflow-hidden shadow-sm ring-1 ring-black/5"
      style={{ background: c.background, color: c.text, fontFamily: fonts.body, borderRadius: radius }}
    >
      {/* Cabeçalho da opção */}
      <div className="flex items-center gap-4 p-5" style={{ background: c.primary, color: c.onPrimary }}>
        <div className="flex-1">
          <p className="text-sm font-semibold opacity-80">Opção {identity.letter}</p>
          <h2 className="text-3xl font-bold leading-tight" style={heading}>
            {identity.name}
          </h2>
          <p className="mt-1 text-[0.95rem] opacity-90">{identity.tagline}</p>
        </div>
        <div className="shrink-0 rounded-2xl bg-white/95 p-1.5">
          <BrandSymbol identity={identity} size={84} />
        </div>
      </div>

      <div className="space-y-6 p-5">
        <p className="text-[0.95rem]" style={{ color: c.muted }}>
          {identity.metaphor}
        </p>

        <Section title="Paleta" color={c.muted}>
          <div className="grid grid-cols-4 gap-2">
            {['primary', 'accent', 'background', 'soft'].map((key) => (
              <div key={key} className="text-center">
                <div className="h-12 rounded-lg ring-1 ring-black/10" style={{ background: c[key] }} />
                <p className="mt-1 text-xs font-semibold leading-tight">{identity.colorNames[key]}</p>
                <p className="text-[0.7rem]" style={{ color: c.muted }}>
                  {c[key]}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Tipografia" color={c.muted}>
          <p className="text-sm" style={{ color: c.muted }}>
            {fonts.label}
          </p>
          <p className="mt-1 text-2xl font-bold" style={heading}>
            Sua aposentadoria começa hoje
          </p>
          <p className="mt-1">Texto corrido em tamanho confortável, fácil de ler no celular.</p>
        </Section>

        <Section title={identity.symbol.kind === 'mascote' ? `Mascote: ${identity.symbol.name}` : `Símbolo: ${identity.symbol.name}`} color={c.muted}>
          <p className="text-[0.95rem]">{identity.symbol.description}.</p>
          {identity.id === 'raiz' && (
            <div className="mt-2 grid grid-cols-4 text-center text-xs font-semibold">
              {['Semente', 'Broto', 'Muda', 'Árvore'].map((label, i) => (
                <div key={label}>
                  <Broto stage={i + 1} colors={c} size={64} title={`Fase ${label}`} />
                  <p>{label}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Tom de voz" color={c.muted}>
          <div className="flex flex-wrap gap-1.5">
            {identity.voice.words.map((w) => (
              <span key={w} className="rounded-full px-2.5 py-0.5 text-sm font-semibold" style={{ background: c.soft }}>
                {w}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[0.95rem]">{identity.voice.description}</p>
        </Section>

        <Section title="No WhatsApp" color={c.muted}>
          <WhatsAppSample identity={identity} />
        </Section>

        <Section title="Na situação do dia" color={c.muted}>
          <SituationSample identity={identity} />
        </Section>

        <Section title="No painel da EFPC" color={c.muted}>
          <DashboardSample identity={identity} />
        </Section>
      </div>
    </article>
  )
}

function Section({ title, color, children }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color }}>
        {title}
      </h3>
      {children}
    </section>
  )
}

// Balão de mensagem imitando o WhatsApp (cores do WhatsApp, texto no tom da identidade)
function WhatsAppSample({ identity }) {
  return (
    <div className="rounded-xl p-3" style={{ background: '#EFE7DD' }}>
      <div className="max-w-[92%] rounded-lg rounded-tl-none bg-white p-2.5 text-[0.95rem] text-[#111B21] shadow-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>
        <p className="text-xs font-bold text-[#0B6B57]">PrevExemplo</p>
        <p className="mt-0.5">{identity.voice.sample}</p>
        <p className="mt-1 font-semibold text-[#027EB5] underline">Abrir a situação do dia</p>
        <p className="text-right text-[0.7rem] text-[#5E6A70]">08:02</p>
      </div>
    </div>
  )
}

function SituationSample({ identity }) {
  const { colors: c, radius, fonts } = identity
  const options = ['Continuar como está', 'Cortar pela metade e guardar a diferença', 'Cortar tudo de vez']
  return (
    <div className="p-4 shadow-sm ring-1 ring-black/5" style={{ background: c.surface, borderRadius: radius }}>
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="rounded-full px-2.5 py-0.5" style={{ background: c.accent, color: c.onAccent }}>
          🔥 4 dias seguidos
        </span>
        <span style={{ color: c.primary }}>120 pontos</span>
      </div>
      <p className="mt-3">
        Você gastou <strong>R$ 640</strong> com delivery em outubro.
      </p>
      <p className="mt-1 text-lg font-bold" style={{ fontFamily: fonts.heading }}>
        O que você faria?
      </p>
      <div className="mt-2 space-y-2">
        {options.map((o, i) => (
          <div
            key={o}
            className="px-3 py-2 text-[0.95rem]"
            style={{
              borderRadius: `calc(${radius} * 0.6)`,
              border: `2px solid ${i === 1 ? c.primary : c.soft}`,
              background: i === 1 ? c.soft : c.surface,
              fontWeight: i === 1 ? 600 : 400,
            }}
          >
            {o}
          </div>
        ))}
      </div>
      <div
        className="mt-3 py-2.5 text-center font-bold"
        style={{ background: c.primary, color: c.onPrimary, borderRadius: `calc(${radius} * 0.6)` }}
      >
        Ver o resultado
      </div>
    </div>
  )
}

function DashboardSample({ identity }) {
  const { colors: c, radius, fonts } = identity
  const bars = [38, 45, 52, 58, 66, 74]
  return (
    <div className="p-4 shadow-sm ring-1 ring-black/5" style={{ background: c.surface, borderRadius: radius }}>
      <p className="text-sm" style={{ color: c.muted }}>
        Participantes ativos na trilha
      </p>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-bold" style={{ fontFamily: fonts.heading, color: c.primary }}>
            1.248
          </p>
          <p className="text-sm font-semibold" style={{ color: c.muted }}>
            ▲ 12% no último mês
          </p>
        </div>
        <div className="flex h-14 items-end gap-1" aria-hidden="true">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-3 rounded-t"
              style={{ height: `${h}%`, background: i === bars.length - 1 ? c.accent : c.primary, opacity: i === bars.length - 1 ? 1 : 0.35 + i * 0.1 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
