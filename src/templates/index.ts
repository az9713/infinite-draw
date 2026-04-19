import { flowchartTemplate } from './flowchart'
import { kanbanTemplate } from './kanban'
import { microservicesTemplate } from './microservices'
import { mindmapTemplate } from './mindmap'
import { orgChartTemplate } from './org-chart'
import { sequenceTemplate } from './sequence'
import { swotTemplate } from './swot'
import { systemArchTemplate } from './system-arch'
import type { DiagramTemplate } from './types'

export const TEMPLATE_CATALOG: DiagramTemplate[] = [
  flowchartTemplate,
  sequenceTemplate,
  systemArchTemplate,
  microservicesTemplate,
  mindmapTemplate,
  kanbanTemplate,
  orgChartTemplate,
  swotTemplate,
]

export { CATEGORY_LABELS } from './types'
export type { DiagramTemplate, TemplateCategory } from './types'
