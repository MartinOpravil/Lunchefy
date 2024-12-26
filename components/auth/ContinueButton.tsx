import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { AuthButtonProps } from "@/types";
import { cn } from "@/lib/utils";
import { ButtonVariant } from "@/enums";

const ContinueButton = ({ title = "Continue", classList }: AuthButtonProps) => {
  return (
    <Button
      asChild
      className={cn("action-button", classList)}
      variant={ButtonVariant.Positive}
    >
      <Link href="/app" className="uppercase">
        {title}
      </Link>
    </Button>
  );
};

export default ContinueButton;
