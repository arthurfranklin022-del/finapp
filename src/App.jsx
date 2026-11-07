import { formatBRL } from './lib/format.js'

// Tela provisória da Etapa 0. Navegação e identidade visual chegam na Etapa 1.
export default function App() {
  return (
    <main className="min-h-dvh bg-slate-50 text-slate-800 flex items-center justify-center p-6">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">Olá, Finapp 👋</h1>
        <p className="mt-4 text-lg text-slate-600">
          Educação financeira e previdenciária para os participantes da{' '}
          <strong>PrevExemplo</strong>.
        </p>
        <p className="mt-6 text-sm text-slate-500">
          Projeto preparado (Etapa 0). Exemplo de valor formatado: {formatBRL(1234.5)}
        </p>
      </section>
    </main>
  )
}
