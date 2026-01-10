import React, { useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import {
  FiX,
  FiCreditCard,
  FiDollarSign,
  FiUser,
  FiMail,
} from "react-icons/fi";

const PayModal = ({ isOpen, closeModal, loan }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !loan) return null;

  const handleConfirmPayment = async () => {
    setLoading(true);

    try {
      console.log("Loan object:", loan);
      console.log("User object:", user);
      console.log("Attempting to create checkout session with:", {
        loanId: loan._id,
        customerEmail: user?.email,
      });

      const { data } = await axiosSecure.post("/create-checkout-session", {
        loanId: loan._id,
        customerEmail: user?.email,
      });

      console.log("Checkout session response:", data);

      // Redirect to Stripe checkout
      if (data.data?.url) {
        window.location.href = data.data.url;
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (err) {
      console.error("Payment error details:", err);
      console.error("Error response:", err.response?.data);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to start payment.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-0 relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            onClick={closeModal}
          >
            <FiX className="w-6 h-6" />
          </button>

          <div className="flex items-center mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
              <FiCreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Payment Required</h2>
              <p className="text-white/90 text-sm">Loan Application Fee</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Loan Details */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Loan Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <FiUser className="w-4 h-4 mr-2" />
                  Applicant
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.email}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Loan Title</span>
                <span className="text-sm font-medium text-gray-900">
                  {loan.loanTitle}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Loan ID</span>
                <span className="text-sm font-mono text-gray-900">
                  #{loan._id.slice(-8)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {loan.applicationStatus || "Unpaid"}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Amount */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <FiDollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Application Fee</p>
                  <p className="text-2xl font-bold text-primary">$10.00</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              One-time processing fee required to submit your loan application
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={closeModal}
              disabled={loading}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FiCreditCard className="w-4 h-4 mr-2" />
                  Pay $10.00
                </div>
              )}
            </button>
          </div>

          {/* Security Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            🔒 Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayModal;
