import { useState, useEffect, useRef } from 'react'
import { useTodoStore } from '../../store/todoStore'

const POMODORO_MS = 25 * 60 * 1000

export function FocusTimer() {
  const selectedTodoId = useTodoStore(s => s.selectedTodoId)
  const setSelectedTodoId = useTodoStore(s => s.setSelectedTodoId)
  const incrementPomodoro = useTodoStore(s => s.incrementPomodoro)
  const items = useTodoStore(s => s.items)

  const [timeLeft, setTimeLeft] = useState(POMODORO_MS)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const todo = selectedTodoId ? items.find(t => t.id === selectedTodoId) ?? items.flatMap(t => t.subtasks).find(st => st.id === selectedTodoId) ?? null : null

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1000) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (selectedTodoId) incrementPomodoro(selectedTodoId)
            return POMODORO_MS
          }
          return prev - 1000
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, selectedTodoId, incrementPomodoro])

  const minutes = Math.floor(timeLeft / 60000)
  const seconds = Math.floor((timeLeft % 60000) / 1000)

  if (!selectedTodoId || !todo) return null

  return (
    <div className="focus-timer">
      <div className="focus-timer-header">
        <h3>Focus: {todo.title}</h3>
        <button onClick={() => { setRunning(false); setSelectedTodoId(null) }}>✕</button>
      </div>
      <div className="timer-display">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="timer-controls">
        <button onClick={() => setRunning(!running)}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => { setTimeLeft(POMODORO_MS); setRunning(false) }}>
          Reset
        </button>
      </div>
    </div>
  )
}
