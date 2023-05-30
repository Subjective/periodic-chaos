import React, { useState } from "react";
import { elements, specialCards } from "./constants.js";
import Tilt from "react-parallax-tilt";
import { clsx } from "clsx";

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
    <div className="flex flex-col justify-center m-auto items-center h-screen w-1/2">
      <h1 className="text-center font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Welcome to Periodic Chaos!
      </h1>
      <form onSubmit={handleSubmit}>
        <label>
          Player Count:{" "}
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
  name,
  symbol,
  atomicNumber,
  atomicRadius,
  electronegativity,
  border,
}) => {
  return (
    <div className="w-64 h-64 m-4 inline-block cursor-pointer">
      <Tilt tiltReverse={true}>
        <div
          onClick={onClick}
          className={clsx(
            "w-64 h-64 hover:bg-gray-400 transition duration-500 bg-gray-300 p-2 rounded-lg flex flex-col justify-center",
            border && "border-8 border-pink-400"
          )}
        >
          <p>
            <strong>
              {name} ({symbol})
            </strong>
          </p>
          <p>Atomic Number: {atomicNumber} </p>
          <p>Atomic Radius: {atomicRadius} pm </p>
          <p>Electronegativity: {electronegativity} </p>
        </div>
      </Tilt>
    </div>
  );
};

const Hand = ({ cards, playCard }) => (
  <div>
    {cards.map((card, index) => (
      <Card
        key={index}
        onClick={() => playCard(index)}
        name={card.name}
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
        name={card.name}
        symbol={card.symbol}
        atomicNumber={card.atomicNumber}
        atomicRadius={card.atomicRadius}
        electronegativity={card.electronegativity}
        border={index === cards.length - 1}
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
      const element = elements[i % elements.length];
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

    if (cardToPlay.name === "FLIP") {
      let selectedMode;
      const validModes = ["atomicNumber", "atomicRadius", "electronegativity"];
      do {
        selectedMode = window.prompt(
          'Enter "atomicNumber", "atomicRadius", or "electronegativity": '
        );
        if (selectedMode === null || selectedMode === "") return;
      } while (!validModes.includes(selectedMode));

      currentPlayer.hand.splice(cardIndex, 1);
      currentPlayer.forfeitedTurn = false;

      setMode(selectedMode);

      return;
    } else {
      // Validate that the played card has a higher strength than the previous card on the stack
      const lastCard = stack[stack.length - 1];
      if (lastCard && compareStrength(cardToPlay, lastCard) < 0) {
        // alert(
        //   "Invalid move! The card must have a higher strength than the previous card."
        // );
        return;
      }
      // delete monopoly status if just played
      currentPlayer.monopolies.delete(cardToPlay.name);
      // Add the card to the stack
      setStack([...stack, cardToPlay]);
    }
    currentPlayer.forfeitedTurn = false;

    currentPlayer.hand.splice(cardIndex, 1);

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
