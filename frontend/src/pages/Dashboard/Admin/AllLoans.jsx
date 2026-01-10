import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import AllLoanData from "../../../components/Dashboard/TableRows/AllLoanData";
import EditLoanModal from "../../../components/Modal/EditLoanModal";

const AllLoans = () => {
  const axiosSecure = useAxiosSecure();
  const {
    data: loansResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allLoans"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/loans`);
      return data;
    },
  });

  // Extract loans from the API response structure
  const loans = loansResponse?.data?.loans || loansResponse?.loans || [];

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLoan(null);
    setIsModalOpen(false);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Interest</th>
                  <th>Category</th>
                  <th>Created By</th>
                  <th>Show on Home</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.length > 0 ? (
                  loans.map((loan) => (
                    <AllLoanData
                      key={loan._id}
                      loan={loan}
                      refetch={refetch}
                      onEdit={handleEdit} // pass modal callback
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No Loans Found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedLoan && (
        <EditLoanModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          loan={selectedLoan}
        />
      )}
    </div>
  );
};

export default AllLoans;
