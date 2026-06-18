import { useEffect } from 'react'
import { useTodoStore } from '../store/todoStore'

export function useKeyboardShortcuts() {
  const undo = useTodoStore(s => s.undo)
  const redo = useTodoStore(s => s.redo)
  const currentHistoryIndex = useTodoStore(s => s.currentHistoryIndex)
  const historyLength = useTodoStore(s => s.history.length)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey

      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (currentHistoryIndex > 0) undo()
      }

      if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        if (currentHistoryIndex < historyLength - 1) redo()
      }

      if (mod && e.key === 'k') {
        e.preventDefault()
        const search = document.querySelector<HTMLInputElement>('.search-input input')
        search?.focus()
      }

      if (mod && e.key === 'n') {
        e.preventDefault()
        const addInput = document.querySelector<HTMLInputElement>('.add-todo-input')
        addInput?.focus()
      }

      if (e.key === 'Escape') {
        const active = document.activeElement as HTMLElement
        active?.blur()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo, currentHistoryIndex, historyLength])
}
