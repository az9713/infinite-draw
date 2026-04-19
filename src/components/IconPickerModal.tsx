import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import {
  LUCIDE_CATALOG,
  LUCIDE_POPULAR,
  type LucideEntry,
} from '@/icons/lucide-catalog'

interface IconPickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (name: string) => void
}

const INITIAL_LIMIT = 180
const LOAD_MORE_STEP = 240

export function IconPickerModal({
  open,
  onClose,
  onSelect,
}: IconPickerModalProps) {
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(INITIAL_LIMIT)
  const inputRef = useRef<HTMLInputElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    setQuery('')
    setVisible(INITIAL_LIMIT)
    const t = window.setTimeout(() => inputRef.current?.focus(), 20)
    return () => window.clearTimeout(t)
  }, [open])

  // Close on Escape
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

  const filtered: LucideEntry[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      // Show popular first, then rest alphabetical, deduped.
      const popularSet = new Set(LUCIDE_POPULAR)
      const popular = LUCIDE_POPULAR
        .map((n) => LUCIDE_CATALOG.find((e) => e.name === n))
        .filter((e): e is LucideEntry => Boolean(e))
      const rest = LUCIDE_CATALOG.filter((e) => !popularSet.has(e.name))
      return [...popular, ...rest]
    }
    return LUCIDE_CATALOG.filter(
      (e) =>
        e.searchKey.includes(q) || e.name.toLowerCase().includes(q),
    )
  }, [query])

  const slice = filtered.slice(0, visible)
  const hasMore = filtered.length > visible

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    if (!hasMore) return
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight
    if (remaining < 400) {
      setVisible((v) => Math.min(v + LOAD_MORE_STEP, filtered.length))
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-20 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="panel flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-white/5 p-3">
          <Search size={15} className="text-zinc-500" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            placeholder="Search icons (e.g. arrow, user, cloud)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setVisible(INITIAL_LIMIT)
              gridRef.current?.scrollTo({ top: 0 })
            }}
          />
          <div className="hidden items-center gap-1 text-xs text-zinc-500 sm:flex">
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

        <div
          ref={gridRef}
          onScroll={handleScroll}
          className="scrollbar-thin grid max-h-[65vh] grid-cols-[repeat(auto-fill,minmax(58px,1fr))] gap-1 overflow-y-auto p-3"
        >
          {slice.length === 0 ? (
            <div className="col-span-full px-4 py-10 text-center text-sm text-zinc-500">
              No icons match "{query}".
            </div>
          ) : (
            slice.map((entry) => {
              const Comp = entry.component
              return (
                <button
                  key={entry.name}
                  onClick={() => {
                    onSelect(entry.name)
                    onClose()
                  }}
                  title={entry.name}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-transparent p-1.5 text-zinc-300 transition-colors hover:border-white/10 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  <Comp size={22} strokeWidth={1.75} />
                </button>
              )
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/5 px-3 py-2 text-[11px] text-zinc-500">
          <span>
            {filtered.length.toLocaleString()} icon
            {filtered.length === 1 ? '' : 's'}
            {query ? ` matching "${query}"` : ''}
          </span>
          <span>
            Click to place at canvas center
          </span>
        </div>
      </div>
    </div>
  )
}
