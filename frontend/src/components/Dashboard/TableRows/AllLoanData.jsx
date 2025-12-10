import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Switch } from "@headlessui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const AllLoanData = ({ loan, refetch, onEdit }) => {
  const axiosSecure = useAxiosSecure();

  const handleDelete = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to delete this loan? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      await axiosSecure.delete(`/loans/${loan._id}`);
      Swal.fire("Deleted!", "The loan has been deleted.", "success");
      refetch();
    } catch (error) {
      Swal.fire("Error!", "Failed to delete the loan.", error);
    }
  }
};

  const enabled = loan.availability === "available";

  const handleToggle = async () => {
    try {
      const res = await axiosSecure.patch(
        `/loans/toggle-availability/${loan._id}`,
        {
          availability: enabled ? "unavailable" : "available",
        }
      );

      if (res.data.success) {
        toast.success(
          `Updated: ${enabled ? "Hidden from home" : "Visible on home"}`
        );
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed!");
    }
  };

  return (
    <tr className="bg-white border-b">
      <td className="px-5 py-4">
        <img
          src={loan?.image}
          alt={loan?.title}
          className="w-12 h-12 object-cover rounded-md"
        />
      </td>
      <td className="px-5 py-4 text-gray-900">{loan?.title}</td>
      <td className="px-5 py-4 text-gray-900">{loan?.interest}%</td>
      <td className="px-5 py-4">{loan?.category}</td>
      <td className="px-5 py-4">{loan?.manager?.email}</td>

      <td className="px-5 py-4">
        <Switch
          checked={enabled}
          onChange={handleToggle}
          className={`${
            enabled ? "bg-green-500" : "bg-gray-300"
          } relative inline-flex items-center h-7 w-14 rounded-full transition-colors duration-300 focus:outline-none shadow-inner`}
        >
          <span
            className={`${
              enabled ? "translate-x-7 bg-white" : "translate-x-1 bg-white"
            } inline-block w-5 h-5 transform rounded-full shadow-md transition-transform duration-300`}
          />
          <span
            className={`absolute left-2 text-xs font-semibold text-white ${
              enabled ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
          >
            ON
          </span>
          <span
            className={`absolute right-2 text-xs font-semibold text-gray-700 ${
              enabled ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
          >
            OFF
          </span>
        </Switch>
      </td>

      <td className="px-5 py-4 flex gap-2">
        {/* Edit Button */}
        <button
          className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg shadow-md transition"
          onClick={() => onEdit(loan)} // trigger modal
        >
          <FaEdit className="text-white" />
          <span>Edit</span>
        </button>

        {/* Delete Button */}
        <button
          className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg shadow-md transition"
          onClick={handleDelete}
        >
          <FaTrash className="text-white" />
          <span>Delete</span>
        </button>
      </td>
    </tr>
  );
};

export default AllLoanData;
