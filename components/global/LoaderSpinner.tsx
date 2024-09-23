import { cn } from "@/lib/utils";
import { Loader, LoaderCircle } from "lucide-react";
import React from "react";

interface LoaderSpinnerProps {
  size?: number;
  classList?: string;
}

const LoaderSpinner = ({ size = 30, classList }: LoaderSpinnerProps) => {
  return (
    <div className="flex-center">
      <LoaderCircle
        className={cn("animate-spin text-white", classList)}
        size={size}
      />
    </div>
  );
};

export default LoaderSpinner;
