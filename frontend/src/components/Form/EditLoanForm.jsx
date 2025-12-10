import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

const EditLoanForm = ({ loan, closeModal }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: loan?.title || "",
      description: loan?.description || "",
      interest: loan?.interest || "",
      category: loan?.category || "",
      image: loan?.image || "",
      maxLoan: loan?.maxLoan || "",
    },
  });

  // Reset form if loan changes
  React.useEffect(() => {
    reset({
      title: loan?.title || "",
      description: loan?.description || "",
      interest: loan?.interest || "",
      category: loan?.category || "",
      image: loan?.image || "",
      maxLoan: loan?.maxLoan || "",
    });
  }, [loan, reset]);

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const { data } = await axiosSecure.put(
        `/loans/${loan._id}`,
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

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register("description", { required: true })}
          className="input input-bordered w-full border-gray-300 rounded-md h-24"
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
        />
      </div>

      {/* Image */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          {...register("image")}
          className="input input-bordered w-full border-gray-300 rounded-md"
          placeholder="Enter image URL"
        />
      </div>

      {/* Max Loan Limit */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Max Loan Limit
        </label>
        <input
          type="number"
          {...register("maxLoan")}
          className="input input-bordered w-full border-gray-300 rounded-md"
          placeholder="Enter max loan amount"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={mutation.isLoading}
        className="w-full py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
      >
        {mutation.isLoading ? "Updating..." : "Update Loan"}
      </button>
    </form>
  );
};

export default EditLoanForm;
