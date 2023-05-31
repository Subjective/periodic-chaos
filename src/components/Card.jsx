import { clsx } from "clsx";
import Tilt from "react-parallax-tilt";

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
    <div className="w-1/6 h-1/6 m-4 inline-block cursor-pointer">
      <Tilt tiltReverse={true}>
        <div
          onClick={onClick}
          className={clsx(
            "hover:bg-gray-400 transition duration-500 bg-gray-300 p-2 rounded-lg flex flex-col justify-center",
            border && "border-8 border-pink-400"
          )}
        >
          <p>
            <strong>
              <span className="hidden md:inline-block">
                {name} ({symbol})
              </span>
              <span className="md:hidden flex justify-center">{symbol}</span>
            </strong>
          </p>
          <p className="hidden md:inline-block">
            Atomic Number: {atomicNumber}
          </p>
          <p className="hidden md:inline-block">
            Atomic Radius: {atomicRadius} pm
          </p>
          <p className="hidden md:inline-block">
            Electronegativity: {electronegativity}{" "}
          </p>
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

export { Card, Hand, Stack };
