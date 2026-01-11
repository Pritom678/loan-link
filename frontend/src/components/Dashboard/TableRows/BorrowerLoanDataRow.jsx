import {
  FiDollarSign,
  FiEye,
  FiX,
  FiCreditCard,
  FiFileText,
} from "react-icons/fi";
import { useState } from "react";

const BorrowerLoanDataRow = ({
  loan,
  onView,
  onCancel,
  onPay,
  onViewPayment,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Status configuration
  const statusConfig = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "Pending",
    },
    approved: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      label: "Approved",
    },
    unpaid: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      label: "Unpaid",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Rejected",
    },
    paid: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Paid",
    },
  };

  // Helper function to check if loan is paid
  const isLoanPaid = () => {
    return loan.applicationStatus?.toLowerCase() === "paid" || loan.paymentId;
  };

  // Helper function to check if payment is required
  const isPaymentRequired = () => {
    return (
      (loan.applicationStatus?.toLowerCase() === "approved" ||
        loan.applicationStatus?.toLowerCase() === "unpaid") &&
      !isLoanPaid()
    );
  };

  return (
    <div className="hover:bg-gray-50 transition-colors">
      <div className="px-6 py-4">
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Loan Details */}
          <div className="col-span-3">
            <div className="flex items-center">
              <div className="shrink-0 h-10 w-10">
                <div className="h-10 w-10 rounded-lg bg-linear-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                  <FiFileText className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {loan.loanTitle || "Loan Application"}
                </div>
                <div className="text-sm text-gray-500">
                  ID: {loan._id?.slice(-8)}
                </div>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="col-span-2">
            <div className="text-sm font-semibold text-gray-900">
              ${loan.loanAmount?.toLocaleString() || "0"}
            </div>
          </div>

          {/* Status */}
          <div className="col-span-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                statusConfig[loan.applicationStatus?.toLowerCase()]?.bg ||
                "bg-gray-100"
              } ${
                statusConfig[loan.applicationStatus?.toLowerCase()]?.text ||
                "text-gray-800"
              }`}
            >
              {statusConfig[loan.applicationStatus?.toLowerCase()]?.label ||
                loan.applicationStatus ||
                "Unknown"}
            </span>
          </div>

          {/* Applied Date */}
          <div className="col-span-2">
            <div className="text-sm text-gray-900">
              {loan.date ? new Date(loan.date).toLocaleDateString() : "N/A"}
            </div>
          </div>

          {/* Payment Status */}
          <div className="col-span-2">
            {isLoanPaid() ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FiDollarSign className="w-3 h-3 mr-1" />
                Paid
              </span>
            ) : isPaymentRequired() ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Payment Required
              </span>
            ) : loan.applicationStatus?.toLowerCase() === "pending" ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Pending Approval
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                No Payment Required
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2">
              {/* View Button */}
              <button
                onClick={onView}
                className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                title="View Details"
              >
                <FiEye className="w-3 h-3" />
              </button>

              {/* Cancel Button - Only show for pending applications */}
              {loan.applicationStatus === "pending" && (
                <button
                  onClick={onCancel}
                  className="inline-flex items-center px-2 py-1 border border-orange-300 shadow-sm text-xs font-medium rounded text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  title="Cancel Application"
                >
                  <FiX className="w-3 h-3" />
                </button>
              )}

              {/* Pay Button - Only show for approved/unpaid applications that haven't been paid */}
              {isPaymentRequired() && (
                <button
                  onClick={onPay}
                  className="inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  title="Pay Processing Fee"
                >
                  <FiCreditCard className="w-3 h-3" />
                </button>
              )}

              {/* View Payment Button - Only show if payment exists */}
              {loan.paymentId && (
                <button
                  onClick={() => onViewPayment()}
                  className="inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  title="View Payment"
                >
                  <FiCreditCard className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowerLoanDataRow;
