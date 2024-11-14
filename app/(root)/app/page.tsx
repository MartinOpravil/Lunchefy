import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import React from "react";
import { getAuthToken } from "@/lib/authentication";
import GroupListPage from "./GroupListPage";

const GroupListServerPage = async () => {
  const token = await getAuthToken();
  const groupListPreload = await preloadQuery(
    api.groups.getGroupList,
    {},
    { token }
  );

  return <GroupListPage groupListPreloaded={groupListPreload} />;
};

export default GroupListServerPage;
