import React from "react";

const PaymentModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <h2 className="text-xl font-bold mb-4">Payment Status</h2>
        <p className="mb-6">{message}</p>
        <button
          onClick={onClose}
          className="btn btn-primary w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
