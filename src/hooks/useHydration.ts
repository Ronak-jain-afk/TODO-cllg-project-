import { useEffect } from 'react'
import { useTodoStore } from '../store/todoStore'
import { getInitialState } from '../utils/localStorage'

export function useHydration() {
  const setHydrated = useTodoStore(s => s.setHydrated)
  const replaceItems = useTodoStore(s => s.replaceItems)
  const setFilter = useTodoStore(s => s.setFilter)

  useEffect(() => {
    const initial = getInitialState()
    if (initial.items.length > 0) {
      replaceItems(initial.items)
      setFilter(initial.filter)
    }
    setHydrated()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
