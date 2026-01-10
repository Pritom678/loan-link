import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import BorrowerLoanDataRow from "../../../components/Dashboard/TableRows/BorrowerLoanDataRow";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useApi from "../../../hooks/useApi";
import usePagination from "../../../hooks/usePagination";
import DeleteModal from "../../../components/Modal/DeleteModal";
import ViewMyLoanModal from "../../../components/Modal/ViewMyLoanModal";
import PayModal from "../../../components/Modal/PayModal";
import PaymentModal from "../../../components/Modal/PaymentModal";
import PaymentDetailModal from "../../../components/Modal/PaymentDetailModal";
import { TableSkeleton, StatsSkeleton } from "../../../components/Shared/SkeletonLoader";
import {
  FiFileText,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiSearch,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const MyLoans = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { loading: apiLoading, execute } = useApi();

  // Modal states
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentDetailModalOpen, setPaymentDetailModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch user loans with React Query
  const {
    data: userLoans = [],
    refetch,
    isLoading,
    error
  } = useQuery({
    queryKey: ["userLoans", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/apply-loans/user/${user.email}`);
      return res.data?.data || res.data || []; // Handle both paginated and non-paginated responses
    },
    enabled: !!user?.email,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    onError: (error) => {
      console.error('Failed to fetch loans:', error);
      toast.error('Failed to load loans. Please try again.');
    }
  });

  // Memoized filtered and sorted loans
  const filteredLoans = useMemo(() => {
    let filtered = Array.isArray(userLoans) ? [...userLoans] : [];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (loan) =>
          loan.loanTitle?.toLowerCase().includes(searchLower) ||
          loan.loanId?.toLowerCase().includes(searchLower) ||
          loan.status?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((loan) => loan.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
        case "oldest":
          return new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt);
        case "amount-high":
          return parseFloat(b.loanAmount || 0) - parseFloat(a.loanAmount || 0);
        case "amount-low":
          return parseFloat(a.loanAmount || 0) - parseFloat(b.loanAmount || 0);
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [userLoans, searchTerm, statusFilter, sortBy]);

  // Pagination
  const {
    currentItems: paginatedLoans,
    currentPage,
    totalPages,
    totalItems,
    hasNext,
    hasPrev,
    goToPage,
    nextPage,
    prevPage,
    startIndex,
    endIndex
  } = usePagination(filteredLoans, 10);

  // Statistics
  const statistics = useMemo(() => {
    const loans = Array.isArray(userLoans) ? userLoans : [];
    return {
      total: loans.length,
      pending: loans.filter(loan => loan.status === "Pending" || loan.status === "pending").length,
      approved: loans.filter(loan => loan.status === "Approved" || loan.status === "approved").length,
      rejected: loans.filter(loan => loan.status === "Rejected" || loan.status === "rejected").length,
      totalAmount: loans.reduce((sum, loan) => {
        const amount = parseFloat(loan.loanAmount || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0)
    };
  }, [userLoans]);

  // Export functionality
  const handleExport = useCallback(async () => {
    await execute(
      async () => {
        if (filteredLoans.length === 0) {
          throw new Error("No loan data to export");
        }

        const headers = [
          "Loan ID",
          "Loan Title", 
          "Amount",
          "Interest Rate",
          "Term",
          "Status",
          "Application Status",
          "Applied Date",
        ];

        const csvContent = [
          headers.join(","),
          ...filteredLoans.map((loan) =>
            [
              loan.loanId || "",
              `"${loan.loanTitle || ""}"`,
              loan.loanAmount || "",
              loan.interestRate || "",
              loan.loanTerm || "",
              loan.status || "",
              loan.applicationStatus || "",
              loan.date ? new Date(loan.date).toLocaleDateString() : "",
            ].join(",")
          ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `my-loans-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      {
        showSuccessToast: true,
        successMessage: "Loans exported successfully!",
        showErrorToast: true
      }
    );
  }, [filteredLoans, execute]);

  // Refresh functionality
  const handleRefresh = useCallback(async () => {
    await execute(
      async () => {
        await refetch();
      },
      {
        showSuccessToast: true,
        successMessage: "Loans refreshed successfully!",
        showErrorToast: true
      }
    );
  }, [refetch, execute]);

  // Modal handlers
  const handleViewLoan = useCallback((loan) => {
    setSelectedLoan(loan);
    setIsViewOpen(true);
  }, []);

  const handleCancelLoan = useCallback((loan) => {
    setSelectedLoan(loan);
    setIsCancelOpen(true);
  }, []);

  const handlePayLoan = useCallback((loan) => {
    setSelectedLoan(loan);
    setIsPayOpen(true);
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("newest");
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Loan Applications</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and manage your loan applications
            </p>
          </div>
        </div>
        <StatsSkeleton count={4} />
        <TableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Loans</h3>
        <p className="text-gray-500 mb-4">There was an error loading your loan applications.</p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FiRefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Loan Applications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your loan applications
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={apiLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiRefreshCw className={`w-4 h-4 mr-2 ${apiLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            disabled={filteredLoans.length === 0 || apiLoading}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiDownload className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FiFileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
              <p className="text-2xl font-semibold text-gray-900">{statistics.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FiCalendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-semibold text-gray-900">{statistics.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FiFileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Approved</h3>
              <p className="text-2xl font-semibold text-gray-900">{statistics.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10">
              <FiFileText className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
              <p className="text-2xl font-semibold text-gray-900">
                ${statistics.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
          loan.applicationStatus,
          new Date(loan.createdAt || loan.appliedAt).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `my-loans-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message
    alert(
      `Successfully exported ${filteredLoans.length} loan records to CSV file.`
    );
  };
  const filteredLoans = userLoans
    .filter((loan) => {
      const matchesSearch =
        loan.loanTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.loanId?.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        loan.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || b.appliedAt) -
            new Date(a.createdAt || a.appliedAt)
          );
        case "oldest":
          return (
            new Date(a.createdAt || a.appliedAt) -
            new Date(b.createdAt || b.appliedAt)
          );
        case "amount-high":
          return parseFloat(b.loanAmount || 0) - parseFloat(a.loanAmount || 0);
        case "amount-low":
          return parseFloat(a.loanAmount || 0) - parseFloat(b.loanAmount || 0);
        default:
          return 0;
      }
    });

  // Handle Stripe success redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const loanId = params.get("loanId");

    if (sessionId && loanId) {
      // Step 1: Retrieve checkout session
      axiosSecure
        .get(`/payment-details/${sessionId}`)
        .then(({ data }) => {
          console.log(data);
          const paymentId = data.id;

          // Step 2: Save paymentId in backend
          return axiosSecure.patch(`/apply-loans/${loanId}/pay-fee`, {
            paymentId,
          });
        })
        .then(() => {
          setPaymentMessage("Loan fee paid successfully!");
          setPaymentModalOpen(true);
          refetch();
        })
        .catch((err) => {
          console.error(err);
          setPaymentMessage("Failed to record payment");
          setPaymentModalOpen(true);
        });
    }
  }, [axiosSecure, refetch]);

  const handleDelete = async (loanId) => {
    if (!loanId) return;
    try {
      await axiosSecure.delete(`/apply-loans/${loanId}`);
      setIsCancelOpen(false);
      setSelectedLoan(null);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const openCancelModal = (loan) => {
    setSelectedLoan(loan);
    setIsCancelOpen(true);
  };

  const openViewModal = (loan) => {
    setSelectedLoan(loan);
    setIsViewOpen(true);
  };

  const openPayModal = (loan) => {
    setSelectedLoan(loan);
    setIsPayOpen(true);
  };

  const handleViewPayment = async (paymentId) => {
    if (!paymentId) return;
    setPaymentDetailModalOpen(true);
    setPaymentData(null); // loading state
    try {
      const { data } = await axiosSecure.get(`/payment-details/${paymentId}`);
      setPaymentData(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Loan Applications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your loan applications
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={handleExport}
            disabled={filteredLoans.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by loan title or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Loan Applications ({filteredLoans.length})
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FiFileText className="w-4 h-4" />
              <span>Total: {userLoans.length} applications</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading your loans...</p>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="p-8 text-center">
            <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {userLoans.length === 0
                ? "No Loan Applications"
                : "No Matching Applications"}
            </h3>
            <p className="text-gray-500">
              {userLoans.length === 0
                ? "You haven't applied for any loans yet. Start by browsing our loan options."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full divide-y divide-gray-200 compact-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    ID
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Details
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Amount
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Date
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoans.map((loan) => (
                  <BorrowerLoanDataRow
                    key={loan._id}
                    loan={loan}
                    onView={() => openViewModal(loan)}
                    onCancel={() => openCancelModal(loan)}
                    onPay={() => openPayModal(loan)}
                    onViewPayment={() => handleViewPayment(loan.paymentId)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedLoan && (
        <>
          <DeleteModal
            isOpen={isCancelOpen}
            closeModal={() => setIsCancelOpen(false)}
            refetch={refetch}
            onConfirm={() => handleDelete(selectedLoan._id)}
          />
          <ViewMyLoanModal
            isOpen={isViewOpen}
            closeModal={() => setIsViewOpen(false)}
            loan={selectedLoan}
          />
          <PayModal
            isOpen={isPayOpen}
            closeModal={() => setIsPayOpen(false)}
            loan={selectedLoan}
          />
        </>
      )}

      <PaymentModal
        isOpen={paymentModalOpen}
        message={paymentMessage}
        onClose={() => setPaymentModalOpen(false)}
      />

      <PaymentDetailModal
        isOpen={paymentDetailModalOpen}
        onClose={() => setPaymentDetailModalOpen(false)}
        paymentData={paymentData}
      />
    </div>
  );
};

export default MyLoans;
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search loans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
              <option value="status">Status</option>
            </select>

            {(searchTerm || statusFilter !== "all" || sortBy !== "newest") && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {filteredLoans.length !== userLoans.length && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredLoans.length} of {userLoans.length} loans
          </div>
        )}
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {paginatedLoans.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {userLoans.length === 0 ? "No Loan Applications" : "No Matching Loans"}
            </h3>
            <p className="text-gray-500 mb-4">
              {userLoans.length === 0 
                ? "You haven't applied for any loans yet. Start by browsing available loan options."
                : "Try adjusting your search criteria or filters."
              }
            </p>
            {userLoans.length === 0 && (
              <button
                onClick={() => window.location.href = '/all-loans'}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse Loans
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-3">Loan Details</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Applied Date</div>
                <div className="col-span-2">Payment Status</div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {paginatedLoans.map((loan) => (
                <BorrowerLoanDataRow
                  key={loan._id}
                  loan={loan}
                  onView={() => handleViewLoan(loan)}
                  onCancel={() => handleCancelLoan(loan)}
                  onPay={() => handlePayLoan(loan)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex} to {endIndex} of {totalItems} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevPage}
                      disabled={!hasPrev}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`px-3 py-1 text-sm rounded ${
                              currentPage === pageNum
                                ? 'bg-primary text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={nextPage}
                      disabled={!hasNext}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <DeleteModal
        isOpen={isCancelOpen}
        closeModal={() => setIsCancelOpen(false)}
        loan={selectedLoan}
        refetch={refetch}
      />

      <ViewMyLoanModal
        isOpen={isViewOpen}
        closeModal={() => setIsViewOpen(false)}
        loan={selectedLoan}
      />

      <PayModal
        isOpen={isPayOpen}
        closeModal={() => setIsPayOpen(false)}
        loan={selectedLoan}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        message={paymentMessage}
        onClose={() => setPaymentModalOpen(false)}
      />

      <PaymentDetailModal
        isOpen={paymentDetailModalOpen}
        closeModal={() => setPaymentDetailModalOpen(false)}
        paymentData={paymentData}
      />
    </div>
  );
};

export default React.memo(MyLoans);