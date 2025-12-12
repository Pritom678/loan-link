const BorrowerLoanDataRow = ({
  loan,
  onView,
  onCancel,
  onPay,
  onViewPayment,
}) => {
  const statusColors = {
    Pending: "text-yellow-600 font-semibold",
    Approved: "text-green-600 font-semibold",
    Rejected: "text-red-600 font-semibold",
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-center text-sm text-gray-900">
        {loan.loanId}
      </td>
      <td className="px-6 py-4 text-center text-sm text-gray-900">
        {loan.loanTitle}
      </td>
      <td className="px-6 py-4 text-center text-sm text-gray-900">
        {loan.loanAmount}
      </td>
      <td
        className={`px-6 py-4 text-center text-sm ${statusColors[loan.status]}`}
      >
        {loan.status}
      </td>
      <td className="px-6 py-4 text-center text-sm flex justify-center gap-2">
        {/* View button */}
        <button onClick={onView} className="btn btn-sm btn-primary">
          View
        </button>

        {/* Cancel button */}
        {loan.applicationStatus === "Unpaid" && loan.status !== "Rejected" && (
          <button onClick={onCancel} className="btn btn-sm btn-error">
            Cancel
          </button>
        )}

        {/* Pay button */}
        {loan.applicationStatus === "Unpaid" && loan.status !== "Rejected" && (
          <button onClick={onPay} className="btn btn-sm btn-secondary">
            Pay
          </button>
        )}

        {/* Paid badge (clickable if paymentId exists) */}
        {loan.applicationStatus === "Paid" && (
          <button
            onClick={() => onViewPayment()}
            className="px-4 py-2 text-white bg-green-600 shadow-md rounded-full text-sm font-semibold uppercase tracking-wide hover:bg-green-700 transition"
          >
            Paid
          </button>
        )}
      </td>
    </tr>
  );
};

export default BorrowerLoanDataRow;
