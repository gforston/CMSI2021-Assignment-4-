import React, { useState, useEffect } from "react";
import { BalldontlieAPI } from "@balldontlie/sdk";
import Entry from "./Entry.jsx";

export default function App() {
  const [player, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      const word = encodeURIComponent(name.toLowerCase());
      const api = new BalldontlieAPI({ apiKey: "138e5814-bfdf-4194-8aa6-8ff31cc3db17" });
      try {
        // Fetch players (you can adjust the parameters as needed)
        const response = await api.nfl.getSeasonStats({
          season: 2024,
        });
        console.log(response)
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Player Stats</h1>
      {player.length === 0 ? (
        <p>No players found.</p>
      ) : (
        <div>
          {player.map((playerData) => (
            <div key={playerData.player.id}>
              <h2>
                {playerData.player.first_name} {playerData.player.last_name} - {playerData.player.position}
              </h2>
              <p><strong>Height:</strong> {playerData.player.height}</p>
              <p><strong>Weight:</strong> {playerData.player.weight}</p>
              <p><strong>College:</strong> {playerData.player.college}</p>
              <p><strong>Experience:</strong> {playerData.player.experience}</p>
              <p><strong>Age:</strong> {playerData.player.age}</p>

              <h3>Stats for Season {playerData.season}</h3>
              <p><strong>Games Played:</strong> {playerData.games_played}</p>

              <p><strong>Passing Yards:</strong> {playerData.passing_yards} </p>
              <p><strong>Passing Yards Per Game:</strong> {playerData.passing_yards_per_game} </p>
              <p><strong>Passing Touchdowns:</strong> {playerData.passing_touchdowns}</p>
              <p><strong>Interceptions:</strong> {playerData.passing_interceptions}</p>

              <p><strong>Rushing Yards:</strong> {playerData.rushing_yards} </p>
              <p><strong>Rushing Touchdowns:</strong> {playerData.rushing_touchdowns}</p>
              <p><strong>Rushing Attempts:</strong> {playerData.rushing_attempts}</p>

              <p><strong>Receiving Yards:</strong> {playerData.receiving_yards} </p>
              <p><strong>Receiving Touchdowns:</strong> {playerData.receiving_touchdowns}</p>
              <p><strong>Receptions:</strong> {playerData.receptions}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



