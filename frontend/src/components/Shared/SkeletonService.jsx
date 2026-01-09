const SkeletonService = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse flex flex-col h-full">
      {/* Top Color Bar Skeleton */}
      <div className="h-2 bg-gray-300"></div>

      {/* Content Skeleton */}
      <div className="p-6 flex flex-col grow">
        {/* Icon and Title Skeleton */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gray-300 rounded-lg mr-4"></div>
          <div className="h-6 bg-gray-300 rounded w-32"></div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4 grow">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>

        {/* Features List Skeleton */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
            <div className="h-3 bg-gray-300 rounded w-28"></div>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="mt-auto">
          <div className="h-12 bg-gray-300 rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonService;
