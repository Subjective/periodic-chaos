import React from "react";
import { formatCamelCase } from "../lib/utils";

const Modal = ({ isOpen, onClose, options, onSelect }) => {
  const handleOptionClick = (option) => {
    onSelect(option);
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
        <div className="bg-white p-8 rounded-lg shadow-lg z-10">
          <h2 className="text-2xl font-bold mb-4">Select a mode:</h2>
          <ul className="space-y-4">
            {options.map((option) => (
              <li key={option}>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleOptionClick(option)}
                >
                  {formatCamelCase(option)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  );
};

export default Modal;
