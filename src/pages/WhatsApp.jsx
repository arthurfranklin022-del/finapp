import { useEffect, useMemo, useRef } from 'react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import { DateChip, ChallengeMessage, AlertMessage, SummaryMessage, WelcomeMessage } from '../components/whatsapp/Messages.jsx'
import { weekFor } from '../data/situations.js'
import { ASSUMPTIONS } from '../data/assumptions.js'
import { buildConversation } from '../lib/conversation.js'

// Área 2: simulação da conversa no WhatsApp com a PrevExemplo (Etapa 4).
// A conversa segue o dia da demo: cada "Avançar ⏭" faz chegar o desafio do dia seguinte.
// Usa as cores do próprio WhatsApp, para o gestor reconhecer na hora.
export default function WhatsApp({ persona, progress }) {
  const week = useMemo(() => weekFor(persona, ASSUMPTIONS), [persona])
  const messages = buildConversation(persona, progress, week, ASSUMPTIONS)
  const endRef = useRef(null)

  // Rola até a última mensagem quando a conversa abre ou chega mensagem nova
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, persona.id])

  return (
    <PhoneFrame
      statusClassName="bg-[#075E54] text-white"
      caption={
        <>
          <p className="text-lg font-extrabold text-ink">O que {persona.name} recebe no WhatsApp</p>
          <p className="mt-2">
            Sem app para instalar e sem cadastro: a PrevExemplo manda o desafio do dia com um link, alertas de gasto feitos
            com os números da pessoa e um resumo do mês.
          </p>
          <p className="mt-3 text-sm">
            <span className="font-bold text-ink">Modo demo:</span> toque em “Abrir a situação do dia” para responder. Use
            “Avançar ⏭” na barra de cima para a mensagem do dia seguinte chegar. No fim da semana, chega o resumo de
            novembro.
          </p>
        </>
      }
    >
      <div className="z-10 flex items-center gap-3 bg-[#075E54] md:sticky md:top-0 px-4 py-3 text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-extrabold text-[#075E54]">
          PE
        </span>
        <div>
          <p className="font-bold leading-tight">PrevExemplo ✔</p>
          <p className="text-sm text-white/80">Conta comercial · Finapp</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 bg-[#EFE7DD] p-3 text-[#111B21]" role="log" aria-label={`Conversa de ${persona.name} com a PrevExemplo`}>
        <p className="mx-auto rounded-lg bg-[#FFF5C4] px-3 py-1.5 text-center text-sm">
          🔒 Conversa simulada para demonstração. Nenhuma mensagem é enviada de verdade.
        </p>
        {messages.map((m) => {
          switch (m.type) {
            case 'date':
              return <DateChip key={m.id} label={m.label} />
            case 'challenge':
              return <ChallengeMessage key={m.id} m={m} persona={persona} />
            case 'alert':
              return <AlertMessage key={m.id} m={m} />
            case 'welcome':
              return <WelcomeMessage key={m.id} m={m} persona={persona} />
            case 'summary':
              return <SummaryMessage key={m.id} m={m} persona={persona} />
            default:
              return null
          }
        })}
        <p className="mx-auto mt-2 max-w-[90%] text-center text-xs text-[#54656F]">
          Conteúdo educativo. Não é recomendação de investimento nem de produto financeiro. Para não receber mais, responda
          SAIR.
        </p>
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 flex items-center gap-2 bg-[#F0F2F5] p-2" aria-hidden="true">
        <span className="flex-1 rounded-full bg-white px-4 py-2 text-[#5E6A70]">Mensagem</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#008069] text-white">➤</span>
      </div>
    </PhoneFrame>
  )
}
