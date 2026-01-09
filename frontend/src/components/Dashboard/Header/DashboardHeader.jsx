import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import Breadcrumb from "../../Shared/Breadcrumb/Breadcrumb";

const DashboardHeader = ({ setSidebarOpen }) => {
  const { user, logOut } = useAuth();
  const [role] = useRole();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      "/dashboard": "Dashboard Overview",
      "/dashboard/profile": "Profile Settings",
      "/dashboard/my-loans": "My Loans",
      "/dashboard/add-loan": "Add New Loan",
      "/dashboard/manage-loans": "Manage Loans",
      "/dashboard/pending-loans": "Pending Applications",
      "/dashboard/approved-loans": "Approved Loans",
      "/dashboard/manage-users": "User Management",
      "/dashboard/all-loan": "All Loans",
      "/dashboard/all-loan-application": "Loan Applications",
    };
    return titles[path] || "Dashboard";
  };

  const getRoleColor = () => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "borrower":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 dashboard-header">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Main Header */}
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Menu & Title */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back, {user?.displayName || user?.email?.split("@")[0]}
              </p>
            </div>
          </div>

          {/* Right Side - Search, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
              <FiBell className="w-6 h-6" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="flex items-center space-x-3">
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={
                      user?.photoURL ||
                      `https://ui-avatars.com/api/?name=${
                        user?.displayName || "User"
                      }&background=9c6c1e&color=fff`
                    }
                    alt="Profile"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.displayName || "User"}
                    </p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor()}`}
                    >
                      {role?.charAt(0).toUpperCase() + role?.slice(1)}
                    </span>
                  </div>
                  <FiChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiUser className="w-4 h-4 mr-3" />
                    Profile Settings
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiSettings className="w-4 h-4 mr-3" />
                    Account Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logOut();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    <FiLogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
