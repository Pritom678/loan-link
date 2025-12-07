import Card from "./Card";
import Container from "../Shared/Container";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";

const LoanOption = () => {
  const axiosSecure = useAxiosSecure();

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ["loans"],
    queryFn: async () => {
      const result = await axiosSecure(
        `${import.meta.env.VITE_API_URL}/loan-options`
      );
      return result.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

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
      {loans && loans.length > 0 ? (
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {loans.map((loan) => (
            <Card key={loan._id} loan={loan} />
          ))}
        </div>
      ) : null}
    </Container>
  );
};

export default LoanOption;
