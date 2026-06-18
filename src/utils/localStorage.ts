import type { Todo } from '../types/todo'
import type { Filter } from '../types/filter'
import { demoData } from '../data/demoData'

const STORAGE_KEY = 'flowforge-todos'

interface StoredState {
  items: Todo[]
  filter: Filter
}

export function saveState(items: Todo[], filter: Filter): void {
  const data: StoredState = { items, filter }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function loadState(): { items: Todo[]; filter: Filter } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: StoredState = JSON.parse(raw)
    if (!Array.isArray(parsed.items)) return null
    return parsed
  } catch {
    return null
  }
}

export function getInitialState(): { items: Todo[]; filter: Filter } {
  const stored = loadState()
  if (stored) return stored
  return {
    items: demoData,
    filter: { status: 'all', priority: null, category: null, searchQuery: '' },
  }
}
