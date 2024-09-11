import { Privilage } from "@/enums";
import { cn } from "@/lib/utils";
import { PrivilageBadgeProps } from "@/types";
import Image from "next/image";
import React, { useMemo } from "react";

const PrivilageBadge = ({ privilage }: PrivilageBadgeProps) => {
  const privilageImage = useMemo(() => {
    switch (privilage) {
      case Privilage.Owner:
        return "owner";
      case Privilage.Editor:
        return "edit";
      default:
        return "viewer";
    }
  }, [privilage]);

  const privilageBackground = useMemo(() => {
    switch (privilage) {
      case Privilage.Owner:
        return "bg-primary";
      case Privilage.Editor:
        return "bg-accent";
      default:
        return "bg-secondary";
    }
  }, [privilage]);

  return (
    <div
      className={cn(
        "text-white-1 bg-primary w-fit rounded-lg px-3 py-1 select-none flex gap-2",
        privilageBackground
      )}
    >
      <Image
        src={`/icons/${privilageImage}.svg`}
        alt="privilage"
        width={15}
        height={15}
      />
      {privilage}
    </div>
  );
};

export default PrivilageBadge;
