import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoaderSpinnerProps {
  size?: number;
  classList?: string;
}

const LoaderSpinner = ({ size = 100, classList }: LoaderSpinnerProps) => {
  return (
    <div className="flex-center pointer-events-none absolute z-10 h-full w-full rounded-md bg-inherit">
      <LoaderCircle
        className={cn("text-white animate-spin", classList)}
        size={size}
      />
    </div>
  );
};

export default LoaderSpinner;
