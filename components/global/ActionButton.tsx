"use client";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ActionButtonProps } from "@/types";
import IconImage from "./IconImage";
import LoaderSpiner from "./LoaderSpinner";

const ActionButton = ({
  title,
  icon,
  isLoading = false,
  onClick,
  classList,
}: ActionButtonProps) => {
  return (
    <Button className={cn("action-button", classList)} onClick={onClick}>
      {isLoading ? (
        <LoaderSpiner />
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
