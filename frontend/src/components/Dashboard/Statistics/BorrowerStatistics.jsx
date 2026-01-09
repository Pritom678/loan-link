import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoanStatusChart from "../Charts/LoanStatusChart";

const BorrowerStatistics = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: userLoans = [], isLoading } = useQuery({
    queryKey: ["userLoans", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/apply-loans/user/${user.email}`);
      return res.data;
    },
  });

  if (isLoading)
    return <div className="text-center mt-10">Loading stats...</div>;

  return (
    <div className="space-y-6">
      {/* Loan Status Charts */}
      <LoanStatusChart loans={userLoans} />
    </div>
  );
};

export default BorrowerStatistics;
