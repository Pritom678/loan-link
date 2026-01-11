import { useQuery } from "@tanstack/react-query";
import LoanDataRow from "../../../components/Dashboard/TableRows/LoanDataRow";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { useState } from "react";
import ViewLoanModal from "../../../components/Modal/ViewLoanModal";

const PendingLoan = () => {
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
    queryKey: ["pendingLoans"],
    queryFn: async () => {
      const result = await axiosSecure(`/pending-loans`);
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
            Pending Loan Applications
          </h1>
          <p className="text-gray-600">
            Review and manage pending loan applications
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
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loans && loans.length > 0 ? (
                  loans.map((loan, index) => (
                    <LoanDataRow
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
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Pending Applications
                        </h3>
                        <p className="text-gray-500">
                          There are no pending loan applications at the moment.
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
          <ViewLoanModal loan={selectedLoan} closeModal={closeModal} />
        )}
      </div>
    </div>
  );
};

export default PendingLoan;
