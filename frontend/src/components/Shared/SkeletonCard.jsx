const SkeletonCard = () => {
  return (
    <div className="bg-white loan-card shadow-md rounded-xl overflow-hidden border border-gray-200 my-5 animate-pulse">
      {/* Top Color Bar Skeleton */}
      <div className="h-1 bg-gray-300"></div>

      {/* Image Skeleton */}
      <div className="h-40 bg-gray-300"></div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>

        {/* Category Skeleton */}
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>

        {/* Interest Skeleton */}
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>

        {/* Limit Skeleton */}
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>

        {/* Button Skeleton */}
        <div className="h-10 bg-gray-300 rounded w-full mt-3"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
