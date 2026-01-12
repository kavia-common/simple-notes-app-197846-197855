import React from "react";
import "./SearchBar.css";

/**
 * Search input for filtering notes.
 */
// PUBLIC_INTERFACE
export default function SearchBar({ value, onChange }) {
  /** SearchBar for filtering notes by query string. */
  return (
    <div className="SearchBar" role="search">
      <label className="SearchBar__label" htmlFor="notes-search">
        Search notes
      </label>
      <input
        id="notes-search"
        className="SearchBar__input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title or content…"
        autoComplete="off"
      />
    </div>
  );
}
