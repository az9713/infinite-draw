import { arrow, ellipse, rect } from './helpers'
import type { BuildResult, DiagramTemplate } from './types'

const BRANCH_LABELS = ['Goals', 'People', 'Risks', 'Tasks', 'Ideas']
const BRANCH_COLORS: Array<'blue' | 'green' | 'red' | 'orange' | 'violet'> = [
  'blue', 'green', 'red', 'orange', 'violet',
]

export const mindmapTemplate: DiagramTemplate = {
  id: 'mindmap',
  name: 'Mind map',
  description: 'Central topic with 5 radial branches',
  category: 'planning',
  build: ({ center, newId }): BuildResult => {
    const cx = center.x
    const cy = center.y

    const centralId = newId()
    const centralW = 180
    const centralH = 90

    const shapes = [
      ellipse(centralId, {
        x: cx - centralW / 2, y: cy - centralH / 2,
        w: centralW, h: centralH,
        label: 'Topic', color: 'violet', size: 'l',
        fill: 'semi',
      }),
    ]
    const allBindings: BuildResult['bindings'] = []

    const branchW = 160
    const branchH = 64
    const radius = 280

    for (let i = 0; i < 5; i++) {
      // Fan branches out over ~300° so they don't overlap; start at 110° (top-left-ish).
      const angle = (-110 - i * 60) * (Math.PI / 180)
      const bx = cx + Math.cos(angle) * radius - branchW / 2
      const by = cy + Math.sin(angle) * radius - branchH / 2

      const branchId = newId()
      const arrowId = newId()

      shapes.push(
        rect(branchId, {
          x: bx, y: by, w: branchW, h: branchH,
          label: BRANCH_LABELS[i],
          color: BRANCH_COLORS[i],
          fill: 'semi',
          size: 'm',
        }),
      )

      const a = arrow(arrowId, {
        fromId: centralId, toId: branchId,
        arrowheadEnd: 'none',
        color: BRANCH_COLORS[i],
      })
      shapes.push(a.shape)
      allBindings.push(...a.bindings)
    }

    return { shapes, bindings: allBindings }
  },
  preview: () => (
    <svg viewBox="0 0 140 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="70" cy="40" rx="18" ry="10" />
      <circle cx="20" cy="16" r="7" />
      <circle cx="20" cy="64" r="7" />
      <circle cx="120" cy="16" r="7" />
      <circle cx="120" cy="64" r="7" />
      <circle cx="70" cy="72" r="6" />
      <path d="M55 34 L26 20 M55 46 L26 60 M85 34 L114 20 M85 46 L114 60 M70 50 V66" />
    </svg>
  ),
}
