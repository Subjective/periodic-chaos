import React, { useState } from "react";
import { elementalCards, specialCards } from "./lib/cards.js";
import { StartScreen } from "./components/StartScreen.jsx";
import { Hand, Stack } from "./components/Card.jsx";
// import Modal from "Modal.jsx";

const Game = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [players, setPlayers] = useState([]);
  const [stack, setStack] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [mode, setMode] = useState("atomicNumber");
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const compareStrength = (element1, element2) => {
    console.log(
      mode,
      "card to play: ",
      element1.name,
      element1[mode],
      "last card: ",
      element2.name,
      element2[mode],
      "diff: ",
      element1[mode] - element2[mode]
    );
    if (element1.name === "Uranium") {
      return Infinity;
    }
    if (element2.name === "Uranium") {
      return -Infinity;
    }

    // set multiplier for monopoly cards
    let multiplier = 1;
    if (players[currentPlayerIndex].monopolies.has(element1)) multiplier = 1.5;

    return element1[mode] * multiplier - element2[mode];
  };

  // Function to start the game
  const startGame = (playerCount) => {
    // Initialize the players' hands and deck of cards
    const startingDeck = [];
    const maxElements = 16;
    const repetitions = 3;
    const numUraniumCards = 2;
    const numFlipCards = 4;

    // normal cards
    for (let i = 0; i < maxElements; i++) {
      const element = elementalCards[i % elementalCards.length];
      for (let j = 0; j < repetitions; j++) {
        startingDeck.push(element);
      }
    }

    // special cards
    for (let i = 0; i < numUraniumCards; i++) {
      startingDeck.push(specialCards.uranium);
    }

    for (let i = 0; i < numFlipCards; i++) {
      startingDeck.push(specialCards.flip);
    }

    const playerHands = [];
    for (let player = 0; player < playerCount; player++) {
      const hand = [];
      playerHands.push(hand);
    }

    // shuffle and distribute cards
    const shuffledCards = [...startingDeck].sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffledCards.length; i++) {
      const card = shuffledCards[i];
      playerHands[i % playerCount].push(card);
    }

    const findElementsAppearingThrice = (hand) => {
      const counts = {};
      const appearingThrice = new Set();

      for (const element of hand) {
        const { name } = element;
        counts[name] = (counts[name] || 0) + 1;

        if (counts[name] === 3) {
          appearingThrice.add(name);
        }
      }

      return appearingThrice;
    };

    setPlayers(
      playerHands.map((playerHand, index) => ({
        name: `Player ${index + 1}`,
        forfeitedTurn: false,
        hand: playerHand,
        monopolies: findElementsAppearingThrice(playerHand),
        isWinner: false,
      }))
    );

    setCurrentPlayerIndex(0);
    setStack([]);

    setIsGameStarted(true);
  };

  // Function to handle a player's turn
  const playCard = (cardIndex) => {
    const currentPlayer = players[currentPlayerIndex];
    const cardToPlay = currentPlayer.hand[cardIndex];
    console.log("Current player hand length: ", currentPlayer.hand.length);

    if (cardToPlay.name === "FLIP") {
      const selectedMode = promptForValidMode();
      if (!selectedMode) return;

      currentPlayer.forfeitedTurn = false;
      currentPlayer.hand.splice(cardIndex, 1);

      handlePlayerHandEmpty(currentPlayer);

      setMode(selectedMode);
      forceUpdate();
    } else {
      if (!validateMove(cardToPlay)) return;

      currentPlayer.monopolies.delete(cardToPlay.name);
      setStack([...stack, cardToPlay]);
    }

    currentPlayer.forfeitedTurn = false;
    currentPlayer.hand.splice(cardIndex, 1);

    handlePlayerHandEmpty(currentPlayer);

    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);

    console.log("Play card!");
    console.log(players);
  };

  const promptForValidMode = () => {
    const validModes = ["atomicNumber", "atomicRadius", "electronegativity"];
    let selectedMode;
    do {
      selectedMode = window.prompt(
        'Enter "atomicNumber", "atomicRadius", or "electronegativity": '
      );
    } while (!validModes.includes(selectedMode));
    return selectedMode;
  };

  const validateMove = (cardToPlay) => {
    const lastCard = stack[stack.length - 1];
    if (lastCard && compareStrength(cardToPlay, lastCard) < 0) {
      return false;
    }
    return true;
  };

  const handlePlayerHandEmpty = (currentPlayer) => {
    if (currentPlayer.hand.length === 0) {
      currentPlayer.isWinner = true;
      setIsGameEnded(true);
    }
  };

  const forfeitTurn = () => {
    console.log("Forfeited turn");
    console.log(players);

    const currentPlayer = players[currentPlayerIndex];
    currentPlayer.forfeitedTurn = true;

    let forfeitedTurns = 0;
    players.forEach((player) => {
      if (player.forfeitedTurn) forfeitedTurns++;
    });
    if (forfeitedTurns === players.length) {
      setStack([]);
      players.forEach((player) => (player.forfeitedTurn = false));
    }

    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  return !isGameStarted ? (
    <StartScreen startGame={startGame} />
  ) : (
    <div>
      {!isGameEnded ? (
        players.map(
          (player, index) =>
            index === currentPlayerIndex && (
              <div key={index}>
                <div className="flex justify-between align-center my-2 mx-4">
                  <h1 className="m-2 font-bold">{player.name}</h1>
                  <h1 className="m-2">
                    <strong>Mode:</strong> {mode}
                  </h1>
                  <button
                    className="bg-red-500 hover:bg-red-600 rounded-lg p-1"
                    onClick={forfeitTurn}
                  >
                    Forfeit turn
                  </button>
                </div>
                <hr />
                <Hand cards={player.hand} playCard={playCard} />
              </div>
            )
        )
      ) : (
        <div>
          <p>Player {currentPlayerIndex + 1} is the Winner!</p>
          <button onClick={startGame}>Restart</button>
        </div>
      )}
      <hr />
      <div className="mt-4 flex justify-center align-center">
        <h3 className="font-bold">Stack</h3>
      </div>
      <Stack cards={stack} />
    </div>
  );
};

export { Game };
