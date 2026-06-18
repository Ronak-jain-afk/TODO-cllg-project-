# FlowForge Todo App — Agent Guide

## Stack

- **Vite + React + TypeScript** (strict mode via `tsc -b`)
- **Zustand** for state management
- **@dnd-kit** for drag-and-drop sorting
- **recharts** for analytics charts
- **react-window** (v2) for list virtualization

## State

All code is implemented. Core features: CRUD, undo/redo (30-entry history), drag-and-drop reorder, filter/search, Pomodoro timer, subtask cascade, dark/light theme, import/export JSON, analytics dashboard (lazy-loaded).

## Architecture

Three layers:
- **Data Layer** — Zustand store (`src/store/`), types, localStorage persistence
- **Business Logic** — hooks, selectors, filter/sort/cascade utilities (`src/hooks/`, `src/utils/`)
- **Presentation** — components under `src/components/`

## Key Design Decisions

- Immutable state updates; every mutation pushes to a 30-entry undo/redo history stack
- `order` property on each Todo (not array index) for drag-and-drop persistence
- Deferred deletion via `pendingDeletionId` + 5s snackbar timeout
- Debounced (500ms) localStorage save on state changes
- Lazy-load AnalyticsDashboard via `React.lazy` + `Suspense`
- Virtualize via `react-window` when filtered list exceeds 100 items (not yet wired)
- All store logic in `src/store/todoStore.ts` (no separate `historyStore`)

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — typecheck + production build (`tsc -b && vite build`)
- `npm run lint` — ESLint check
- `npm run preview` — preview production build

## Folder Structure

```
src/
  components/   — AddTodo, TodoItem, TodoList, FilterBar, SearchInput,
                  UndoSnackbar, AnalyticsDashboard, FocusTimer, ThemeToggle,
                  ImportExport
  store/        — todoStore.ts, themeStore.ts
  hooks/        — useKeyboardShortcuts, useDebouncedSave, useHydration
  types/        — todo.ts, filter.ts
  utils/        — localStorage, subtaskUtils, fuzzySearch
  data/         — demoData.ts
```

## Design Context

See `PRODUCT.md` (strategic: users, brand, principles) and `DESIGN.md` (visual: palette, typography, components). Key rules from DESIGN.md enforced by CSS:
- No glassmorphism, no gradient text, no side-stripe borders — flat tonal surfaces with `--surface` on `--bg`
- Warm terracotta accent (`oklch(52% 0.14 38)`) on ≤10% of screen
- One typeface (Inter), three weights (400/500/600)
- Priority via full-card background tint, not border-left
- Radii: cards/12px, inputs/buttons/10px, chips/12px
- Semantic z-index scale: dropdown(10) → sticky(20) → backdrop(30) → modal(40) → toast(50) → tooltip(60)
- Body text `--ink` on `--bg` must maintain 4.5:1 contrast

## Reference Files

- `plan.md` — product specification
- `dev-plan.md` — phased implementation task list
- `PRODUCT.md` — strategic design brief
- `DESIGN.md` — visual design system
