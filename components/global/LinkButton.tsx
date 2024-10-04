"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import IconImage from "./IconImage";
import LoaderSpinner from "./LoaderSpinner";
import { ClassListProp } from "@/types";
import { ButtonVariant } from "@/enums";

interface LinkButtonBaseProps extends ClassListProp {
  title?: string;
  href: string;
  variant?: ButtonVariant;
}

type LinkButtonProps =
  | { iconName?: string; icon?: never }
  | { iconName?: never; icon: React.ReactNode };

const LinkButton = ({
  title,
  href,
  iconName,
  variant,
  icon,
  classList,
}: LinkButtonBaseProps & LinkButtonProps) => {
  const [isRouting, setIsRouting] = useState(false);
  return (
    <Button
      asChild
      className={cn(
        "action-button",
        classList,
        `${isRouting && "pointer-events-none"}`
      )}
      onClick={() => setIsRouting(true)}
      variant={variant}
    >
      <Link href={href}>
        {iconName ? (
          <IconImage name={iconName} opacity={isRouting ? 0 : 1} />
        ) : (
          <div className={`${isRouting && "opacity-0"}`}>{icon}</div>
        )}{" "}
        {title}
        {isRouting && <LoaderSpinner />}
      </Link>
    </Button>
  );
};

export default LinkButton;
