const BorrowerLoanDataRow = ({ loan, onView, onCancel, onPay }) => {
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
        <button onClick={onView} className="btn btn-sm btn-primary">
          View
        </button>

        {loan.applicationStatus === "Unpaid" && (
          <button onClick={onCancel} className="btn btn-sm btn-error">
            Cancel
          </button>
        )}

        {loan.applicationStatus === "Unpaid" && loan.status !== "Rejected" && (
          <>
            <button onClick={onPay} className="btn btn-sm btn-secondary">
              Pay
            </button>
          </>
        )}
        {loan.applicationStatus === "Paid" && (
          <span className="px-4 py-2 text-white bg-linear-to-r from-green-500 to-green-700 shadow-md rounded-full text-sm font-semibold uppercase tracking-wide">
            Paid
          </span>
        )}
      </td>
    </tr>
  );
};

export default BorrowerLoanDataRow;
