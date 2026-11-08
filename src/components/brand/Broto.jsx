// Mascote "Broto" (opção A — Raiz): uma plantinha num vaso que cresce com o nível.
// stage: 1 = semente, 2 = broto, 3 = muda, 4 = árvore
export default function Broto({ stage = 2, colors, size = 120, title = 'Broto, o mascote' }) {
  const leaf = colors.primary
  const leafLight = '#3F8A5F'
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={title}>
      <title>{title}</title>
      {/* caule e folhas, conforme a fase */}
      {stage === 1 && (
        <>
          <path d="M60 58 C 60 50 64 46 70 46" stroke={leafLight} strokeWidth="4" fill="none" strokeLinecap="round" />
          <ellipse cx="60" cy="61" rx="9" ry="6" fill="#8A5A2B" />
        </>
      )}
      {stage >= 2 && <path d="M60 70 V 30" stroke={leaf} strokeWidth="5" strokeLinecap="round" />}
      {stage >= 2 && stage < 4 && (
        <>
          <path d="M60 46 C 44 46 36 36 36 26 C 50 26 60 34 60 46 Z" fill={leafLight} />
          <path d="M60 40 C 76 40 84 30 84 20 C 70 20 60 28 60 40 Z" fill={leaf} />
        </>
      )}
      {stage === 3 && (
        <>
          <path d="M60 60 C 46 60 40 52 40 44 C 52 44 60 50 60 60 Z" fill={leaf} />
          <path d="M60 56 C 74 56 80 48 80 40 C 68 40 60 46 60 56 Z" fill={leafLight} />
        </>
      )}
      {stage === 4 && (
        <>
          <circle cx="60" cy="30" r="22" fill={leaf} />
          <circle cx="44" cy="40" r="14" fill={leafLight} />
          <circle cx="76" cy="40" r="14" fill={leafLight} />
          <circle cx="68" cy="22" r="4" fill={colors.accent} />
          <circle cx="50" cy="28" r="3.5" fill={colors.accent} />
        </>
      )}
      {/* vaso */}
      <path d="M30 70 H 90 L 84 112 H 36 Z" fill={colors.accent} />
      <rect x="26" y="64" width="68" height="12" rx="4" fill="#D08A26" />
      {/* rostinho */}
      <circle cx="50" cy="90" r="3.5" fill={colors.text} />
      <circle cx="70" cy="90" r="3.5" fill={colors.text} />
      <path d="M53 98 Q 60 104 67 98" stroke={colors.text} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="44" cy="97" r="3" fill="#F08A6B" opacity="0.6" />
      <circle cx="76" cy="97" r="3" fill="#F08A6B" opacity="0.6" />
    </svg>
  )
}
