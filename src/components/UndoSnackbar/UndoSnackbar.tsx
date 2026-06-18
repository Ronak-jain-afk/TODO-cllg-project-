import { useEffect, useRef } from 'react'
import { useTodoStore } from '../../store/todoStore'

export function UndoSnackbar() {
  const pendingDeletionId = useTodoStore(s => s.pendingDeletionId)
  const setPendingDeletion = useTodoStore(s => s.setPendingDeletion)
  const deleteTodo = useTodoStore(s => s.deleteTodo)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!pendingDeletionId) return
    timerRef.current = setTimeout(() => {
      deleteTodo(pendingDeletionId)
      setPendingDeletion(null)
    }, 5000)
    return () => clearTimeout(timerRef.current)
  }, [pendingDeletionId, deleteTodo, setPendingDeletion])

  if (!pendingDeletionId) return null

  return (
    <div className="snackbar">
      <span>Todo deleted.</span>
      <button onClick={() => setPendingDeletion(null)}>Undo</button>
    </div>
  )
}
