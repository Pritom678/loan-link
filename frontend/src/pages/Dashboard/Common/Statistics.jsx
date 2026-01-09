import AdminStatistics from "../../../components/Dashboard/Statistics/AdminStatistics";
import ManagerStatistics from "../../../components/Dashboard/Statistics/ManagerStatistics";
import BorrowerStatistics from "../../../components/Dashboard/Statistics/BorrowerStatistics";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import useRole from "../../../hooks/useRole";
import useAuth from "../../../hooks/useAuth";

const Statistics = () => {
  const [role, isRoleLoading] = useRole();
  const { user } = useAuth();

  if (isRoleLoading) return <LoadingSpinner />;

  const getWelcomeMessage = () => {
    const name = user?.displayName || user?.email?.split("@")[0] || "User";
    const timeOfDay =
      new Date().getHours() < 12
        ? "morning"
        : new Date().getHours() < 18
        ? "afternoon"
        : "evening";
    return `Good ${timeOfDay}, ${name}!`;
  };

  const getRoleDescription = () => {
    switch (role) {
      case "admin":
        return "Manage users, oversee all loan operations, and monitor system performance.";
      case "manager":
        return "Review loan applications, manage loan products, and approve/reject applications.";
      case "borrower":
        return "Apply for loans, track your applications, and manage your loan portfolio.";
      default:
        return "Welcome to your dashboard.";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {getWelcomeMessage()}
            </h2>
            <p className="text-gray-600 mb-4">{getRoleDescription()}</p>
            <div className="flex items-center space-x-4">
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  role === "admin"
                    ? "bg-red-100 text-red-800"
                    : role === "manager"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {role?.charAt(0).toUpperCase() + role?.slice(1)} Dashboard
              </span>
              <span className="text-sm text-gray-500">
                Last login: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              className="h-16 w-16 rounded-full object-cover"
              src={
                user?.photoURL ||
                `https://ui-avatars.com/api/?name=${
                  user?.displayName || "User"
                }&background=9c6c1e&color=fff&size=64`
              }
              alt="Profile"
            />
          </div>
        </div>
      </div>

      {/* Role-specific Statistics */}
      <div>
        {role === "admin" && <AdminStatistics />}
        {role === "manager" && <ManagerStatistics />}
        {role === "borrower" && <BorrowerStatistics />}
      </div>
    </div>
  );
};

export default Statistics;
