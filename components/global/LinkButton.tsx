import { LinkButtonProps } from "@/types";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import IconImage from "./IconImage";

const LinkButton = ({ title, href, icon, classList }: LinkButtonProps) => {
  return (
    <Button asChild className={cn("action-button", classList)}>
      <Link href={href}>
        {icon && <IconImage name={icon} />}
        {title}
      </Link>
    </Button>
  );
};

export default LinkButton;
