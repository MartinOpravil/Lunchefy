import { cn } from "@/lib/utils";
import { Loader, LoaderCircle } from "lucide-react";
import React from "react";

interface LoaderSpinnerProps {
  size?: number;
  classList?: string;
}

const LoaderSpinner = ({ size = 30, classList }: LoaderSpinnerProps) => {
  return (
    <div className="absolute flex-center bg-inherit w-full h-full rounded-md pointer-events-none z-10">
      <LoaderCircle
        className={cn("animate-spin text-white", classList)}
        size={size}
      />
    </div>
  );
};

export default LoaderSpinner;
