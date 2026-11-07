// Navegação por "#" no endereço (ex.: .../#/whatsapp).
// Funciona sem servidor e no Netlify sem configuração extra.

// As 4 áreas da demo + a ficha da persona, na ordem em que aparecem na barra
export const AREAS = [
  { id: 'apresentacao', label: 'Apresentação', short: 'Início' },
  { id: 'whatsapp', label: 'WhatsApp', short: 'WhatsApp' },
  { id: 'situacao', label: 'Situação do dia', short: 'Situação' },
  { id: 'painel', label: 'Painel da EFPC', short: 'Painel' },
  // Ferramenta do apresentador: quem é a persona e seus números (Etapa 2)
  { id: 'persona', label: 'Ficha da persona', short: 'Ficha' },
]

// Páginas que existem mas não aparecem na barra (ex.: registro da comparação)
export const HIDDEN_PAGES = ['identidades']

export const DEFAULT_PAGE = 'apresentacao'

const KNOWN = new Set([...AREAS.map((a) => a.id), ...HIDDEN_PAGES])

// "#/whatsapp" -> "whatsapp"; endereço vazio ou desconhecido -> página inicial
export function pageFromHash(hash) {
  const id = (hash || '').replace(/^#\/?/, '').split(/[/?]/)[0].toLowerCase()
  return KNOWN.has(id) ? id : DEFAULT_PAGE
}

export function hashForPage(id) {
  return `#/${id}`
}
