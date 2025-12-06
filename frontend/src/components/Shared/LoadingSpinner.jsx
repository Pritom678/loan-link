import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
      <div className="relative w-16 h-16">
        {/* Outer rotating coin */}
        <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>

        {/* Inner coin */}
        <div className="absolute inset-2 rounded-full bg-amber-500 flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-xl">$</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
