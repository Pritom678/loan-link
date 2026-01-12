import { FaPlusCircle, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

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

const ManagerStatistics = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: statsResponse = {}, isLoading } = useQuery({
    queryKey: ["manager-stats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/manager-stats?email=${user.email}`
      );
      return data;
    },
  });

  // Extract stats from API response
  const stats = statsResponse?.data || statsResponse || {};

  if (isLoading)
    return <div className="text-center mt-10">Loading stats...</div>;

  return (
    <div className="container mx-auto px-4 mt-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <StatCard
          title="Loan Products"
          value={stats.totalLoanProducts || 0}
          icon={FaPlusCircle}
          fromColor="from-amber-500"
          toColor="to-amber-400"
        />

        <StatCard
          title="Total Applications"
          value={stats.totalApplications || 0}
          icon={FaCheckCircle}
          fromColor="from-orange-500"
          toColor="to-orange-400"
        />

        <StatCard
          title="Pending Applications"
          value={stats.pendingApplications || 0}
          icon={FaHourglassHalf}
          fromColor="from-yellow-600"
          toColor="to-yellow-500"
        />

        <StatCard
          title="Approved Applications"
          value={stats.approvedApplications || 0}
          icon={FaCheckCircle}
          fromColor="from-amber-600"
          toColor="to-amber-500"
        />

        <StatCard
          title="Total Loan Amount"
          value={`${(stats.totalLoanAmount || 0).toLocaleString()}`}
          icon={FaPlusCircle}
          fromColor="from-orange-600"
          toColor="to-orange-500"
        />

        <StatCard
          title="Avg Interest Rate"
          value={`${(stats.averageInterestRate || 0).toFixed(1)}%`}
          icon={FaHourglassHalf}
          fromColor="from-yellow-700"
          toColor="to-yellow-600"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Application Status Chart
        </h3>
        <div className="space-y-6">
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-around h-48 px-4">
            <div className="flex flex-col items-center flex-1">
              <div
                className="w-12 bg-green-500 rounded-t transition-all duration-500"
                style={{
                  height: `${
                    stats.totalApplications > 0
                      ? ((stats.applicationStatus?.approved || 0) /
                          stats.totalApplications) *
                        150
                      : 10
                  }px`,
                }}
              ></div>
              <span className="text-xs font-medium text-gray-600 mt-2">
                Approved
              </span>
              <span className="text-sm font-bold text-green-600">
                {stats.applicationStatus?.approved || 0}
              </span>
            </div>

            <div className="flex flex-col items-center flex-1">
              <div
                className="w-12 bg-yellow-500 rounded-t transition-all duration-500"
                style={{
                  height: `${
                    stats.totalApplications > 0
                      ? ((stats.applicationStatus?.pending || 0) /
                          stats.totalApplications) *
                        150
                      : 10
                  }px`,
                }}
              ></div>
              <span className="text-xs font-medium text-gray-600 mt-2">
                Pending
              </span>
              <span className="text-sm font-bold text-yellow-600">
                {stats.applicationStatus?.pending || 0}
              </span>
            </div>

            <div className="flex flex-col items-center flex-1">
              <div
                className="w-12 bg-red-500 rounded-t transition-all duration-500"
                style={{
                  height: `${
                    stats.totalApplications > 0
                      ? ((stats.applicationStatus?.rejected || 0) /
                          stats.totalApplications) *
                        150
                      : 10
                  }px`,
                }}
              ></div>
              <span className="text-xs font-medium text-gray-600 mt-2">
                Rejected
              </span>
              <span className="text-sm font-bold text-red-600">
                {stats.applicationStatus?.rejected || 0}
              </span>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-gray-600">Approved</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span className="text-gray-600">Pending</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span className="text-gray-600">Rejected</span>
            </div>
          </div>

          {/* Total Summary */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Total Applications
              </span>
              <span className="text-lg font-bold text-gray-900">
                {stats.totalApplications || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerStatistics;
