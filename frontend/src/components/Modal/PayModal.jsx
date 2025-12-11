import React, { useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { FaTimes } from "react-icons/fa";

const PayModal = ({ isOpen, closeModal, loan }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !loan) return null;

  const handleConfirmPayment = async () => {
    setLoading(true);

    try {
      const { data } = await axiosSecure.post("/create-checkout-session", {
        loanId: loan._id,
        customerEmail: user?.email,
      });

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      toast.error("Failed to start payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          onClick={closeModal}
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-4">Pay Loan Application Fee</h2>

        <p>
          <span className="font-semibold">User Email:</span> {user?.email}
        </p>
        <p>
          <span className="font-semibold">Loan ID:</span> {loan._id}
        </p>
        <p>
          <span className="font-semibold">Loan Title:</span> {loan.loanTitle}
        </p>
        <p>
          <span className="font-semibold">Amount:</span> $10
        </p>
        <p>
          <span className="font-semibold">Status:</span> {loan.applicationFeeStatus || "Unpaid"}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="btn btn-sm btn-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPayment}
            className="btn btn-sm btn-primary"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay $10"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayModal;
