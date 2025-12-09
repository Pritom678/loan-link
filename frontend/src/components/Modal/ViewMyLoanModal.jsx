const ViewMyLoanModal = ({ isOpen, closeModal, selectedLoan }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-2">Loan Details</h3>

        <p>
          <strong>Loan Title:</strong> {selectedLoan.loanTitle}
        </p>
        <p>
          <strong>Amount:</strong> {selectedLoan.loanAmount}
        </p>
        <p>
          <strong>Status:</strong> {selectedLoan.status}
        </p>
        <p>
          <strong>Application Status:</strong> {selectedLoan.applicationStatus}
        </p>
        <p>
          <strong>Reason:</strong> {selectedLoan.reason || "N/A"}
        </p>
        <p>
          <strong>Date Applied:</strong> {selectedLoan.date?.slice(0, 10)}
        </p>

        <div className="modal-action">
          <button onClick={closeModal} className="btn btn-primary btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewMyLoanModal;
