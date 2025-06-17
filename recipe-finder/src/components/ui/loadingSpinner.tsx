import { Loader2 } from "lucide-react";
import React from "react";

const LoadingSpinner: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
    </div>
  );
};

export default LoadingSpinner;
