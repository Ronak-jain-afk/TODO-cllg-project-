import { useEffect } from 'react'
import { useTodoStore } from '../store/todoStore'
import { saveState } from '../utils/localStorage'

export function useDebouncedSave(delay = 500) {
  const items = useTodoStore(s => s.items)
  const filter = useTodoStore(s => s.filter)
  const hydrated = useTodoStore(s => s.hydrated)

  useEffect(() => {
    if (!hydrated) return
    const timer = setTimeout(() => {
      saveState(items, filter)
    }, delay)
    return () => clearTimeout(timer)
  }, [items, filter, hydrated, delay])
}
