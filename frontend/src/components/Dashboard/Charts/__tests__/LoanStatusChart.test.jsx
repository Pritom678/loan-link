import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, mockLoans } from "../../../../test/utils";
import LoanStatusChart from "../LoanStatusChart";

describe("LoanStatusChart", () => {
  it("renders statistics cards correctly", () => {
    renderWithProviders(<LoanStatusChart loans={mockLoans} />);

    expect(screen.getByText("Total Applications")).toBeInTheDocument();
    expect(screen.getByText("Pending Review")).toBeInTheDocument();
    expect(screen.getByText("Approved Loans")).toBeInTheDocument();
    expect(screen.getByText("Total Amount")).toBeInTheDocument();
  });

  it("displays correct statistics values", () => {
    renderWithProviders(<LoanStatusChart loans={mockLoans} />);

    expect(screen.getByText("3")).toBeInTheDocument(); // Total applications
    expect(screen.getByText("1")).toBeInTheDocument(); // Pending count
    expect(screen.getByText("$22,500")).toBeInTheDocument(); // Total amount
  });

  it("renders charts when data is available", () => {
    renderWithProviders(<LoanStatusChart loans={mockLoans} />);

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("shows empty state when no loans provided", () => {
    renderWithProviders(<LoanStatusChart loans={[]} />);

    expect(screen.getByText("No Loan Data")).toBeInTheDocument();
    expect(
      screen.getByText("Start by applying for loans to see statistics here.")
    ).toBeInTheDocument();
  });

  it("handles undefined loans gracefully", () => {
    renderWithProviders(<LoanStatusChart />);

    expect(screen.getByText("No Loan Data")).toBeInTheDocument();
  });

  it("calculates percentages correctly", () => {
    renderWithProviders(<LoanStatusChart loans={mockLoans} />);

    // Should show approval rate (1 approved out of 3 total = 33.3%)
    expect(screen.getByText("33.3%")).toBeInTheDocument();
  });

  it("formats currency correctly", () => {
    renderWithProviders(<LoanStatusChart loans={mockLoans} />);

    // Should format large numbers with commas
    expect(screen.getByText("$22,500")).toBeInTheDocument();
  });
});
