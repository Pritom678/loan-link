import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useApi from "../useApi";

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useApi", () => {
  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useApi());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.execute).toBe("function");
    expect(typeof result.current.reset).toBe("function");
  });

  it("should set loading to true during API call", async () => {
    const { result } = renderHook(() => useApi());
    const mockApiCall = vi.fn(() => Promise.resolve("success"));

    act(() => {
      result.current.execute(mockApiCall);
    });

    expect(result.current.loading).toBe(true);
  });

  it("should handle successful API calls", async () => {
    const { result } = renderHook(() => useApi());
    const mockApiCall = vi.fn(() => Promise.resolve("success"));
    const mockOnSuccess = vi.fn();

    await act(async () => {
      const response = await result.current.execute(mockApiCall, {
        onSuccess: mockOnSuccess,
      });
      expect(response).toBe("success");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockOnSuccess).toHaveBeenCalledWith("success");
  });

  it("should handle API call errors", async () => {
    const { result } = renderHook(() => useApi());
    const mockError = new Error("API Error");
    const mockApiCall = vi.fn(() => Promise.reject(mockError));
    const mockOnError = vi.fn();

    await act(async () => {
      try {
        await result.current.execute(mockApiCall, {
          onError: mockOnError,
        });
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("API Error");
    expect(mockOnError).toHaveBeenCalledWith(mockError);
  });

  it("should reset state correctly", () => {
    const { result } = renderHook(() => useApi());

    // Manually set some state
    act(() => {
      result.current.reset();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
