"use client";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import IconImage from "./IconImage";
import LoaderSpinner from "./LoaderSpinner";
import { ClassListProp } from "@/types";
import { ButtonVariant } from "@/enums";

export interface ActionButtonBaseProps extends ClassListProp {
  title?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  variant?: ButtonVariant;
}

type LinkButtonProps =
  | { iconName?: string; icon?: never }
  | { iconName?: never; icon: React.ReactNode };

const ActionButton = ({
  title,
  iconName,
  icon,
  variant,
  isLoading = false,
  isDisabled = false,
  onClick,
  classList,
}: ActionButtonBaseProps & LinkButtonProps) => {
  return (
    <Button
      className={cn(
        "action-button",
        classList,
        `${isLoading && "pointer-events-none"}`
      )}
      onClick={onClick}
      disabled={isDisabled}
      variant={isDisabled ? undefined : variant}
    >
      {iconName && <IconImage name={iconName} />}
      {icon && <div className={`${isLoading && "opacity-0"}`}>{icon}</div>}
      {title && <div className="">{title}</div>}
      {isLoading && <LoaderSpinner />}
    </Button>
  );
};

export default ActionButton;
