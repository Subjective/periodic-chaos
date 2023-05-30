import React, { useState } from "react";
import { elements } from "./constants.js";

const StartScreen = ({ startGame }) => {
  const [playerCount, setPlayerCount] = useState(2);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setPlayerCount(Number(value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    startGame(playerCount);
  };

  return (
    <div>
      <h1>Welcome to Periodic Chaos!</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Player Count:
          <input
            type="number"
            value={playerCount}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Start Game</button>
      </form>
    </div>
  );
};

const Card = ({
  onClick,
  symbol,
  atomicNumber,
  atomicRadius,
  electronegativity,
}) => (
  <div onClick={onClick}>
    <span>{symbol} | </span>
    <span>Atomic Number: {atomicNumber}; </span>
    <span>Atomic Radius: {atomicRadius} pm; </span>
    <span>Electronegativity: {electronegativity}; </span>
  </div>
);

const Hand = ({ cards, playCard }) => (
  <div>
    {cards.map((card, index) => (
      <Card
        key={index}
        onClick={() => playCard(index)}
        symbol={card.symbol}
        atomicNumber={card.atomicNumber}
        atomicRadius={card.atomicRadius}
        electronegativity={card.electronegativity}
      />
    ))}
  </div>
);

const Stack = ({ cards }) => (
  <div>
    {cards.map((card, index) => (
      <Card
        key={index}
        symbol={card.symbol}
        atomicNumber={card.atomicNumber}
        atomicRadius={card.atomicRadius}
        electronegativity={card.electronegativity}
      />
    ))}
  </div>
);

const Game = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [players, setPlayers] = useState([]);
  const [stack, setStack] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [mode, setMode] = useState("atomicNumber");

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
    return element1[mode] - element2[mode];
  };

  // Function to start the game
  const startGame = (playerCount) => {
    // Initialize the players' hands and deck of cards
    const startingDeck = [];
    const maxElements = 16;
    const repetitions = 3;

    for (let i = 0; i < maxElements; i++) {
      const element = elements[i % elements.length];
      for (let j = 0; j < repetitions; j++) {
        startingDeck.push(element);
      }
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
      const appearingThrice = [];

      for (const element of hand) {
        const { name } = element;
        counts[name] = (counts[name] || 0) + 1;

        if (counts[name] === 3 && !appearingThrice.includes(name)) {
          appearingThrice.push(name);
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

    // Validate that the played card has a higher strength than the previous card on the stack
    const lastCard = stack[stack.length - 1];
    if (lastCard && compareStrength(cardToPlay, lastCard) < 0) {
      alert(
        "Invalid move! The card must have a higher strength than the previous card."
      );
      return;
    }

    // Remove the played card from the player's hand
    currentPlayer.hand.splice(cardIndex, 1);
    currentPlayer.forfeitedTurn = false;

    // Add the card to the stack
    setStack([...stack, cardToPlay]);

    if (currentPlayer.hand.length === 0) {
      currentPlayer.isWinner = true;
      setIsGameEnded(true);
      return;
    }

    // Update the current player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);

    console.log("Play card!");
    console.log(players);
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
                <h3>{player.name}</h3>
                <Hand cards={player.hand} playCard={playCard} />
                <button onClick={forfeitTurn}>Forfeit turn</button>
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
      <h3>Stack</h3>
      <Stack cards={stack} />
      <div>Mode: {mode}</div>
      <hr />
    </div>
  );
};

export { Game };
