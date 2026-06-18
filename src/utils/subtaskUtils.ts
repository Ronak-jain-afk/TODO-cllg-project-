import type { Todo } from '../types/todo'

export function getProgressPercentage(todo: Todo): number {
  if (todo.subtasks.length === 0) return todo.isCompleted ? 100 : 0
  const done = todo.subtasks.filter(st => st.isCompleted).length
  return Math.round((done / todo.subtasks.length) * 100)
}
