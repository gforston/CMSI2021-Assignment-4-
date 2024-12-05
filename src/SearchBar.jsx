import React from "react";
import "./App.css";

// fix the css
export default function SearchBar({ searchQuery, onSearchChange, onKeyDown, suggestions, onSuggestionClick }) {
  return (
    <div className="player-section">
      <input
        type="text"
        className="search-bar"
        placeholder="Search for a player..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((playerData) => (
            <li
              key={playerData.player.id}
              onClick={() => onSuggestionClick(playerData)}
            >
              {playerData.player.first_name} {playerData.player.last_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
