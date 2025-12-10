const ViewMyLoanModal = ({ isOpen, closeModal, loan }) => {
  if (!isOpen || !loan) return null;

  return (
    <div className="modal modal-open bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="modal-box rounded-2xl max-w-md w-full shadow-xl border border-gray-200">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-primary">Loan Details</h3>
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-error text-white"
          >
            ✕
          </button>
        </div>

        {/* Info Content */}
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          <Info label="Loan Title" value={loan.loanTitle} />
          <Info label="Amount" value={`$${loan.loanAmount}`} />

          {/* Highlight Status with Badges */}
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
                {loan.status}
              </span>
            }
          />

          <Info
            label="Application Status"
            value={
              <span className="badge badge-info">{loan.applicationStatus}</span>
            }
          />

          <Info label="Reason" value={loan.reason || "N/A"} />
          <Info label="Date Applied" value={loan.date?.slice(0, 10)} />
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button onClick={closeModal} className="btn btn-primary px-6">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="font-semibold text-gray-700">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

export default ViewMyLoanModal;
