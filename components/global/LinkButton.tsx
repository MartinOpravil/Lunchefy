"use client";
import { LinkButtonProps } from "@/types";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import IconImage from "./IconImage";
import LoaderSpinner from "./LoaderSpinner";

const LinkButton = ({ title, href, icon, classList }: LinkButtonProps) => {
  const [isRouting, setIsRouting] = useState(false);
  return (
    <Button
      asChild
      className={cn("action-button", classList)}
      onClick={() => setIsRouting(true)}
    >
      <Link href={href}>
        {isRouting ? (
          <LoaderSpinner size={15} />
        ) : (
          <>
            {icon && <IconImage name={icon} />} {title}
          </>
        )}
      </Link>
    </Button>
  );
};

export default LinkButton;
