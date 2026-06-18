import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import type { Todo } from '../../types/todo'
import { useTodoStore } from '../../store/todoStore'
import { getProgressPercentage } from '../../utils/subtaskUtils'

interface TodoItemProps {
  todo: Todo
  isPending?: boolean
}

export function TodoItem({ todo, isPending }: TodoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id })
  const toggleTodo = useTodoStore(s => s.toggleTodo)
  const editTodo = useTodoStore(s => s.editTodo)
  const setPendingDeletion = useTodoStore(s => s.setPendingDeletion)
  const setSelectedTodoId = useTodoStore(s => s.setSelectedTodoId)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : isPending ? 0.5 : 1,
  }

  const progress = getProgressPercentage(todo)

  const handleSave = () => {
    if (editTitle.trim()) {
      editTodo(todo.id, { title: editTitle.trim() })
    }
    setEditing(false)
  }

  return (
    <div ref={setNodeRef} style={style} className={`todo-item priority-${todo.priority} ${todo.isCompleted ? 'completed' : ''}`}>
      <div className="todo-item-header">
        <button className="drag-handle" {...attributes} {...listeners}>⠿</button>
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => toggleTodo(todo.id)}
        />
        {editing ? (
          <input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        ) : (
          <span className="todo-title" onDoubleClick={() => { setEditTitle(todo.title); setEditing(true) }}>
            {todo.title}
          </span>
        )}
        <div className="todo-meta">
          {todo.dueDate && <span className="todo-due">{new Date(todo.dueDate).toLocaleDateString()}</span>}
          <span className="todo-priority-badge">{todo.priority}</span>
          <span className="todo-category-badge">{todo.category}</span>
          {todo.estimatedPomodoros > 0 && <span className="todo-pomodoros">🍅 {todo.completedPomodoros}/{todo.estimatedPomodoros}</span>}
        </div>
        <button className="todo-focus-btn" onClick={() => setSelectedTodoId(todo.id)} title="Focus">
          ▶
        </button>
        <button className="todo-delete-btn" onClick={() => setPendingDeletion(todo.id)} title="Delete">
          ✕
        </button>
      </div>
      {todo.subtasks.length > 0 && (
        <div className="todo-subtask-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
      )}
      {todo.subtasks.length > 0 && (
        <div className="todo-subtasks">
          {todo.subtasks.map(st => (
            <div key={st.id} className={`todo-subtask ${st.isCompleted ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={st.isCompleted}
                onChange={() => toggleTodo(st.id)}
              />
              <span>{st.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
