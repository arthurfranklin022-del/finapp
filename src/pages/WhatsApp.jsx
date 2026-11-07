import PhoneFrame from '../components/PhoneFrame.jsx'

// Área 2: simulação da conversa no WhatsApp com a PrevExemplo (conteúdo na Etapa 4).
// Usa as cores do próprio WhatsApp, para o gestor reconhecer na hora.
export default function WhatsApp({ persona }) {
  return (
    <PhoneFrame
      statusClassName="bg-[#075E54] text-white"
      caption={
        <>
          <p className="text-lg font-extrabold text-ink">O que {persona.name} recebe no WhatsApp</p>
          <p className="mt-2">
            Sem app para instalar e sem cadastro: a conversa vem da PrevExemplo, com um link para a situação do dia.
          </p>
        </>
      }
    >
      <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-extrabold text-[#075E54]">
          PE
        </span>
        <div>
          <p className="font-bold leading-tight">PrevExemplo</p>
          <p className="text-sm text-white/80">Conta comercial</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 bg-[#EFE7DD] p-3 text-[#111B21]">
        <p className="mx-auto rounded-lg bg-[#FFF5C4] px-3 py-1.5 text-center text-sm">
          🔒 Conversa simulada para demonstração. Nenhuma mensagem é enviada de verdade.
        </p>
        <div className="max-w-[85%] rounded-lg rounded-tl-none bg-white p-3 shadow-sm">
          <p>
            Olá, {persona.name}! As mensagens de desafio do dia, alerta de gasto e resumo do mês chegam na{' '}
            <strong>Etapa 4</strong>.
          </p>
          <p className="mt-1 text-right text-xs text-[#5E6A70]">08:02</p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-[#F0F2F5] p-2" aria-hidden="true">
        <span className="flex-1 rounded-full bg-white px-4 py-2 text-[#5E6A70]">Mensagem</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#008069] text-white">➤</span>
      </div>
    </PhoneFrame>
  )
}
