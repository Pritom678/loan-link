import Home from "../pages/Home/Home";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import LoanDetails from "../pages/LoanDetails/LoanDetails";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import Profile from "../pages/Dashboard/Common/Profile";
import Statistics from "../pages/Dashboard/Common/Statistics";
import MainLayout from "../layouts/MainLayout";

import MyLoans from "../pages/Dashboard/Customer/MyLoans";
import { createBrowserRouter } from "react-router";
import AddLoan from "../pages/Dashboard/Manager/AddLoan";
import AboutUs from "../pages/AboutUs/AboutUs";
import ContactPage from "../pages/ContactPage/ContactPage";
import AllLoansOptions from "../pages/AllLoans/AllLoansOptions";
import ApplyForm from "../components/Form/ApplyForm";
import ManageLoans from "../pages/Dashboard/Manager/ManageLoans";
import PendingLoan from "../pages/Dashboard/Manager/PendingLoan";
import ApprovedLoan from "../pages/Dashboard/Manager/ApprovedLoan";
import AllLoans from "../pages/Dashboard/Admin/AllLoans";
import LoanApplication from "../pages/Dashboard/Admin/LoanApplication";
import PaymentSuccess from "../pages/Stripe/PaymentSucess";
import PaymentCancel from "../pages/Stripe/PaymentCancel";
import ManagerRoute from "./ManagerRoute";
import AdminRoute from "./AdminRoute";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService/TermsOfService";
import FAQ from "../pages/FAQ/FAQ";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/loans/:id",
        element: (
          <PrivateRoute>
            <LoanDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/all-loans-options",
        element: <AllLoansOptions />,
      },
      {
        path: "/apply-loans/:id",
        element: (
          <PrivateRoute>
            <ApplyForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/faq",
        element: <FAQ />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-of-service",
        element: <TermsOfService />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Statistics />
          </PrivateRoute>
        ),
      },
      {
        path: "add-loan",
        element: (
          <ManagerRoute>
            <PrivateRoute>
              <AddLoan />
            </PrivateRoute>
          </ManagerRoute>
        ),
      },
      {
        path: "pending-loans",
        element: (
          <ManagerRoute>
            <PrivateRoute>
              <PendingLoan />
            </PrivateRoute>
          </ManagerRoute>
        ),
      },
      {
        path: "approved-loans",
        element: (
          <ManagerRoute>
            <PrivateRoute>
              <ApprovedLoan />
            </PrivateRoute>
          </ManagerRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <PrivateRoute>
              <ManageUsers />
            </PrivateRoute>
          </AdminRoute>
        ),
      },
      {
        path: "all-loan",
        element: (
          <AdminRoute>
            <PrivateRoute>
              <AllLoans />
            </PrivateRoute>
          </AdminRoute>
        ),
      },
      {
        path: "all-loan-application",
        element: (
          <PrivateRoute>
            <LoanApplication />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "my-loans",
        element: (
          <PrivateRoute>
            <MyLoans />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-cancel",
        element: <PaymentCancel />,
      },
      {
        path: "manage-loans ",
        element: (
          <ManagerRoute>
            <PrivateRoute>
              <ManageLoans />
            </PrivateRoute>
          </ManagerRoute>
        ),
      },
    ],
  },
]);
