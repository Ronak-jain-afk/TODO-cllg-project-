export type Priority = 'critical' | 'high' | 'medium' | 'low'

export interface Todo {
  id: string
  title: string
  description?: string
  isCompleted: boolean
  completedAt: string | null
  priority: Priority
  category: string
  dueDate: string | null
  estimatedPomodoros: number
  completedPomodoros: number
  subtasks: Todo[]
  order: number
  createdAt: string
}
