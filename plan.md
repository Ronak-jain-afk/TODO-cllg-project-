
### Executive Summary: The "FlowForge" Todo App
Instead of a basic list, build a **personal productivity cockpit**. Logic is separated into layers: **Data Layer** (state/history), **Business Logic Layer** (hooks/selectors), and **Presentation Layer** (components). The core differentiators are **Time-Travel (Undo/Redo)**, **Drag-and-Drop Sorting**, **Advanced Filtering**, and **Productivity Analytics**.

---

### Phase 1: Data Modeling (The Backbone)
Define a strict, immutable data structure for a single Todo item. This prevents bugs and makes features like search/grouping trivial.

- **Core Fields:** `id` (UUID), `title` (string), `description` (optional string).
- **Status Fields:** `isCompleted` (boolean), `completedAt` (timestamp or null).
- **Meta Fields:** `priority` (Enum: `'critical' | 'high' | 'medium' | 'low'`), `category` (string, e.g., "Work", "Personal", "Health"), `dueDate` (ISO string or null), `estimatedPomodoros` (number, default 1).
- **Hierarchy:** `subtasks` (array of Todo items - allows infinite nesting, but limit to 2 levels for UI sanity).
- **Sorting Index:** `order` (number). *Crucial for drag-and-drop; do not rely on array index alone.*

---

### Phase 2: Core Logic & State Architecture
Use **Zustand** (or React Context + `useReducer`) for global state. The store must contain:

1.  `items`: The master array of todos.
2.  `filter`: Object containing `{ status: 'all'|'active'|'completed', priority: null|'critical'|..., category: null|string, searchQuery: string }`.
3.  `history`: An array of previous states (for Undo/Redo).
4.  `currentHistoryIndex`: Number pointing to the current state in the history stack.

**Key Logic: Immutable Updates**
Every action (Add, Delete, Toggle, Edit) must clone the state, modify it, and return a new object. *Crucially*, every successful action automatically pushes the *new* state into the `history` array (truncating any "future" states if you are in the middle of an Undo).

**Undo/Redo Logic (Time Travel):**
- **Undo:** Decrease `currentHistoryIndex` by 1. Replace `items` with `history[currentHistoryIndex]`.
- **Redo:** Increase index by 1. Replace `items` with the new index.
- *Limit:* Cap the `history` array to the last 30 snapshots to prevent memory bloat.

---

### Phase 3: Smart Processing (Derived State & Memoization)
Never render raw data. Use `useMemo` to compute a "Virtual List" based on active filters.

- **Search Logic:** Case-insensitive fuzzy matching on `title` and `description`.
- **Multi-Filter Combination Logic:**
  - *Step 1:* Filter by `status` (Completed/Active).
  - *Step 2:* Filter by `priority` (if selected).
  - *Step 3:* Filter by `category` (if selected).
  - *Step 4:* Apply `searchQuery`.
- **Sorting Logic:** Apply *after* filtering. Offer three sort modes:
  1.  **Manual (Default):** Sorted by the `order` property (managed by drag-and-drop).
  2.  **Due Date:** Ascending (Overdue first).
  3.  **Priority:** Critical > High > Medium > Low.

---

### Phase 4: Advanced Interactions (The "Wow" Factors)

**A. Drag-and-Drop Reordering**
- Logic: Use `@dnd-kit/sortable`. When drag ends, capture the `oldIndex` and `newIndex`.
- Update logic: Splice the item out of the array, splice it into the new position, and importantly, **recalculate the `order` property** for every item in that list to reflect the new sequence (e.g., set order = index). This ensures persistence on page reload.

**B. The "Focus Mode" (Pomodoro Integration)**
- Add a timer component that reads the `estimatedPomodoros` of a selected task.
- Logic: When "Start Focus" is clicked on a Todo, a timer counts down from 25 mins.
- **Interaction Logic:** When the timer hits 0, increment a `completedPomodoros` counter on that Todo item. If `completedPomodoros` equals `estimatedPomodoros`, automatically mark the main task as `isCompleted`. This gamifies the workflow.

**C. Subtask Cascade Logic**
- If a parent Todo has `subtasks`:
  - *Auto-complete:* When 100% of subtasks are marked complete, automatically complete the parent task and record the `completedAt` timestamp.
  - *Progress Tracking:* Derive a `progressPercentage` for the parent by counting completed subtasks vs. total subtasks and render a miniature progress bar next to the title.

---

### Phase 5: Persistence & User Experience (UX) Logic

**A. Smart LocalStorage**
- **Debounced Save:** Do not save to localStorage on every keystroke. Implement a debounce logic (wait 500ms after the user stops typing/clicking) before serializing the `items` and `filter` state to `localStorage`.
- **Hydration:** On app initialization (`useEffect` with empty dependency array), read from localStorage. If data exists, replace the default initial state. If not, seed the app with 2-3 pre-made demo todos so the UI never looks empty.

**B. Keyboard Shortcuts (Power-User Logic)**
- Attach a global `useEventListener` for `keydown`.
- `Ctrl/Cmd + K`: Focus the search input (prevent default to avoid browser search).
- `Ctrl/Cmd + N`: Clear all input fields and auto-focus the "Add Todo" input to start a new task immediately.
- `Ctrl/Cmd + Z`: Trigger Undo (only if `currentHistoryIndex > 0`).
- `Ctrl/Cmd + Shift + Z` or `Ctrl/Cmd + Y`: Trigger Redo.
- `Escape`: Blur any active input/close any modal.

**C. Deferred Deletion (Snackbar Logic)**
- Instead of instantly deleting, when "Delete" is clicked, temporarily gray out the item and show an "Undo Delete" snackbar/toast for 5 seconds.
- Logic: Set a `pendingDeletionId` in state. Use `setTimeout` for 5000ms. If the user clicks "Undo" before the timeout finishes, clear the timeout and restore the item. If the timeout fires, permanently filter it out of the `items` array and update the history.

---

### Phase 6: Data Visualization & Analytics Dashboard
Add a collapsible sidebar or overlay panel (toggle via `Ctrl/Cmd + D`) that shows real-time derived stats:

- **Completion Rate:** `(Completed / Total) * 100`. Animate this number counting up.
- **Priority Breakdown:** A mini donut chart showing how many Critical/High/Medium/Low tasks are currently active.
- **Overdue Count:** Compare `dueDate` of incomplete tasks to `Date.now()`. Show a red alert if overdue > 0.
- **Category Pile:** Group tasks by `category` and display the count per category (e.g., Work: 4, Personal: 2).

---

### Phase 7: UI/UX Styling Logic (The Aesthetic)
- **Theme Toggle:** Use React Context to manage `theme` state (`light` | `dark`). Persist preference in localStorage. Apply CSS variables to the root element. When toggling, smoothly transition background/color changes via CSS `transition: all 0.3s ease`.
- **Glassmorphism / Neumorphism:** Choose one and stick to it. Logic dictates that components (Add bar, Todo cards, Dashboard) share a unified `box-shadow` and `backdrop-filter` system defined in a central CSS file.
- **Responsive Logic:** Use CSS Grid for the main layout. On `max-width: 768px`, hide the Analytics dashboard behind a floating action button (FAB) instead of a sidebar. The drag-and-drop should automatically disable touch-action styling for mobile.

---

### Phase 8: Import / Export Logic (Backup Feature)
- **Export:** Serialize the entire `items` array into a JSON blob, create a virtual `<a>` element, set `href` to `data:text/json;charset=utf-8,${encodedData}`, and trigger a `click()` download.
- **Import:** Use an `<input type="file" accept=".json" />`. Logic reads the file using `FileReader`. On load, validate the data structure (check if first item has an `id` and `title`). If valid, replace the entire current state with the imported data (push a snapshot to history first, so they can Undo this action).

---

### Phase 9: Performance Optimization Logic (Bonus)
- **Virtualization:** If the user has more than 100 items, implement `react-window` logic. Render only the visible items in the viewport to keep DOM nodes low.
- **Component Memoization:** Wrap static components (like the Header, Analytics Cards) in `React.memo`. Use `useCallback` for all event handlers passed down to child components to prevent unnecessary re-renders.
- **Lazy Loading:** Use React's `lazy` and `Suspense` to split the code. Load the heavy "Analytics Dashboard" component only when the user clicks the button to open it, reducing initial bundle size.

---

### Final Logic Flow for the "Add Todo" Event (Example Walkthrough)
1. User types title, selects priority/due date, clicks "Add".
2. Dispatch `ADD_TODO` action.
3. Reducer creates a new Todo object with `id: crypto.randomUUID()`, `order: items.length`, `createdAt: new Date().toISOString()`.
4. New array = `[...prevItems, newTodo]`.
5. History stack gets updated with this new array.
6. Debounced `saveToLocalStorage` triggers.
7. Input field clears automatically via `ref.current.focus()` logic.
8. A success toast pops up for 2 seconds.
9. If the current filter doesn't include the new item's status (e.g., filter is set to "Completed"), the item is added to the master list but logically hidden by the filter selector, keeping the UI uncluttered.
