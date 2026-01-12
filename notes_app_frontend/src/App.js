import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import NotesList from "./components/NotesList";
import NoteForm from "./components/NoteForm";
import { generateNoteId, loadNotes, saveNotes } from "./utils/localStorage";

function normalizeQuery(q) {
  return (q ?? "").trim().toLowerCase();
}

function matchesQuery(note, q) {
  if (!q) return true;
  const t = (note.title ?? "").toLowerCase();
  const c = (note.content ?? "").toLowerCase();
  return t.includes(q) || c.includes(q);
}

// PUBLIC_INTERFACE
function App() {
  /** Single-page Notes app persisted to browser localStorage. */
  const [notes, setNotes] = useState(() => loadNotes());
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("list"); // "list" | "add" | "edit"
  const [activeNoteId, setActiveNoteId] = useState(null);

  // Persist notes on change.
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const activeNote = useMemo(() => {
    if (!activeNoteId) return null;
    return notes.find((n) => n.id === activeNoteId) ?? null;
  }, [notes, activeNoteId]);

  const filteredSortedNotes = useMemo(() => {
    const q = normalizeQuery(query);
    return [...notes]
      .filter((n) => matchesQuery(n, q))
      .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  }, [notes, query]);

  // PUBLIC_INTERFACE
  function startAdd() {
    /** Open the add-note form. */
    setActiveNoteId(null);
    setMode("add");
  }

  // PUBLIC_INTERFACE
  function startEdit(noteId) {
    /** Open the edit form for the selected note. */
    setActiveNoteId(noteId);
    setMode("edit");
  }

  // PUBLIC_INTERFACE
  function cancelForm() {
    /** Return to list view without saving. */
    setMode("list");
    setActiveNoteId(null);
  }

  // PUBLIC_INTERFACE
  function saveFromForm(payload) {
    /** Save note (create or update) from form payload. */
    const now = Date.now();

    if (mode === "add") {
      const newNote = {
        id: generateNoteId(),
        title: payload.title,
        content: payload.content ?? "",
        updatedAt: now,
      };
      setNotes((prev) => [newNote, ...prev]);
      setMode("list");
      return;
    }

    if (mode === "edit" && activeNoteId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeNoteId
            ? { ...n, title: payload.title, content: payload.content ?? "", updatedAt: now }
            : n
        )
      );
      setMode("list");
      setActiveNoteId(null);
    }
  }

  // PUBLIC_INTERFACE
  function deleteNote(noteId) {
    /** Delete a note after confirmation. */
    const note = notes.find((n) => n.id === noteId);
    const label = note?.title ? `“${note.title}”` : "this note";
    const ok = window.confirm(`Delete ${label}? This cannot be undone.`);
    if (!ok) return;

    // If deleting the currently open note, return to list.
    if (activeNoteId === noteId) {
      setMode("list");
      setActiveNoteId(null);
    }

    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }

  return (
    <div className="App">
      <Header onAddNote={startAdd} />

      <main className="Main" role="main">
        <div className="TopRow">
          <SearchBar value={query} onChange={setQuery} />
          <div className="TopRow__meta" aria-live="polite">
            {filteredSortedNotes.length} note{filteredSortedNotes.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="Layout">
          <section className="Layout__left" aria-label="Notes list">
            <NotesList notes={filteredSortedNotes} onSelect={startEdit} onDelete={deleteNote} />
          </section>

          <aside className="Layout__right" aria-label="Note editor">
            {mode === "list" ? (
              <div className="Placeholder" role="status" aria-live="polite">
                <div className="Placeholder__title">Select a note to edit</div>
                <div className="Placeholder__text">
                  Or click <strong>Add Note</strong> to create a new one.
                </div>
              </div>
            ) : (
              <NoteForm
                mode={mode}
                initialNote={mode === "edit" ? activeNote : null}
                onSave={saveFromForm}
                onCancel={cancelForm}
              />
            )}
          </aside>
        </div>

        {/* FAB for mobile / quick access */}
        <button className="Fab" type="button" onClick={startAdd} aria-label="Add note">
          +
        </button>
      </main>
    </div>
  );
}

export default App;
