import React, { useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const PayModal = ({ isOpen, closeModal, loan }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !loan) return null;

  const handleConfirmPayment = async () => {
    setLoading(true);

    const paymentInfo = {
      loanId: loan._id,
      title: loan.loanTitle,
      price: loan.loanAmount,
      customerEmail: user?.email,
      quantity: 1,
    };
    try {
      const { data } = await axiosSecure.post(
        "/create-checkout-session",
        paymentInfo
      );

      console.log(data.url);
      // Redirect to Stripe Checkout
        window.location.href = data.url;
    } catch (err) {
      console.error(err);
      toast.error("Failed to start payment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <h2 className="text-xl font-bold mb-4">Pay Loan</h2>

        <p>
          <span className="font-semibold">User Email:</span> {user?.email}
        </p>
        <p>
          <span className="font-semibold">Loan ID:</span> {loan.loanId}
        </p>
        <p>
          <span className="font-semibold">Loan Title:</span> {loan.loanTitle}
        </p>
        <p>
          <span className="font-semibold">Amount:</span> ${loan.loanAmount}
        </p>
        <p>
          <span className="font-semibold">Status:</span> {loan.status}
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
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayModal;
