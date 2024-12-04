import React, { useState, useEffect } from "react";
import { BalldontlieAPI } from "@balldontlie/sdk";
const api = new BalldontlieAPI({ apiKey: "138e5814-bfdf-4194-8aa6-8ff31cc3db17" });
const playerData = await api.nfl.getPlayers();



const PlayerList = () => {
  const players = playerData.data;
  return (
    <div>
      <h1>Player List</h1>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.first_name} {player.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;

