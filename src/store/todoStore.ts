import { create } from 'zustand'
import type { Todo } from '../types/todo'
import type { Filter } from '../types/filter'

const MAX_HISTORY = 30

interface TodoState {
  items: Todo[]
  filter: Filter
  history: Todo[][]
  currentHistoryIndex: number
  pendingDeletionId: string | null
  selectedTodoId: string | null
  hydrated: boolean

  setHydrated: () => void
  addTodo: (todo: Omit<Todo, 'id' | 'order' | 'createdAt' | 'subtasks' | 'completedPomodoros' | 'isCompleted' | 'completedAt'>) => void
  deleteTodo: (id: string) => void
  toggleTodo: (id: string) => void
  editTodo: (id: string, updates: Partial<Todo>) => void
  reorderTodos: (oldIndex: number, newIndex: number) => void
  setFilter: (filter: Partial<Filter>) => void
  setPendingDeletion: (id: string | null) => void
  undo: () => void
  redo: () => void
  setSelectedTodoId: (id: string | null) => void
  incrementPomodoro: (id: string) => void
  replaceItems: (items: Todo[]) => void
}

function pushHistory(state: TodoState, newItems: Todo[]): { history: Todo[][]; currentHistoryIndex: number } {
  const newHistory = state.history.slice(0, state.currentHistoryIndex + 1)
  newHistory.push(newItems)
  if (newHistory.length > MAX_HISTORY) newHistory.shift()
  return { history: newHistory, currentHistoryIndex: newHistory.length - 1 }
}

function mapTodo(items: Todo[], id: string, fn: (todo: Todo) => Todo): Todo[] {
  return items.map(item => {
    if (item.id === id) return fn(item)
    if (item.subtasks.length > 0) return { ...item, subtasks: mapTodo(item.subtasks, id, fn) }
    return item
  })
}

function cascadeComplete(items: Todo[], id: string): Todo[] {
  return mapTodo(items, id, todo => {
    if (!todo.subtasks.length) return todo
    const allDone = todo.subtasks.every(st => st.isCompleted)
    if (allDone) return { ...todo, isCompleted: true, completedAt: new Date().toISOString() }
    return todo
  })
}

function removeTodo(items: Todo[], id: string): Todo[] {
  return items.filter(item => {
    if (item.id === id) return false
    if (item.subtasks.length > 0) item.subtasks = removeTodo(item.subtasks, id)
    return true
  })
}

export const useTodoStore = create<TodoState>((set) => ({
  items: [],
  filter: { status: 'all', priority: null, category: null, searchQuery: '' },
  history: [],
  currentHistoryIndex: -1,
  pendingDeletionId: null,
  selectedTodoId: null,
  hydrated: false,

  setHydrated: () => set({ hydrated: true }),

  addTodo: (data) => set(state => {
    const newItem: Todo = {
      ...data,
      id: crypto.randomUUID(),
      order: state.items.length,
      createdAt: new Date().toISOString(),
      subtasks: [],
      completedPomodoros: 0,
      isCompleted: false,
      completedAt: null,
    }
    const newItems = [...state.items, newItem]
    const { history, currentHistoryIndex } = pushHistory(state, newItems)
    return { items: newItems, history, currentHistoryIndex }
  }),

  deleteTodo: (id) => set(state => {
    const newItems = removeTodo(state.items, id).map((item, i) => ({ ...item, order: i }))
    const { history, currentHistoryIndex } = pushHistory(state, newItems)
    return { items: newItems, history, currentHistoryIndex, pendingDeletionId: null }
  }),

  toggleTodo: (id) => set(state => {
    const newItems = mapTodo(state.items, id, todo => {
      const isCompleted = !todo.isCompleted
      return {
        ...todo,
        isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : null,
      }
    })
    const cascaded = cascadeComplete(newItems, id)
    const { history, currentHistoryIndex } = pushHistory(state, cascaded)
    return { items: cascaded, history, currentHistoryIndex }
  }),

  editTodo: (id, updates) => set(state => {
    const newItems = mapTodo(state.items, id, todo => ({ ...todo, ...updates }))
    const { history, currentHistoryIndex } = pushHistory(state, newItems)
    return { items: newItems, history, currentHistoryIndex }
  }),

  reorderTodos: (oldIndex, newIndex) => set(state => {
    const filtered = state.items
    const [moved] = filtered.splice(oldIndex, 1)
    filtered.splice(newIndex, 0, moved)
    const newItems = filtered.map((item, i) => ({ ...item, order: i }))
    const { history, currentHistoryIndex } = pushHistory(state, newItems)
    return { items: newItems, history, currentHistoryIndex }
  }),

  setFilter: (filter) => set(state => ({
    filter: { ...state.filter, ...filter },
  })),

  setPendingDeletion: (id) => set({ pendingDeletionId: id }),

  undo: () => set(state => {
    if (state.currentHistoryIndex <= 0) return state
    const newIndex = state.currentHistoryIndex - 1
    return { items: state.history[newIndex].map(i => ({ ...i })), currentHistoryIndex: newIndex }
  }),

  redo: () => set(state => {
    if (state.currentHistoryIndex >= state.history.length - 1) return state
    const newIndex = state.currentHistoryIndex + 1
    return { items: state.history[newIndex].map(i => ({ ...i })), currentHistoryIndex: newIndex }
  }),

  setSelectedTodoId: (id) => set({ selectedTodoId: id }),

  incrementPomodoro: (id) => set(state => {
    const newItems = mapTodo(state.items, id, todo => {
      const completedPomodoros = todo.completedPomodoros + 1
      if (completedPomodoros >= todo.estimatedPomodoros) {
        return { ...todo, completedPomodoros, isCompleted: true, completedAt: new Date().toISOString() }
      }
      return { ...todo, completedPomodoros }
    })
    const { history, currentHistoryIndex } = pushHistory(state, newItems)
    return { items: newItems, history, currentHistoryIndex }
  }),

  replaceItems: (items) => set(state => {
    const { history, currentHistoryIndex } = pushHistory(state, items)
    return { items, history, currentHistoryIndex }
  }),
}))

export function useFilteredSortedTodos(): Todo[] {
  const items = useTodoStore(s => s.items)
  const filter = useTodoStore(s => s.filter)
  const sortMode = 'manual'

  let result = [...items]

  if (filter.status === 'active') result = result.filter(t => !t.isCompleted)
  else if (filter.status === 'completed') result = result.filter(t => t.isCompleted)

  if (filter.priority) result = result.filter(t => t.priority === filter.priority)
  if (filter.category) result = result.filter(t => t.category === filter.category)

  if (filter.searchQuery) {
    const q = filter.searchQuery.toLowerCase()
    result = result.filter(t => t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q))
  }

  if (sortMode === 'manual') result.sort((a, b) => a.order - b.order)

  return result
}
