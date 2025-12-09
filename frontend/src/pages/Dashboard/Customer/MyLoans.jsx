import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BorrowerLoanDataRow from "../../../components/Dashboard/TableRows/BorrowerLoanDataRow";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import DeleteModal from "../../../components/Modal/DeleteModal";
import ViewLoanModal from "../../../components/Modal/ViewLoanModal";
import ViewMyLoanModal from "../../../components/Modal/ViewMyLoanModal";

const MyLoans = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const { data: userLoans = [], refetch } = useQuery({
    queryKey: ["userLoans", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/apply-loans/user/${user.email}`);
      return res.data;
    },
  });

  const openCancelModal = (loan) => {
    setSelectedLoan(loan);
    setIsCancelOpen(true);
  };

  const openViewModal = (loan) => {
    setSelectedLoan(loan);
    setIsViewOpen(true);
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Loan Info</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userLoans.map((loan) => (
                    <BorrowerLoanDataRow
                      key={loan._id}
                      loan={loan}
                      onView={() => openViewModal(loan)}
                      onCancel={() => openCancelModal(loan)}
                      onPay={() => alert(`Paying loan ${loan.loanId}`)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedLoan && (
        <>
          <DeleteModal
            isOpen={isCancelOpen}
            closeModal={() => setIsCancelOpen(false)}
            refetch={refetch}
            loanId={selectedLoan._id}
          />
          <ViewMyLoanModal
            isOpen={isViewOpen}
            closeModal={() => setIsViewOpen(false)}
            loan={selectedLoan}
          />
        </>
      )}
    </>
  );
};

export default MyLoans;
