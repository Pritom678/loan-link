import React from "react";

const SkeletonLoader = ({
  type = "card",
  count = 1,
  className = "",
  height = "h-4",
  width = "w-full",
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
          >
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        );

      case "table":
        return (
          <div
            className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
          >
            <div className="animate-pulse">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex space-x-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-4 bg-gray-200 rounded flex-1"
                    ></div>
                  ))}
                </div>
              </div>
              {/* Table Rows */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 border-b border-gray-100">
                  <div className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div
                        key={j}
                        className="h-3 bg-gray-200 rounded flex-1"
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "chart":
        return (
          <div
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
          >
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        );

      case "stats":
        return (
          <div
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
          >
            <div className="animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="ml-4 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case "text":
        return (
          <div className={`animate-pulse ${className}`}>
            <div className={`bg-gray-200 rounded ${height} ${width}`}></div>
          </div>
        );

      case "avatar":
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
        );

      case "button":
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
          </div>
        );

      default:
        return (
          <div className={`animate-pulse ${className}`}>
            <div className={`bg-gray-200 rounded ${height} ${width}`}></div>
          </div>
        );
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

// Specific skeleton components for common use cases
export const CardSkeleton = ({ count = 1, className = "" }) => (
  <SkeletonLoader type="card" count={count} className={className} />
);

export const TableSkeleton = ({ className = "" }) => (
  <SkeletonLoader type="table" className={className} />
);

export const ChartSkeleton = ({ className = "" }) => (
  <SkeletonLoader type="chart" className={className} />
);

export const StatsSkeleton = ({ count = 4, className = "" }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonLoader key={index} type="stats" className={className} />
    ))}
  </div>
);

export const TextSkeleton = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonLoader
        key={index}
        type="text"
        width={index === lines - 1 ? "w-3/4" : "w-full"}
      />
    ))}
  </div>
);

export default SkeletonLoader;
