import { useLiveQuery } from 'dexie-react-hooks'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Pencil, Search, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Logo } from '@/components/Logo'
import {
  createProject,
  deleteProject,
  listProjects,
  renameProject,
} from '@/lib/projects'

export default function HomePage() {
  const navigate = useNavigate()
  const projects = useLiveQuery(() => listProjects(), [], [])
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!projects) return []
    const q = query.trim().toLowerCase()
    if (!q) return projects
    return projects.filter((p) => p.name.toLowerCase().includes(q))
  }, [projects, query])

  async function onNew() {
    const p = await createProject()
    navigate(`/c/${p.id}`)
  }

  // N — new canvas shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      const isEditable =
        tag === 'input' ||
        tag === 'textarea' ||
        target?.isContentEditable
      if (isEditable) return
      if ((e.key === 'n' || e.key === 'N') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        void onNew()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(139,92,246,0.12),transparent_60%)]">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <Logo />
        <button className="btn-primary" onClick={onNew}>
          <Plus size={16} />
          New canvas
          <span className="ml-1 hidden sm:inline">
            <span className="kbd">N</span>
          </span>
        </button>
      </header>

      <main className="scrollbar-thin flex-1 overflow-y-auto px-6 pb-24 pt-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand/80">
              <Sparkles size={14} />
              Your canvases
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Pick up where you left off.
            </h1>
            <div className="relative max-w-sm">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                className="input pl-9"
                placeholder="Search canvases…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {projects === undefined ? (
            <div className="text-sm text-zinc-500">Loading…</div>
          ) : filtered.length === 0 ? (
            <EmptyState onNew={onNew} hasProjects={projects.length > 0} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <NewCanvasCard onClick={onNew} />
              {filtered.map((p) => (
                <ProjectCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  updatedAt={p.updatedAt}
                  thumbnail={p.thumbnail}
                  onRename={async (name) => renameProject(p.id, name)}
                  onDelete={async () => deleteProject(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function EmptyState({
  onNew,
  hasProjects,
}: {
  onNew: () => void
  hasProjects: boolean
}) {
  return (
    <div className="panel flex flex-col items-center gap-4 px-8 py-14 text-center">
      <div className="rounded-xl bg-brand/10 p-3 text-brand">
        <Sparkles size={20} />
      </div>
      <div>
        <div className="text-lg font-medium text-white">
          {hasProjects ? 'No canvases match that search.' : 'Your canvas awaits.'}
        </div>
        <div className="mt-1 text-sm text-zinc-400">
          {hasProjects
            ? 'Try a different term or start a fresh canvas.'
            : 'Create your first project to start drawing, diagramming, and sketching.'}
        </div>
      </div>
      <button className="btn-primary" onClick={onNew}>
        <Plus size={16} />
        New canvas
      </button>
    </div>
  )
}

function NewCanvasCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-zinc-400 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
    >
      <div className="rounded-full border border-white/10 bg-white/5 p-3 transition-colors group-hover:border-brand/40 group-hover:bg-brand/10">
        <Plus size={20} />
      </div>
      <div className="text-sm font-medium">New canvas</div>
    </button>
  )
}

function ProjectCard({
  id,
  name,
  updatedAt,
  thumbnail,
  onRename,
  onDelete,
}: {
  id: string
  name: string
  updatedAt: number
  thumbnail: string | null
  onRename: (name: string) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)

  async function commit() {
    const next = draft.trim() || name
    setEditing(false)
    if (next !== name) await onRename(next)
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-zinc-900/80">
      <Link
        to={`/c/${id}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-[linear-gradient(135deg,#111114_0%,#17171c_100%)]"
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-600">
            <svg width="64" height="48" viewBox="0 0 64 48" fill="none">
              <path
                d="M6 38 Q 18 10, 30 22 T 58 18"
                stroke="rgba(167,139,250,0.55)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="6" cy="38" r="2.5" fill="rgba(167,139,250,0.75)" />
              <circle cx="58" cy="18" r="2.5" fill="rgba(99,102,241,0.75)" />
            </svg>
          </div>
        )}
      </Link>
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              autoFocus
              className="input py-1 text-sm"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commit()
                if (e.key === 'Escape') {
                  setDraft(name)
                  setEditing(false)
                }
              }}
            />
          ) : (
            <>
              <div className="truncate text-sm font-medium text-white">
                {name}
              </div>
              <div className="text-xs text-zinc-500">
                {relativeTime(updatedAt)}
              </div>
            </>
          )}
        </div>
        {!editing && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => {
                setDraft(name)
                setEditing(true)
              }}
              className="rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
              title="Rename"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={async () => {
                if (confirm(`Delete "${name}"? This cannot be undone.`)) {
                  await onDelete()
                }
              }}
              className="rounded-md p-1.5 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function relativeTime(ms: number): string {
  const diff = Date.now() - ms
  const s = Math.floor(diff / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(ms).toLocaleDateString()
}
