import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface LucideEntry {
  /** PascalCase name (e.g. "Activity"). Used as the canonical id. */
  name: string
  /** Lowercased name + kebab-cased for search (e.g. "activity", "alarm-clock"). */
  searchKey: string
  component: LucideIcon
}

function pascalToKebab(s: string): string {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

function isIconExport(name: string, val: unknown): val is LucideIcon {
  if (!/^[A-Z][a-zA-Z0-9]+$/.test(name)) return false
  // Skip deprecated "Foo" / "FooIcon" duplicate aliases — keep only the bare name.
  if (name.endsWith('Icon') && name !== 'Icon') return false
  if (name === 'Icon' || name === 'LucideIcon') return false
  if (name === 'createLucideIcon') return false
  if (typeof val !== 'object' || val === null) return false
  // forwardRef / memo components expose $$typeof
  return Object.prototype.hasOwnProperty.call(val, '$$typeof')
}

// Build the catalog once at module load.
// Lucide-react re-exports some icons under multiple aliases (kebab variants,
// legacy names, "Icon" suffix variants); dedupe by component identity and
// prefer the shortest PascalCase name.
export const LUCIDE_CATALOG: LucideEntry[] = (() => {
  const byComponent = new Map<LucideIcon, string>()
  for (const [name, val] of Object.entries(LucideIcons)) {
    if (!isIconExport(name, val)) continue
    const existing = byComponent.get(val)
    if (!existing || name.length < existing.length) {
      byComponent.set(val, name)
    }
  }
  const entries: LucideEntry[] = []
  for (const [component, name] of byComponent) {
    entries.push({
      name,
      searchKey: pascalToKebab(name),
      component,
    })
  }
  entries.sort((a, b) => a.name.localeCompare(b.name))
  return entries
})()

export const LUCIDE_CATALOG_BY_NAME: Record<string, LucideIcon> = Object.fromEntries(
  LUCIDE_CATALOG.map((e) => [e.name, e.component]),
)

export function resolveIcon(name: string): LucideIcon | null {
  return LUCIDE_CATALOG_BY_NAME[name] ?? null
}

/** Popular subset shown first when the search is empty. */
export const LUCIDE_POPULAR: string[] = [
  'Sparkles', 'Star', 'Heart', 'Check', 'X', 'Plus', 'Minus', 'ArrowRight',
  'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ChevronRight', 'Zap', 'Flame', 'Sun',
  'Moon', 'Cloud', 'Database', 'Server', 'Globe', 'Wifi', 'Lock', 'Unlock',
  'Key', 'Shield', 'Bell', 'Mail', 'MessageCircle', 'Phone', 'Camera', 'Image',
  'File', 'FileText', 'Folder', 'Download', 'Upload', 'Settings', 'Search',
  'User', 'Users', 'Home', 'Map', 'MapPin', 'Calendar', 'Clock', 'Play',
  'Pause', 'Square', 'Circle', 'Triangle', 'Hexagon', 'GitBranch', 'GitMerge',
  'GitPullRequest', 'Code', 'Terminal', 'Package', 'Box', 'Layers', 'Layout',
  'Grid', 'List', 'Trash2', 'Edit', 'Copy', 'Share', 'Link', 'ExternalLink',
  'Eye', 'EyeOff', 'AlertTriangle', 'AlertCircle', 'Info', 'HelpCircle',
  'ThumbsUp', 'ThumbsDown', 'Flag', 'Bookmark', 'Tag', 'Filter', 'Rocket',
  'Lightbulb', 'Target', 'Trophy', 'Gift', 'ShoppingCart', 'CreditCard',
  'DollarSign', 'TrendingUp', 'TrendingDown', 'BarChart', 'PieChart',
  'LineChart', 'Activity', 'Cpu', 'HardDrive', 'Smartphone', 'Laptop',
  'Monitor', 'Headphones', 'Music', 'Video', 'Mic', 'Volume2',
]
