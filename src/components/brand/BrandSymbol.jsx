import Broto from './Broto.jsx'
import Sunrise from './Sunrise.jsx'
import Owl from './Owl.jsx'

// Mostra o símbolo ou mascote de uma identidade
export default function BrandSymbol({ identity, size = 120, stage }) {
  if (identity.id === 'raiz') return <Broto colors={identity.colors} size={size} stage={stage} />
  if (identity.id === 'horizonte') return <Sunrise colors={identity.colors} size={size} />
  return <Owl colors={identity.colors} size={size} />
}
