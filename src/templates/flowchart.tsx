import { arrow, diamond, ellipse, rect } from './helpers'
import type { BuildResult, DiagramTemplate } from './types'

export const flowchartTemplate: DiagramTemplate = {
  id: 'flowchart',
  name: 'Flowchart',
  description: 'Start → Process → Decision → outcomes',
  category: 'flow',
  build: ({ center, newId }): BuildResult => {
    const cx = center.x
    const cy = center.y

    const startId = newId()
    const procId = newId()
    const decId = newId()
    const successId = newId()
    const failureId = newId()
    const a1 = newId()
    const a2 = newId()
    const a3 = newId()
    const a4 = newId()

    const shapes = [
      ellipse(startId, {
        x: cx - 70, y: cy - 230, w: 140, h: 70,
        label: 'Start', color: 'green', size: 'm',
      }),
      rect(procId, {
        x: cx - 80, y: cy - 120, w: 160, h: 80,
        label: 'Process', size: 'm',
      }),
      diamond(decId, {
        x: cx - 80, y: cy, w: 160, h: 120,
        label: 'Valid?', color: 'orange', size: 'm',
      }),
      ellipse(successId, {
        x: cx - 200, y: cy + 160, w: 140, h: 70,
        label: 'Success', color: 'blue', size: 'm',
      }),
      ellipse(failureId, {
        x: cx + 60, y: cy + 160, w: 140, h: 70,
        label: 'Retry', color: 'red', size: 'm',
      }),
    ]

    const a = arrow(a1, { fromId: startId, toId: procId })
    const b = arrow(a2, { fromId: procId, toId: decId })
    const c = arrow(a3, { fromId: decId, toId: successId, label: 'Yes' })
    const d = arrow(a4, { fromId: decId, toId: failureId, label: 'No' })

    return {
      shapes: [...shapes, a.shape, b.shape, c.shape, d.shape],
      bindings: [...a.bindings, ...b.bindings, ...c.bindings, ...d.bindings],
    }
  },
  preview: () => (
    <svg viewBox="0 0 140 90" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="70" cy="12" rx="18" ry="8" />
      <rect x="52" y="28" width="36" height="14" rx="2" />
      <path d="M70 50 l14 10 -14 10 -14 -10 z" />
      <ellipse cx="35" cy="80" rx="16" ry="6" />
      <ellipse cx="105" cy="80" rx="16" ry="6" />
      <path d="M70 20 V28 M70 42 V50 M62 68 L40 76 M78 68 L100 76" />
    </svg>
  ),
}
