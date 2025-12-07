import Container from "../../components/Shared/Container";
import Heading from "../../components/Shared/Heading";
import Button from "../../components/Shared/Button/Button";
import { FaCheckCircle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";

const LoanDetails = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isApplyDisabled =
    !user || user?.role === "admin" || user?.role === "manager";
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: loan = {}, isLoading } = useQuery({
    queryKey: ["loan", id],
    queryFn: async () => {
      const result = await axiosSecure(
        `${import.meta.env.VITE_API_URL}/loans/${id}`
      );
      return result.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const {
    title,
    image,
    category,
    description,
    documents,
    interest,
    emi,
    limit,
  } = loan;

  const handleApply = () => navigate(`/apply-loans/${id}`);

  return (
    <Container>
      <div className="mx-auto flex flex-col lg:flex-row gap-12 py-12 mt-[-110px]">
        {/* Image Section */}
        <div className="flex-1 rounded-xl overflow-hidden shadow-lg bg-base-100">
          <img
            className="w-full h-80 object-cover transition-transform duration-300 hover:scale-105"
            src={image}
            alt={title}
          />
        </div>

        {/* Loan Info */}
        <div className="flex-1 space-y-6">
          <div className="bg-base-100 p-6 rounded-xl shadow-md border border-base-300">
            <Heading
              title={title}
              subtitle={`Category: ${category}`}
              className="text-primary"
            />
            <hr className="my-4 border-base-300" />

            <p className="text-gray-700 leading-relaxed">{description}</p>
            <hr className="my-4 border-base-300" />
            <p className="text-gray-700 leading-relaxed">{documents}</p>
            <hr className="my-4 border-base-300" />

            <div className="flex flex-col md:flex-row justify-between text-gray-800 gap-4">
              <p>
                <span className="font-semibold text-secondary">
                  Interest Rate:
                </span>{" "}
                {interest}%
              </p>
              <p>
                <span className="font-semibold text-secondary">Max Limit:</span>{" "}
                ${limit}
              </p>
            </div>
            <hr className="my-4 border-base-300" />

            {/* EMI Plans */}
            <div>
              <h2 className="font-semibold text-primary mb-2">
                Available EMI Plans
              </h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <FaCheckCircle className="text-accent" />
                  {emi} Months
                </li>
              </ul>
            </div>
            <hr className="my-4 border-base-300" />

            {/* Apply Button */}
            <div className="flex justify-between items-center mt-4">
              <p className="font-bold text-2xl text-gray-800">Apply Now</p>

              <button
                onClick={handleApply}
                disabled={isApplyDisabled}
                className="btn btn-primary hover:btn-accent text-white"
              >
                {isApplyDisabled ? "Login Required" : "Apply Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default LoanDetails;
