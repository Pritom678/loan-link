import { Link, useLocation, useParams } from "react-router";
import { FiHome, FiChevronRight } from "react-icons/fi";
import Container from "../Container";

const Breadcrumb = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const params = useParams();

  // Generate breadcrumbs based on hierarchy
  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    // Don't show breadcrumbs on home page
    if (location.pathname === "/") {
      return [];
    }

    const breadcrumbs = [];
    const currentPath = location.pathname;

    // Define specific breadcrumb patterns
    if (currentPath === "/all-loans-options") {
      breadcrumbs.push(
        { name: "Home", path: "/", icon: <FiHome className="w-4 h-4" /> },
        { name: "All Loans", path: "/all-loans-options", isLast: true }
      );
    } else if (currentPath.startsWith("/loans/") && params.id) {
      breadcrumbs.push(
        { name: "Home", path: "/", icon: <FiHome className="w-4 h-4" /> },
        { name: "All Loans", path: "/all-loans-options" },
        { name: "Loan Details", path: `/loans/${params.id}`, isLast: true }
      );
    } else if (currentPath.startsWith("/apply-loans/") && params.id) {
      breadcrumbs.push(
        { name: "Home", path: "/", icon: <FiHome className="w-4 h-4" /> },
        { name: "All Loans", path: "/all-loans-options" },
        { name: "Loan Details", path: `/loans/${params.id}` },
        {
          name: "Apply for Loan",
          path: `/apply-loans/${params.id}`,
          isLast: true,
        }
      );
    } else if (currentPath === "/about") {
      breadcrumbs.push(
        { name: "Home", path: "/", icon: <FiHome className="w-4 h-4" /> },
        { name: "About Us", path: "/about", isLast: true }
      );
    } else if (currentPath === "/contact") {
      breadcrumbs.push(
        { name: "Home", path: "/", icon: <FiHome className="w-4 h-4" /> },
        { name: "Contact", path: "/contact", isLast: true }
      );
    } else if (currentPath === "/faq") {
      breadcrumbs.push(
        { name: "Home", path: "/", icon: <FiHome className="w-4 h-4" /> },
        { name: "FAQ", path: "/faq", isLast: true }
      );
    } else if (currentPath === "/privacy-policy") {
      breadcrumbs.push(
        { name: "Home", path: "/", icon: <FiHome className="w-4 h-4" /> },
        { name: "Privacy Policy", path: "/privacy-policy", isLast: true }
      );
    } else if (currentPath === "/terms-of-service") {
      breadcrumbs.push(
        { name: "Home", path: "/", icon: <FiHome className="w-4 h-4" /> },
        { name: "Terms of Service", path: "/terms-of-service", isLast: true }
      );
    }
    // Dashboard routes
    else if (currentPath === "/dashboard") {
      breadcrumbs.push(
        { name: "Home", path: "/", icon: <FiHome className="w-4 h-4" /> },
        { name: "Dashboard", path: "/dashboard", isLast: true }
      );
    } else if (currentPath.startsWith("/dashboard/")) {
      const dashboardRoutes = {
        "/dashboard/profile": "Profile",
        "/dashboard/my-loans": "My Loans",
        "/dashboard/add-loan": "Add Loan",
        "/dashboard/manage-loans": "Manage Loans",
        "/dashboard/pending-loans": "Pending Loans",
        "/dashboard/approved-loans": "Approved Loans",
        "/dashboard/manage-users": "Manage Users",
        "/dashboard/all-loan": "All Loans",
        "/dashboard/all-loan-application": "Loan Applications",
        "/dashboard/payment-success": "Payment Success",
        "/dashboard/payment-cancel": "Payment Cancelled",
      };

      const routeName = dashboardRoutes[currentPath] || "Dashboard Page";
      breadcrumbs.push(
        { name: "Home", path: "/", icon: <FiHome className="w-4 h-4" /> },
        { name: "Dashboard", path: "/dashboard" },
        { name: routeName, path: currentPath, isLast: true }
      );
    } else {
      // Fallback for other routes
      breadcrumbs.push(
        { name: "Home", path: "/", icon: <FiHome className="w-4 h-4" /> },
        { name: "Page", path: currentPath, isLast: true }
      );
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render if no breadcrumbs or only home
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <div className="bg-base-200 breadcrumb-bg py-3 border-b border-gray-200">
      <Container>
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <FiChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              )}

              {breadcrumb.isLast ? (
                <span className="flex items-center gap-1 text-primary font-medium breadcrumb-current">
                  {breadcrumb.icon}
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors breadcrumb-link"
                >
                  {breadcrumb.icon}
                  {breadcrumb.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </Container>
    </div>
  );
};

export default Breadcrumb;
