"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { AuthButtonProps } from "@/types";
import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const LogoutButton = ({ title = "Log out", classList }: AuthButtonProps) => {
  const router = useRouter();
  const { signOut } = useClerk();

  return (
    <Button
      className={cn("action-button", classList)}
      onClick={() => signOut(() => router.push("/"))}
    >
      {title}
    </Button>
  );
};

export default LogoutButton;
