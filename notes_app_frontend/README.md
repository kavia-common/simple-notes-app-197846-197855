# Notes App (React + localStorage)

A simple single-page notes app that runs entirely in the browser (no backend). Notes are persisted in `window.localStorage`.

## Features

- List notes (sorted by `updatedAt` descending)
- Add a note (title required, content optional)
- Edit a note (click a note card to open editor)
- Delete a note (with confirmation prompt)
- Search/filter by title or content
- Empty state + basic keyboard accessibility (`Esc` cancels the form)

## Run locally

From `notes_app_frontend/`:

```bash
npm install
npm start
```

Then open http://localhost:3000

## Data persistence

Notes are saved in localStorage under a single key. Refreshing the page preserves your notes.
