import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import LoadingSpinner from "../Shared/LoadingSpinner";
import ErrorPage from "../../pages/ErrorPage";

const ApplyForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();

  const { data: loanDetails = {}, isLoading: loanLoading } = useQuery({
    queryKey: ["loanDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `${import.meta.env.VITE_API_URL}/loans/${id}`
      );
      return res.data;
    },
  });

  const {
    isPending,
    isError,
    mutateAsync,
    reset: mutationReset,
  } = useMutation({
    mutationFn: async (payload) => {
      await axiosSecure.post(
        `${import.meta.env.VITE_API_URL}/apply-loans`,
        payload
      );
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Loan Added Successfully");
      //navigate to my Loan
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
      firstName,
      lastName,
      contactNumber,
      nidOrPassport,
      incomeSource,
      monthlyIncome,
      loanAmount,
      reasonForLoan,

      address,
    } = data;

    try {
      const ApplyLoanData = {
        loanId: id,
        loanTitle: loanDetails?.title,
        interestRate: loanDetails?.interest,
        firstName,
        lastName,
        contactNumber,
        nidOrPassport,
        incomeSource,
        monthlyIncome,
        loanAmount: Number(loanAmount),
        reasonForLoan,
        address,
      };
      console.table(ApplyLoanData);
      await mutateAsync(ApplyLoanData);
      reset();
    } catch (err) {
      console.log(err);
    }
  };

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorPage />;

  return (
    <div className="w-full min-h-full flex items-center justify-center bg-base-200 py-20 mt-[-110px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl bg-base-100 shadow-xl rounded-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-primary text-center">
          Loan Application Form
        </h2>

        {/* Auto-Filled Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">User Email</label>
            <input
              type="email"
              className="input input-bordered"
              value={user?.email}
              readOnly
            />
          </div>

          <div className="form-control">
            <label className="label">Loan Title</label>
            <input
              className="input input-bordered"
              value={loanDetails?.title || "Loading..."}
              readOnly
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">Interest Rate (%)</label>
            <input
              className="input input-bordered"
              value={loanDetails?.interest || "Loading..."}
              readOnly
            />
          </div>
        </div>

        {/* User Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">First Name*</label>
            <input
              {...register("firstName", { required: true })}
              className="input input-bordered"
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">First Name is required</p>
            )}
          </div>

          <div className="form-control">
            <label className="label">Last Name*</label>
            <input
              {...register("lastName", { required: true })}
              className="input input-bordered"
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">Last Name is required</p>
            )}
          </div>

          <div className="form-control">
            <label className="label">Contact Number*</label>
            <input
              type="tel"
              {...register("contactNumber", { required: true })}
              className="input input-bordered"
              placeholder="01XXXXXXXXX"
            />
            {errors.contactNumber && (
              <p className="text-sm text-red-500">Contact Number is required</p>
            )}
          </div>

          <div className="form-control">
            <label className="label">National ID / Passport No*</label>
            <input
              {...register("nidOrPassport", { required: true })}
              className="input input-bordered"
              placeholder="Enter NID / Passport"
            />
            {errors.nidOrPassport && (
              <p className="text-sm text-red-500">NID / Passport is required</p>
            )}
          </div>

          <div className="form-control">
            <label className="label">Income Source*</label>
            <select
              {...register("incomeSource", { required: true })}
              className="select select-bordered"
            >
              <option value="">Select source</option>
              <option value="Job">Job</option>
              <option value="Business">Business</option>
              <option value="Freelance">Freelance</option>
              <option value="Other">Other</option>
            </select>
            {errors.incomeSource && (
              <p className="text-sm text-red-500">Income Source is required</p>
            )}
          </div>

          <div className="form-control">
            <label className="label">Monthly Income (BDT)*</label>
            <input
              type="number"
              {...register("monthlyIncome", { required: true })}
              className="input input-bordered"
              placeholder="Enter amount"
            />
            {errors.monthlyIncome && (
              <p className="text-sm text-red-500">Monthly Income is required</p>
            )}
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">Loan Amount (BDT)*</label>
            <input
              type="number"
              {...register("loanAmount", { required: true })}
              className="input input-bordered"
              placeholder="Enter loan amount"
            />
            {errors.loanAmount && (
              <p className="text-sm text-red-500">Loan Amount is required</p>
            )}
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">Reason for Loan*</label>
            <textarea
              {...register("reasonForLoan", { required: true })}
              className="textarea textarea-bordered"
              placeholder="Tell us why you need this loan"
            ></textarea>
            {errors.reasonForLoan && (
              <p className="text-sm text-red-500">
                Reason for Loan is required
              </p>
            )}
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">Address*</label>
            <textarea
              {...register("address", { required: true })}
              className="textarea textarea-bordered"
              placeholder="Enter your full address"
            ></textarea>
            {errors.address && (
              <p className="text-sm text-red-500">Address is required</p>
            )}
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">Extra Notes</label>
            <textarea
              {...register("extraNotes")}
              className="textarea textarea-bordered"
              placeholder="Any additional information"
            ></textarea>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyForm;
