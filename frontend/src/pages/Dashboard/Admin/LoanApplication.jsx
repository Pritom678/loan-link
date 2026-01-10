import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import LoanApplicationRow from "../../../components/Dashboard/TableRows/LoanApplicationRow";
import ViewAdminApplicationLoanModal from "../../../components/Modal/ViewAdminApplicationLoanModal";

const LoanApplication = () => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
  };

  const axiosSecure = useAxiosSecure();
  const {
    data: loansResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["loan"],
    queryFn: async () => {
      const result = await axiosSecure(
        `${import.meta.env.VITE_API_URL}/admin/loans`
      );
      return result.data;
    },
  });

  // Extract loans from the API response structure
  const loans =
    loansResponse?.data?.applications || loansResponse?.applications || [];
  if (isLoading) return <LoadingSpinner />;
  return (
    <>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Id
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Loan Category
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loans && loans.length > 0 ? (
                    loans.map((loan) => (
                      <LoanApplicationRow
                        key={loan._id}
                        loan={loan}
                        refetch={refetch}
                        setSelectedLoan={setSelectedLoan}
                        setIsModalOpen={setIsModalOpen}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-4 text-gray-500"
                      >
                        No Loan Applications Found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {isModalOpen && (
                <ViewAdminApplicationLoanModal
                  isOpen={isModalOpen} // <-- Add this line
                  loan={selectedLoan}
                  closeModal={closeModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoanApplication;
