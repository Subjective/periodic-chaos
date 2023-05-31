import React, { useState } from "react";

const ModalWrapper = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {React.cloneElement(trigger, { onClick: handleOpenModal })}
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            {children}
            <button className="modal-close" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalWrapper;
