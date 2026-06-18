# FlowForge Todo App — Development Plan

## Project Setup

- [ ] **Initialize Vite + React + TypeScript project**
  - Run `npm create vite@latest` with React + TypeScript template
  - Verify `tsconfig.json` has strict mode enabled
- [ ] **Install core dependencies**
  - `zustand` (state management)
  - `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (drag-and-drop)
  - `react-window` (virtualization for 100+ items)
  - `recharts` (analytics charts — donut, bar)
- [ ] **Set up project folder structure**

  ```
  src/
    components/
      AddTodo/
      TodoItem/
      TodoList/
      FilterBar/
      SearchInput/
      UndoSnackbar/
      AnalyticsDashboard/
      FocusTimer/
      ThemeToggle/
      ImportExport/
      KeyboardShortcuts/
    store/
      todoStore.ts
      historyStore.ts
      themeStore.ts
    hooks/
      useKeyboardShortcuts.ts
      useDebouncedSave.ts
      useHydration.ts
    types/
      todo.ts
      filter.ts
    utils/
      filterTodos.ts
      sortTodos.ts
      localStorage.ts
      subtaskUtils.ts
      cascadeComplete.ts
      fuzzySearch.ts
    data/
      demoData.ts
    App.tsx
    main.tsx
    index.css
  ```

---

## Phase 1: Data Modeling & Types

- [ ] **Define Todo type** (`src/types/todo.ts`)
  - Fields: `id: string` (UUID), `title: string`, `description?: string`
  - Status: `isCompleted: boolean`, `completedAt: string | null`
  - Meta: `priority: 'critical' | 'high' | 'medium' | 'low'`, `category: string`, `dueDate: string | null`, `estimatedPomodoros: number` (default 1), `completedPomodoros: number` (default 0)
  - Hierarchy: `subtasks: Todo[]`
  - Sorting: `order: number`
  - Timestamp: `createdAt: string`
- [ ] **Define Filter type** (`src/types/filter.ts`)
  - `status: 'all' | 'active' | 'completed'`
  - `priority: 'critical' | 'high' | 'medium' | 'low' | null`
  - `category: string | null`
  - `searchQuery: string`
- [ ] **Create demo seed data** (`src/data/demoData.ts`)
  - 3 pre-made todos with varied categories, priorities, due dates, and subtasks
  - Ensure they exercise all filter and sort paths

---

## Phase 2: Core State & Undo/Redo

### Store Foundation

- [ ] **Create Zustand store** (`src/store/todoStore.ts`)
  - State shape: `{ items: Todo[], filter: Filter, pendingDeletionId: string | null }`
- [ ] **Implement `ADD_TODO` action**
  - Generate `id` via `crypto.randomUUID()`
  - Set `order` = `items.length`
  - Set `createdAt` = `new Date().toISOString()`
  - Push to history before mutating
- [ ] **Implement `DELETE_TODO` action** (immediate removal + history push)
  - Pushes current state to history, then filters out the item by id
  - Recursively handle subtasks
- [ ] **Implement `TOGGLE_TODO` action**
  - Flip `isCompleted`, set/clear `completedAt`
  - If the toggled item is a subtask, trigger cascade-complete logic on parent
- [ ] **Implement `EDIT_TODO` action**
  - Merge partial fields onto the target todo by `id`
- [ ] **Implement `REORDER_TODOS` action**
  - Accept `oldIndex` and `newIndex`
  - Splice item out, splice it back at `newIndex`
  - Recalculate `order = index` for all items in that list
- [ ] **Implement `SET_FILTER` action**
  - Merge partial filter into `filter` state (no history push needed for filter changes)
- [ ] **Implement `SET_PENDING_DELETION` / `CLEAR_PENDING_DELETION` actions**
  - Used by the deferred-deletion snackbar flow

### Undo / Redo System

- [ ] **Add history stack to store**
  - `history: Todo[][]` (cap at 30 entries)
  - `currentHistoryIndex: number`
- [ ] **Implement `UNDO` action**
  - Guard: only if `currentHistoryIndex > 0`
  - Decrement index, restore `items` from `history[currentHistoryIndex]`
- [ ] **Implement `REDO` action**
  - Guard: only if `currentHistoryIndex < history.length - 1`
  - Increment index, restore `items` from `history[currentHistoryIndex]`
- [ ] **History push helper**
  - Every state-mutating action calls `pushToHistory(newItems)` internally
  - Truncate any "future" entries if user is mid-undo before making a new change
  - If history exceeds 30 entries, shift oldest

---

## Phase 3: Filtering, Sorting & Derived State

- [ ] **Build `fuzzySearch` utility** (`src/utils/fuzzySearch.ts`)
  - Case-insensitive match on `title` and `description`
  - Return boolean
- [ ] **Build `filterTodos` selector** (`src/utils/filterTodos.ts`)
  - Step 1: Filter by `status` (completed/active)
  - Step 2: Filter by `priority`
  - Step 3: Filter by `category`
  - Step 4: Apply `searchQuery` via fuzzy search
  - Return filtered array
- [ ] **Build `sortTodos` utility** (`src/utils/sortTodos.ts`)
  - Manual (by `order` property)
  - Due Date (ascending, nulls last)
  - Priority (critical → high → medium → low)
- [ ] **Wire derived list in store**
  - Create a custom hook `useFilteredSortedTodos` that applies `filterTodos` then `sortTodos` both wrapped in `useMemo`

---

## Phase 4: Advanced Interactions

### A. Drag-and-Drop

- [ ] **Set up `@dnd-kit` DndContext in TodoList**
  - Use `SortableContext` with `verticalListSortingStrategy`
- [ ] **Make TodoItem a sortable `useSortable` element**
  - Render drag handle icon
- [ ] **Handle `onDragEnd` event**
  - Extract `oldIndex` / `newIndex` from `{active, over}`
  - Call `reorderTodos(oldIndex, newIndex)`
  - Recalculate all `order` values

### B. Focus Mode (Pomodoro Timer)

- [ ] **Add `completedPomodoros` field to Todo type** (already in type definition)
- [ ] **Build FocusTimer component**
  - Accept `selectedTodoId` prop
  - Display 25:00 countdown
  - Start / Pause / Reset controls
- [ ] **Implement timer completion logic**
  - When timer hits 0, increment `completedPomodoros` on the todo
  - If `completedPomodoros >= estimatedPomodoros`, auto-complete the task
- [ ] **Wire "Start Focus" button on each TodoItem**
  - Click sets `selectedTodoId` in store and opens FocusTimer

### C. Subtask Cascade Logic

- [ ] **Build `cascadeComplete` utility** (`src/utils/cascadeComplete.ts`)
  - Given a parent todo, check if all subtasks are completed
  - If so, auto-set `isCompleted = true` and `completedAt = now`
- [ ] **Calculate `progressPercentage` on parent todos**
  - Derived value: `completed subtasks / total subtasks * 100`
- [ ] **Render mini progress bar on parent TodoItem**
  - Thin horizontal bar, width = `progressPercentage`

### D. Deferred Deletion (Snackbar)

- [ ] **Build UndoSnackbar component**
  - Display message: "Todo deleted. [Undo]"
  - 5-second countdown timer
  - "Undo" button clears `pendingDeletionId` and restores item
  - On timeout expiry, permanently delete via `DELETE_TODO`
- [ ] **Wire delete flow**
  - Click delete → set `pendingDeletionId` in store → visually gray out item → show snackbar
  - If user starts another action on a different item, cancel pending deletion

---

## Phase 5: Persistence & UX

### A. Smart LocalStorage

- [ ] **Build `localStorage` utilities** (`src/utils/localStorage.ts`)
  - `saveState(items, filter)` — serialize to `localStorage.setItem('flowforge-todos', ...)`
  - `loadState()` — parse and return stored state or null
- [ ] **Create `useDebouncedSave` hook** (`src/hooks/useDebouncedSave.ts`)
  - Subscribe to store changes
  - Debounce 500ms before calling `saveState`
  - Use `useEffect` + `setTimeout` / `clearTimeout`
- [ ] **Create `useHydration` hook** (`src/hooks/useHydration.ts`)
  - On mount (`useEffect` with `[]`), read from localStorage
  - If data exists, replace store state with it
  - If not, seed with demo data
  - Set `hydrated` flag to prevent flash of empty state

### B. Keyboard Shortcuts

- [ ] **Create `useKeyboardShortcuts` hook** (`src/hooks/useKeyboardShortcuts.ts`)
  - Attach global `keydown` listener via `useEffect`
  - Prevent default browser behavior for app shortcuts
- [ ] **Implement each shortcut**
  - `Ctrl/Cmd + K` → focus search input
  - `Ctrl/Cmd + N` → clear fields, focus "Add Todo" input
  - `Ctrl/Cmd + Z` → undo (if possible)
  - `Ctrl/Cmd + Shift + Z` / `Ctrl/Cmd + Y` → redo (if possible)
  - `Escape` → blur active input / close modals

### C. Add Todo Flow

- [ ] **Build AddTodo component**
  - Title input (required)
  - Priority select
  - Category input/tags
  - Due date picker
  - Estimated pomodoros number input
  - "Add" button
- [ ] **Wire submission logic**
  - Validate title is non-empty
  - Dispatch `ADD_TODO`
  - Clear form
  - Auto-focus title input via `ref`
  - Show success toast (2 seconds)

---

## Phase 6: Analytics Dashboard

- [ ] **Build AnalyticsDashboard component**
  - Wrap in `React.lazy` + `Suspense` (lazy-loaded)
  - Toggle via `Ctrl/Cmd + D` or a sidebar button
- [ ] **Completion Rate card**
  - `(completed / total) * 100`
  - Animated counter (counts up to value)
- [ ] **Priority Breakdown (donut chart)**
  - Use `recharts` `PieChart` / `Pie`
  - Show count of each priority among active (non-completed) tasks
- [ ] **Overdue Count**
  - Compare `dueDate` of incomplete tasks to `Date.now()`
  - Red alert badge if > 0
- [ ] **Category Pile**
  - Group active tasks by `category`
  - Display category name + count per group
- [ ] **Responsive layout**
  - On desktop: fixed sidebar
  - On mobile: toggle via FAB button

---

## Phase 7: UI/UX Styling

### Theme System

- [ ] **Create theme store** (`src/store/themeStore.ts`)
  - `theme: 'light' | 'dark'`
  - Persist to localStorage
  - Toggle action
- [ ] **Define CSS variables** in `index.css`
  - `--bg-primary`, `--bg-secondary`, `--text-primary`, `--text-secondary`, `--accent`, `--shadow`, `--glass-bg`, `--glass-border`, etc.
  - Apply on `[data-theme="dark"]` selector
- [ ] **Apply smooth transitions**
  - `transition: background-color 0.3s ease, color 0.3s ease`
- [ ] **Build ThemeToggle component**
  - Sun/Moon icon button
  - Calls `toggleTheme()`

### Component Styling

- [ ] **Style App shell** — CSS Grid layout
- [ ] **Style AddTodo bar** — glassmorphism card with `backdrop-filter`
- [ ] **Style TodoItem** — priority color indicator (left border), progress bar for subtasks, fade animation for completed
- [ ] **Style FilterBar** — chip/tab style buttons for status, dropdowns for priority/category
- [ ] **Style SearchInput** — icon + input with clear button
- [ ] **Style UndoSnackbar** — fixed bottom-center toast
- [ ] **Style AnalyticsDashboard** — sidebar panel with glassmorphism cards
- [ ] **Style FocusTimer** — circular countdown
- [ ] **Responsive breakpoint** — `max-width: 768px` hides sidebar, enables FAB

---

## Phase 8: Import / Export

- [ ] **Build Export feature**
  - Serialize `items` array to JSON
  - Create `data:text/json` link, trigger download as `flowforge-backup.json`
- [ ] **Build Import feature**
  - Hidden `<input type="file" accept=".json" />`
  - On file select, use `FileReader` to read
  - Validate structure (check first item has `id` and `title`)
  - If valid, push current state to history, then replace items
  - If invalid, show error toast
- [ ] **Add Import/Export buttons** to the app header or settings area

---

## Phase 9: Performance Optimization

- [ ] **Virtualization with `react-window`**
  - If filtered list > 100 items, render with `FixedSizeList` instead of flat map
  - Measure item height and pass `itemCount`, `itemSize`
- [ ] **Component memoization**
  - Wrap TodoItem, FilterBar chips, AnalyticsDashboard cards, Header in `React.memo`
  - Use `useCallback` for all event handlers passed as props
- [ ] **Lazy load AnalyticsDashboard**
  - `const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard/AnalyticsDashboard'))`
  - Wrap in `<Suspense fallback={<AnalyticsSkeleton />}>`

---

## Verification & Polish

- [ ] **Lint & typecheck**
  - `npm run lint` — fix all warnings
  - `npm run typecheck` (or `tsc --noEmit`) — fix all type errors
- [ ] **Manual smoke test**
  - Add, edit, delete, toggle todos
  - Undo / redo 30+ steps
  - Drag-and-drop reorder
  - Filter + search combinations
  - Pomodoro timer
  - Subtask cascade
  - Dark mode toggle
  - Import / export cycle
  - Refresh page → state persists
- [ ] **Accessibility check**
  - All interactive elements have `aria-label` or visible labels
  - Focus ring visible on keyboard navigation
  - Color contrast ratios pass
