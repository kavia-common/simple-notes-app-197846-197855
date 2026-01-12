import React from "react";
import "./NotesList.css";

function formatUpdatedAt(ts) {
  const d = new Date(ts);
  // Simple, readable format without extra libs.
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * List of note cards.
 */
// PUBLIC_INTERFACE
export default function NotesList({ notes, onSelect, onDelete }) {
  /** Render notes list with click-to-edit and delete action. */
  if (!notes.length) {
    return (
      <div className="EmptyState" role="status" aria-live="polite">
        <div className="EmptyState__title">No notes yet</div>
        <div className="EmptyState__text">Click “Add Note” to create your first note.</div>
      </div>
    );
  }

  return (
    <div className="NotesList" role="list" aria-label="Notes">
      {notes.map((note) => (
        <div className="NoteCard" role="listitem" key={note.id}>
          <button
            type="button"
            className="NoteCard__main"
            onClick={() => onSelect(note.id)}
            aria-label={`Edit note: ${note.title}`}
          >
            <div className="NoteCard__titleRow">
              <div className="NoteCard__title">{note.title}</div>
              <div className="NoteCard__time" title={`Updated at ${formatUpdatedAt(note.updatedAt)}`}>
                {formatUpdatedAt(note.updatedAt)}
              </div>
            </div>
            {note.content ? (
              <div className="NoteCard__content">{note.content}</div>
            ) : (
              <div className="NoteCard__content NoteCard__content--muted">(No content)</div>
            )}
          </button>

          <div className="NoteCard__actions">
            <button
              type="button"
              className="IconButton IconButton--danger"
              onClick={() => onDelete(note.id)}
              aria-label={`Delete note: ${note.title}`}
              title="Delete"
            >
              {/* simple inline icon */}
              <span aria-hidden="true">🗑</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
