"use client";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ActionButtonProps } from "@/types";
import IconImage from "./IconImage";
import LoaderSpinner from "./LoaderSpinner";

const ActionButton = ({
  title,
  icon,
  isLoading = false,
  isDisabled = false,
  onClick,
  classList,
}: ActionButtonProps) => {
  return (
    <Button
      className={cn("action-button", classList)}
      onClick={onClick}
      disabled={isDisabled}
    >
      {isLoading ? (
        <LoaderSpinner />
      ) : (
        <>
          {icon && <IconImage name={icon} />} {title}
        </>
      )}

      {/* {icon && <IconImage name={icon} />}
      {title} */}
    </Button>
  );
};

export default ActionButton;
