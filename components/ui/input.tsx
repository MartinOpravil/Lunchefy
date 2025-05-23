import * as React from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  clearable?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ clearable = false, className, type, ...props }, ref) => {
    const clearInput = () => {
      props.onChange?.({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {clearable && props.value && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="hover:text-foreground !h-6 !w-6 text-text" />
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
