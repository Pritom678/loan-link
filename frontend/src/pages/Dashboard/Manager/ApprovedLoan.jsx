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
    data: loans = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["loan"],
    queryFn: async () => {
      const result = await axiosSecure(
        `${import.meta.env.VITE_API_URL}/approved-loans`
      );
      return result.data;
    },
  });
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
                      Borrower
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
                      Approved Date
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
                      <ApprovedLoanRow
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
                        No Approved loans found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {isModalOpen && (
                <ViewApprovedLoanModal
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

export default ApprovedLoan;
