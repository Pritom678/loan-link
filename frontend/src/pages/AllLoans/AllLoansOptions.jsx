import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import SkeletonCard from "../../components/Shared/SkeletonCard";
import Container from "../../components/Shared/Container";
import Card from "../../components/Home/Card";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

const AllLoansOptions = () => {
  const axiosSecure = useAxiosSecure();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [interestRange, setInterestRange] = useState("");
  const loansPerPage = 8;

  const {
    data: loansResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["loans", "all"],
    queryFn: async () => {
      const result = await axiosSecure(`/loans`);
      return result.data;
    },
  });

  // Extract loans from the API response structure
  const loans = Array.isArray(loansResponse) ? loansResponse : [];

  if (error) {
    console.error("AllLoansOptions - Error:", error);
  }

  // Ensure loans is always an array
  const safeLoans = Array.isArray(loans) ? loans : [];

  // Get unique categories for filter dropdown
  const categories = [
    ...new Set(safeLoans.map((loan) => loan.category).filter(Boolean)),
  ];

  // Filter and sort loans
  const filteredAndSortedLoans = useMemo(() => {
    let filtered = safeLoans.filter((loan) => {
      const matchesSearch =
        loan.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || loan.category === selectedCategory;

      let matchesInterest = true;
      if (interestRange) {
        // Handle both number and string formats for interest
        const interest =
          typeof loan.interest === "number"
            ? loan.interest
            : parseFloat((loan.interest || "0").toString().replace("%", ""));

        switch (interestRange) {
          case "low":
            matchesInterest = interest <= 5;
            break;
          case "medium":
            matchesInterest = interest > 5 && interest <= 10;
            break;
          case "high":
            matchesInterest = interest > 10;
            break;
        }
      }

      return matchesSearch && matchesCategory && matchesInterest;
    });

    // Sort loans
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "interest-low":
            // Handle both number and string formats for interest
            const aInterest =
              typeof a.interest === "number"
                ? a.interest
                : parseFloat((a.interest || "0").toString().replace("%", ""));
            const bInterest =
              typeof b.interest === "number"
                ? b.interest
                : parseFloat((b.interest || "0").toString().replace("%", ""));
            return aInterest - bInterest;
          case "interest-high":
            const aInterestHigh =
              typeof a.interest === "number"
                ? a.interest
                : parseFloat((a.interest || "0").toString().replace("%", ""));
            const bInterestHigh =
              typeof b.interest === "number"
                ? b.interest
                : parseFloat((b.interest || "0").toString().replace("%", ""));
            return bInterestHigh - aInterestHigh;
          case "amount-low":
            return (a.limit || 0) - (b.limit || 0);
          case "amount-high":
            return (b.limit || 0) - (a.limit || 0);
          case "title":
            return (a.title || "").localeCompare(b.title || "");
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [safeLoans, searchTerm, selectedCategory, sortBy, interestRange]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy, interestRange]);

  // Pagination logic
  const indexOfLastLoan = currentPage * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = filteredAndSortedLoans.slice(
    indexOfFirstLoan,
    indexOfLastLoan
  );

  const totalPages = Math.ceil(filteredAndSortedLoans.length / loansPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top on page change
  };

  if (isLoading) {
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

        {/* Search and Filter Section Skeleton */}
        <div className="pt-12 mb-8">
          <div className="bg-base-200 p-6 rounded-lg shadow-sm animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 h-10 bg-gray-300 rounded-md"></div>
              <div className="h-10 bg-gray-300 rounded-md"></div>
              <div className="h-10 bg-gray-300 rounded-md"></div>
              <div className="h-10 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Skeleton Cards */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </Container>
    );
  }

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

      {/* Search and Filter Section */}
      <div className="pt-12 mb-8">
        <div className="bg-base-200 p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Bar */}
            <div className="lg:col-span-2 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search loans by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Interest Rate Filter */}
            <select
              value={interestRange}
              onChange={(e) => setInterestRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Interest Rates</option>
              <option value="low">Low (≤5%)</option>
              <option value="medium">Medium (5-10%)</option>
              <option value="high">High (&gt;10%)</option>
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Sort By</option>
              <option value="title">Title (A-Z)</option>
              <option value="interest-low">Interest (Low to High)</option>
              <option value="interest-high">Interest (High to Low)</option>
              <option value="amount-low">Amount (Low to High)</option>
              <option value="amount-high">Amount (High to Low)</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {currentLoans.length} of {filteredAndSortedLoans.length}{" "}
            loans
            {(searchTerm || selectedCategory || interestRange) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setInterestRange("");
                  setSortBy("");
                }}
                className="ml-4 text-primary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loan Cards */}
      {error ? (
        <div className="text-center text-red-500 py-20">
          <h3 className="text-lg font-medium mb-2">Error Loading Loans</h3>
          <p>Failed to fetch loans from the server. Please try again later.</p>
          <p className="text-sm mt-2">Error: {error.message}</p>
        </div>
      ) : currentLoans && currentLoans.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {currentLoans.map((loan, index) => (
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
          <h3 className="text-lg font-medium mb-2">
            No Loan Options Available
          </h3>
          {searchTerm || selectedCategory || interestRange
            ? "No loans match your search criteria. Try adjusting your filters."
            : "No loan options are currently available. Please check back later or contact support."}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 my-10 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-md border ${
                currentPage === i + 1
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300"
              } hover:bg-primary hover:text-white transition`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </Container>
  );
};

export default AllLoansOptions;
