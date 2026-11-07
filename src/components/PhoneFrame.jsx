// Moldura de celular: no notebook, desenha um celular no centro da tela;
// no celular de verdade, o conteúdo ocupa a tela toda (sem moldura).
export default function PhoneFrame({ children, statusClassName = 'bg-brand text-white', caption }) {
  return (
    <div className="flex flex-1 flex-col md:flex-row md:items-center md:justify-center md:gap-12 md:px-6 md:py-8">
      <div className="relative flex flex-1 flex-col md:h-[min(780px,calc(100dvh-7rem))] md:w-[390px] md:flex-none md:overflow-hidden md:rounded-[2.75rem] md:border-[10px] md:border-zinc-900 md:bg-cream md:shadow-2xl">
        {/* barra de status do celular (só no notebook) */}
        <div className={`hidden shrink-0 items-center justify-between px-6 pt-2 pb-1 text-xs font-bold md:flex ${statusClassName}`} aria-hidden="true">
          <span>08:02</span>
          <span className="h-5 w-24 rounded-full bg-zinc-900" />
          <span>▂▄▆ 🔋</span>
        </div>
        <div className="flex flex-1 flex-col md:overflow-y-auto">{children}</div>
      </div>
      {caption && <aside className="hidden max-w-xs text-muted lg:block">{caption}</aside>}
    </div>
  )
}
