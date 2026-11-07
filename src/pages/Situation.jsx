import PhoneFrame from '../components/PhoneFrame.jsx'
import Logo from '../components/Logo.jsx'
import ComingSoon from '../components/ComingSoon.jsx'

// Área 3: a situação do dia (a trilha) que o participante abre pelo link do WhatsApp.
// Conteúdo, pontos, nível e sequência chegam na Etapa 3.
export default function Situation({ persona }) {
  return (
    <PhoneFrame
      statusClassName="bg-cream text-ink"
      caption={
        <>
          <p className="text-lg font-extrabold text-ink">A situação do dia de {persona.name}</p>
          <p className="mt-2">Abre no navegador do celular, direto do link no WhatsApp. Leva cerca de 2 minutos.</p>
        </>
      }
    >
      <div className="flex flex-1 flex-col gap-4 bg-cream p-4">
        <div className="flex items-center justify-between">
          <Logo size={34} />
          <span className="text-sm font-semibold text-muted">PrevExemplo</span>
        </div>
        <div>
          <p className="text-muted">Bom dia,</p>
          <h1 className="text-2xl font-extrabold text-ink">{persona.name} 🌱</h1>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center" aria-label="Seu progresso">
          {[
            ['Sequência', '🔥 —'],
            ['Pontos', '—'],
            ['Nível', 'Broto'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-surface p-2 shadow-sm ring-1 ring-black/5">
              <p className="text-xs font-bold uppercase text-muted">{label}</p>
              <p className="font-extrabold text-brand">{value}</p>
            </div>
          ))}
        </div>
        <ComingSoon stage={3}>
          Uma situação com os números de {persona.name}, a pergunta “o que você faria?”, três opções e o cálculo
          de cada escolha.
        </ComingSoon>
        <p className="mt-auto pt-2 text-center text-xs text-muted">
          Conteúdo educativo. Não é recomendação de investimento nem de produto financeiro.
        </p>
      </div>
    </PhoneFrame>
  )
}
