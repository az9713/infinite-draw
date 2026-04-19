import { useEffect, useMemo } from 'react'
import { X } from 'lucide-react'
import {
  CATEGORY_LABELS,
  TEMPLATE_CATALOG,
  type DiagramTemplate,
  type TemplateCategory,
} from '@/templates'

interface TemplatePickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (template: DiagramTemplate) => void
}

const CATEGORY_ORDER: TemplateCategory[] = [
  'flow',
  'architecture',
  'planning',
  'analysis',
]

export function TemplatePickerModal({
  open,
  onClose,
  onSelect,
}: TemplatePickerModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, onClose])

  const grouped = useMemo(() => {
    const map = new Map<TemplateCategory, DiagramTemplate[]>()
    for (const t of TEMPLATE_CATALOG) {
      const list = map.get(t.category) ?? []
      list.push(t)
      map.set(t.category, list)
    }
    return map
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-20 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="panel flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-white/5 p-3">
          <div className="text-sm font-medium text-white">Templates</div>
          <div className="text-xs text-zinc-500">
            Click any template to drop it onto the canvas
          </div>
          <div className="ml-auto hidden items-center gap-1 text-xs text-zinc-500 sm:flex">
            <span className="kbd">Esc</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto p-4">
          {CATEGORY_ORDER.map((cat) => {
            const list = grouped.get(cat)
            if (!list || list.length === 0) return null
            return (
              <section key={cat} className="mb-5 last:mb-0">
                <h3 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  {CATEGORY_LABELS[cat]}
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {list.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelect(t)
                        onClose()
                      }}
                      title={t.description}
                      className="group flex flex-col items-stretch gap-2 rounded-lg border border-white/5 bg-zinc-900/40 p-3 text-left text-zinc-300 transition-colors hover:border-brand/40 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand/40"
                    >
                      <div className="flex h-20 items-center justify-center rounded-md bg-zinc-900/80 text-zinc-400 group-hover:text-brand">
                        <div className="h-14 w-24">{t.preview()}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {t.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        <div className="flex items-center justify-between border-t border-white/5 px-3 py-2 text-[11px] text-zinc-500">
          <span>
            {TEMPLATE_CATALOG.length} templates
          </span>
          <span>Drops at viewport center · Ctrl+Z to undo</span>
        </div>
      </div>
    </div>
  )
}
