import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const SuspendModal = ({ isOpen, closeModal, user, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSuspend = async () => {
    if (!reason || !feedback) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      await axiosSecure.patch(`/user/suspend/${user._id}`, {
        reason,
        feedback,
        suspendedAt: new Date().toISOString(),
      });

      toast.success(`${user.name} has been suspended`);
      refetch();
      closeModal();
    } catch (error) {
      toast.error("Failed to suspend user");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-xl">
                <Dialog.Title className="text-lg font-semibold text-red-600">
                  Suspend User: {user.name}
                </Dialog.Title>

                <div className="mt-4 space-y-3">
                  <textarea
                    placeholder="Suspension Reason"
                    className="textarea textarea-bordered w-full"
                    rows="2"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>

                  <textarea
                    placeholder="Feedback Message"
                    className="textarea textarea-bordered w-full"
                    rows="3"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 mt-5">
                  <button className="btn btn-sm" onClick={closeModal}>
                    Cancel
                  </button>
                  <button className="btn btn-error btn-sm" onClick={handleSuspend}>
                    Confirm Suspend
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SuspendModal;
