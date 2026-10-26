import { Coffee, GlassWater, Martini, Wine } from 'lucide-react'
import type { Glass } from '../types.ts'

// Rocks and coupe are drawn by hand to match the mockups; Lucide covers the rest.
const svg = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

function GlassIcon({ glass, size = 26 }: { glass: Glass; size?: number }) {
  switch (glass) {
    case 'rocks':
      return (
        <svg {...svg} width={size} height={size}>
          <path d="M5 6h14l-1.5 14h-11z" />
          <path d="M6 11h12" />
        </svg>
      )
    case 'coupe':
      return (
        <svg {...svg} width={size} height={size}>
          <path d="M3 5h18c0 4-4 6-9 6S3 9 3 5Z" />
          <path d="M12 11v9" />
          <path d="M8 20h8" />
        </svg>
      )
    case 'highball':
    case 'collins':
      return <GlassWater size={size} aria-hidden />
    case 'flute':
      return <Wine size={size} aria-hidden />
    case 'mug':
      return <Coffee size={size} aria-hidden />
    default:
      return <Martini size={size} aria-hidden />
  }
}

export default GlassIcon
