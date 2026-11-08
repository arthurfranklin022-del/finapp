// Mascote "Sábia" (opção C — Coruja): coruja curiosa que puxa conversa.
export default function Owl({ colors, size = 120, title = 'Sábia, a coruja mascote' }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={title}>
      <title>{title}</title>
      {/* orelhas (tufos) */}
      <path d="M30 34 L 26 12 L 46 26 Z" fill={colors.primary} />
      <path d="M90 34 L 94 12 L 74 26 Z" fill={colors.primary} />
      {/* corpo */}
      <ellipse cx="60" cy="66" rx="36" ry="44" fill={colors.primary} />
      {/* barriga */}
      <ellipse cx="60" cy="82" rx="22" ry="24" fill={colors.soft} />
      <g stroke={colors.primary} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5">
        <path d="M50 78 q 4 4 8 0" />
        <path d="M62 78 q 4 4 8 0" />
        <path d="M56 88 q 4 4 8 0" />
      </g>
      {/* asas */}
      <path d="M26 60 C 16 74 20 92 30 98 C 32 84 32 72 26 60 Z" fill="#0A464C" />
      <path d="M94 60 C 104 74 100 92 90 98 C 88 84 88 72 94 60 Z" fill="#0A464C" />
      {/* olhos */}
      <circle cx="45" cy="46" r="15" fill="#FFFFFF" />
      <circle cx="75" cy="46" r="15" fill="#FFFFFF" />
      <circle cx="47" cy="47" r="7" fill={colors.text} />
      <circle cx="73" cy="47" r="7" fill={colors.text} />
      <circle cx="49" cy="44" r="2.2" fill="#FFFFFF" />
      <circle cx="75" cy="44" r="2.2" fill="#FFFFFF" />
      {/* bico */}
      <path d="M54 58 L 66 58 L 60 68 Z" fill={colors.accent} />
      {/* pés */}
      <g fill={colors.accent}>
        <ellipse cx="48" cy="109" rx="7" ry="4" />
        <ellipse cx="72" cy="109" rx="7" ry="4" />
      </g>
    </svg>
  )
}
