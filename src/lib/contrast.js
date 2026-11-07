// Contraste entre duas cores, pela regra de acessibilidade WCAG.
// Resultado vai de 1 (sem contraste) a 21 (preto no branco).
// Mínimos usados no projeto: 4,5 para texto normal e 3 para texto grande ou ícones.

// "#1F5D3F" -> [31, 93, 63]
export function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`Cor inválida: ${hex}`)
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
}

// Luminância relativa (quanto a cor "acende" para o olho humano)
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(hexA, hexB) {
  const [light, dark] = [luminance(hexA), luminance(hexB)].sort((a, b) => b - a)
  return (light + 0.05) / (dark + 0.05)
}
