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
        element: <LoanDetails />,
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
        element: <ApplyForm />,
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
          <PrivateRoute>
            <AddLoan />
          </PrivateRoute>
        ),
      },
      {
        path: "pending-loans",
        element: (
          <PrivateRoute>
            <PendingLoan />
          </PrivateRoute>
        ),
      },
      {
        path: "approved-loans",
        element: (
          <PrivateRoute>
            <ApprovedLoan />
          </PrivateRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <PrivateRoute>
            <ManageUsers />
          </PrivateRoute>
        ),
      },
      {
        path: "all-loan",
        element: (
          <PrivateRoute>
            <AllLoans />
          </PrivateRoute>
        ),
      },
      {
        path: "all-loan-application",
        element: (
          <PrivateRoute>
            <LoanApplication/>
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
        path: "manage-loans ",
        element: <ManageLoans />,
      },
    ],
  },
]);
