import { lazy, Suspense, useEffect } from 'react'
import { AddTodo } from './components/AddTodo/AddTodo'
import { TodoList } from './components/TodoList/TodoList'
import { FilterBar } from './components/FilterBar/FilterBar'
import { SearchInput } from './components/SearchInput/SearchInput'
import { UndoSnackbar } from './components/UndoSnackbar/UndoSnackbar'
import { FocusTimer } from './components/FocusTimer/FocusTimer'
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle'
import { ImportExport } from './components/ImportExport/ImportExport'
import { useDebouncedSave } from './hooks/useDebouncedSave'
import { useHydration } from './hooks/useHydration'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useThemeStore } from './store/themeStore'
import { useTodoStore } from './store/todoStore'

const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard/AnalyticsDashboard'))

function App() {
  const theme = useThemeStore(s => s.theme)
  const hydrated = useTodoStore(s => s.hydrated)

  useHydration()
  useDebouncedSave()
  useKeyboardShortcuts()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  if (!hydrated) {
    return <div className="app-loading">Loading...</div>
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>FlowForge</h1>
        <div className="header-actions">
          <ImportExport />
          <ThemeToggle />
        </div>
      </header>

      <main className="app-main">
        <div className="app-content">
          <AddTodo />
          <SearchInput />
          <FilterBar />
          <TodoList />
        </div>
        <aside className="app-sidebar">
          <Suspense fallback={<div className="sidebar-loading">Loading analytics...</div>}>
            <AnalyticsDashboard />
          </Suspense>
        </aside>
      </main>

      <FocusTimer />
      <UndoSnackbar />
    </div>
  )
}

export default App
