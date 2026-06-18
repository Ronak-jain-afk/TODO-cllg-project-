import type { Priority } from './todo'

export interface Filter {
  status: 'all' | 'active' | 'completed'
  priority: Priority | null
  category: string | null
  searchQuery: string
}
