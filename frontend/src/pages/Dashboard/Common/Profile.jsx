import { FaEdit, FaSignOutAlt } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import coverImg from "../../../assets/images/cover.jpg";

const Profile = () => {
  const { user, logOut } = useAuth();
  const [role, isRoleLoading] = useRole();
  console.log(role);
  const axiosSecure = useAxiosSecure();

  const { data: userInfo = {} } = useQuery({
    queryKey: ["userInfo", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/user/${user?.email}`);
      return res.data;
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200 px-4">
      <div className="bg-white/90 shadow-xl rounded-2xl overflow-hidden w-full max-w-3xl">
        {/* Header Cover */}
        <div className="relative">
          <img src={coverImg} alt="cover" className="w-full h-48 object-cover" />
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <img
              src={user?.photoURL}
              alt="profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>
        </div>

        <div className="pt-16 pb-6 px-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {user?.displayName || "Unknown"}
          </h2>
          <p className="text-sm text-gray-500">{user?.email}</p>

          {/* Role Badge */}
          <div className="mt-2 inline-block bg-primary/20 text-primary px-4 py-1 rounded-full text-xs font-semibold">
            {isRoleLoading ? "Loading..." : role}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-base-100 py-3 rounded-lg shadow-sm">
              <p className="text-lg font-bold text-primary">
                {userInfo?.totalApplied || 0}
              </p>
              <p className="text-xs text-gray-500">Loans Applied</p>
            </div>
            <div className="bg-base-100 py-3 rounded-lg shadow-sm">
              <p className="text-lg font-bold text-green-600">
                {userInfo?.totalApproved || 0}
              </p>
              <p className="text-xs text-gray-500">Approved Loans</p>
            </div>
            <div className="bg-base-100 py-3 rounded-lg shadow-sm">
              <p className="text-lg font-bold text-yellow-600">
                {userInfo?.totalPending || 0}
              </p>
              <p className="text-xs text-gray-500">Pending Loans</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-center mt-6">
            <button className="btn btn-primary btn-sm gap-2">
              <FaEdit /> Edit Profile
            </button>
            <button className="btn btn-secondary btn-sm gap-2" onClick={logOut}>
              <FaSignOutAlt /> Log Out
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">User ID: {user?.uid}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
