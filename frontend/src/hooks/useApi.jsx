import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

/**
 * Custom hook for API calls with loading, error, and success states
 */
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const {
      showSuccessToast = false,
      showErrorToast = true,
      successMessage = "Operation completed successfully",
      onSuccess,
      onError,
      onFinally,
    } = options;

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();

      if (showSuccessToast) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err?.message || "An error occurred";
      setError(errorMessage);

      if (showErrorToast) {
        toast.error(errorMessage);
      }

      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      setLoading(false);

      if (onFinally) {
        onFinally();
      }
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    reset,
  };
};

export default useApi;
