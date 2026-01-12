import React, { useEffect, useMemo, useRef, useState } from "react";
import "./NoteForm.css";

/**
 * Add/Edit form for a note.
 */
// PUBLIC_INTERFACE
export default function NoteForm({ mode, initialNote, onSave, onCancel }) {
  /** Note form supporting add/edit with validation and keyboard interactions. */
  const isEdit = mode === "edit";

  const [title, setTitle] = useState(initialNote?.title ?? "");
  const [content, setContent] = useState(initialNote?.content ?? "");
  const [touched, setTouched] = useState({ title: false });

  const titleRef = useRef(null);

  useEffect(() => {
    // Focus title on open for quick keyboard flow.
    if (titleRef.current) titleRef.current.focus();
  }, []);

  const errorTitle = useMemo(() => {
    if (!touched.title) return "";
    if (!title.trim()) return "Title is required.";
    return "";
  }, [title, touched.title]);

  const canSave = title.trim().length > 0;

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ title: true });
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      content,
    });
  }

  function handleKeyDown(e) {
    // Esc closes the form (basic keyboard accessibility).
    if (e.key === "Escape") onCancel();
  }

  return (
    <section className="NoteForm" aria-label={isEdit ? "Edit note" : "Add note"}>
      <div className="NoteForm__header">
        <div className="NoteForm__heading">{isEdit ? "Edit Note" : "Add Note"}</div>
        <div className="NoteForm__meta">
          {isEdit && initialNote?.updatedAt ? (
            <span className="NoteForm__metaText">
              Last updated:{" "}
              {new Date(initialNote.updatedAt).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          ) : (
            <span className="NoteForm__metaText">Create a new note</span>
          )}
        </div>
      </div>

      <form className="NoteForm__form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <div className="Field">
          <label className="Field__label" htmlFor="note-title">
            Title <span className="Field__required">*</span>
          </label>
          <input
            ref={titleRef}
            id="note-title"
            className={`Field__input ${errorTitle ? "Field__input--error" : ""}`}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, title: true }))}
            placeholder="e.g., Grocery list"
            autoComplete="off"
          />
          {errorTitle ? <div className="Field__error">{errorTitle}</div> : null}
        </div>

        <div className="Field">
          <label className="Field__label" htmlFor="note-content">
            Content
          </label>
          <textarea
            id="note-content"
            className="Field__textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something…"
            rows={10}
          />
        </div>

        <div className="NoteForm__actions">
          <button className="Button Button--primary" type="submit" disabled={!canSave}>
            Save
          </button>
          <button className="Button Button--secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>

        <div className="NoteForm__hint" aria-live="polite">
          Tip: Press <kbd>Esc</kbd> to cancel.
        </div>
      </form>
    </section>
  );
}
