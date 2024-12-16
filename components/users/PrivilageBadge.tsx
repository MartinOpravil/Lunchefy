import { Privilage } from "@/enums";
import { cn } from "@/lib/utils";
import { PrivilageBadgeProps } from "@/types";
import { User, UserCog, UserPen } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useMemo } from "react";

const PrivilageBadge = ({ privilage }: PrivilageBadgeProps) => {
  const t = useTranslations("Groups");
  const privilageImage = useMemo(() => {
    switch (privilage) {
      case Privilage.Owner:
        return <UserCog />;
      case Privilage.Editor:
        return <UserPen />;
      default:
        return <User />;
    }
  }, [privilage]);

  // const privilageStyles = useMemo(() => {
  //   switch (privilage) {
  //     case Privilage.Owner:
  //       return "bg-primary bg-[#A4B476]";
  //     case Privilage.Editor:
  //       return "bg-accent";
  //     default:
  //       return "bg-secondary";
  //   }
  // }, [privilage]);

  return (
    <div
      className={cn(
        "text-white-1 w-fit rounded-full px-3 py-1 select-none flex gap-2 outline outline-1 bg-[#A4B476]"
        // privilageStyles
      )}
    >
      {privilageImage}
      {t(`AccessManager.Privilage.${privilage}`)}
    </div>
  );
};

export default PrivilageBadge;
