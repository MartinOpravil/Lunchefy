import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { AuthButtonProps } from "@/types";
import { cn } from "@/lib/utils";

const LoginButton = ({ title = "Sign in", classList }: AuthButtonProps) => {
  return (
    <Button asChild className={cn("action-button", classList)}>
      <Link href="/sign-in">{title}</Link>
    </Button>
  );
};

export default LoginButton;
