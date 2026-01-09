import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import BorrowerLoanDataRow from "../../../components/Dashboard/TableRows/BorrowerLoanDataRow";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import DeleteModal from "../../../components/Modal/DeleteModal";
import ViewMyLoanModal from "../../../components/Modal/ViewMyLoanModal";
import PayModal from "../../../components/Modal/PayModal";
import PaymentModal from "../../../components/Modal/PaymentModal";
import PaymentDetailModal from "../../../components/Modal/PaymentDetailModal";
import {
  FiFileText,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiSearch,
  FiCalendar,
} from "react-icons/fi";

const MyLoans = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

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

  const {
    data: userLoans = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["userLoans", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/apply-loans/user/${user.email}`);
      return res.data;
    },
  });

  // Handle export functionality
  const handleExport = () => {
    if (filteredLoans.length === 0) {
      alert("No loan data to export");
      return;
    }

    // Create CSV content
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
          loan.loanId,
          `"${loan.loanTitle}"`,
          loan.loanAmount,
          loan.interestRate,
          loan.loanTerm,
          loan.status,
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
