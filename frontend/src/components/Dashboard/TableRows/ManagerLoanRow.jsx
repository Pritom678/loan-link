import { useState } from "react";
import DeleteModal from "../../Modal/DeleteModal";
import UpdateLoanModal from "../../Modal/UpdateLoanModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const ManagerLoanRow = ({ loan, removeLoanFromTable, refetch }) => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Delete function
  const handleDelete = async (loanId) => {
    if (!loanId) return; // safety check
    try {
      await axiosSecure.delete(`/loans/${loanId}`);
      toast.success("Loan deleted successfully!");
      setIsDeleteOpen(false);
      setSelectedLoan(null);
      refetch();
      // Remove the deleted loan from table dynamically
      if (removeLoanFromTable) removeLoanFromTable(loanId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete the loan");
    }
  };

  return (
    <>
      <tr key={loan._id}>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <img src={loan.image} className="w-10" />
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900">{loan.title}</p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900">{loan.interest} %</p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900">{loan.category}</p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <span className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedLoan(loan);
                setIsUpdateOpen(true);
              }}
              className="px-3 py-1 text-white bg-accent rounded-md hover:bg-secondary"
            >
              Update
            </button>
            <button
              onClick={() => {
                setSelectedLoan(loan);
                setIsDeleteOpen(true);
              }}
              className="px-3 py-1 text-white bg-red-700 rounded-md hover:bg-red-900"
            >
              Delete
            </button>
          </span>

          {/* Delete Modal */}
          {selectedLoan && (
            <DeleteModal
              isOpen={isDeleteOpen}
              closeModal={() => setIsDeleteOpen(false)}
              onConfirm={() => handleDelete(selectedLoan._id)}
            />
          )}

          {/* Update Modal */}
          {selectedLoan && (
            <UpdateLoanModal
              isOpen={isUpdateOpen}
              closeModal={() => setIsUpdateOpen(false)}
              loan={selectedLoan}
            />
          )}
        </td>
      </tr>
    </>
  );
};

export default ManagerLoanRow;
