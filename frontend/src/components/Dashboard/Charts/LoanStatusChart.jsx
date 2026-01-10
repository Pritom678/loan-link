import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
} from "react-icons/fi";

const StatCard = ({ icon: IconComponent, title, value, subtitle }) => (
  <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-primary/10">
        {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value || 0}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const LoanStatusChart = ({ loans = [] }) => {
  // Memoize expensive calculations
  const statistics = useMemo(() => {
    const safeLoans = Array.isArray(loans) ? loans : [];

    const stats = {
      total: safeLoans.length,
      pending: safeLoans.filter((loan) => loan.status === "pending").length,
      approved: safeLoans.filter((loan) => loan.status === "approved").length,
      rejected: safeLoans.filter((loan) => loan.status === "rejected").length,
      paid: safeLoans.filter((loan) => loan.paymentId).length,
      totalAmount: safeLoans.reduce((sum, loan) => {
        const amount = parseFloat(loan.amount || loan.loanAmount || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0),
      approvedAmount: safeLoans
        .filter((loan) => loan.status === "approved")
        .reduce((sum, loan) => {
          const amount = parseFloat(loan.amount || loan.loanAmount || 0);
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0),
    };

    return stats;
  }, [loans]);

  // Memoize chart data
  const chartData = useMemo(() => {
    const pieData = [
      { name: "Pending", value: statistics.pending, color: "#f59e0b" },
      { name: "Approved", value: statistics.approved, color: "#ea580c" },
      { name: "Rejected", value: statistics.rejected, color: "#d97706" },
    ].filter((item) => item.value > 0);

    const monthlyData = [
      { month: "Jan", applications: 12, approved: 8, rejected: 2, pending: 2 },
      { month: "Feb", applications: 15, approved: 10, rejected: 3, pending: 2 },
      { month: "Mar", applications: 18, approved: 12, rejected: 4, pending: 2 },
      { month: "Apr", applications: 22, approved: 15, rejected: 5, pending: 2 },
      { month: "May", applications: 25, approved: 18, rejected: 4, pending: 3 },
      { month: "Jun", applications: 20, approved: 14, rejected: 3, pending: 3 },
    ];

    return { pieData, monthlyData };
  }, [statistics]);

  const formatCurrency = (amount) => {
    const safeAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(safeAmount);
  };

  const formatPercentage = (value, total) => {
    if (!total || total === 0) return "0%";
    const safeValue = parseFloat(value) || 0;
    const safeTotal = parseFloat(total) || 1;
    return `${((safeValue / safeTotal) * 100).toFixed(1)}%`;
  };

  const safeToLocaleString = (value) => {
    const safeValue = parseFloat(value) || 0;
    return safeValue.toLocaleString();
  };

  if (statistics.total === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <FiTrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Loan Data
          </h3>
          <p className="text-gray-500">
            Start by applying for loans to see statistics here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiTrendingUp}
          title="Total Applications"
          value={safeToLocaleString(statistics.total)}
          subtitle={`${formatPercentage(
            statistics.approved,
            statistics.total
          )} approved`}
        />
        <StatCard
          icon={FiClock}
          title="Pending Review"
          value={safeToLocaleString(statistics.pending)}
          subtitle={`${formatPercentage(
            statistics.pending,
            statistics.total
          )} of total`}
        />
        <StatCard
          icon={FiCheckCircle}
          title="Approved Loans"
          value={safeToLocaleString(statistics.approved)}
          subtitle={`${formatPercentage(
            statistics.approved,
            statistics.total
          )} success rate`}
        />
        <StatCard
          icon={FiDollarSign}
          title="Total Amount"
          value={formatCurrency(statistics.totalAmount)}
          subtitle={`${formatCurrency(statistics.approvedAmount)} approved`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Loan Status Distribution
          </h3>
          {chartData.pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#f59e0b"
                  dataKey="value"
                >
                  {chartData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Applications"]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No data to display
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Application Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="applications"
                fill="#9c6c1e"
                name="Total Applications"
              />
              <Bar dataKey="approved" fill="#ea580c" name="Approved" />
              <Bar dataKey="rejected" fill="#d97706" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Section */}
      <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">
              {formatPercentage(statistics.approved, statistics.total)}
            </div>
            <div className="text-sm text-green-700">Approval Rate</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {formatPercentage(statistics.pending, statistics.total)}
            </div>
            <div className="text-sm text-yellow-700">Pending Review</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(
                statistics.total > 0
                  ? statistics.totalAmount / statistics.total
                  : 0
              )}
            </div>
            <div className="text-sm text-blue-700">Average Amount</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LoanStatusChart);
