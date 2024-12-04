import React, { useState, useEffect } from "react";
import { BalldontlieAPI } from "@balldontlie/sdk";

export default function App() {
  const [players, setPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
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
        setFilteredPlayers(response.data); // Initialize filtered players
      } catch (err) {
        setError("Failed to fetch players");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Update the filtered players whenever the search query changes
  useEffect(() => {
    const filtered = players.filter((playerData) => {
      const fullName =
        `${playerData.player.first_name} ${playerData.player.last_name}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
    setFilteredPlayers(filtered);
  }, [searchQuery, players]);

  // Function to dynamically filter applicable stats
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

    // Filter out null or undefined stats
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
    <div>
      <h1>Player Stats</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for a player..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: "10px",
          margin: "10px 0",
          width: "100%",
          fontSize: "16px",
        }}
      />

      {filteredPlayers.length === 0 ? (
        <p>No players found for the search term.</p>
      ) : (
        <div>
          {filteredPlayers.map((playerData) => (
            <div key={playerData.player.id}>
              <h2>
                {playerData.player.first_name} {playerData.player.last_name} -{" "}
                {playerData.player.position}
              </h2>
              <p>
                <strong>Height:</strong> {playerData.player.height}
              </p>
              <p>
                <strong>Weight:</strong> {playerData.player.weight}
              </p>
              <p>
                <strong>College:</strong> {playerData.player.college}
              </p>
              <p>
                <strong>Experience:</strong> {playerData.player.experience}
              </p>
              <p>
                <strong>Age:</strong> {playerData.player.age}
              </p>

              <h3>Stats for Season {playerData.season}</h3>
              <ul>
                {getApplicableStats(playerData).map(([statName, statValue]) => (
                  <li key={statName}>
                    <strong>{statName}:</strong> {statValue}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
