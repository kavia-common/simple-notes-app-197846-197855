/**
 * LocalStorage persistence helpers for Notes.
 * Notes are stored under a single key as a JSON array.
 */

const NOTES_STORAGE_KEY = "notes_app__notes_v1";

// PUBLIC_INTERFACE
export function loadNotes() {
  /** Load notes from localStorage (returns [] if missing/invalid). */
  try {
    const raw = window.localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Normalize records to expected shape.
    return parsed
      .filter((n) => n && typeof n === "object")
      .map((n) => ({
        id: String(n.id ?? ""),
        title: String(n.title ?? ""),
        content: String(n.content ?? ""),
        updatedAt:
          typeof n.updatedAt === "number" && Number.isFinite(n.updatedAt)
            ? n.updatedAt
            : Date.now(),
      }))
      .filter((n) => n.id && n.title);
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveNotes(notes) {
  /** Persist notes array into localStorage. */
  try {
    window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes ?? []));
  } catch {
    // If storage is full/blocked, fail silently. App remains usable for session.
  }
}

// PUBLIC_INTERFACE
export function generateNoteId() {
  /** Generate a reasonably unique ID for a note. */
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
