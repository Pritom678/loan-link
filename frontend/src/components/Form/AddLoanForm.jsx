import { useState } from "react";
import { useForm } from "react-hook-form";
import { imageUpload } from "../../utilities";
import useAuth from "../../hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { TbCoin } from "react-icons/tb";

const AddLoanForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    isPending,
    mutateAsync,
    reset: mutationReset,
  } = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosSecure.post(`/loans`, payload);
      return res?.data;
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Loan Added Successfully");
      // Invalidate loan queries to refresh the UI
      queryClient.invalidateQueries(["loans"]);
      queryClient.invalidateQueries(["allLoans"]);
      //navigate to my inventory
      mutationReset();
    },
    onError: (error) => {
      console.log(error);
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to add loan";
      toast.error(apiMessage);
    },
    onMutate: (payload) => {
      console.log("I will post this data-->", payload);
    },
    onSettled: (data, error) => {
      if (data) console.log(data);
      if (error) console.log(error);
    },
    retry: 3,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onInvalid = () => {
    toast.error("Please fill all required fields");
  };

  const onSubmit = async (data) => {
    const {
      title,
      category,
      description,
      documents,
      interest,
      emi,
      limit,
      image,
    } = data;
    const imageFile = image[0];
    try {
      setIsUploadingImage(true);
      const imageUrl = await imageUpload(imageFile);
      const loanData = {
        image: imageUrl,
        title,
        category,
        description,
        documents,
        interest: Number(interest),
        emi,
        limit: Number(limit),
        manager: {
          image: user?.photoURL,
          name: user?.displayName,
          email: user?.email,
        },
      };

      await mutateAsync(loanData);
      reset();
    } catch (err) {
      console.log(err);
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to add loan";
      toast.error(apiMessage);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const currentDate = new Date().toISOString().split("T")[0]; // auto date

  if (isPending || isUploadingImage) return <LoadingSpinner />;
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Add New Loan Product
            </h1>
            <p className="text-gray-600">
              Create a new loan product for borrowers to apply
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Loan Title */}
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Loan Title
                  </label>
                  <input
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                    id="title"
                    type="text"
                    placeholder="Enter Loan Title"
                    {...register("title", {
                      required: "Title is required",
                      maxLength: {
                        value: 20,
                        message: "Title cannot be too long",
                      },
                    })}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    {...register("category", {
                      required: "Category is required",
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  >
                    <option value="Personal">Personal Loan</option>
                    <option value="Student">Student Loan</option>
                    <option value="Car">Car Loan</option>
                    <option value="Home">Home Loan</option>
                    <option value="Business">Business Loan</option>
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Write loan details here..."
                    className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 resize-none"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Required Documents */}
                <div className="space-y-2">
                  <label
                    htmlFor="documents"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Required Documents
                  </label>
                  <textarea
                    id="documents"
                    placeholder="National ID, Passport, Salary Slip..."
                    className="w-full h-28 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 resize-none"
                    {...register("documents", {
                      required: "Documents are required",
                    })}
                  ></textarea>
                  {errors.documents && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.documents.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Interest Rate & Max Loan Limit */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Interest Rate */}
                  <div className="space-y-2">
                    <label
                      htmlFor="interest"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Interest Rate (%)
                    </label>
                    <input
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                      id="interestRate"
                      type="number"
                      placeholder="e.g. 10"
                      {...register("interest", {
                        required: "Interest is required",
                        min: {
                          value: 5,
                          message: "Interest must be more than 5%",
                        },
                      })}
                    />
                    {errors.interest && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.interest.message}
                      </p>
                    )}
                  </div>

                  {/* Max Loan Limit */}
                  <div className="space-y-2">
                    <label
                      htmlFor="limit"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Max Loan Limit
                    </label>
                    <input
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                      id="maxLoanLimit"
                      type="number"
                      placeholder="e.g. 500000"
                      {...register("limit", {
                        required: "Limit is required",
                        max: {
                          value: 50000000,
                          message: "Max Limit is 50 Million",
                        },
                      })}
                    />
                    {errors.limit && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.limit.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* EMI Plans */}
                <div className="space-y-2">
                  <label
                    htmlFor="emiPlans"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    EMI Plans
                  </label>
                  <select
                    id="emiPlans"
                    {...register("emi", { required: "EMI is required" })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select EMI Plan
                    </option>
                    <option value="6 Months">6 Months</option>
                    <option value="12 Months">12 Months</option>
                    <option value="24 Months">24 Months</option>
                    <option value="36 Months">36 Months</option>
                    <option value="Custom">Custom</option>
                  </select>
                  {errors.emi && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.emi.message}
                    </p>
                  )}
                </div>

                {/* Images Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Loan Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-all duration-200"
                    {...register("image", { required: "Image is required" })}
                  />
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.image.message}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="uploadDate"
                    value={currentDate}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>

                {/* Show on Home */}
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <input
                    type="checkbox"
                    name="showOnHome"
                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Show on Home Page
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending || isUploadingImage}
                  className="w-full py-4 px-6 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isPending || isUploadingImage ? (
                    <div className="flex items-center justify-center">
                      <TbCoin className="animate-spin mr-2" />
                      {isUploadingImage
                        ? "Uploading Image..."
                        : "Creating Loan..."}
                    </div>
                  ) : (
                    "Create Loan Product"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLoanForm;
