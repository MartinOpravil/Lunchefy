import { Privilage } from "@/enums";
import { cn } from "@/lib/utils";
import { PrivilageBadgeProps } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useMemo } from "react";

const PrivilageBadge = ({ privilage }: PrivilageBadgeProps) => {
  const t = useTranslations("Groups");
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
        "text-white-1 w-fit rounded-full px-3 py-1 select-none flex gap-2",
        privilageBackground
      )}
    >
      <Image
        src={`/icons/${privilageImage}.svg`}
        alt="privilage"
        width={15}
        height={15}
      />
      {t(`AccessManager.Privilage.${privilage}`)}
    </div>
  );
};

export default PrivilageBadge;
