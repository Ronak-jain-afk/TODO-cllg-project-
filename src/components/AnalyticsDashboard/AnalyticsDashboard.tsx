import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useTodoStore } from '../../store/todoStore'
import type { Priority } from '../../types/todo'

const COLORS: Record<Priority, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
}

export default function AnalyticsDashboard() {
  const items = useTodoStore(s => s.items)

  const stats = useMemo(() => {
    const total = items.length
    const completed = items.filter(t => t.isCompleted).length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    const active = items.filter(t => !t.isCompleted)

    const priorityBreakdown = active.reduce<Record<string, number>>((acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1
      return acc
    }, {})

    const overdue = active.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length

    const categoryPile = active.reduce<Record<string, number>>((acc, t) => {
      const cat = t.category || 'General'
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {})

    const priorityData = Object.entries(priorityBreakdown).map(([name, value]) => ({ name, value }))

    return { completionRate, priorityData, overdue, categoryPile }
  }, [items])

  return (
    <div className="analytics-dashboard">
      <h2>Analytics</h2>

      <div className="analytics-card">
        <h3>Completion Rate</h3>
        <div className="completion-rate">{stats.completionRate}%</div>
      </div>

      {stats.overdue > 0 && (
        <div className="analytics-card overdue-alert">
          <h3>Overdue</h3>
          <div className="overdue-count">{stats.overdue} tasks overdue!</div>
        </div>
      )}

      <div className="analytics-card">
        <h3>Priority Breakdown</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={stats.priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {stats.priorityData.map(entry => (
                <Cell key={entry.name} fill={COLORS[entry.name as Priority] || '#888'} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="analytics-card">
        <h3>Categories</h3>
        <ul className="category-list">
          {Object.entries(stats.categoryPile).map(([cat, count]) => (
            <li key={cat}>{cat}: {count}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
