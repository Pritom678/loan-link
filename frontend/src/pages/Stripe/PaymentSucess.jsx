import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PaymentModal from "../../components/Modal/PaymentModal";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use"; // for responsive confetti

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const loanId = searchParams.get("loanId");
  const axiosSecure = useAxiosSecure();
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!loanId) return;

    axiosSecure
      .patch(`/apply-loans/${loanId}/pay-fee`)
      .then(() => {
        setMessage("Payment successful! Loan fee is now paid.");
        setShowConfetti(true);
      })
      .catch(() =>
        setMessage("Payment succeeded but failed to update backend.")
      )
      .finally(() => setModalOpen(true));
  }, [loanId, axiosSecure]);

  const handleClose = () => {
    setModalOpen(false);
    setShowConfetti(false); // stop confetti
    navigate("/dashboard/my-loans");
  };

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      <PaymentModal isOpen={modalOpen} message={message} onClose={handleClose} />
    </>
  );
};

export default PaymentSuccess;
