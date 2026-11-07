import { useId } from 'react'

// Símbolo "Sol nascente" (opção B — Horizonte): sol surgindo sobre linhas de horizonte.
export default function Sunrise({ colors, size = 120, title = 'Símbolo: sol nascendo no horizonte' }) {
  const clipId = useId()
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={title}>
      <title>{title}</title>
      <rect width="120" height="120" rx="26" fill={colors.primary} />
      <clipPath id={clipId}>
        <rect x="0" y="0" width="120" height="72" />
      </clipPath>
      {/* raios */}
      <g stroke={colors.accent} strokeWidth="5" strokeLinecap="round">
        <path d="M60 20 V 28" />
        <path d="M32 32 L 38 38" />
        <path d="M88 32 L 82 38" />
        <path d="M20 58 H 28" />
        <path d="M92 58 H 100" />
      </g>
      <circle cx="60" cy="72" r="26" fill={colors.accent} clipPath={`url(#${clipId})`} />
      {/* horizonte */}
      <g stroke={colors.onPrimary} strokeLinecap="round">
        <path d="M18 76 H 102" strokeWidth="5" />
        <path d="M32 88 H 88" strokeWidth="5" opacity="0.7" />
        <path d="M46 100 H 74" strokeWidth="5" opacity="0.45" />
      </g>
    </svg>
  )
}
