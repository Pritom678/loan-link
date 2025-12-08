import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import UpdateLoanForm from '../Form/UpdateLoanForm';


const UpdateLoanModal = ({ isOpen, closeModal, loan }) => {
  if (!loan) return null; // prevent crash when no loan selected

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={closeModal}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/30">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl 
            duration-300 ease-out data-closed:scale-95 data-closed:opacity-0"
          >
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-red-100 px-3 py-1 rounded-md text-red-500 cursor-pointer"
              >
                X
              </button>
            </div>

            <DialogTitle
              as="h3"
              className="text-lg font-medium text-center leading-6 text-gray-900"
            >
              Update Loan Information
            </DialogTitle>

            <div className="mt-4 w-full">
              {/* Pass loan fields to form */}
              <UpdateLoanForm loan={loan} closeModal={closeModal} />
            </div>

          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default UpdateLoanModal;
