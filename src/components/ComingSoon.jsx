// Aviso de "em construção" das áreas que ainda serão preenchidas
export default function ComingSoon({ stage, children }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-brand/30 bg-surface/70 p-4 text-muted">
      <p className="text-sm font-extrabold uppercase tracking-wide text-brand">Chega na Etapa {stage}</p>
      <p className="mt-1">{children}</p>
    </div>
  )
}
