import { useState } from "react";

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
        <div className="flex flex-col justify-center">
          <label className="ml-5">
            Player Count:{" "}
            <input
              type="number"
              className="w-8 mb-6"
              value={playerCount}
              onChange={handleInputChange}
            />
          </label>
          <button
            className="bg-green-300 hover:bg-green-400 p-2 rounded-lg animate-bounce"
            type="submit"
          >
            Start Game
          </button>
        </div>
      </form>
    </div>
  );
};

export { StartScreen };
