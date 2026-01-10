import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ManagerLoanRow from "../../../components/Dashboard/TableRows/ManagerLoanRow";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const ManageLoans = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: loansResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["loans"],
    queryFn: async () => {
      const result = await axiosSecure(`${import.meta.env.VITE_API_URL}/loans`);
      return result.data;
    },
  });

  // Extract loans from the API response structure
  const loans = loansResponse?.data?.loans || loansResponse?.loans || [];

  // Filter loans based on search term (title or category)
  const filteredLoans = loans.filter(
    (loan) =>
      loan.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Manage Loan Products
          </h1>
          <p className="text-gray-600">View and manage your loan products</p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-amber-600 to-orange-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Interest Rate
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLoans.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-8 h-8 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Loan Products Found
                        </h3>
                        <p className="text-gray-500">
                          {searchTerm
                            ? "No loans match your search criteria."
                            : "You haven't created any loan products yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLoans.map((loan, index) => (
                    <ManagerLoanRow
                      key={loan._id}
                      loan={loan}
                      refetch={refetch}
                      index={index}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageLoans;
