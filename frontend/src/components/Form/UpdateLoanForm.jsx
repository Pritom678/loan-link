import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const UpdateLoanForm = ({ loan, closeModal }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: loan?.title,
      interest: loan?.interest,
      category: loan?.category,
    },
  });

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const { data } = await axiosSecure.put(
        `${import.meta.env.VITE_API_URL}/loans/${loan._id}`,
        updatedData
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Loan updated successfully!");
      queryClient.invalidateQueries(["loans"]);
      closeModal();
    },
    onError: () => {
      toast.error("Failed to update loan!");
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Loan Title */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Loan Title
        </label>
        <input
          type="text"
          {...register("title", { required: true })}
          className="input input-bordered w-full border-gray-300 rounded-md"
        />
      </div>

      {/* Interest */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Interest Rate (%)
        </label>
        <input
          type="number"
          step="0.1"
          {...register("interest", { required: true })}
          className="input input-bordered w-full border-gray-300 rounded-md"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Category</label>
        <input
          type="text"
          {...register("category", { required: true })}
          className="input input-bordered w-full border-gray-300 rounded-md"
          placeholder="Enter category"
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
      >
        {mutation.isPending ? "Updating..." : "Update Loan"}
      </button>
    </form>
  );
};

export default UpdateLoanForm;
