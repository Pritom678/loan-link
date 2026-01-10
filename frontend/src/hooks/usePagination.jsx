import { useState, useMemo } from "react";

/**
 * Custom hook for pagination logic
 */
const usePagination = (data = [], itemsPerPage = 20) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationInfo = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    return {
      currentItems,
      currentPage,
      totalPages,
      totalItems,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems),
    };
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (paginationInfo.hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (paginationInfo.hasPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const reset = () => {
    setCurrentPage(1);
  };

  return {
    ...paginationInfo,
    goToPage,
    nextPage,
    prevPage,
    reset,
    setCurrentPage,
  };
};

export default usePagination;
