import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import PaymentModal from "../../components/Modal/PaymentModal";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use"; // for responsive confetti

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const loanId = searchParams.get("loanId");
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!loanId || !sessionId) {
      console.error("Missing payment parameters:", { loanId, sessionId });
      setMessage("Missing payment information. Please try again.");
      setModalOpen(true);
      return;
    }

    console.log("Processing payment completion:", { loanId, sessionId });

    // Step 1: Retrieve checkout session to get payment details
    axiosSecure
      .get(`/payment-details/${sessionId}`)
      .then(({ data }) => {
        console.log("Payment details retrieved:", data);
        const paymentId = data.id;

        if (!paymentId) {
          throw new Error("Payment ID not found in session data");
        }

        // Step 2: Save paymentId in backend
        return axiosSecure.patch(`/apply-loans/${loanId}/pay-fee`, {
          paymentId,
        });
      })
      .then((response) => {
        console.log("Payment recorded successfully:", response.data);
        setMessage(
          "Payment successful! Your loan application fee has been processed and your application is now under review."
        );
        setShowConfetti(true);

        // Invalidate the user loans cache to ensure fresh data
        if (user?.email) {
          queryClient.invalidateQueries({
            queryKey: ["userLoans", user.email],
          });
        }
      })
      .catch((err) => {
        console.error("Payment processing error:", err);
        console.error("Error details:", err.response?.data);

        if (
          err.response?.status === 400 &&
          err.response?.data?.message?.includes("Payment not completed")
        ) {
          setMessage(
            "Payment is still processing. Please wait a moment and check your loan applications."
          );
        } else {
          setMessage(
            "Payment succeeded but failed to update your application. Please contact support if needed."
          );
        }
      })
      .finally(() => setModalOpen(true));
  }, [loanId, sessionId, axiosSecure]);

  const handleClose = () => {
    setModalOpen(false);
    setShowConfetti(false); // stop confetti
    navigate("/dashboard/my-loans");
  };

  return (
    <>
      {showConfetti && (
        <Confetti width={width} height={height} recycle={false} />
      )}
      <PaymentModal
        isOpen={modalOpen}
        message={message}
        onClose={handleClose}
        type="success"
      />
    </>
  );
};

export default PaymentSuccess;
