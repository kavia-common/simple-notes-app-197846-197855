import React from "react";
import "./Header.css";

/**
 * App header with title and primary action.
 */
// PUBLIC_INTERFACE
export default function Header({ onAddNote }) {
  /** Header for the notes app. */
  return (
    <header className="Header" role="banner">
      <div className="Header__inner">
        <div className="Header__brand" aria-label="Simple Notes">
          <div className="Header__title">Notes</div>
          <div className="Header__subtitle">Lightweight local notes</div>
        </div>

        <div className="Header__actions">
          <button className="Button Button--primary" type="button" onClick={onAddNote}>
            Add Note
          </button>
        </div>
      </div>
    </header>
  );
}
