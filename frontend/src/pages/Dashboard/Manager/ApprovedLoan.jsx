import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import ApprovedLoanRow from "../../../components/Dashboard/TableRows/ApprovedLoanRow";
import { useState } from "react";
import ViewApprovedLoanModal from "../../../components/Modal/ViewApprovedLoanModal";

const ApprovedLoan = () => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
  };

  const axiosSecure = useAxiosSecure();
  const {
    data: loans,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["approvedLoans"],
    queryFn: async () => {
      const result = await axiosSecure(`/approved-loans`);
      return result.data; // Backend returns array directly
    },
  });

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Approved Loan Applications
          </h1>
          <p className="text-gray-600">
            View and manage approved loan applications
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-amber-600 to-orange-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Application ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Borrower
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Approved Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loans && loans.length > 0 ? (
                  loans.map((loan, index) => (
                    <ApprovedLoanRow
                      key={loan._id}
                      loan={loan}
                      refetch={refetch}
                      setSelectedLoan={setSelectedLoan}
                      setIsModalOpen={setIsModalOpen}
                      index={index}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-8 h-8 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Approved Applications
                        </h3>
                        <p className="text-gray-500">
                          There are no approved loan applications at the moment.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <ViewApprovedLoanModal loan={selectedLoan} closeModal={closeModal} />
        )}
      </div>
    </div>
  );
};

export default ApprovedLoan;
