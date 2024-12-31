"use client";
import React from "react";
import NoContent from "../global/NoContent";
import { getGroupList } from "@/convex/groups";
import Group from "./Group";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface GroupListProps {
  groupList: Awaited<ReturnType<typeof getGroupList>>;
  onClick: () => void;
}

const GroupList = ({ groupList, onClick }: GroupListProps) => {
  const t = useTranslations();

  return groupList.data ? (
    <div
      className={cn(
        "flex justify-center flex-wrap",
        groupList.data.length ? "gap-4" : "gap-8"
      )}
    >
      {groupList.data.length === 0 ? (
        <NoContent
          title={t("Groups.Empty.Group.title")}
          subTitle={t("Groups.Empty.Group.subTitle")}
        />
      ) : (
        <>
          {groupList.data?.map((group) => (
            <Group key={group._id} group={group} privilage={group.privilage} />
          ))}
        </>
      )}
      <NewGroupButton onClick={onClick} hasGroups={!!groupList.data.length} />
    </div>
  ) : (
    <></>
  );
};

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
        <Avatar className="relative w-[100px] h-[100px] transition-all group-hover:opacity-90">
          <AvatarFallback className="bg-primary">
            <Plus className="text-white-1 !w-[50px] !h-[50px]" />
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

export default GroupList;
