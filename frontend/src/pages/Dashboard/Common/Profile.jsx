import { useState } from "react";
import {
  FiEdit3,
  FiLogOut,
  FiMail,
  FiUser,
  FiShield,
  FiCalendar,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import EditProfileModal from "../../../components/Modal/EditProfileModal";

const Profile = () => {
  const { user, logOut } = useAuth();
  const [role, isRoleLoading] = useRole();
  const axiosSecure = useAxiosSecure();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSaveProfile = async (profileData) => {
    try {
      // Save profile data to backend
      const response = await axiosSecure.put(`/user/${user.email}`, {
        displayName: profileData.displayName,
        bio: profileData.bio,
        profilePicture: profileData.profilePicture,
      });

      if (response.data.success) {
        // Refetch user info to update the UI
        await refetch();

        // Show success message
        const successDiv = document.createElement("div");
        successDiv.className =
          "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
        successDiv.textContent = "Profile updated successfully!";
        document.body.appendChild(successDiv);

        // Remove after 3 seconds
        setTimeout(() => {
          document.body.removeChild(successDiv);
        }, 3000);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);

      // Show error message
      const errorDiv = document.createElement("div");
      errorDiv.className =
        "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      errorDiv.textContent = "Failed to save profile. Please try again.";
      document.body.appendChild(errorDiv);

      // Remove after 3 seconds
      setTimeout(() => {
        document.body.removeChild(errorDiv);
      }, 3000);

      throw error;
    }
  };

  const {
    data: userInfo = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userInfo", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/user/${user?.email}`);
      return res.data;
    },
  });

  const { data: userLoans = [] } = useQuery({
    queryKey: ["userLoans", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/apply-loans/user/${user.email}`);
      return res.data;
    },
  });

  const getRoleColor = () => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "borrower":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStats = () => {
    // Ensure userLoans is an array and handle empty/undefined cases
    const loans = Array.isArray(userLoans) ? userLoans : [];

    const stats = {
      totalApplied: loans.length,
      approved: loans.filter((loan) => loan?.status === "approved").length,
      pending: loans.filter((loan) => loan?.status === "pending").length,
      rejected: loans.filter((loan) => loan?.status === "rejected").length,
      totalAmount: loans.reduce((sum, loan) => {
        const amount = parseFloat(loan?.loanAmount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0),
    };
    return stats;
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account information and preferences
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => {
              console.log(
                "Edit button clicked! Current modal state:",
                isEditModalOpen
              );
              setIsEditModalOpen(true);
              console.log("Modal state should now be true");
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FiEdit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              {/* Profile Picture */}
              <div className="relative inline-block">
                <img
                  className="h-24 w-24 rounded-full object-cover mx-auto"
                  src={
                    user?.photoURL ||
                    `https://ui-avatars.com/api/?name=${
                      user?.displayName || "User"
                    }&background=9c6c1e&color=fff&size=96`
                  }
                  alt="Profile"
                />
              </div>

              {/* Name and Role */}
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {user?.displayName || "User"}
                </h3>

                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor()}`}
                  >
                    <FiShield className="w-4 h-4 mr-1" />
                    {isRoleLoading
                      ? "Loading..."
                      : role?.charAt(0).toUpperCase() + role?.slice(1)}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <FiMail className="w-4 h-4 mr-2" />
                  {user?.email}
                </div>

                <div className="flex items-center justify-center text-sm text-gray-600">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  Member since{" "}
                  {new Date(user?.metadata?.creationTime).toLocaleDateString()}
                </div>

                {userInfo?.phone && (
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <FiPhone className="w-4 h-4 mr-2" />
                    {userInfo.phone}
                  </div>
                )}

                {userInfo?.address && (
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    {userInfo.address}
                  </div>
                )}
              </div>

              {/* Bio Section */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Bio</h4>
                <p className="text-sm text-gray-600">
                  {userInfo?.bio || "No bio available"}
                </p>
              </div>

              {/* Logout Button */}
              <div className="mt-6">
                <button
                  onClick={logOut}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FiLogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary/10">
                  <FiUser className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Applications
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalApplied}
                  </p>
                </div>
              </div>
            </div>

            <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary/10">
                  <FiUser className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Approved
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.approved}
                  </p>
                </div>
              </div>
            </div>

            <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary/10">
                  <FiUser className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.pending}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User ID
                </label>
                <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded border">
                  {user?.uid}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Verified
                </label>
                <p className="mt-1 text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user?.emailVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user?.emailVerified ? "Verified" : "Not Verified"}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Sign In
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(user?.metadata?.lastSignInTime).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Loan Amount
                </label>
                <p className="mt-1 text-sm text-gray-900 font-semibold">
                  ${(stats.totalAmount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            {userLoans.length > 0 ? (
              <div className="space-y-3">
                {userLoans.slice(0, 3).map((loan) => (
                  <div
                    key={loan._id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {loan.loanTitle}
                      </p>
                      <p className="text-xs text-gray-500">
                        Applied on{" "}
                        {new Date(
                          loan.createdAt || loan.appliedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        loan.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : loan.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        userInfo={userInfo}
      />
    </div>
  );
};

export default Profile;
