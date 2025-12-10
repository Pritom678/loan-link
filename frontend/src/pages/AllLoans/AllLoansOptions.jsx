import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import Container from "../../components/Shared/Container";
import Card from "../../components/Home/Card";
import { motion } from "framer-motion";

const AllLoansOptions = () => {
  const axiosSecure = useAxiosSecure();

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ["loans"],
    queryFn: async () => {
      const result = await axiosSecure(`${import.meta.env.VITE_API_URL}/loans`);
      return result.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container>
      {/* Section Title */}
      <div className="text-center pt-16 mt-[-110px]">
        <h2 className="text-4xl font-bold text-primary mb-4 tracking-wide">
          Our Loan Options
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Choose the perfect loan that matches your financial goals — from
          personal needs to business expansion. Get flexible terms & lower
          interest rates.
        </p>
        <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Loan Cards */}
      {loans && loans.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {loans.map((loan, index) => (
            <motion.div
              key={loan._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
            >
              <Card loan={loan} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center text-gray-500 py-20">
          No loan options available right now. Please check back later.
        </div>
      )}
    </Container>
  );
};

export default AllLoansOptions;
