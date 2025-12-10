const ViewAdminApplicationLoanModal = ({ isOpen, closeModal, loan }) => {
  if (!isOpen || !loan) return null;

  return (
    <div className="modal modal-open bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="modal-box rounded-2xl max-w-lg w-full shadow-xl border border-gray-200">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-primary">Loan Application Details</h3>
          <button 
            onClick={closeModal} 
            className="btn btn-sm btn-circle btn-error text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <Info label="Loan Title" value={loan.loanTitle} />
          <Info label="User Name" value={`${loan.firstName} ${loan.lastName}`} />
          <Info label="User Email" value={loan.userEmail} />
          <Info label="Amount" value={`$${loan.loanAmount}`} />
          <Info label="Contact" value={loan.contactNumber} />
          <Info label="NID / Passport" value={loan.nidOrPassport} />
          <Info label="Status" value={loan.status} />
          <Info label="Monthly Income" value={`$${loan.monthlyIncome}`} />
          <Info label="Income Source" value={loan.incomeSource} />
          <Info label="Application Status" value={loan.applicationStatus} />
          <Info label="Reason" value={loan.reasonForLoan || "N/A"} />
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
  <div>
    <span className="font-semibold text-gray-700">{label}: </span>
    <span className="text-gray-900">{value}</span>
  </div>
);

export default ViewAdminApplicationLoanModal;
