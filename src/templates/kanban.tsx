import { rect, text } from './helpers'
import type { BuildResult, DiagramTemplate } from './types'

const COLUMNS: Array<{
  title: string
  color: 'grey' | 'blue' | 'green'
  cards: string[]
}> = [
  { title: 'To Do', color: 'grey', cards: ['Write spec', 'Research prior art'] },
  { title: 'In Progress', color: 'blue', cards: ['Build modal', 'Wire shortcuts'] },
  { title: 'Done', color: 'green', cards: ['Kickoff', 'Pick templates'] },
]

export const kanbanTemplate: DiagramTemplate = {
  id: 'kanban',
  name: 'Kanban board',
  description: 'To Do / In Progress / Done with cards',
  category: 'planning',
  build: ({ center, newId }): BuildResult => {
    const cx = center.x
    const cy = center.y

    const colW = 220
    const colH = 420
    const colGap = 24
    const cardW = 200
    const cardH = 60
    const cardGap = 12
    const headerH = 40

    const totalW = COLUMNS.length * colW + (COLUMNS.length - 1) * colGap
    const firstColX = cx - totalW / 2
    const colY = cy - colH / 2

    const shapes: BuildResult['shapes'] = []

    COLUMNS.forEach((col, i) => {
      const colX = firstColX + i * (colW + colGap)

      shapes.push(
        rect(newId(), {
          x: colX, y: colY, w: colW, h: colH,
          color: col.color,
          fill: 'semi',
          dash: 'dashed',
        }),
        text(newId(), {
          x: colX + 16, y: colY + 12,
          text: col.title,
          color: col.color,
          size: 'l',
        }),
      )

      const cardX = colX + (colW - cardW) / 2
      col.cards.forEach((cardLabel, ci) => {
        const cy2 = colY + headerH + 12 + ci * (cardH + cardGap)
        shapes.push(
          rect(newId(), {
            x: cardX, y: cy2, w: cardW, h: cardH,
            label: cardLabel,
            color: 'black',
            fill: 'solid',
            labelColor: 'white',
            size: 's',
          }),
        )
      })
    })

    return { shapes }
  },
  preview: () => (
    <svg viewBox="0 0 140 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="10" width="38" height="64" rx="3" strokeDasharray="3 2" />
      <rect x="51" y="10" width="38" height="64" rx="3" strokeDasharray="3 2" />
      <rect x="96" y="10" width="38" height="64" rx="3" strokeDasharray="3 2" />
      <rect x="10" y="20" width="30" height="8" rx="1" fill="currentColor" />
      <rect x="10" y="32" width="30" height="8" rx="1" fill="currentColor" />
      <rect x="55" y="20" width="30" height="8" rx="1" fill="currentColor" />
      <rect x="55" y="32" width="30" height="8" rx="1" fill="currentColor" />
      <rect x="100" y="20" width="30" height="8" rx="1" fill="currentColor" />
    </svg>
  ),
}
