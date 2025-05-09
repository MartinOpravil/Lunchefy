import { useMemo } from "react";

import { useTranslations } from "next-intl";

import { User, UserCog, UserPen } from "lucide-react";

import { Privilage } from "@/enums";
import { PrivilageBadgeProps } from "@/types";

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

  return (
    <div className="flex w-fit select-none gap-2 rounded-full bg-secondary px-3 py-1 text-white-1">
      {privilageImage}
      {t(`AccessManager.Privilage.${privilage}`)}
    </div>
  );
};

export default PrivilageBadge;
