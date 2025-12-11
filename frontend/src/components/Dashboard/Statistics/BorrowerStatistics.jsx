import { FaFileAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const StatCard = ({ title, value, icon: Icon, fromColor, toColor }) => (
  <div className="flex items-center bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
    <div
      className={`flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-tr ${fromColor} ${toColor} text-white mr-4 shadow-lg`}
    >
      <Icon className="w-8 h-8" />
    </div>

    <div className="flex flex-col">
      <span className="text-gray-500 text-sm uppercase tracking-wide">{title}</span>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
    </div>
  </div>
);

const BorrowerStatistics = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["borrower-stats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/borrower-stats?email=${user.email}`);
      return data;
    },
  });

  if (isLoading) return <div className="text-center mt-10">Loading stats...</div>;

  return (
    <div className="container mx-auto px-4 mt-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <StatCard
          title="Total Loans Applied"
          value={stats.totalApplied || 0}
          icon={FaFileAlt}
          fromColor="from-blue-500"
          toColor="to-blue-400"
        />

        <StatCard
          title="Approved Loans"
          value={stats.approved || 0}
          icon={FaCheckCircle}
          fromColor="from-green-500"
          toColor="to-green-400"
        />

        <StatCard
          title="Rejected Loans"
          value={stats.rejected || 0}
          icon={FaTimesCircle}
          fromColor="from-red-500"
          toColor="to-red-400"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Loan Status Over Time
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </div>
    </div>
  );
};

export default BorrowerStatistics;
