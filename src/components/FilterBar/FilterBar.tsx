import { useTodoStore } from '../../store/todoStore'
import type { Priority } from '../../types/todo'

const statusOptions = ['all', 'active', 'completed'] as const
export function FilterBar() {
  const filter = useTodoStore(s => s.filter)
  const setFilter = useTodoStore(s => s.setFilter)

  return (
    <div className="filter-bar">
      <div className="filter-group">
        {statusOptions.map(s => (
          <button
            key={s}
            className={`filter-chip ${filter.status === s ? 'active' : ''}`}
            onClick={() => setFilter({ status: s })}
          >
            {s}
          </button>
        ))}
      </div>
      <select
        value={filter.priority ?? ''}
        onChange={e => setFilter({ priority: (e.target.value || null) as Priority | null })}
      >
        <option value="">All Priorities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <input
        type="text"
        placeholder="Filter by category"
        value={filter.category ?? ''}
        onChange={e => setFilter({ category: e.target.value || null })}
      />
    </div>
  )
}
