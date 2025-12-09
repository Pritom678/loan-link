import React from "react";
import { FaEye, FaTimes } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const ApprovedLoanRow = ({
  loan,
  refetch,
  setSelectedLoan,
  setIsModalOpen,
}) => {
  const axiosSecure = useAxiosSecure();

  const handleReject = async () => {
    try {
      await axiosSecure.delete(`/approved-loans/${loan._id}`);
      toast.success("Loan Rejected!");
      refetch();
    } catch (err) {
      toast.error("Delete failed", err);
    }
  };

  const handleView = async () => {
    try {
      const res = await axiosSecure.get(`/approved-loans/${loan._id}`);
      setSelectedLoan(res.data);
      setIsModalOpen(true);
    } catch (err) {
      toast.error("Failed to load details", err);
    }
  };

  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 ">{loan._id}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 ">
          {loan.firstName} {loan.lastName}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 ">{loan.loanAmount}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 ">{loan.approvedAt}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center gap-3">
          {/* Reject Button */}
          <button
            onClick={handleReject}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
            title="Reject"
          >
            <FaTimes />
          </button>
          {/* View Button */}
          <button
            onClick={handleView}
            className="p-2 bg-accent hover:bg-secondary text-white rounded-md"
            title="View Details"
          >
            <FaEye />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ApprovedLoanRow;
