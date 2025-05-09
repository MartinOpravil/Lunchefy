import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

interface NewGroupButtonProps {
  onClick: () => void;
  hasGroups?: boolean;
}

const NewGroupButton = ({ onClick, hasGroups }: NewGroupButtonProps) => {
  const t = useTranslations();

  return (
    <div
      className={cn("group-button group", {
        "opacity-50 hover:opacity-100": hasGroups,
      })}
      onClick={onClick}
    >
      <div className="link">
        <Avatar className="relative h-[100px] w-[100px] transition-all group-hover:opacity-90">
          <AvatarFallback className="bg-primary">
            <Plus className="!h-[50px] !w-[50px] text-white-1" />
          </AvatarFallback>
        </Avatar>
        <div className="gap-2 transition-all group-hover:opacity-90">
          <h3 className="text-primary">
            {t("Groups.General.Button.CreateNew")}
          </h3>
          {/* {description && <span>{description}</span>} */}
        </div>
      </div>
    </div>
  );
};

export default NewGroupButton;
