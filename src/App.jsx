import React, { useState, useEffect } from "react";
import { BalldontlieAPI } from "@balldontlie/sdk";
import Entry from "./Entry.jsx";

export default function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      const api = new BalldontlieAPI({
        apiKey: "138e5814-bfdf-4194-8aa6-8ff31cc3db17",
      });
      try {
        // Fetch players' season stats
        const response = await api.nfl.getSeasonStats({
          season: 2024,
        });
        console.log(response);
        setPlayers(response.data); // Save fetched players
      } catch (err) {
        setError("Failed to fetch players");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

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
      {players.length === 0 ? (
        <p>No players found.</p>
      ) : (
        <div>
          {players.map((playerData) => (
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
