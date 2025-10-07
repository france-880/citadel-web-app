import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function NewModalStyle({ children, onClose, width = 800 }) {
  const [show, setShow] = useState(false);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
    setShowButton(false); // hide button instantl
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end items-stretch">
      {/* Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
          show ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundColor: "rgba(77, 78, 78, 0.2)"
        }}
        onClick={handleClose}
      />

      {/* Close Button - Outside modal, left side */}
      {showButton && (
      <button
        onClick={handleClose}
        className="absolute top-15 w-10 h-10 flex items-center justify-center bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 z-[60]"
        style={{
          right: 720, // 20 + 3
          top: 25,
        }}
        aria-label="Close modal"
      >
        <X className="w-5 h-5" />
      </button>
)}
      {/* Modal Panel */}
      <div
        className="h-full p-6 bg-white shadow-xl flex flex-col relative transition-transform duration-300 ease-in-out overflow-hidden"
        style={{
          width: `${width}px`,
          maxWidth: "45vw",
          borderRadius: "10px",
          marginRight: "10px",
          marginTop: "20px",
          marginBottom: "20px",
          maxHeight: "calc(100vh - 40px)",
          transform: show ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto  flex flex-col gap-3">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}