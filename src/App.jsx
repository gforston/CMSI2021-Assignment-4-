import React, { useState, useEffect } from "react";
import { BalldontlieAPI } from "@balldontlie/sdk";
import Entry from "./Entry.jsx";

export default function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      const word = encodeURIComponent(name.toLowerCase());
      const api = new BalldontlieAPI({ apiKey: "138e5814-bfdf-4194-8aa6-8ff31cc3db17" });
      try {
        // Fetch players (you can adjust the parameters as needed)
        const response = await api.nfl.getStats({
          per_page: 100,  // Number of players per page
          page: 1,       // Which page to fetch
          //team_ids: [1] // Optional: fetch players from a specific team (e.g., team ID 1)
          //search: {word}
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
      <ul>
        {players.map((player) => (
          <li key={player.player.id}>
            <h2>
              {player.player.first_name} {player.player.last_name} -{" "}
              {player.player.position} ({player.team.full_name})
            </h2>
            <p>
              Passing Yards: {player.passing_yards} yards | Passing
              Touchdowns: {player.passing_touchdowns}
              receiving_yards {player.receiving_yards}
            </p>
            <p>
              Rushing Yards: {player.rushing_yards} yards | Rushing
              Touchdowns: {player.rushing_touchdowns}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};



