"use client";
import React from "react";
import NoContent from "../global/NoContent";
import { getGroupList } from "@/convex/groups";
import Group from "./Group";

interface GroupListProps {
  groupList: Awaited<ReturnType<typeof getGroupList>>;
}

const GroupList = ({ groupList }: GroupListProps) => {
  return groupList.data ? (
    <>
      {groupList.data.length === 0 ? (
        <NoContent
          title="You have no group yet"
          subTitle="Start by creating one"
        />
      ) : (
        <div className="recipe-grid">
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
        </div>
      )}
    </>
  ) : (
    <></>
  );
};

export default GroupList;
