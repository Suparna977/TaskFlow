# Taskflow

A glassmorphism to-do tracker built with React and Vite. Tasks are stored in your browser's `localStorage`, so no backend is needed.

## Run it

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build into /dist
npm run preview   # preview the production build
```

Requires Node 18+.

## Features

- Add, edit (title, description, priority, category, due date), complete and delete tasks
- Undo for deleting a task and for "Clear completed" (the task returns to its original position)
- Search (press `/` to focus, `Esc` to clear), status filter with live counts, category filter
- Sort by priority, due date, newest, oldest or title; your choice is remembered
- Dashboard with total / pending / completed / overdue counts and a progress bar
- Smart due labels: "Overdue by 2 days", "Due today", "Due tomorrow", "Due in 5 days"
- Light and dark glass themes (follows your system setting, toggle in the header)
- Export tasks to JSON and import them back (duplicates are skipped)
- Responsive layout, keyboard-accessible controls, reduced-motion support

## Project structure

```
src/
  main.jsx          entry point
  App.jsx           state, persistence and task actions
  App.css           component styles (glass surfaces)
  index.css         theme tokens, page backdrop, reset
  utils.js          constants, due-date logic, sorting, import/export
  hooks.js          useTheme, useStoredState
  icons.jsx         inline SVG icons
  Header.jsx  Dashboard.jsx  TaskForm.jsx  PriorityPicker.jsx
  Toolbar.jsx  TaskList.jsx  TaskItem.jsx  Toast.jsx  Footer.jsx
```

## Notes

- Saved data uses the same `tasks` key as the original version, so existing tasks load automatically (older tasks get the "Other" category).
- To tweak the look, edit the CSS variables at the top of `src/index.css` (colours, blur strength, glass opacity).
