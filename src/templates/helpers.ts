import { toRichText, type TLShapeId, type TLShapePartial } from 'tldraw'
import type { IconShape } from '@/shapes/IconShapeUtil'
import type { TemplateBindingSpec } from './types'

type Color =
  | 'black' | 'grey' | 'light-violet' | 'violet' | 'blue' | 'light-blue'
  | 'yellow' | 'orange' | 'green' | 'light-green' | 'light-red' | 'red'
  | 'white'

type GeoKind =
  | 'rectangle' | 'ellipse' | 'diamond' | 'triangle' | 'hexagon' | 'octagon'
  | 'pentagon' | 'star' | 'rhombus' | 'oval' | 'trapezoid' | 'heart'
  | 'cloud' | 'check-box' | 'x-box'

interface GeoOpts {
  x: number
  y: number
  w: number
  h: number
  label?: string
  color?: Color
  fill?: 'none' | 'semi' | 'solid' | 'pattern'
  labelColor?: Color
  size?: 's' | 'm' | 'l' | 'xl'
  align?: 'start' | 'middle' | 'end'
  verticalAlign?: 'start' | 'middle' | 'end'
  dash?: 'draw' | 'solid' | 'dashed' | 'dotted'
}

function geoPartial(
  id: TLShapeId,
  geo: GeoKind,
  opts: GeoOpts,
): TLShapePartial {
  return {
    id,
    type: 'geo',
    x: opts.x,
    y: opts.y,
    props: {
      geo,
      w: opts.w,
      h: opts.h,
      color: opts.color ?? 'black',
      fill: opts.fill ?? 'none',
      labelColor: opts.labelColor ?? opts.color ?? 'black',
      size: opts.size ?? 'm',
      align: opts.align ?? 'middle',
      verticalAlign: opts.verticalAlign ?? 'middle',
      dash: opts.dash ?? 'draw',
      richText: toRichText(opts.label ?? ''),
    },
  }
}

export function rect(id: TLShapeId, opts: GeoOpts): TLShapePartial {
  return geoPartial(id, 'rectangle', opts)
}

export function ellipse(id: TLShapeId, opts: GeoOpts): TLShapePartial {
  return geoPartial(id, 'ellipse', opts)
}

export function diamond(id: TLShapeId, opts: GeoOpts): TLShapePartial {
  return geoPartial(id, 'diamond', opts)
}

export function geo(
  id: TLShapeId,
  kind: GeoKind,
  opts: GeoOpts,
): TLShapePartial {
  return geoPartial(id, kind, opts)
}

export interface TextOpts {
  x: number
  y: number
  text: string
  color?: Color
  size?: 's' | 'm' | 'l' | 'xl'
  w?: number
  textAlign?: 'start' | 'middle' | 'end'
}

export function text(id: TLShapeId, opts: TextOpts): TLShapePartial {
  return {
    id,
    type: 'text',
    x: opts.x,
    y: opts.y,
    props: {
      richText: toRichText(opts.text),
      color: opts.color ?? 'black',
      size: opts.size ?? 'm',
      w: opts.w ?? 200,
      autoSize: opts.w === undefined,
      textAlign: opts.textAlign ?? 'start',
    },
  }
}

export interface IconOpts {
  x: number
  y: number
  size: number
  name: string
  color?: Color
  strokeWidth?: number
}

export function icon(
  id: TLShapeId,
  opts: IconOpts,
): TLShapePartial<IconShape> {
  return {
    id,
    type: 'icon',
    x: opts.x,
    y: opts.y,
    props: {
      w: opts.size,
      h: opts.size,
      name: opts.name,
      color: opts.color ?? 'black',
      strokeWidth: opts.strokeWidth ?? 2,
    },
  }
}

export interface ArrowOpts {
  fromId: TLShapeId
  toId: TLShapeId
  // Initial endpoints are overridden by binding once the shapes exist,
  // but tldraw validates them on create so we need sensible defaults.
  start?: { x: number; y: number }
  end?: { x: number; y: number }
  color?: Color
  bend?: number
  label?: string
  size?: 's' | 'm' | 'l' | 'xl'
  dash?: 'draw' | 'solid' | 'dashed' | 'dotted'
  arrowheadStart?: 'none' | 'arrow' | 'triangle' | 'dot' | 'diamond' | 'bar'
  arrowheadEnd?: 'none' | 'arrow' | 'triangle' | 'dot' | 'diamond' | 'bar'
}

export interface ArrowResult {
  shape: TLShapePartial
  bindings: TemplateBindingSpec[]
}

export function arrow(id: TLShapeId, opts: ArrowOpts): ArrowResult {
  const shape: TLShapePartial = {
    id,
    type: 'arrow',
    x: 0,
    y: 0,
    props: {
      color: opts.color ?? 'black',
      bend: opts.bend ?? 0,
      text: opts.label ?? '',
      size: opts.size ?? 'm',
      dash: opts.dash ?? 'draw',
      arrowheadStart: opts.arrowheadStart ?? 'none',
      arrowheadEnd: opts.arrowheadEnd ?? 'arrow',
      start: opts.start ?? { x: 0, y: 0 },
      end: opts.end ?? { x: 100, y: 0 },
    },
  }
  return {
    shape,
    bindings: [
      { fromId: id, toId: opts.fromId, terminal: 'start' },
      { fromId: id, toId: opts.toId, terminal: 'end' },
    ],
  }
}

export interface LineOpts {
  x: number
  y: number
  // Points relative to (x, y). First point should be at (0,0).
  points: Array<{ x: number; y: number }>
  color?: Color
  dash?: 'draw' | 'solid' | 'dashed' | 'dotted'
  size?: 's' | 'm' | 'l' | 'xl'
}

export function line(id: TLShapeId, opts: LineOpts): TLShapePartial {
  const pointsArr = opts.points.length > 0 ? opts.points : [{ x: 0, y: 0 }]
  const pointsObj: Record<
    string,
    { id: string; index: string; x: number; y: number }
  > = {}
  // tldraw's line shape stores points in a record keyed by id; index orders them.
  // "a1", "a2", ... are valid fractional-index strings for ordering.
  pointsArr.forEach((p, i) => {
    const pid = `p${i + 1}`
    pointsObj[pid] = {
      id: pid,
      index: `a${i + 1}`,
      x: p.x,
      y: p.y,
    }
  })
  return {
    id,
    type: 'line',
    x: opts.x,
    y: opts.y,
    props: {
      color: opts.color ?? 'black',
      dash: opts.dash ?? 'solid',
      size: opts.size ?? 'm',
      points: pointsObj,
    },
  }
}
