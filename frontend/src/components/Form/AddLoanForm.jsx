import { useForm } from "react-hook-form";
import { imageUpload } from "../../utilities";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import LoadingSpinner from "../Shared/LoadingSpinner";
import ErrorPage from "../../pages/ErrorPage";
import { TbCoin } from "react-icons/tb";

const AddLoanForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    isPending,
    isError,
    mutateAsync,
    reset: mutationReset,
  } = useMutation({
    mutationFn: async (payload) => {
      await axiosSecure.post(
        `${import.meta.env.VITE_API_URL}/loans`,
        payload
      );
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Loan Added Successfully");
      //navigate to my inventory
      mutationReset();
    },
    onError: (error) => {
      console.log(error);
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
    }
  };

  const currentDate = new Date().toISOString().split("T")[0]; // auto date

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorPage />;
  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-5xl bg-white p-8 rounded-xl shadow"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Add New Loan
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {/* Loan Title */}
            <div className="space-y-1 text-sm">
              <label htmlFor="title" className="block text-gray-600">
                Loan Title
              </label>
              <input
                className="w-full px-4 py-3 border border-accent rounded-md focus:outline-secondary"
                id="title"
                type="text"
                placeholder="Enter Loan Title"
                {...register("title", {
                  required: "Title is required",
                  maxLength: {
                    value: 20,
                    message: "Title cannot be to long",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1 text-sm">
              <label htmlFor="category" className="block text-gray-600">
                Category
              </label>
              <select
                {...register("category", {
                  required: "Category is required",
                })}
                className="w-full px-4 py-3 border border-accent rounded-md focus:outline-secondary"
              >
                <option value="Personal">Personal Loan</option>
                <option value="Student">Student Loan</option>
                <option value="Car">Car Loan</option>
                <option value="Home">Home Loan</option>
                <option value="Business">Business Loan</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1 text-sm">
              <label htmlFor="description" className="block text-gray-600">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Write details here..."
                className="w-full h-32 px-4 py-3 border border-accent rounded-md focus:outline-secondary"
                {...register("description", {
                  required: "Description is required",
                })}
              ></textarea>
              {errors.interest && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.interest.message}
                </p>
              )}
            </div>

            {/* Required Documents */}
            <div className="space-y-1 text-sm">
              <label htmlFor="documents" className="block text-gray-600">
                Required Documents
              </label>
              <textarea
                id="documents"
                placeholder="National ID, Passport, Salary Slip..."
                className="w-full h-28 px-4 py-3 border border-accent rounded-md focus:outline-secondary"
                {...register("documents", {
                  required: "Documents is required",
                })}
              ></textarea>
              {errors.interest && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.interest.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6 flex flex-col">
            {/* Interest Rate & Max Loan Limit */}
            <div className="flex gap-4">
              {/* Interest Rate */}
              <div className="space-y-1 text-sm w-1/2">
                <label htmlFor="interest" className="block text-gray-600">
                  Interest Rate (%)
                </label>
                <input
                  className="w-full px-4 py-3 border border-accent rounded-md focus:outline-secondary"
                  id="interestRate"
                  type="number"
                  placeholder="e.g. 10"
                  {...register("interest", {
                    required: "Interest is required",
                    min: { value: 5, message: "Interest must be more than 5%" },
                  })}
                />
                {errors.interest && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.interest.message}
                  </p>
                )}
              </div>

              {/* Max Loan Limit */}
              <div className="space-y-1 text-sm w-1/2">
                <label htmlFor="limit" className="block text-gray-600">
                  Max Loan Limit
                </label>
                <input
                  className="w-full px-4 py-3 border border-accent rounded-md focus:outline-secondary"
                  id="maxLoanLimit"
                  type="number"
                  placeholder="e.g. 500000"
                  {...register("limit", {
                    required: "Limit is required",
                    max: { value: 50000000, message: "Max Limit is 50 Million" },
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
            <div className="space-y-1 text-sm">
              <label htmlFor="emiPlans" className="block text-gray-600">
                EMI Plans
              </label>
              <input
                className="w-full px-4 py-3 border border-accent rounded-md focus:outline-secondary"
                id="emiPlans"
                type="text"
                placeholder="e.g. 6 Months, 12 Months, 24 Months"
                {...register("emi", { required: "EMI is required" })}
              />
              {errors.emi && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emi.message}
                </p>
              )}
            </div>

            {/* Images Upload */}
            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Loan Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="w-full px-4 py-3 border border-accent rounded-md bg-white cursor-pointer"
                {...register("image", { required: "Image is required" })}
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-1 text-sm">
              <label className="block text-gray-600">Date</label>
              <input
                type="date"
                name="uploadDate"
                value={currentDate}
                readOnly
                className="w-full px-4 py-3 border border-accent rounded-md bg-gray-100"
              />
            </div>

            {/* Show on Home */}
            <div className="flex items-center gap-3">
              <label className="text-gray-600">Show on Home</label>
              <input type="checkbox" name="showOnHome" className="toggle" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-5 p-3 font-medium text-white bg-primary hover:bg-secondary rounded-md shadow-md transition"
            >
              {isPending ? (
                <TbCoin  className="animate-spin m-auto" />
              ) : (
                "Save & Continue"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddLoanForm;
