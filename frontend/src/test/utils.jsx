import React from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";

// Create a custom render function that includes providers
export function renderWithProviders(ui, options = {}) {
  const {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    }),
    ...renderOptions
  } = options;

  function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock user data
export const mockUser = {
  uid: "test-uid",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: "https://example.com/photo.jpg",
  emailVerified: true,
  metadata: {
    creationTime: "2023-01-01T00:00:00.000Z",
    lastSignInTime: "2023-01-01T00:00:00.000Z",
  },
};

// Mock loan data
export const mockLoan = {
  _id: "test-loan-id",
  loanId: "LOAN-001",
  loanTitle: "Personal Loan",
  loanAmount: 5000,
  interestRate: "5.5%",
  loanTerm: "12 months",
  status: "Pending",
  applicationStatus: "Unpaid",
  userEmail: "test@example.com",
  date: "2023-01-01T00:00:00.000Z",
  firstName: "John",
  lastName: "Doe",
  contactNumber: "+1234567890",
  monthlyIncome: 3000,
  reasonForLoan: "Home improvement",
};

// Mock loans array
export const mockLoans = [
  mockLoan,
  {
    ...mockLoan,
    _id: "test-loan-id-2",
    loanId: "LOAN-002",
    loanTitle: "Business Loan",
    loanAmount: 10000,
    status: "Approved",
    applicationStatus: "Paid",
  },
  {
    ...mockLoan,
    _id: "test-loan-id-3",
    loanId: "LOAN-003",
    loanTitle: "Education Loan",
    loanAmount: 7500,
    status: "Rejected",
    applicationStatus: "Unpaid",
  },
];

export * from "@testing-library/react";
