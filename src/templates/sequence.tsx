import { arrow, line, rect } from './helpers'
import type { BuildResult, DiagramTemplate } from './types'

const ACTORS = ['Client', 'API', 'Database']
const MESSAGES = [
  { from: 0, to: 1, label: 'POST /login' },
  { from: 1, to: 2, label: 'SELECT user' },
  { from: 2, to: 1, label: 'row', reverse: true },
  { from: 1, to: 0, label: '200 OK', reverse: true },
]

export const sequenceTemplate: DiagramTemplate = {
  id: 'sequence',
  name: 'Sequence diagram',
  description: 'Actors, lifelines, and messages',
  category: 'flow',
  build: ({ center, newId }): BuildResult => {
    const cx = center.x
    const cy = center.y

    const headerW = 140
    const headerH = 48
    const laneGap = 200
    const lifelineLen = 340
    const msgSpacing = 70

    const totalW = (ACTORS.length - 1) * laneGap + headerW
    const firstLaneX = cx - totalW / 2 + headerW / 2
    const topY = cy - lifelineLen / 2 - headerH / 2

    const actorIds = ACTORS.map(() => newId())
    const shapes: BuildResult['shapes'] = []
    const bindings: BuildResult['bindings'] = []

    ACTORS.forEach((name, i) => {
      const lx = firstLaneX + i * laneGap
      shapes.push(
        rect(actorIds[i], {
          x: lx - headerW / 2, y: topY,
          w: headerW, h: headerH,
          label: name,
          color: 'blue',
          fill: 'semi',
          size: 'm',
        }),
        // Lifeline as a dashed vertical line beneath each actor header.
        line(newId(), {
          x: lx,
          y: topY + headerH + 4,
          points: [
            { x: 0, y: 0 },
            { x: 0, y: lifelineLen },
          ],
          dash: 'dashed',
          color: 'grey',
        }),
      )
    })

    MESSAGES.forEach((m, i) => {
      const lxFrom = firstLaneX + m.from * laneGap
      const lxTo = firstLaneX + m.to * laneGap
      const msgY = topY + headerH + 30 + i * msgSpacing
      const a = arrow(newId(), {
        fromId: actorIds[m.from], toId: actorIds[m.to],
        label: m.label,
        dash: m.reverse ? 'dashed' : 'solid',
        color: m.reverse ? 'grey' : 'black',
        start: { x: lxFrom, y: msgY },
        end: { x: lxTo, y: msgY },
      })
      shapes.push(a.shape)
      bindings.push(...a.bindings)
    })

    return { shapes, bindings }
  },
  preview: () => (
    <svg viewBox="0 0 140 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="10" y="6" width="26" height="12" rx="2" />
      <rect x="56" y="6" width="28" height="12" rx="2" />
      <rect x="104" y="6" width="26" height="12" rx="2" />
      <path d="M23 20 V74" strokeDasharray="2 2" />
      <path d="M70 20 V74" strokeDasharray="2 2" />
      <path d="M117 20 V74" strokeDasharray="2 2" />
      <path d="M23 30 H68 M70 42 H115 M70 56 H24 M117 68 H25" markerEnd="url(#)" />
    </svg>
  ),
}
