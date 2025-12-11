import AdminStatistics from "../../../components/Dashboard/Statistics/AdminStatistics";
import ManagerStatistics from "../../../components/Dashboard/Statistics/ManagerStatistics";
import BorrowerStatistics from "../../../components/Dashboard/Statistics/BorrowerStatistics";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import useRole from "../../../hooks/useRole";
const Statistics = () => {
  const [role, isRoleLoading] = useRole();

  if (isRoleLoading) return <LoadingSpinner />;

  return (
    <div>
      {role === "admin" && <AdminStatistics />}
      {role === "manager" && <ManagerStatistics />}
      {role === "borrower" && <BorrowerStatistics />}
    </div>
  );
};

export default Statistics;
