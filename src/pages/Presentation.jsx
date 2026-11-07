import Broto from '../components/brand/Broto.jsx'
import { brandColors } from '../data/identities.js'
import ComingSoon from '../components/ComingSoon.jsx'
import { AREAS, hashForPage } from '../lib/router.js'

const DESCRIPTIONS = {
  whatsapp: 'O participante recebe dicas, alertas e o desafio do dia no WhatsApp.',
  situacao: 'Uma situação do dia a dia, com os números da própria pessoa.',
  painel: 'A entidade acompanha adesão, engajamento e evolução.',
}

// Área 1: página de apresentação para o gestor da EFPC (conteúdo completo na Etapa 6)
export default function Presentation() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 lg:py-16">
      <section className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-bold text-brand">Para entidades fechadas de previdência complementar</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            Educação financeira que cresce com cada participante
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            O Finapp leva educação financeira e previdenciária ao participante pelo WhatsApp, com situações
            montadas a partir da vida real de cada pessoa.
          </p>
        </div>
        <div className="flex justify-center gap-1 md:gap-2" aria-label="As fases do Broto: semente, broto, muda e árvore">
          {[1, 2, 3, 4].map((s) => (
            <Broto key={s} stage={s} colors={brandColors} size={s === 4 ? 120 : 64 + s * 12} title={`Broto, fase ${s}`} />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {AREAS.filter((a) => a.id !== 'apresentacao').map((area) => (
          <a
            key={area.id}
            href={hashForPage(area.id)}
            className="group rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-xl font-extrabold text-brand">{area.label}</h2>
            <p className="mt-1 text-muted">{DESCRIPTIONS[area.id]}</p>
            <p className="mt-3 font-bold text-brand group-hover:underline">Ver na demo →</p>
          </a>
        ))}
      </section>

      <div className="mt-10">
        <ComingSoon stage={6}>
          A história completa para o gestor: o problema, a solução, como funciona e os benefícios para a entidade.
        </ComingSoon>
      </div>
    </div>
  )
}
