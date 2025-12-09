const ViewApplicationLoanModal = ({ isOpen, closeModal, loan }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-2">Loan Details</h3>

        <p><strong>Loan Title:</strong> {loan.loanTitle}</p>
        <p><strong>Amount:</strong> {loan.loanAmount}</p>
        <p><strong>Status:</strong> {loan.status}</p>
        <p><strong>Application Status:</strong> {loan.applicationStatus}</p>
        <p><strong>Reason:</strong> {loan.reason || "N/A"}</p>
        <p><strong>Date Applied:</strong> {loan.date?.slice(0, 10)}</p>

        <div className="modal-action">
          <button onClick={closeModal} className="btn btn-primary btn-sm">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewApplicationLoanModal;
