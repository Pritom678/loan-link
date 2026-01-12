import Card from "./Card";
import Container from "../Shared/Container";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../Shared/LoadingSpinner";
import SkeletonCard from "../Shared/SkeletonCard";
import { useQuery } from "@tanstack/react-query";

const LoanOption = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: loansResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["loans", "home"],
    queryFn: async () => {
      const result = await axiosSecure(
        `/loans?limit=6&home=available&random=true`
      );
      return result.data;
    },
  });

  // Extract loans from the API response structure
  const loans = Array.isArray(loansResponse) ? loansResponse : [];
  console.log("Home LoanOption - Processed loans:", loans);

  if (error) {
    console.error("Home LoanOption - Error:", error);
  }

  if (isLoading) {
    return (
      <Container>
        <div className="text-center pt-12">
          <h2 className="text-3xl font-bold mb-4">Our Loan Options</h2>
          <p className="text-gray-600">
            Explore a variety of loan options tailored to your needs.
          </p>
        </div>
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Section Title */}
      <div className="text-center pt-12">
        <h2 className="text-3xl font-bold mb-4">Our Loan Options</h2>
        <p className="text-gray-600">
          Explore a variety of loan options tailored to your needs.
        </p>
      </div>

      {/* Loan Cards */}
      {error ? (
        <div className="pt-12 text-center text-red-500">
          <h3 className="text-lg font-medium mb-2">Error Loading Loans</h3>
          <p>Failed to fetch loans. Please try again later.</p>
        </div>
      ) : loans && loans.length > 0 ? (
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {loans.map((loan) => (
            <Card key={loan._id} loan={loan} />
          ))}
        </div>
      ) : (
        <div className="pt-12 text-center text-gray-500">
          <h3 className="text-lg font-medium mb-2">
            No Loan Options Available
          </h3>
          <p>
            We're currently updating our loan products. Please check back soon!
          </p>
        </div>
      )}
    </Container>
  );
};

export default LoanOption;
