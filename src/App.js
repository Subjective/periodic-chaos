import React, { useState } from "react";
import { elements } from "./constants.js";

// Define the Start Screen Component
const StartScreen = ({ startGame }) => {
  return (
    <div>
      <h1>Welcome to Periodic Chaos!</h1>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};

// Define the Card component
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

// Define the Hand component
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

// Define the Stack component
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

// Define the Game component
const Game = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [players, setPlayers] = useState([
    { name: "Player 1", hand: [], monopolies: [], isWinner: false },
    { name: "Player 2", hand: [], monopolies: [], isWinner: false },
  ]);
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
  const startGame = () => {
    // Initialize the players' hands and deck of cards
    // (You'll need to implement this part based on your desired deck composition and distribution logic)

    const startingDeck = [];
    const maxElements = 16;
    const repetitions = 3;

    for (let i = 0; i < maxElements; i++) {
      const element = elements[i % elements.length];
      for (let j = 0; j < repetitions; j++) {
        startingDeck.push(element);
      }
    }

    const player1Hand = [];
    const player2Hand = [];

    // shuffle and distribute cards
    const shuffledCards = [...startingDeck].sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffledCards.length; i++) {
      const card = shuffledCards[i];
      if (i % 2 === 0) {
        player1Hand.push(card);
      } else {
        player2Hand.push(card);
      }
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

    setPlayers([
      {
        name: "Player 1",
        hand: player1Hand,
        monopolies: findElementsAppearingThrice(player1Hand),
        isWinner: false,
      },
      {
        name: "Player 2",
        hand: player2Hand,
        monopolies: findElementsAppearingThrice(player2Hand),
        isWinner: false,
      },
    ]);

    setCurrentPlayerIndex(0);
    setStack([]);

    setIsGameStarted(true);
  };

  // Function to handle a player's turn
  const playCard = (cardIndex) => {
    console.log("Click!");
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

    // Add the card to the stack
    setStack([...stack, cardToPlay]);

    // Update the current player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  return !isGameStarted ? (
    <StartScreen startGame={startGame} />
  ) : (
    <div>
      {players.map(
        (player, index) =>
          index === currentPlayerIndex && (
            <div key={index}>
              <h3>{player.name}</h3>
              <Hand cards={player.hand} playCard={playCard} />
              {player.isWinner && <p>Winner!</p>}
            </div>
          )
      )}
      <hr />
      <h3>Stack</h3>
      <Stack cards={stack} />
      <hr />

      <button onClick={startGame}>Restart Game</button>
    </div>
  );
};

export { Game };
