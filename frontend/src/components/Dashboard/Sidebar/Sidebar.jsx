import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  FiX,
  FiHome,
  FiBarChart,
  FiUsers,
  FiCreditCard,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import Logo from "../../Shared/Logo";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const [role] = useRole();
  const location = useLocation();

  // Navigation items based on role
  const getNavigationItems = () => {
    const commonItems = [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: FiBarChart,
        description: "Overview & Analytics",
      },
    ];

    const roleBasedItems = {
      borrower: [
        {
          name: "My Loans",
          href: "/dashboard/my-loans",
          icon: FiCreditCard,
          description: "View your loan applications",
        },
      ],
      manager: [
        {
          name: "Add Loan",
          href: "/dashboard/add-loan",
          icon: FiPlus,
          description: "Create new loan products",
        },
        {
          name: "Manage Loans",
          href: "/dashboard/manage-loans",
          icon: FiFileText,
          description: "Edit loan products",
        },
        {
          name: "Pending Applications",
          href: "/dashboard/pending-loans",
          icon: FiClock,
          description: "Review pending loans",
        },
        {
          name: "Approved Loans",
          href: "/dashboard/approved-loans",
          icon: FiCheckCircle,
          description: "View approved applications",
        },
      ],
      admin: [
        {
          name: "User Management",
          href: "/dashboard/manage-users",
          icon: FiUsers,
          description: "Manage system users",
        },
        {
          name: "All Loans",
          href: "/dashboard/all-loan",
          icon: FiFileText,
          description: "View all loan products",
        },
        {
          name: "Loan Applications",
          href: "/dashboard/all-loan-application",
          icon: FiCreditCard,
          description: "All loan applications",
        },
      ],
    };

    return [...commonItems, ...(roleBasedItems[role] || [])];
  };

  const navigationItems = getNavigationItems();

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200 sidebar-desktop">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <Logo />
          </div>

          {/* Navigation */}
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`flex-shrink-0 w-5 h-5 mr-3 ${
                      isActive(item.href) ? "text-white" : "text-gray-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div
                      className={`text-xs ${
                        isActive(item.href) ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Secondary Navigation */}
            <div className="space-y-1">
              <Link
                to="/dashboard/profile"
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive("/dashboard/profile")
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <FiUser
                  className={`flex-shrink-0 w-5 h-5 mr-3 ${
                    isActive("/dashboard/profile")
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                />
                <div className="flex-1">
                  <div className="font-medium">Profile</div>
                  <div
                    className={`text-xs ${
                      isActive("/dashboard/profile")
                        ? "text-white/80"
                        : "text-gray-500"
                    }`}
                  >
                    Account settings
                  </div>
                </div>
              </Link>

              <Link
                to="/"
                className="group flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              >
                <FiHome className="flex-shrink-0 w-5 h-5 mr-3 text-gray-500" />
                <div className="flex-1">
                  <div className="font-medium">Back to Website</div>
                  <div className="text-xs text-gray-500">
                    Return to main site
                  </div>
                </div>
              </Link>
            </div>
          </nav>

          {/* User Info */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <img
                className="inline-block h-10 w-10 rounded-full"
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${
                    user?.displayName || "User"
                  }&background=9c6c1e&color=fff`
                }
                alt="User avatar"
              />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.displayName || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 flex z-50 ${
          sidebarOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close Button */}
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <FiX className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Mobile Sidebar Content */}
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 mb-8">
              <Logo />
            </div>

            <nav className="mt-5 px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${
                    isActive(item.href)
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="flex-shrink-0 w-5 h-5 mr-3" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile User Info */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <img
                className="inline-block h-10 w-10 rounded-full"
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${
                    user?.displayName || "User"
                  }&background=9c6c1e&color=fff`
                }
                alt="User avatar"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.displayName || "User"}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
