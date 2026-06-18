import { useTodoStore } from '../../store/todoStore'

export function SearchInput() {
  const searchQuery = useTodoStore(s => s.filter.searchQuery)
  const setFilter = useTodoStore(s => s.setFilter)

  return (
    <div className="search-input">
      <input
        type="text"
        placeholder="Search todos..."
        value={searchQuery}
        onChange={e => setFilter({ searchQuery: e.target.value })}
      />
      {searchQuery && (
        <button className="search-clear" onClick={() => setFilter({ searchQuery: '' })}>
          &times;
        </button>
      )}
    </div>
  )
}
