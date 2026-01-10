import { useState } from "react";
import UpdateUserRoleModal from "../../Modal/UpdateUserRoleModal";
import SuspendModal from "../../Modal/SuspendModal";

const UserDataRow = ({ user, refetch }) => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 ">{user.name}</p>
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 ">{user.email}</p>
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="">{user.role}</p>
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {/* Update Role Button */}
        <span
          onClick={() => setIsRoleModalOpen(true)}
          className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight mr-3"
        >
          <span className="absolute inset-0 bg-amber-200 opacity-50 rounded-full"></span>
          <span className="relative">Update Role</span>
        </span>

        {/* Suspend Button */}

        {user?.status === "suspended" ? (
          <span className="relative inline-block px-3 py-1 font-semibold text-orange-700 leading-tight">
            <span className="absolute inset-0 bg-orange-200 opacity-50 rounded-full"></span>
            <span className="relative">Suspended</span>
          </span>
        ) : (
          <span
            onClick={() => setIsSuspendModalOpen(true)}
            className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-orange-900 leading-tight"
          >
            <span className="absolute inset-0 bg-orange-200 opacity-50 rounded-full"></span>
            <span className="relative">Suspend</span>
          </span>
        )}

        {/* Role Modal */}
        <UpdateUserRoleModal
          isOpen={isRoleModalOpen}
          closeModal={() => setIsRoleModalOpen(false)}
          user={user}
          refetch={refetch}
        />

        {/* Suspend Modal */}
        <SuspendModal
          isOpen={isSuspendModalOpen}
          closeModal={() => setIsSuspendModalOpen(false)}
          user={user}
          refetch={refetch}
        />
      </td>
    </tr>
  );
};

export default UserDataRow;
