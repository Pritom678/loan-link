import { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PaymentModal from "../../components/Modal/PaymentModal";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const loanId = searchParams.get("loanId");
  const axiosSecure = useAxiosSecure();
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!loanId) return;

    
    axiosSecure
      .patch(`/apply-loans/${loanId}/pay-fee`)
      .then(() => setMessage("Payment successful! Loan fee is now paid."))
      .catch(() =>
        setMessage("Payment succeeded but failed to update backend.")
      )
      .finally(() => setModalOpen(true));
  }, [loanId, axiosSecure]);

  const handleClose = () => {
    setModalOpen(false);
    navigate("/dashboard/my-loans"); // redirect to my loans page
  };

  return (
    <PaymentModal isOpen={modalOpen} message={message} onClose={handleClose} />
  );
};

export default PaymentSuccess;
