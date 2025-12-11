import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import BorrowerLoanDataRow from "../../../components/Dashboard/TableRows/BorrowerLoanDataRow";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import DeleteModal from "../../../components/Modal/DeleteModal";
import ViewMyLoanModal from "../../../components/Modal/ViewMyLoanModal";
import PayModal from "../../../components/Modal/PayModal";
import PaymentModal from "../../../components/Modal/PaymentModal";
import PaymentDetailModal from "../../../components/Modal/PaymentDetailModal";

const MyLoans = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const [paymentDetailModalOpen, setPaymentDetailModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const { data: userLoans = [], refetch } = useQuery({
    queryKey: ["userLoans", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/apply-loans/user/${user.email}`);
      return res.data;
    },
  });

  // Handle Stripe success redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const loanId = params.get("loanId");

    if (sessionId && loanId) {
      // Step 1: Retrieve checkout session
      axiosSecure
        .get(`/payment-details/${sessionId}`)
        .then(({ data }) => {
          const paymentId = data.id; // Stripe PaymentIntent ID

          // Step 2: Save paymentId in backend
          return axiosSecure.patch(`/apply-loans/${loanId}/pay-fee`, {
            paymentId,
          });
        })
        .then(() => {
          setPaymentMessage("Loan fee paid successfully!");
          setPaymentModalOpen(true);
          refetch();
        })
        .catch((err) => {
          console.error(err);
          setPaymentMessage("Failed to record payment");
          setPaymentModalOpen(true);
        });
    }
  }, [axiosSecure, refetch]);

  const handleDelete = async (loanId) => {
    if (!loanId) return;
    try {
      await axiosSecure.delete(`/apply-loans/${loanId}`);
      setIsCancelOpen(false);
      setSelectedLoan(null);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const openCancelModal = (loan) => {
    setSelectedLoan(loan);
    setIsCancelOpen(true);
  };

  const openViewModal = (loan) => {
    setSelectedLoan(loan);
    setIsViewOpen(true);
  };

  const openPayModal = (loan) => {
    setSelectedLoan(loan);
    setIsPayOpen(true);
  };

  const handleViewPayment = async (paymentId) => {
    if (!paymentId) return;
    setPaymentDetailModalOpen(true);
    setPaymentData(null); // loading state
    try {
      const { data } = await axiosSecure.get(`/payment-details/${paymentId}`);
      setPaymentData(data);
    } catch (err) {
      console.error(err);
    }
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
                      onPay={() => openPayModal(loan)}
                      onViewPayment={() => handleViewPayment(loan.paymentId)}
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
            onConfirm={() => handleDelete(selectedLoan._id)}
          />
          <ViewMyLoanModal
            isOpen={isViewOpen}
            closeModal={() => setIsViewOpen(false)}
            loan={selectedLoan}
          />
          <PayModal
            isOpen={isPayOpen}
            closeModal={() => setIsPayOpen(false)}
            loan={selectedLoan}
          />
        </>
      )}

      <PaymentModal
        isOpen={paymentModalOpen}
        message={paymentMessage}
        onClose={() => setPaymentModalOpen(false)}
      />

      <PaymentDetailModal
        isOpen={paymentDetailModalOpen}
        onClose={() => setPaymentDetailModalOpen(false)}
        paymentData={paymentData}
      />
    </>
  );
};

export default MyLoans;
