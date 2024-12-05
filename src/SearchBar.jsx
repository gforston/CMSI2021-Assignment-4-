import React from "react";

export default function SearchBar({ searchQuery, setSearchQuery, fetchPlayerByName }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchPlayerByName(); // Trigger fetch when Enter is pressed
    }
  };
  return (
    <input
      type="text"
      placeholder="Search for a player..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={handleKeyDown} // Listen for Enter key press
      //remove this and add css
      style={{
        padding: "10px",
        margin: "10px 0",
        width: "100%",
        fontSize: "16px",
      }}
    />
  );
};

