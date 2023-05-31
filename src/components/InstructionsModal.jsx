import { useEffect } from "react";

const InstructionsModal = ({ isOpen, onClose }) => {
  const handleClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div
          onClick={handleClick}
          className="fixed inset-0 bg-gray-900 opacity-50"
        ></div>
        <div className="w-3/4 bg-white p-8 rounded-lg shadow-lg z-10">
          <h2 className="text-2xl font-bold mb-4">Game Instructions</h2>
          <p className="mb-4">
            This is a card game with 54 cards (48 element cards, 4 FLIP cards,
            and 2 uranium cards). The game is played by dealing an equal size
            hand to each player and taking turns playing cards until one person
            has no cards left. That person is the winner and the master of the
            periodic table. Hence, the object of the game is to get rid of all
            your cards first.
          </p>
          <p className="mb-4">
            The element cards are ranked in a hierarchy based on their strength
            number. A higher strength number correlates to a “stronger card.” At
            the beginning,{" "}
            <em>
              the strength number of each element card is the same as its atomic
              number
            </em>
            .
          </p>
          <p className="mb-4">
            The game progresses as follows: choose a person to go first. That
            person must place an element card on the table, starting a stack.
            Then, in a clockwise order around the table, each player may choose
            to either place a card on top of the stack or forfeit their turn.
            Each card in the stack must have a higher strength number than the
            previous card in the stack. If, at any point, all players decide to
            pass their turn, discard the stack. Then, the person who placed the
            last card may place any card to start a new stack, and play
            continues.
          </p>
          <p className="mb-4">
            Note: you may also play two of the same card (two-of-a-kind) to
            start a stack; in this case, all subsequent plays must also be
            two-of-a-kind cards with higher strength. There are two special
            cards: uranium cards and FLIP cards. Uranium cards are nuclear
            bombs; they have a strength number of infinity and can beat any
            other card.
          </p>
          <p className="mb-4">
            FLIP cards are unique in that they can be played at any time, even
            if it is not your turn. Playing a FLIP card does not count as taking
            a turn. FLIP cards are placed straight into the discard pile, not on
            the playing stack. A FLIP card allows you to reassign the strength
            numbers of{" "}
            <u>all the element cards in the game (other than uranium)</u> to
            either <u>atomic number, electronegativity, or atomic radius</u>.
          </p>
          <p className="mb-4">
            Finally, there are certain special combinations you may use. If you
            have a carbon and a nitrogen, you may play both as a cyanide at any
            time, and thus skip the current player’s turn. This may also be used
            with two chlorides. WHILE you have three-of-a-kind, you have a
            monopoly on that element. Multiply the strength number of those
            cards by 1.5.
          </p>
          <p>Good luck and have fun!</p>
        </div>
      </div>
    )
  );
};

export default InstructionsModal;
