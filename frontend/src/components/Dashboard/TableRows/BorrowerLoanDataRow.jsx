import {
  FiEye,
  FiX,
  FiCreditCard,
  FiDollarSign,
  FiChevronDown,
  FiChevronUp,
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

  const getStatusBadge = (status) => {
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
      rejected: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        label: "Rejected",
      },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} w-fit max-w-full`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount) => {
    if (!amount) return "N/A";
    const num = parseFloat(amount);
    if (isNaN(num)) return "N/A";
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toLocaleString()}`;
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Loan ID */}
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{loan.loanId}</div>
      </td>

      {/* Loan Details */}
      <td className="px-3 py-4">
        <div className="flex items-center">
          <div className="shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FiDollarSign className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <div className="flex items-center">
              <div className="text-sm font-medium text-gray-900 truncate">
                {isExpanded ? loan.loanTitle : truncateText(loan.loanTitle, 15)}
              </div>
              {loan.loanTitle && loan.loanTitle.length > 15 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  {isExpanded ? (
                    <FiChevronUp className="w-3 h-3" />
                  ) : (
                    <FiChevronDown className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {loan.interestRate}% APR
            </div>
          </div>
        </div>
      </td>

      {/* Amount */}
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900">
          {formatAmount(loan.loanAmount)}
        </div>
        <div className="text-xs text-gray-500">{loan.loanTerm}mo</div>
      </td>

      {/* Status */}
      <td className="px-3 py-4 whitespace-nowrap status-column">
        <div className="flex flex-col space-y-1">
          <div className="status-badge">{getStatusBadge(loan.status)}</div>
          {loan.applicationStatus === "Paid" && (
            <div className="status-badge">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 w-fit">
                Paid
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Applied Date */}
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {formatDate(loan.createdAt || loan.appliedAt)}
        </div>
      </td>

      {/* Actions */}
      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-1">
          {/* View button */}
          <button
            onClick={onView}
            className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            title="View Details"
          >
            <FiEye className="w-3 h-3" />
          </button>

          {/* Cancel button */}
          {loan.applicationStatus === "Unpaid" &&
            loan.status !== "Rejected" && (
              <button
                onClick={onCancel}
                className="inline-flex items-center px-2 py-1 border border-orange-300 shadow-sm text-xs font-medium rounded text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                title="Cancel Application"
              >
                <FiX className="w-3 h-3" />
              </button>
            )}

          {/* Pay button */}
          {loan.applicationStatus === "Unpaid" &&
            loan.status !== "Rejected" && (
              <button
                onClick={onPay}
                className="inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                title="Pay Fee"
              >
                <FiCreditCard className="w-3 h-3" />
              </button>
            )}

          {/* Paid badge (clickable if paymentId exists) */}
          {loan.applicationStatus === "Paid" && (
            <button
              onClick={() => onViewPayment()}
              className="inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              title="View Payment"
            >
              <FiCreditCard className="w-3 h-3" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default BorrowerLoanDataRow;
