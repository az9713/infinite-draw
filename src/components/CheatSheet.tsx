import { X } from 'lucide-react'
import { useEffect } from 'react'

interface CheatSheetProps {
  open: boolean
  onClose: () => void
}

interface Shortcut {
  keys: string[]
  label: string
}

interface Section {
  title: string
  shortcuts: Shortcut[]
}

const SECTIONS: Section[] = [
  {
    title: 'Infinite Draw',
    shortcuts: [
      { keys: ['I'], label: 'Open icon picker' },
      { keys: ['P'], label: 'Insert diagram template' },
      { keys: ['N'], label: 'New canvas' },
      { keys: ['⌘/Ctrl', 'E'], label: 'Export page as PNG' },
      { keys: ['⌘/Ctrl', '⇧', 'E'], label: 'Export selection as PNG' },
      { keys: ['?'], label: 'Toggle this cheat-sheet' },
      { keys: ['Esc'], label: 'Close overlay' },
    ],
  },
  {
    title: 'Tools',
    shortcuts: [
      { keys: ['V'], label: 'Select' },
      { keys: ['H'], label: 'Hand / pan' },
      { keys: ['D'], label: 'Draw' },
      { keys: ['R'], label: 'Rectangle' },
      { keys: ['O'], label: 'Ellipse / circle' },
      { keys: ['A'], label: 'Arrow (connects shapes)' },
      { keys: ['L'], label: 'Line' },
      { keys: ['T'], label: 'Text' },
      { keys: ['E'], label: 'Eraser' },
    ],
  },
  {
    title: 'Editing',
    shortcuts: [
      { keys: ['⌘/Ctrl', 'Z'], label: 'Undo' },
      { keys: ['⌘/Ctrl', '⇧', 'Z'], label: 'Redo' },
      { keys: ['⌘/Ctrl', 'C'], label: 'Copy' },
      { keys: ['⌘/Ctrl', 'V'], label: 'Paste (including screenshots)' },
      { keys: ['⌘/Ctrl', 'D'], label: 'Duplicate' },
      { keys: ['⌫'], label: 'Delete' },
      { keys: ['⌘/Ctrl', 'A'], label: 'Select all' },
    ],
  },
  {
    title: 'View',
    shortcuts: [
      { keys: ['⌘/Ctrl', '='], label: 'Zoom in' },
      { keys: ['⌘/Ctrl', '-'], label: 'Zoom out' },
      { keys: ['⌘/Ctrl', '0'], label: 'Zoom to 100%' },
      { keys: ['⇧', '1'], label: 'Zoom to fit' },
      { keys: ['⇧', '2'], label: 'Zoom to selection' },
    ],
  },
]

export function CheatSheet({ open, onClose }: CheatSheetProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === '?') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="panel flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 p-4">
          <div>
            <div className="text-sm font-semibold text-white">Keyboard shortcuts</div>
            <div className="mt-0.5 text-xs text-zinc-500">
              Press <span className="kbd">?</span> anytime to toggle
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="scrollbar-thin grid grid-cols-1 gap-6 overflow-y-auto p-5 md:grid-cols-2">
          {SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-brand/90">
                {section.title}
              </div>
              <div className="flex flex-col">
                {section.shortcuts.map((sc) => (
                  <div
                    key={sc.label}
                    className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-white/[0.03]"
                  >
                    <span className="text-zinc-300">{sc.label}</span>
                    <span className="flex items-center gap-1">
                      {sc.keys.map((k, i) => (
                        <span key={i} className="kbd">
                          {k}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
