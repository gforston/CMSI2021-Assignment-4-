import React, { useEffect, useState } from "react";
import "./App.css";
import api from "./services/apiService";
import { getFromCache, setCache } from "./cache";
import SearchBar from "./SearchBar"; // Import the new SearchBar component

export default function PlayerSearch({ onPlayerSelect, playerName }) {
  const [players, setPlayers] = useState([]); // Players fetched from the API
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch player by name or first_name and last_name
  const fetchPlayerByName = async (query) => {
    try {
      setLoading(true);
  
      // Encode the query to handle special characters safely
      const encodedQuery = encodeURIComponent(query);
  
      // Check if the query result is cached
      const cachedData = getFromCache(encodedQuery);
      if (cachedData) {
        setPlayers(cachedData);
        setSuggestions(cachedData.slice(0, 5)); // Limit to 5 suggestions
        setLoading(false);
        return;
      }
  
      // Split the query into first_name and last_name if both are present
      const [firstName, lastName] = query.trim().split(" ").map(encodeURIComponent);
  
      let response;
      if (firstName && lastName) {
        response = await api.nfl.getPlayers({
          first_name: firstName,
          last_name: lastName,
        });
      } else {
        response = await api.nfl.getPlayers({ search: encodedQuery });
      }
  
      const foundPlayers = response.data;
  
      if (foundPlayers.length > 0) {
        const statsResponses = await Promise.all(
          foundPlayers.map((player) =>
            api.nfl.getSeasonStats({
              player_ids: [player.id],
              season: 2024,
            })
          )
        );
  
        const combinedData = statsResponses.map((statsResponse, index) => {
          const playerStats = statsResponse.data[0] || {};
          return {
            ...playerStats,
            player: foundPlayers[index],
          };
        });
  
        setCache(encodedQuery, combinedData);
        setPlayers(combinedData);
        setSuggestions(combinedData.slice(0, 5));
      } else {
        setPlayers([]);
        setSuggestions([]);
      }
    } catch (err) {
      setError("Failed to fetch players by name");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch stats if playerName is provided
  useEffect(() => {
    if (playerName) {
      fetchPlayerByName(playerName);
    }
  }, [playerName]);

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

    setSuggestions(filteredSuggestions.slice(0, 5));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      fetchPlayerByName(searchQuery.trim());
    }
  };

  const handleSuggestionClick = (playerData) => {
    if (playerData && playerData.player) {
      setSelectedPlayer(playerData);
      setSearchQuery(
        `${playerData.player.first_name} ${playerData.player.last_name}`
      );
      setSuggestions([]);

      if (onPlayerSelect) {
        onPlayerSelect({
          playerId: playerData.player.id,
          playerData,
        });
      }
    } else {
      console.error("Player data is missing");
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
    <div className="player-search">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
      />
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
