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

  const visualizeRouting = () => {
    setIsRouting(true);
    setTimeout(() => {
      setIsRouting(false);
    }, 2000);
  };

  return (
    <Button
      asChild
      className={cn(
        "action-button",
        classList,
        `${isRouting && "pointer-events-none"}`
      )}
      onClick={visualizeRouting}
      variant={variant}
    >
      <Link href={href}>
        {iconName && <IconImage name={iconName} />}
        {icon && <div className={`${isRouting && "opacity-0"}`}>{icon}</div>}
        {title && <div>{title}</div>}
        {isRouting && <LoaderSpinner />}
      </Link>
    </Button>
  );
};

export default LinkButton;
