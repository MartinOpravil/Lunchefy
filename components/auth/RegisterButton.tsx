import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { AuthButtonProps } from "@/types";
import { cn } from "@/lib/utils";

const RegisterButton = ({ title = "Sign up", classList }: AuthButtonProps) => {
  return (
    <Button asChild className={cn("action-button", classList)}>
      <Link href="/sign-up">{title}</Link>
    </Button>
  );
};

export default RegisterButton;
