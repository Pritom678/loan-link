import { useState} from "react";

import PaymentModal from "../../components/Modal/PaymentModal";
import { useNavigate, useSearchParams } from "react-router";


const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const loanId = searchParams.get("loanId");
  const [modalOpen, setModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setModalOpen(false);
    navigate("/dashboard/my-loans"); // redirect to my loans page
  };

  return (
    <PaymentModal
      isOpen={modalOpen}
      message={`Payment canceled for loan ${loanId}`}
      onClose={handleClose}
    />
  );
};

export default PaymentCancel;
