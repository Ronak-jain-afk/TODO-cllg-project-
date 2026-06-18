import { memo, useCallback, useRef } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { List as VirtualListBase } from 'react-window'
import { useTodoStore, useFilteredSortedTodos } from '../../store/todoStore'
import { TodoItem } from '../TodoItem/TodoItem'
import type { Todo } from '../../types/todo'

const VirtualList = VirtualListBase as any // eslint-disable-line @typescript-eslint/no-explicit-any

const VIRTUALIZATION_THRESHOLD = 100
const ROW_HEIGHT = 80

const TodoRow = memo(function TodoRow({ index, style, data }: { index: number; style: React.CSSProperties; data: { todos: Todo[]; pendingDeletionId: string | null } }) {
  const todo = data.todos[index]
  return (
    <div style={style}>
      <TodoItem todo={todo} isPending={todo.id === data.pendingDeletionId} />
    </div>
  )
})

export function TodoList() {
  const items = useFilteredSortedTodos()
  const pendingDeletionId = useTodoStore(s => s.pendingDeletionId)
  const reorderTodos = useTodoStore(s => s.reorderTodos)
  const listRef = useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex(t => t.id === active.id)
    const newIndex = items.findIndex(t => t.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderTodos(oldIndex, newIndex)
    }
  }, [items, reorderTodos])

  const useVirtual = items.length > VIRTUALIZATION_THRESHOLD

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="todo-list">
          {useVirtual ? (
            <VirtualList
              listRef={listRef}
              height={600}
              rowCount={items.length}
              rowHeight={ROW_HEIGHT}
              width="100%"
              rowComponent={TodoRow}
              rowProps={{ data: { todos: items, pendingDeletionId } }}
            />
          ) : (
            items.map(todo => (
              <TodoItem key={todo.id} todo={todo} isPending={todo.id === pendingDeletionId} />
            ))
          )}
          {items.length === 0 && <div className="todo-empty">No todos match your filters.</div>}
        </div>
      </SortableContext>
    </DndContext>
  )
}
