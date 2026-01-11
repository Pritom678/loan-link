import {
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const StatCard = ({ title, value, icon: Icon, fromColor, toColor }) => (
  <div className="flex items-center bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
    <div
      className={`flex items-center justify-center w-16 h-16 rounded-xl bg-linear-to-tr ${fromColor} ${toColor} text-white mr-4 shadow-lg`}
    >
      <Icon className="w-8 h-8" />
    </div>
    <div className="flex flex-col">
      <span className="text-gray-500 text-sm uppercase tracking-wide">
        {title}
      </span>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
    </div>
  </div>
);

const AdminStatistics = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/admin-stats");
      return data;
    },
  });

  // Generate chart data from real statistics
  const loanTrendsData = [
    {
      month: "Current",
      applications: stats.totalLoans || 0,
      approved: stats.approvedLoans || 0,
      rejected: stats.rejectedLoans || 0,
      pending: stats.pendingLoans || 0,
    },
  ];

  const loanStatusData = [
    { name: "Approved", value: stats.approvedLoans || 0, color: "#10B981" },
    { name: "Pending", value: stats.pendingLoans || 0, color: "#F59E0B" },
    { name: "Rejected", value: stats.rejectedLoans || 0, color: "#EF4444" },
    { name: "Paid", value: stats.paidLoans || 0, color: "#8B5CF6" },
  ];

  const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  if (isLoading) {
    return <div className="text-center mt-20">Loading statistics...</div>;
  }

  return (
    <div className="container mx-auto px-4 mt-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-12">
        <StatCard
          title="Total Applications"
          value={stats.totalLoans || 0}
          icon={FaFileAlt}
          fromColor="from-amber-500"
          toColor="to-amber-400"
        />

        <StatCard
          title="Approved"
          value={stats.approvedLoans || 0}
          icon={FaCheckCircle}
          fromColor="from-green-500"
          toColor="to-green-400"
        />

        <StatCard
          title="Pending"
          value={stats.pendingLoans || 0}
          icon={FaFileAlt}
          fromColor="from-yellow-500"
          toColor="to-yellow-400"
        />

        <StatCard
          title="Rejected"
          value={stats.rejectedLoans || 0}
          icon={FaTimesCircle}
          fromColor="from-red-500"
          toColor="to-red-400"
        />

        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon={FaUsers}
          fromColor="from-blue-500"
          toColor="to-blue-400"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-12">
        {/* Loan Applications Trend Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Loan Applications Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={loanTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#9c6c1e"
                strokeWidth={3}
                name="Total Applications"
              />
              <Line
                type="monotone"
                dataKey="approved"
                stroke="#10B981"
                strokeWidth={2}
                name="Approved"
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Pending"
              />
              <Line
                type="monotone"
                dataKey="rejected"
                stroke="#EF4444"
                strokeWidth={2}
                name="Rejected"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Loan Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Loan Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={loanStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {loanStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Performance Bar Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-12">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Monthly Loan Performance
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={loanTrendsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="applications"
              fill="#9c6c1e"
              name="Total Applications"
            />
            <Bar dataKey="approved" fill="#10B981" name="Approved" />
            <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
            <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminStatistics;
