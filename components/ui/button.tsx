import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-background rounded-lg outline outline-1 outline-accent hover:outline-primary group focus:outline-none",
        minimalistic:
          "bg-background outline outline-1 outline-transparent hover:outline-accent rounded-lg group focus:outline-none",
        negative_minimalistic:
          "bg-background outline outline-1 outline-transparent hover:outline-primary rounded-lg group focus:outline-none",
        positive:
          "bg-secondary text-white-1 rounded-lg group hover:bg-primary focus:outline-none",
        negative:
          "bg-primary text-white-1 rounded-lg group hover:bg-red-500 focus:outline-none",
        editor:
          "bg-background outline outline-1 outline-transparent hover:outline-primary !p-1 !h-fit transition-all focus:outline-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        tabIndex={-1}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
