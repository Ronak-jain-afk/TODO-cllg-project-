import { useState, useRef, useEffect } from 'react'
import { useTodoStore } from '../../store/todoStore'
import type { Priority } from '../../types/todo'

export function AddTodo() {
  const addTodo = useTodoStore(s => s.addTodo)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addTodo({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category: category.trim() || 'General',
      dueDate: dueDate || null,
      estimatedPomodoros,
    })
    setTitle('')
    setDescription('')
    setPriority('medium')
    setCategory('')
    setDueDate('')
    setEstimatedPomodoros(1)
    inputRef.current?.focus()
  }

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="What do you need to do?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="add-todo-input"
      />
      <select value={priority} onChange={e => setPriority(e.target.value as Priority)}>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="add-todo-category"
      />
      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />
      <input
        type="number"
        min={1}
        value={estimatedPomodoros}
        onChange={e => setEstimatedPomodoros(Math.max(1, Number(e.target.value)))}
        className="add-todo-pomodoros"
      />
      <button type="submit" disabled={!title.trim()}>Add</button>
    </form>
  )
}
