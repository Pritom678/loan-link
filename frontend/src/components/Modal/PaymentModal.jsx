import React from "react";
import { FiCheckCircle, FiXCircle, FiX } from "react-icons/fi";

const PaymentModal = ({ isOpen, message, onClose, type = "success" }) => {
  if (!isOpen) return null;

  const isSuccess =
    type === "success" || message.toLowerCase().includes("successful");
  const isError =
    type === "error" ||
    message.toLowerCase().includes("failed") ||
    message.toLowerCase().includes("canceled");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-0 relative overflow-hidden">
        {/* Header */}
        <div
          className={`p-6 text-white ${
            isSuccess
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : isError
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : "bg-gradient-to-r from-primary to-secondary"
          }`}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            onClick={onClose}
          >
            <FiX className="w-6 h-6" />
          </button>

          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
              {isSuccess ? (
                <FiCheckCircle className="w-6 h-6" />
              ) : isError ? (
                <FiXCircle className="w-6 h-6" />
              ) : (
                <FiCheckCircle className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {isSuccess
                  ? "Payment Successful!"
                  : isError
                  ? "Payment Failed"
                  : "Payment Status"}
              </h2>
              <p className="text-white/90 text-sm">
                {isSuccess
                  ? "Your transaction has been completed"
                  : isError
                  ? "There was an issue with your payment"
                  : "Transaction update"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status Icon and Message */}
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                isSuccess
                  ? "bg-green-100"
                  : isError
                  ? "bg-red-100"
                  : "bg-primary/10"
              }`}
            >
              {isSuccess ? (
                <FiCheckCircle className="w-8 h-8 text-green-600" />
              ) : isError ? (
                <FiXCircle className="w-8 h-8 text-red-600" />
              ) : (
                <FiCheckCircle className="w-8 h-8 text-primary" />
              )}
            </div>

            <p className="text-gray-700 text-center leading-relaxed">
              {message}
            </p>
          </div>

          {/* Additional Info */}
          {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-green-800">
                ✅ Your loan application fee has been processed successfully.
                You will receive a confirmation email shortly.
              </p>
            </div>
          )}

          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800">
                ❌ If you continue to experience issues, please contact our
                support team.
              </p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onClose}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSuccess
                ? "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
                : isError
                ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                : "bg-primary hover:bg-primary/90 text-white focus:ring-primary"
            }`}
          >
            {isSuccess
              ? "Continue to Dashboard"
              : isError
              ? "Try Again"
              : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
