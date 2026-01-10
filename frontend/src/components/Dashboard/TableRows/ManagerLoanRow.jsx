import { useState } from "react";
import DeleteModal from "../../Modal/DeleteModal";
import UpdateLoanModal from "../../Modal/UpdateLoanModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const ManagerLoanRow = ({ loan, removeLoanFromTable, refetch, index }) => {
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
      <tr
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-gray-50"
        } hover:bg-amber-50 transition-colors duration-200`}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex-shrink-0 h-16 w-16">
            <img
              src={loan.image}
              alt={loan.title}
              className="h-16 w-16 rounded-lg object-cover border-2 border-amber-200"
            />
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{loan.title}</div>
          <div className="text-sm text-gray-500">
            Max: ${loan.limit?.toLocaleString()}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
            {loan.interest}%
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            {loan.category}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setSelectedLoan(loan);
                setIsUpdateOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
            >
              Update
            </button>
            <button
              onClick={() => {
                setSelectedLoan(loan);
                setIsDeleteOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
            >
              Delete
            </button>
          </div>

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
