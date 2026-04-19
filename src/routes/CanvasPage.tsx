import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  DefaultColorStyle,
  Tldraw,
  createShapeId,
  getSnapshot,
  loadSnapshot,
  type Editor,
  type TLDefaultColorStyle,
  type TLEditorSnapshot,
} from 'tldraw'
import 'tldraw/tldraw.css'
import {
  ArrowLeft,
  Download,
  Keyboard,
  Pencil,
  Shapes,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { IconPickerModal } from '@/components/IconPickerModal'
import { CheatSheet } from '@/components/CheatSheet'
import { IconShapeUtil } from '@/shapes/IconShapeUtil'
import { getProject, renameProject, saveSnapshot } from '@/lib/projects'
import type { Project } from '@/db'

const SHAPE_UTILS = [IconShapeUtil]

export default function CanvasPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null | undefined>(undefined)
  const [name, setName] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [iconPickerOpen, setIconPickerOpen] = useState(false)
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    if (!projectId) {
      setProject(null)
      return
    }
    ;(async () => {
      const p = await getProject(projectId)
      if (cancelled) return
      if (!p) {
        setProject(null)
        return
      }
      setProject(p)
      setName(p.name)
    })()
    return () => {
      cancelled = true
    }
  }, [projectId])

  const initialSnapshot = useMemo(
    () => (project?.snapshot ?? null) as TLEditorSnapshot | null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project?.id],
  )

  const editorRef = useRef<Editor | null>(null)
  const snapshotTimer = useRef<number | null>(null)
  const savedFlashTimer = useRef<number | null>(null)
  const toastTimer = useRef<number | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2200)
  }, [])

  const runThumbnail = useCallback(async () => {
    const editor = editorRef.current
    if (!editor || !projectId) return null
    try {
      const ids = Array.from(editor.getCurrentPageShapeIds())
      if (ids.length === 0) return null
      const result = await editor.toImage(ids, {
        format: 'png',
        background: true,
        padding: 24,
        scale: 0.5,
      })
      if (!result?.blob) return null
      // Convert blob to data URL (cheap enough for a thumbnail)
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(result.blob)
      })
    } catch (err) {
      console.warn('Thumbnail generation failed', err)
      return null
    }
  }, [projectId])

  const flushSave = useCallback(async () => {
    const editor = editorRef.current
    if (!editor || !projectId) return
    const snapshot = getSnapshot(editor.store)
    // Thumbnail generation is async; don't block user feedback on it.
    const thumb = await runThumbnail()
    await saveSnapshot(projectId, snapshot, thumb)
    setSaving('saved')
    if (savedFlashTimer.current) window.clearTimeout(savedFlashTimer.current)
    savedFlashTimer.current = window.setTimeout(() => setSaving('idle'), 900)
  }, [projectId, runThumbnail])

  const scheduleSave = useCallback(() => {
    if (!projectId) return
    setSaving('saving')
    if (snapshotTimer.current) window.clearTimeout(snapshotTimer.current)
    snapshotTimer.current = window.setTimeout(() => {
      void flushSave()
    }, 700)
  }, [projectId, flushSave])

  const handleMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor
      editor.user.updateUserPreferences({ colorScheme: 'dark' })
      if (import.meta.env.DEV) {
        ;(window as unknown as { editor?: Editor }).editor = editor
      }

      if (initialSnapshot) {
        try {
          loadSnapshot(editor.store, initialSnapshot)
        } catch (err) {
          console.warn('Failed to load snapshot; starting fresh.', err)
        }
      }

      const unsub = editor.store.listen(() => scheduleSave(), {
        source: 'user',
        scope: 'document',
      })
      return () => unsub()
    },
    [initialSnapshot, scheduleSave],
  )

  // Insert an icon shape at the center of the current viewport.
  const insertIcon = useCallback((iconName: string) => {
    const editor = editorRef.current
    if (!editor) return
    const { x, y } = editor.getViewportPageBounds().center
    const size = 96
    editor.createShape({
      id: createShapeId(),
      type: 'icon',
      x: x - size / 2,
      y: y - size / 2,
      props: {
        w: size,
        h: size,
        name: iconName,
        // Use tldraw's current styling so the color picker keeps working.
        color: editor.getStyleForNextShape(DefaultColorStyle) as TLDefaultColorStyle,
        strokeWidth: 2,
      },
    })
    showToast(`Inserted ${iconName}`)
  }, [showToast])

  // PNG export (page or selection).
  const exportPng = useCallback(
    async (selectionOnly: boolean) => {
      const editor = editorRef.current
      if (!editor) return
      const ids = selectionOnly
        ? editor.getSelectedShapeIds()
        : Array.from(editor.getCurrentPageShapeIds())
      if (!ids || ids.length === 0) {
        showToast(
          selectionOnly
            ? 'Nothing selected to export.'
            : 'Canvas is empty — nothing to export.',
        )
        return
      }
      try {
        const result = await editor.toImage(ids, {
          format: 'png',
          background: true,
          padding: 32,
          scale: 2,
        })
        if (!result?.blob) {
          showToast('Export failed.')
          return
        }
        const url = URL.createObjectURL(result.blob)
        const a = document.createElement('a')
        const safeName = (project?.name ?? 'canvas').replace(/[^\w.-]+/g, '_')
        a.href = url
        a.download = `${safeName}${selectionOnly ? '-selection' : ''}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.setTimeout(() => URL.revokeObjectURL(url), 2000)
        showToast(
          selectionOnly ? 'Exported selection' : 'Exported canvas',
        )
      } catch (err) {
        console.error(err)
        showToast('Export failed.')
      }
    },
    [project?.name, showToast],
  )

  // Keyboard shortcuts layered on top of tldraw's own.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Never intercept when the user is typing in an input/textarea/contentEditable,
      // or when any of our own modals is open (they handle Esc themselves).
      const target = e.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      const isEditable =
        tag === 'input' ||
        tag === 'textarea' ||
        target?.isContentEditable
      if (isEditable) return

      // Ctrl/Cmd+E — export PNG
      if ((e.metaKey || e.ctrlKey) && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault()
        exportPng(e.shiftKey)
        return
      }

      // ? — cheat sheet
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        setCheatSheetOpen((v) => !v)
        return
      }

      // I — icon picker (only when no shape is being edited)
      if (
        (e.key === 'i' || e.key === 'I') &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        // tldraw doesn't use plain "I" for anything, safe to claim.
        e.preventDefault()
        setIconPickerOpen(true)
        return
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [exportPng])

  // Persist any in-flight debounce on unload / unmount.
  useEffect(() => {
    const onBeforeUnload = () => {
      const editor = editorRef.current
      if (!editor || !projectId) return
      // Synchronous snapshot only — async thumbnail can't complete before unload.
      const snapshot = getSnapshot(editor.store)
      void saveSnapshot(projectId, snapshot, null)
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      // React Router navigation: flush any pending debounced save (with thumbnail).
      if (snapshotTimer.current) {
        window.clearTimeout(snapshotTimer.current)
        snapshotTimer.current = null
        void flushSave()
      }
    }
  }, [projectId, flushSave])

  async function commitName() {
    setEditingName(false)
    const next = name.trim()
    if (!projectId || !project || !next || next === project.name) {
      setName(project?.name ?? '')
      return
    }
    await renameProject(projectId, next)
    setProject({ ...project, name: next })
  }

  if (project === undefined) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
        Loading canvas…
      </div>
    )
  }

  if (project === null) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="text-zinc-300">That canvas doesn't exist.</div>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={14} /> Back home
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-zinc-950">
      {/* Top bar — center so it never collides with tldraw's own menus */}
      <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center px-3">
        <div className="pointer-events-auto panel flex items-center gap-1 px-1.5 py-1.5">
          <Link
            to="/"
            className="btn-ghost !px-2 !py-1.5"
            title="Back to projects"
          >
            <ArrowLeft size={14} />
          </Link>
          <div className="mx-0.5 h-4 w-px bg-white/10" />
          <div className="pl-1">
            <Logo />
          </div>
          <div className="mx-1 h-4 w-px bg-white/10" />
          {editingName ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Enter') commitName()
                if (e.key === 'Escape') {
                  setName(project.name)
                  setEditingName(false)
                }
              }}
              className="w-56 rounded-md bg-transparent px-2 py-1 text-sm text-white outline-none ring-1 ring-brand/40"
            />
          ) : (
            <button
              className="group flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-zinc-200 hover:bg-white/5 hover:text-white"
              onClick={() => setEditingName(true)}
              title="Rename"
            >
              <span className="max-w-[16rem] truncate">{project.name}</span>
              <Pencil
                size={12}
                className="opacity-0 transition-opacity group-hover:opacity-60"
              />
            </button>
          )}
          <SaveIndicator status={saving} />
          <div className="mx-1 h-4 w-px bg-white/10" />
          <button
            className="btn-ghost !px-2.5 !py-1.5"
            title="Insert icon (I)"
            onClick={() => setIconPickerOpen(true)}
          >
            <Shapes size={14} />
            <span className="hidden lg:inline">Icons</span>
            <span className="kbd hidden sm:inline-flex">I</span>
          </button>
          <button
            className="btn-ghost !px-2.5 !py-1.5"
            title="Export PNG (⌘/Ctrl+E)"
            onClick={() => exportPng(false)}
          >
            <Download size={14} />
            <span className="hidden lg:inline">Export</span>
          </button>
          <button
            className="btn-ghost !px-2.5 !py-1.5"
            title="Keyboard shortcuts (?)"
            onClick={() => setCheatSheetOpen(true)}
          >
            <Keyboard size={14} />
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 z-30 -translate-x-1/2 animate-fade-in">
          <div className="panel px-3 py-1.5 text-xs text-zinc-200">
            {toast}
          </div>
        </div>
      )}

      <div className="absolute inset-0">
        <Tldraw
          key={project.id}
          persistenceKey={undefined}
          shapeUtils={SHAPE_UTILS}
          onMount={handleMount}
          inferDarkMode
        />
      </div>

      <IconPickerModal
        open={iconPickerOpen}
        onClose={() => setIconPickerOpen(false)}
        onSelect={insertIcon}
      />
      <CheatSheet
        open={cheatSheetOpen}
        onClose={() => setCheatSheetOpen(false)}
      />
    </div>
  )
}

function SaveIndicator({ status }: { status: 'idle' | 'saving' | 'saved' }) {
  if (status === 'idle') return null
  return (
    <span
      className={`ml-1 inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] ${
        status === 'saving' ? 'text-zinc-400' : 'text-emerald-400'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'saving'
            ? 'animate-pulse bg-zinc-400'
            : 'bg-emerald-400'
        }`}
      />
      {status === 'saving' ? 'Saving…' : 'Saved'}
    </span>
  )
}
