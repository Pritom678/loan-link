import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["role", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/user/role");
      return res.data; // { role: "admin" } or { role: "borrower" }
    },
    placeholderData: { role: null },
  });

  return [data?.role, isLoading];
};

export default useRole;
