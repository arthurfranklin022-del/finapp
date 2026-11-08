import Broto from './brand/Broto.jsx'
import { brandColors } from '../data/identities.js'

// Marca do Finapp: o Broto + o nome
export default function Logo({ size = 36, stage = 2, light = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 font-extrabold ${className}`}>
      <span className={`inline-flex rounded-xl ${light ? 'bg-white' : 'bg-leaf'}`}>
        <Broto colors={brandColors} size={size} stage={stage} title="Broto, o mascote do Finapp" />
      </span>
      <span className={light ? 'text-white' : 'text-brand'}>Finapp</span>
    </span>
  )
}
