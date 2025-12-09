import { FaTimes } from "react-icons/fa";

const ViewApprovedLoanModal = ({ loan, closeModal }) => {
  if (!loan) return null;

  return (
    <dialog open className="modal modal-open bg-black/40 backdrop-blur-sm">
      <div className="modal-box max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-800">Loan Details</h3>
          <button
            className="text-gray-600 hover:text-red-500"
            onClick={closeModal}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Applicant:</strong> {loan.firstName} {loan.lastName}
          </p>
          <p>
            <strong>Phone:</strong> {loan.contactNumber}
          </p>
          <p>
            <strong>NID/Passport:</strong> {loan.nationalId}
          </p>
          <p>
            <strong>Loan Amount:</strong> {loan.loanAmount}
          </p>
          <p>
            <strong>Income Source:</strong> {loan.incomeSource}
          </p>
          <p>
            <strong>Monthly Income:</strong> {loan.monthlyIncome}
          </p>
          <p>
            <strong>Reason:</strong> {loan.reasonForLoan}
          </p>
          <p>
            <strong>Address:</strong> {loan.address}
          </p>
          <p>
            <strong>Approved Date:</strong> {loan.approvedAt}
          </p>
          <p>
            <strong>Status:</strong> {loan.status || "Pending"}
          </p>
        </div>

        {/* Footer */}
        <div className="modal-action">
          <button
            className="btn btn-outline btn-secondary"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ViewApprovedLoanModal;
