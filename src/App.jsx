import React, { useState, useEffect } from "react";
import { BalldontlieAPI } from "@balldontlie/sdk";
import "./App.css";

export default function PlayerSearch({ onPlayerSelect }) {
  // Added `onPlayerSelect` prop
  const [players, setPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      const api = new BalldontlieAPI({
        apiKey: "138e5814-bfdf-4194-8aa6-8ff31cc3db17",
      });
      try {
        const response = await api.nfl.getSeasonStats({
          season: 2024,
        });
        setPlayers(response.data);
      } catch (err) {
        setError("Failed to fetch players");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleSearchChange = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = players.filter((playerData) => {
      const fullName =
        `${playerData.player.first_name} ${playerData.player.last_name}`.toLowerCase();
      return fullName.includes(query.toLowerCase());
    });

    setSuggestions(filteredSuggestions.slice(0, 5)); // Limit to 5 suggestions
  };

  const handleSuggestionClick = (playerData) => {
    setSelectedPlayer(playerData);
    setSearchQuery(
      `${playerData.player.first_name} ${playerData.player.last_name}`
    );
    setSuggestions([]);
    if (onPlayerSelect) {
      onPlayerSelect(playerData); // Pass the selected player to the parent
    }
  };

  const getApplicableStats = (playerData) => {
    const stats = {
      "Games Played": playerData.games_played,
      "Passing Yards": playerData.passing_yards,
      "Passing Yards Per Game": playerData.passing_yards_per_game,
      "Passing Touchdowns": playerData.passing_touchdowns,
      Interceptions: playerData.passing_interceptions,
      "Rushing Yards": playerData.rushing_yards,
      "Rushing Touchdowns": playerData.rushing_touchdowns,
      "Rushing Attempts": playerData.rushing_attempts,
      "Receiving Yards": playerData.receiving_yards,
      "Receiving Touchdowns": playerData.receiving_touchdowns,
      Receptions: playerData.receptions,
    };

    return Object.entries(stats).filter(
      ([key, value]) => value !== null && value !== undefined
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="player-section">
      <input
        type="text"
        className="search-bar"
        placeholder="Search for a player..."
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((playerData) => (
            <li
              key={playerData.player.id}
              onClick={() => handleSuggestionClick(playerData)}
            >
              {playerData.player.first_name} {playerData.player.last_name}
            </li>
          ))}
        </ul>
      )}
      {selectedPlayer && (
        <div className="player-stats">
          <h2>
            {selectedPlayer.player.first_name} {selectedPlayer.player.last_name}{" "}
            - {selectedPlayer.player.position}
          </h2>
          <ul>
            {getApplicableStats(selectedPlayer).map(([statName, statValue]) => (
              <li key={statName}>
                <strong>{statName}:</strong> {statValue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
