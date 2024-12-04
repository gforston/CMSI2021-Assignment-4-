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
      const api = new BalldontlieAPI({ apiKey: "138e5814-bfdf-4194-8aa6-8ff31cc3db17" });
      try {
        const response = await api.nfl.getSeasonStats({
          season: 2024,
        });
        setPlayers(response.data);
        setFilteredPlayers(response.data); 
      } catch (err) {
        setError("Failed to fetch players");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    const filtered = players.filter((playerData) => {
      const fullName = `${playerData.player.first_name} ${playerData.player.last_name}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
    setFilteredPlayers(filtered);
  }, [searchQuery, players]);

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
}
