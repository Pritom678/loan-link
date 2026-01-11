import React from "react";
import { FaEye, FaTimes } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const LoanApplicationRow = ({
  loan,
  refetch,
  setSelectedLoan,
  setIsModalOpen,
}) => {
  const axiosSecure = useAxiosSecure();

  const handleView = () => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 ">{loan._id}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 ">{loan.userEmail}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 ">
          {loan.firstName} {loan.lastName}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 ">{loan.category}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 ">{loan.loanAmount}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 ">{loan.status}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button
          onClick={handleView}
          className="p-2 bg-accent hover:bg-secondary text-white rounded-md"
          title="View Details"
        >
          <FaEye />
        </button>
      </td>
    </tr>
  );
};

export default LoanApplicationRow;
