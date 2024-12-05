import React, { useState } from "react";
import ReactDOM from "react-dom";
import PlayerSearch from "./App"; // Import the PlayerSearch component
import "./App.css";
import { SignIn, SignOut } from "./Auth";
import { useAuthentication } from "./services/authService";
import  {db} from "./firebaseConfig"; // Import Firestore
import { collection, addDoc } from "firebase/firestore"; // Firestore methods

function Main() {
  const [playerOne, setPlayerOne] = useState(null);
  const [playerTwo, setPlayerTwo] = useState(null);
  const user = useAuthentication();

  // Save selected player team to Firebase
  const savePlayerToFirebase = async (player, playerLabel) => {
    if (!player) return;
  
    try {
      await addDoc(collection(db, "playerTeams"), {
        userId: user?.uid || "guest", // Include user ID if logged in
        playerLabel,
        playerId: player.playerId, // Save the playerId
        playerName: `${player.playerData.player.first_name} ${player.playerData.player.last_name}`,
        position: player.playerData.player.position,
        timestamp: new Date(),
      });
      console.log(`Saved ${playerLabel} to Firebase successfully.`);
    } catch (error) {
      console.error(`Error saving ${playerLabel}:`, error);
    }
  };
  

  // Save players when both are selected
  React.useEffect(() => {
    if (playerOne) savePlayerToFirebase(playerOne, "Player One");
    if (playerTwo) savePlayerToFirebase(playerTwo, "Player Two");
  }, [playerOne, playerTwo]);

  // Helper function to calculate fantasy points
  const calculateFantasyPoints = (playerData) => {
    if (!playerData || !playerData.games_played) {
      return 0; // Avoid division by zero or missing data
    }

    const points =
      playerData.passing_yards / 25 + // 1 point per 25 passing yards
      playerData.passing_touchdowns * 4 + // 4 points per passing TD
      playerData.passing_interceptions * -2 + // -2 points per interception
      playerData.rushing_yards / 10 + // 1 point per 10 rushing yards
      playerData.rushing_touchdowns * 6 + // 6 points per rushing TD
      playerData.receiving_yards / 10 + // 1 point per 10 receiving yards
      playerData.receiving_touchdowns * 6 + // 6 points per receiving TD
      (playerData.receptions || 0) * 1 - // 1 point per reception (PPR)
      (playerData.fumbles_lost || 0) * 2; // -2 points per fumble lost

    return (points / playerData.games_played).toFixed(2); // Average points per game
  };

  // Calculate fantasy points for each player
  const playerOnePoints = playerOne ? parseFloat(calculateFantasyPoints(playerOne)) : 0;
  const playerTwoPoints = playerTwo ? parseFloat(calculateFantasyPoints(playerTwo)) : 0;

  // Determine which player has higher points
  const playerOneIsBetter = playerOnePoints > playerTwoPoints;
  const playerTwoIsBetter = playerTwoPoints > playerOnePoints;

  return (
    <div className="comparison-container">
      <header>
        <h1 className="signIn bar">
          SignIn bar {!user ? <SignIn /> : <SignOut />}
        </h1>
      </header>
      <h1>Player Comparison</h1>

      <div className="player-search-sections">
        <div className="player-search">
          <h2>Player 1</h2>
          <PlayerSearch onPlayerSelect={setPlayerOne} />
        </div>
        <div className="player-search">
          <h2>Player 2</h2>
          <PlayerSearch onPlayerSelect={setPlayerTwo} />
        </div>
      </div>

      <div className="comparison-results">
        <h2>Comparison Results</h2>
        {playerOne && playerTwo ? (
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Fantasy Points Per Game</th>
                </tr>
              </thead>
              <tbody>
                <tr className={playerOneIsBetter ? "highlight" : ""}>
                  <td>{`${playerOne.player.first_name} ${playerOne.player.last_name}`}</td>
                  <td>{playerOnePoints}</td>
                </tr>
                <tr className={playerTwoIsBetter ? "highlight" : ""}>
                  <td>{`${playerTwo.player.first_name} ${playerTwo.player.last_name}`}</td>
                  <td>{playerTwoPoints}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p>Select both players to see their fantasy points per game.</p>
        )}
      </div>
    </div>
  );
}

export default Main;

ReactDOM.render(<Main />, document.getElementById("root"));
