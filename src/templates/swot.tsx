import { rect, text } from './helpers'
import type { BuildResult, DiagramTemplate } from './types'

const QUADRANTS: Array<{
  title: string
  subtitle: string
  color: 'green' | 'red' | 'blue' | 'orange'
}> = [
  { title: 'Strengths', subtitle: 'Internal · Positive', color: 'green' },
  { title: 'Weaknesses', subtitle: 'Internal · Negative', color: 'red' },
  { title: 'Opportunities', subtitle: 'External · Positive', color: 'blue' },
  { title: 'Threats', subtitle: 'External · Negative', color: 'orange' },
]

export const swotTemplate: DiagramTemplate = {
  id: 'swot',
  name: 'SWOT analysis',
  description: 'Strengths / Weaknesses / Opportunities / Threats',
  category: 'analysis',
  build: ({ center, newId }): BuildResult => {
    const cx = center.x
    const cy = center.y

    const quadW = 260
    const quadH = 200
    const gap = 8

    const positions = [
      { x: cx - quadW - gap / 2, y: cy - quadH - gap / 2 },
      { x: cx + gap / 2, y: cy - quadH - gap / 2 },
      { x: cx - quadW - gap / 2, y: cy + gap / 2 },
      { x: cx + gap / 2, y: cy + gap / 2 },
    ]

    const shapes: BuildResult['shapes'] = []
    QUADRANTS.forEach((q, i) => {
      const pos = positions[i]
      shapes.push(
        rect(newId(), {
          x: pos.x, y: pos.y, w: quadW, h: quadH,
          color: q.color, fill: 'semi',
        }),
        text(newId(), {
          x: pos.x + 16, y: pos.y + 14,
          text: q.title,
          color: q.color,
          size: 'l',
        }),
        text(newId(), {
          x: pos.x + 16, y: pos.y + 44,
          text: q.subtitle,
          color: 'grey',
          size: 's',
        }),
      )
    })

    return { shapes }
  },
  preview: () => (
    <svg viewBox="0 0 140 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="8" width="60" height="30" rx="2" />
      <rect x="72" y="8" width="60" height="30" rx="2" />
      <rect x="8" y="42" width="60" height="30" rx="2" />
      <rect x="72" y="42" width="60" height="30" rx="2" />
      <rect x="12" y="14" width="22" height="4" rx="1" fill="currentColor" />
      <rect x="76" y="14" width="26" height="4" rx="1" fill="currentColor" />
      <rect x="12" y="48" width="30" height="4" rx="1" fill="currentColor" />
      <rect x="76" y="48" width="20" height="4" rx="1" fill="currentColor" />
    </svg>
  ),
}
