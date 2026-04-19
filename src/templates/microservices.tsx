import { arrow, icon, rect } from './helpers'
import type { BuildResult, DiagramTemplate } from './types'

export const microservicesTemplate: DiagramTemplate = {
  id: 'microservices',
  name: 'Microservices',
  description: 'Gateway → 3 services → shared database',
  category: 'architecture',
  build: ({ center, newId }): BuildResult => {
    const cx = center.x
    const cy = center.y

    const boxW = 160
    const boxH = 100
    const iconSize = 40

    // Vertical layers: gateway (top), 3 services (middle), db (bottom)
    const gatewayY = cy - 260
    const servicesY = cy - 60
    const dbY = cy + 180

    const gatewayId = newId()
    const gatewayIconId = newId()
    const svc1Id = newId()
    const svc2Id = newId()
    const svc3Id = newId()
    const svc1IconId = newId()
    const svc2IconId = newId()
    const svc3IconId = newId()
    const dbId = newId()
    const dbIconId = newId()
    const arrowIds = [newId(), newId(), newId(), newId(), newId(), newId()]

    const svcCxs = [cx - (boxW + 40), cx, cx + (boxW + 40)]

    const mkBox = (
      id: string,
      centerX: number,
      y: number,
      label: string,
      color: Parameters<typeof rect>[1]['color'],
    ) =>
      rect(id as never, {
        x: centerX - boxW / 2, y, w: boxW, h: boxH,
        label, color, size: 'm', verticalAlign: 'end',
      })

    const mkIcon = (id: string, centerX: number, y: number, name: string, color: Parameters<typeof icon>[1]['color']) =>
      icon(id as never, {
        x: centerX - iconSize / 2,
        y: y + 16,
        size: iconSize,
        name,
        color,
      })

    const shapes = [
      mkBox(gatewayId, cx, gatewayY, 'API Gateway', 'violet'),
      mkIcon(gatewayIconId, cx, gatewayY, 'Router', 'violet'),
      mkBox(svc1Id, svcCxs[0], servicesY, 'Auth', 'blue'),
      mkIcon(svc1IconId, svcCxs[0], servicesY, 'Lock', 'blue'),
      mkBox(svc2Id, svcCxs[1], servicesY, 'Orders', 'green'),
      mkIcon(svc2IconId, svcCxs[1], servicesY, 'Package', 'green'),
      mkBox(svc3Id, svcCxs[2], servicesY, 'Billing', 'orange'),
      mkIcon(svc3IconId, svcCxs[2], servicesY, 'CreditCard', 'orange'),
      mkBox(dbId, cx, dbY, 'Database', 'grey'),
      mkIcon(dbIconId, cx, dbY, 'Database', 'grey'),
    ]

    const arrows = [
      arrow(arrowIds[0], { fromId: gatewayId, toId: svc1Id }),
      arrow(arrowIds[1], { fromId: gatewayId, toId: svc2Id }),
      arrow(arrowIds[2], { fromId: gatewayId, toId: svc3Id }),
      arrow(arrowIds[3], { fromId: svc1Id, toId: dbId }),
      arrow(arrowIds[4], { fromId: svc2Id, toId: dbId }),
      arrow(arrowIds[5], { fromId: svc3Id, toId: dbId }),
    ]

    return {
      shapes: [...shapes, ...arrows.map((a) => a.shape)],
      bindings: arrows.flatMap((a) => a.bindings),
    }
  },
  preview: () => (
    <svg viewBox="0 0 140 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="55" y="6" width="30" height="16" rx="2" />
      <rect x="10" y="34" width="28" height="16" rx="2" />
      <rect x="56" y="34" width="28" height="16" rx="2" />
      <rect x="102" y="34" width="28" height="16" rx="2" />
      <rect x="55" y="62" width="30" height="14" rx="2" />
      <path d="M60 22 L24 34 M70 22 V34 M80 22 L116 34 M24 50 L60 62 M70 50 V62 M116 50 L80 62" />
    </svg>
  ),
}
