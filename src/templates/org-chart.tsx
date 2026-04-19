import { arrow, rect } from './helpers'
import type { BuildResult, DiagramTemplate } from './types'

export const orgChartTemplate: DiagramTemplate = {
  id: 'org-chart',
  name: 'Org chart',
  description: 'CEO → 3 reports → ICs',
  category: 'planning',
  build: ({ center, newId }): BuildResult => {
    const cx = center.x
    const cy = center.y

    const nodeW = 140
    const nodeH = 64
    const level1Y = cy - 220
    const level2Y = cy - 40
    const level3Y = cy + 140

    const ceoId = newId()
    const mgrIds = [newId(), newId(), newId()]
    const icIds = [newId(), newId(), newId(), newId(), newId(), newId()]

    const mgrCxs = [cx - 220, cx, cx + 220]
    // Two ICs under each manager, slightly spread.
    const icCxs = [
      mgrCxs[0] - 80, mgrCxs[0] + 80,
      mgrCxs[1] - 80, mgrCxs[1] + 80,
      mgrCxs[2] - 80, mgrCxs[2] + 80,
    ]

    const shapes = [
      rect(ceoId, {
        x: cx - nodeW / 2, y: level1Y, w: nodeW, h: nodeH,
        label: 'CEO', color: 'violet', fill: 'semi', size: 'm',
      }),
      ...mgrIds.map((id, i) =>
        rect(id, {
          x: mgrCxs[i] - nodeW / 2, y: level2Y, w: nodeW, h: nodeH,
          label: ['Engineering', 'Product', 'Design'][i],
          color: ['blue', 'green', 'orange'][i] as 'blue' | 'green' | 'orange',
          fill: 'semi', size: 'm',
        }),
      ),
      ...icIds.map((id, i) =>
        rect(id, {
          x: icCxs[i] - nodeW / 2 + 20, y: level3Y, w: nodeW - 40, h: nodeH - 14,
          label: ['Alex', 'Sam', 'Pat', 'Jess', 'Morgan', 'Chris'][i],
          size: 's',
        }),
      ),
    ]

    const allBindings: BuildResult['bindings'] = []

    for (const mgrId of mgrIds) {
      const a = arrow(newId(), { fromId: ceoId, toId: mgrId, arrowheadEnd: 'none' })
      shapes.push(a.shape)
      allBindings.push(...a.bindings)
    }
    for (let i = 0; i < 6; i++) {
      const mgr = mgrIds[Math.floor(i / 2)]
      const a = arrow(newId(), { fromId: mgr, toId: icIds[i], arrowheadEnd: 'none' })
      shapes.push(a.shape)
      allBindings.push(...a.bindings)
    }

    return { shapes, bindings: allBindings }
  },
  preview: () => (
    <svg viewBox="0 0 140 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="58" y="6" width="24" height="12" rx="2" />
      <rect x="14" y="32" width="24" height="12" rx="2" />
      <rect x="58" y="32" width="24" height="12" rx="2" />
      <rect x="102" y="32" width="24" height="12" rx="2" />
      <rect x="6" y="60" width="18" height="10" rx="2" />
      <rect x="28" y="60" width="18" height="10" rx="2" />
      <rect x="50" y="60" width="18" height="10" rx="2" />
      <rect x="72" y="60" width="18" height="10" rx="2" />
      <rect x="94" y="60" width="18" height="10" rx="2" />
      <rect x="116" y="60" width="18" height="10" rx="2" />
      <path d="M70 18 V32 M26 18 L26 32 M26 18 L70 18 L114 18 L114 32 M15 44 V60 M37 44 V60 M59 44 V60 M81 44 V60 M103 44 V60 M125 44 V60" />
    </svg>
  ),
}
