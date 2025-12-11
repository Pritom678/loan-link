
import { IoClose } from "react-icons/io5";

const PaymentDetailModal = ({ isOpen, onClose, paymentData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-black"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          Payment Details
        </h2>

        {!paymentData ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-2 text-gray-700">
            <p><strong>Payment ID:</strong> {paymentData.id}</p>
            <p><strong>Amount:</strong> ${(paymentData.amount / 100).toFixed(2)}</p>
            <p><strong>Currency:</strong> {paymentData.currency.toUpperCase()}</p>
            <p><strong>Status:</strong> {paymentData.status}</p>
            <p><strong>Customer Email:</strong> {paymentData.receipt_email}</p>

            <a
              href={paymentData.charges?.data[0]?.receipt_url}
              target="_blank"
              className="text-blue-600 underline font-semibold"
            >
              View Stripe Receipt
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetailModal;
