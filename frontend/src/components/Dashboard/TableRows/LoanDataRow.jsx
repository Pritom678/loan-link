// import { useState } from "react";

import { FaCheck, FaEye, FaTimes } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const LoanDataRow = ({
  loan,
  refetch,
  setSelectedLoan,
  setIsModalOpen,
  index,
}) => {
  const axiosSecure = useAxiosSecure();

  const handleApprove = async () => {
    try {
      await axiosSecure.patch(`/apply-loans/${loan._id}`, {
        status: "Approved",
      });
      toast.success("Loan Approved!");
      refetch();
    } catch (err) {
      toast.error("Approval failed", err);
    }
  };

  const handleReject = async () => {
    try {
      await axiosSecure.patch(`/apply-loans/${loan._id}`, {
        status: "Rejected",
      });
      toast.success("Loan Rejected!");
      refetch();
    } catch (err) {
      toast.error("Failed to reject loan");
    }
  };

  const handleView = async () => {
    try {
      setSelectedLoan(loan);
      setIsModalOpen(true);
    } catch (err) {
      toast.error("Failed to load details", err);
    }
  };

  return (
    <tr
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } hover:bg-amber-50 transition-colors duration-200`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {loan._id?.slice(-8) || "N/A"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {loan.firstName?.charAt(0) || "U"}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {loan.firstName} {loan.lastName}
            </div>
            <div className="text-sm text-gray-500">{loan.userEmail}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900">
          ${loan.loanAmount?.toLocaleString() || "N/A"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {loan.date ? new Date(loan.date).toLocaleDateString() : "N/A"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          {/* Approve Button */}
          <button
            onClick={handleApprove}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
            title="Approve Application"
          >
            <FaCheck className="w-4 h-4" />
          </button>

          {/* Reject Button */}
          <button
            onClick={handleReject}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
            title="Reject Application"
          >
            <FaTimes className="w-4 h-4" />
          </button>

          {/* View Button */}
          <button
            onClick={handleView}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-yellow-700 hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
            title="View Details"
          >
            <FaEye className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LoanDataRow;
