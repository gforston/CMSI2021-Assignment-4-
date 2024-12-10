import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../components/firebaseConfig"; // Import your Firestore instance

/**
 * Save or update a player in the Firestore database.
 * @param {Object} player - The player data.
 * @param {string} playerLabel - The label for the player (e.g., "Player One").
 * @param {string} userId - The user ID of the currently signed-in user or "guest".
 */
export const fetchPlayersFromFirebase = async (userId) => {
    try {
      const playerTeamsRef = collection(db, "playerTeams");
      const querySnapshot = await getDocs(playerTeamsRef);
      const players = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((player) => player.userId === userId); // Filter by user ID
  
      return players;
    } catch (error) {
      console.error("Error fetching players:", error);
      return [];
    }
  };
  
  // Load players from Firebase
export const loadPlayers = async (user, setLoadedPlayers) => {
    const userId = user?.uid || "guest"; // Default to "guest" if not logged in
    const players = await fetchPlayersFromFirebase(userId);
    setLoadedPlayers(players);
  };

export const savePlayerToFirebase = async (player, playerLabel, userId) => {
  if (!player) return;

  try {
    // Reference to the Firestore collection
    const playerTeamsRef = collection(db, "playerTeams");

    // Query to check if a document exists for this user and playerLabel
    const existingDocQuery = query(
      playerTeamsRef,
      where("userId", "==", userId),
      where("playerLabel", "==", playerLabel)
    );

    const querySnapshot = await getDocs(existingDocQuery);

    if (!querySnapshot.empty) {
      // If the document exists, get its ID and update it
      const docId = querySnapshot.docs[0].id;
      await setDoc(doc(playerTeamsRef, docId), {
        userId,
        playerLabel,
        playerId: player.playerId,
        playerName: `${player.playerData.player.first_name} ${player.playerData.player.last_name}`,
        position: player.playerData.player.position,
        timestamp: new Date(),
      });
      console.log(`Updated ${playerLabel} in Firebase successfully.`);
    } else {
      // If the document doesn't exist, create a new one
      await setDoc(doc(playerTeamsRef), {
        userId,
        playerLabel,
        playerId: player.playerId,
        playerName: `${player.playerData.player.first_name} ${player.playerData.player.last_name}`,
        position: player.playerData.player.position,
        timestamp: new Date(),
      });
      console.log(`Created ${playerLabel} in Firebase successfully.`);
    }
  } catch (error) {
    console.error(`Error saving or updating ${playerLabel}:`, error);
  }
};
