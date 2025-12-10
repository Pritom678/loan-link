import { FaTimes } from "react-icons/fa";

const ViewLoanModal = ({ loan, closeModal }) => {
  if (!loan) return null;

  return (
    <dialog
      open
      className="modal modal-open bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="modal-box rounded-2xl max-w-lg w-full shadow-xl border border-gray-200">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-primary">Loan Application</h3>
          <button
            className="btn btn-sm btn-circle btn-error text-white"
            onClick={closeModal}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 text-gray-800">
          <Info label="Applicant" value={`${loan.firstName} ${loan.lastName}`} />
          <Info label="Phone" value={loan.contactNumber} />
          <Info label="NID/Passport" value={loan.nationalId} />
          <Info label="Loan Amount" value={`$${loan.loanAmount}`} />
          <Info label="Income Source" value={loan.incomeSource} />
          <Info label="Monthly Income" value={`$${loan.monthlyIncome}`} />
          <Info label="Reason" value={loan.reasonForLoan} />
          <Info label="Address" value={loan.address} />
          <Info label="Applied Date" value={loan.date?.slice(0, 10)} />

          {/* Status Badge */}
          <Info
            label="Status"
            value={
              <span
                className={`badge ${
                  loan.status === "Approved"
                    ? "badge-success"
                    : loan.status === "Rejected"
                    ? "badge-error"
                    : "badge-warning"
                }`}
              >
                {loan.status || "Pending"}
              </span>
            }
          />
        </div>

        {/* Footer */}
        <div className="modal-action">
          <button
            className="btn btn-primary px-6"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

const Info = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="font-semibold text-gray-700">{label}:</span>
    <span className="text-gray-900 text-right">{value}</span>
  </div>
);

export default ViewLoanModal;
