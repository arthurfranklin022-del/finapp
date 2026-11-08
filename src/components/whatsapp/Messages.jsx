import { useState } from 'react'
import { formatBRLRounded as R } from '../../lib/format.js'
import { QUALITY } from '../trail/quality.js'
import SpendingChart from './SpendingChart.jsx'

// Peças da conversa do WhatsApp. Cores do próprio WhatsApp, para o gestor reconhecer na hora.
const MUTED = 'text-[#5E6A70]'

// Balão de mensagem recebida (da PrevExemplo), com horário no canto
export function Bubble({ time, children, footer }) {
  return (
    <div className="max-w-[88%] self-start">
      <div className="rounded-lg rounded-tl-none bg-white p-2.5 shadow-sm">
        {children}
        <p className={`mt-1 text-right text-xs ${MUTED}`}>{time}</p>
      </div>
      {footer}
    </div>
  )
}

export function DateChip({ label }) {
  return (
    <p className="mx-auto mt-2 rounded-lg bg-white/90 px-3 py-1 text-xs font-semibold text-[#54656F] shadow-sm first-letter:uppercase">
      {label}
    </p>
  )
}

// Botão de resposta rápida, abaixo do balão (como nas contas comerciais)
function ActionButton({ href, children }) {
  return (
    <a
      href={href}
      className="mt-0.5 flex items-center justify-center gap-1 rounded-lg bg-white py-2.5 font-bold text-[#008069] shadow-sm hover:bg-[#F5F6F6] focus-visible:outline-2 focus-visible:outline-[#008069]"
    >
      {children}
    </a>
  )
}

const LEVEL_EMOJI = { semente: '🌰', broto: '🌱', muda: '🪴', arvore: '🌳' }
const days = (n) => (n === 1 ? '1 dia' : `${n} dias`)

export function ChallengeMessage({ m, persona }) {
  const q = m.answer ? QUALITY[m.answer.quality] : null
  let status = null
  if (m.answer)
    status = `✅ Respondida: ${q.icon} ${q.tag} · +${m.answer.points} pontos`
  else if (m.skipped) status = '⏭ Não respondida'
  else if (!m.isToday) status = null

  return (
    <Bubble
      time={m.time}
      footer={
        m.link ? (
          <ActionButton href={m.link}>{m.answer ? '↗ Ver a situação de novo' : '↗ Abrir a situação do dia'}</ActionButton>
        ) : null
      }
    >
      {m.previousSkip === 'protected' && (
        <p className="mb-1">🛡️ Ontem não deu? Tudo bem: a folga da semana protegeu a sua sequência.</p>
      )}
      {m.previousSkip === 'reset' && <p className="mb-1">🌱 A sua sequência recomeçou. Hoje é um ótimo dia para voltar!</p>}
      <p>
        Bom dia, {persona.name}! ☀️ A sua situação de hoje é <strong>“{m.title}”</strong>.
      </p>
      <p className={`mt-1 text-sm ${MUTED}`}>
        {m.theme.emoji} {m.theme.label} · dia {m.day} de 7 · leva uns 2 minutos
      </p>
      {status && <p className="mt-2 rounded-md bg-[#F0F2F5] px-2 py-1 text-sm font-semibold">{status}</p>}
      {!m.link && !m.answer && !m.skipped && <p className={`mt-2 text-sm ${MUTED}`}>Este desafio já passou.</p>}
    </Bubble>
  )
}

export function AlertMessage({ m }) {
  return (
    <Bubble time={m.time}>
      <p className="font-bold">
        {m.icon} {m.title}
      </p>
      {m.lines.map((l) => (
        <p key={l} className="mt-1">
          {l}
        </p>
      ))}
      <p className={`mt-2 text-xs ${MUTED}`}>Premissas: {m.basis}</p>
    </Bubble>
  )
}

export function WelcomeMessage({ m, persona }) {
  return (
    <Bubble time={m.time}>
      <p>
        Oi, {persona.name}! 👋 Como {persona.link.toLowerCase()} da PrevExemplo, agora você recebe por aqui uma situação
        do dia, com os números da sua vida, para cuidar melhor do seu dinheiro.
      </p>
      <p className="mt-1">Para começar, olha como foi o seu mês de outubro:</p>
      <SpendingChart groups={m.groups} overview={m.overview} donut={m.donut} incomeLabel="bolsa" />
      <p className="mt-2">A partir de segunda, a cada manhã chega um desafio novo. Você começa no nível Semente 🌰.</p>
    </Bubble>
  )
}

export function SummaryMessage({ m, persona }) {
  const income = persona.id === 'pedro' ? 'bolsa' : 'renda'
  const final = m.month === 'novembro'
  return (
    <Bubble time={m.time}>
      <p className="font-bold">📊 Seu resumo de {m.month}</p>
      <ul className="mt-1 flex flex-col gap-0.5">
        <li>
          ⭐ <strong>{m.points} pontos</strong>
          {final && ` (+${m.monthPoints} no mês)`}
        </li>
        <li>
          {LEVEL_EMOJI[m.level.id]} Nível <strong>{m.level.name}</strong>
          {final && m.startLevel.id !== m.level.id && ` (subiu de ${m.startLevel.name}!)`}
        </li>
        <li>
          🔥 Sequência de <strong>{days(m.streak)}</strong>
        </li>
        {final && (
          <li>
            ✅ {m.answeredCount} de 7 situações respondidas, <strong>{m.bestCount}</strong> com a melhor escolha
          </li>
        )}
      </ul>
      {final && <ChoicesBlock choices={m.choices} />}
      <SpendingChart groups={m.groups} overview={m.overview} donut={m.donut} incomeLabel={income} />
    </Bubble>
  )
}

// "Quanto você poderia ter guardado": soma das melhores escolhas, com a conta de cada dia
function ChoicesBlock({ choices }) {
  const [open, setOpen] = useState(false)
  const { achieved, potential, values, bestDays } = choices
  const allBest = bestDays.length === values.length
  return (
    <div className="mt-2 rounded-lg bg-leaf/60 p-2.5">
      <p className="text-sm font-bold">💰 Quanto as suas escolhas valem</p>
      <p className="mt-1">
        Com as suas melhores escolhas: <strong>{R(achieved.monthly)} por mês</strong>
        {achieved.monthly > 0 ? ' a mais para você.' : '.'}
      </p>
      {!allBest && (
        <p className="mt-1">
          Escolhendo a melhor em todas, daria para guardar <strong>{R(potential.monthly)} por mês</strong>.
        </p>
      )}
      {potential.once > 0 && (
        <p className="mt-1 text-sm">
          De uma vez só: {R(achieved.once)}
          {!allBest && ` de ${R(potential.once)} possíveis`} economizados.
        </p>
      )}
      {potential.protection.length > 0 && (
        <p className="mt-1 text-sm">
          🛡️ Proteção:{' '}
          {potential.protection
            .map((p) => `${R(p.amount)} ${p.what}${achieved.protection.includes(p) ? '' : ' (não escolhida)'}`)
            .join('; ')}
          .
        </p>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-1 text-sm font-bold text-[#008069] underline"
      >
        {open ? 'Esconder as contas' : 'Ver a conta de cada dia'}
      </button>
      {open && (
        <ol className="mt-1 flex flex-col gap-1 text-sm">
          {values.map((v) => {
            const chosen = bestDays.includes(v.day)
            const unit = v.kind === 'monthly' ? ' por mês' : v.kind === 'once' ? ' de uma vez' : ''
            return (
              <li key={v.day} className={chosen ? '' : MUTED}>
                <span className="font-semibold">
                  {chosen ? '⭐' : '○'} Dia {v.day}, {v.title}:
                </span>{' '}
                {R(v.amount)}
                {unit} {v.what}
                {v.kind === 'protection' && ' (proteção, fora da soma)'}
              </li>
            )
          })}
        </ol>
      )}
      {open && (
        <p className={`mt-2 text-xs ${MUTED}`}>
          Como contamos: comparado com o que você faz hoje (ou, numa decisão nova, com a opção “dá para melhorar”).
          Rendimento a mais aparece como média por mês no prazo da situação, em dinheiro de hoje. O mesmo dinheiro não é
          contado duas vezes. É uma estimativa educativa.
        </p>
      )}
    </div>
  )
}
