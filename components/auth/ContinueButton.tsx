import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { AuthButtonProps } from "@/types";
import { cn } from "@/lib/utils";

const ContinueButton = ({ title = "Continue", classList }: AuthButtonProps) => {
  return (
    <Button asChild className={cn("action-button", classList)}>
      <Link href="/app">{title}</Link>
    </Button>
  );
};

export default ContinueButton;
