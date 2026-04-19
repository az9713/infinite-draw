import type { ReactNode } from 'react'
import type { TLShapeId, TLShapePartial } from 'tldraw'
import type { IconShape } from '@/shapes/IconShapeUtil'

export type TemplateCategory = 'flow' | 'architecture' | 'planning' | 'analysis'

export interface BuildContext {
  center: { x: number; y: number }
  newId: () => TLShapeId
}

export interface TemplateBindingSpec {
  fromId: TLShapeId
  toId: TLShapeId
  terminal: 'start' | 'end'
  anchor?: { x: number; y: number }
  isPrecise?: boolean
}

export interface BuildResult {
  // Use a permissive shape partial union so templates can emit geo, text, arrow,
  // line, and our custom icon shape from a single factory surface.
  shapes: Array<TLShapePartial | TLShapePartial<IconShape>>
  bindings?: TemplateBindingSpec[]
}

export interface DiagramTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  preview: () => ReactNode
  build: (ctx: BuildContext) => BuildResult
}

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  flow: 'Flow',
  architecture: 'Architecture',
  planning: 'Planning',
  analysis: 'Analysis',
}
