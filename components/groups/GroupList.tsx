"use client";
import React from "react";
import NoContent from "../global/NoContent";
import { getGroupList } from "@/convex/groups";
import Group from "./Group";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface GroupListProps {
  groupList: Awaited<ReturnType<typeof getGroupList>>;
  onClick: () => void;
}

const GroupList = ({ groupList, onClick }: GroupListProps) => {
  const t = useTranslations();

  return groupList.data ? (
    <>
      {groupList.data.length === 0 ? (
        <>
          {/** TODO: Translate this!!! */}
          <NoContent
            title="You have no group yet"
            subTitle="Start by creating one"
          />
        </>
      ) : (
        <div className="flex justify-center gap-4 flex-wrap">
          {groupList.data?.map((group) => (
            <Group
              key={group._id}
              id={group._id}
              title={group.name}
              description={group.description}
              imageUrl={group.coverImage?.imageUrl}
              privilage={group.privilage}
            />
          ))}
          <div className="group-button group" onClick={onClick}>
            <div className="link">
              <Avatar className="relative w-[100px] h-[100px] transition-all group-hover:opacity-90">
                <AvatarFallback className="bg-primary">
                  <Plus className="text-white-1 !w-[50px] !h-[50px]" />
                </AvatarFallback>
              </Avatar>
              <div className="gap-2 transition-all group-hover:opacity-90">
                <h3>{t("Global.Button.New")}</h3>
                {/* {description && <span>{description}</span>} */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <></>
  );
};

export default GroupList;
