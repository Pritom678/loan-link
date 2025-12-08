import React from "react";
import { FaCheck, FaEye, FaTimes } from "react-icons/fa";

const ApprovedLoanRow = ({ loan }) => {
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
          
          <button
            // onClick={handleApprove}
            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            title="Approve"
          >
            <FaCheck />
          </button>
          {/* Reject Button */}
          <button
            // onClick={handleReject}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
            title="Reject"
          >
            <FaTimes />
          </button>
          {/* View Button */}
          <button
            // onClick={handleView}
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
