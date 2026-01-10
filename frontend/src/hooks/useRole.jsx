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
      try {
        const res = await axiosSecure.get("/user/role");

        // If role is missing or invalid, try to fix it
        if (!res.data?.role) {
          try {
            const fixRes = await axiosSecure.patch(`/user/${user.email}/role`);
            return { role: fixRes.data?.data?.role || "borrower" };
          } catch (fixError) {
            console.error("Failed to fix user role:", fixError);
            return { role: "borrower" };
          }
        }

        return res.data;
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        // Return default role if API fails
        return { role: "borrower" };
      }
    },
    placeholderData: { role: "borrower" }, // Default to borrower
  });

  // Ensure we always return a valid role, defaulting to borrower
  const role = data?.role || "borrower";

  return [role, isLoading];
};

export default useRole;
