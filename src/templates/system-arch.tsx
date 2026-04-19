import { arrow, icon, rect } from './helpers'
import type { BuildResult, DiagramTemplate } from './types'

export const systemArchTemplate: DiagramTemplate = {
  id: 'system-arch',
  name: 'System architecture',
  description: 'Client ↔ API ↔ Database with icons',
  category: 'architecture',
  build: ({ center, newId }): BuildResult => {
    const cx = center.x
    const cy = center.y

    const boxW = 200
    const boxH = 140
    const gap = 80

    const clientBoxId = newId()
    const apiBoxId = newId()
    const dbBoxId = newId()
    const clientIconId = newId()
    const apiIconId = newId()
    const dbIconId = newId()
    const a1 = newId()
    const a2 = newId()

    const iconSize = 56
    // 3-column layout centered at cx. Centers at cx-boxW-gap, cx, cx+boxW+gap.
    const clientCx = cx - (boxW + gap)
    const apiCx = cx
    const dbCx = cx + (boxW + gap)

    const boxOf = (id: string, centerX: number, label: string, color: Parameters<typeof rect>[1]['color']) =>
      rect(id as never, {
        x: centerX - boxW / 2,
        y: cy - boxH / 2,
        w: boxW,
        h: boxH,
        label,
        color,
        size: 'm',
        align: 'middle',
        verticalAlign: 'end',
      })

    const shapes = [
      boxOf(clientBoxId, clientCx, 'Client', 'blue'),
      boxOf(apiBoxId, apiCx, 'API', 'violet'),
      boxOf(dbBoxId, dbCx, 'Database', 'green'),
      icon(clientIconId, {
        x: clientCx - iconSize / 2,
        y: cy - boxH / 2 + 18,
        size: iconSize,
        name: 'Globe',
        color: 'blue',
      }),
      icon(apiIconId, {
        x: apiCx - iconSize / 2,
        y: cy - boxH / 2 + 18,
        size: iconSize,
        name: 'Server',
        color: 'violet',
      }),
      icon(dbIconId, {
        x: dbCx - iconSize / 2,
        y: cy - boxH / 2 + 18,
        size: iconSize,
        name: 'Database',
        color: 'green',
      }),
    ]

    const a = arrow(a1, {
      fromId: clientBoxId, toId: apiBoxId,
      label: 'HTTPS',
      arrowheadStart: 'arrow', arrowheadEnd: 'arrow',
    })
    const b = arrow(a2, {
      fromId: apiBoxId, toId: dbBoxId,
      label: 'SQL',
      arrowheadStart: 'arrow', arrowheadEnd: 'arrow',
    })

    return {
      shapes: [...shapes, a.shape, b.shape],
      bindings: [...a.bindings, ...b.bindings],
    }
  },
  preview: () => (
    <svg viewBox="0 0 140 70" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="18" width="36" height="34" rx="3" />
      <rect x="52" y="18" width="36" height="34" rx="3" />
      <rect x="98" y="18" width="36" height="34" rx="3" />
      <circle cx="24" cy="30" r="5" />
      <rect x="58" y="26" width="24" height="8" rx="1" />
      <ellipse cx="116" cy="28" rx="8" ry="3" />
      <path d="M116 28 v8 M108 36 a8 3 0 0 0 16 0" />
      <path d="M42 35 H52 M88 35 H98" />
    </svg>
  ),
}
