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
  FiXCircle,
  FiDollarSign,
} from "react-icons/fi";

const LoanStatusChart = ({ loans = [] }) => {
  // Calculate loan statistics
  const getStatistics = () => {
    const stats = {
      total: loans.length,
      pending: loans.filter((loan) => loan.status === "pending").length,
      approved: loans.filter((loan) => loan.status === "approved").length,
      rejected: loans.filter((loan) => loan.status === "rejected").length,
      paid: loans.filter((loan) => loan.paymentId).length,
      totalAmount: loans.reduce(
        (sum, loan) => sum + (parseFloat(loan.amount) || 0),
        0
      ),
      approvedAmount: loans
        .filter((loan) => loan.status === "approved")
        .reduce((sum, loan) => sum + (parseFloat(loan.amount) || 0), 0),
    };
    return stats;
  };

  const stats = getStatistics();

  // Pie chart data
  const pieData = [
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "Approved", value: stats.approved, color: "#10b981" },
    { name: "Rejected", value: stats.rejected, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  // Bar chart data - Monthly loan applications
  const getMonthlyData = () => {
    const monthlyStats = {};
    loans.forEach((loan) => {
      const date = new Date(loan.createdAt || loan.appliedAt || Date.now());
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          month: monthName,
          applications: 0,
          approved: 0,
          amount: 0,
        };
      }

      monthlyStats[monthKey].applications += 1;
      if (loan.status === "approved") {
        monthlyStats[monthKey].approved += 1;
        monthlyStats[monthKey].amount += parseFloat(loan.amount) || 0;
      }
    });

    return Object.values(monthlyStats).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  };

  const monthlyData = getMonthlyData();

  const StatCard = ({ icon: Icon, title, value, subtitle }) => (
    <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loans.length === 0) {
    return (
      <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <FiTrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Loan Data</h3>
        <p className="text-gray-500">
          Apply for your first loan to see statistics here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FiTrendingUp}
          title="Total Applications"
          value={stats.total}
          subtitle="All time"
        />
        <StatCard
          icon={FiClock}
          title="Pending Review"
          value={stats.pending}
          subtitle="Awaiting approval"
        />
        <StatCard
          icon={FiCheckCircle}
          title="Approved Loans"
          value={stats.approved}
          subtitle={`$${stats.approvedAmount.toLocaleString()}`}
        />
        <StatCard
          icon={FiDollarSign}
          title="Total Requested"
          value={`$${stats.totalAmount.toLocaleString()}`}
          subtitle="All applications"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Loan Status Distribution */}
        <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Loan Status Distribution
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data to display
            </div>
          )}
        </div>

        {/* Bar Chart - Monthly Applications */}
        <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Applications
          </h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="applications"
                  fill="#9c6c1e"
                  name="Applications"
                />
                <Bar dataKey="approved" fill="#10b981" name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No monthly data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanStatusChart;
