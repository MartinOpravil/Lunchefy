import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import React from "react";
import { getAuthToken } from "@/lib/authentication";
import GroupListPage from "./GroupListPage";

const GroupListServerPage = async () => {
  const token = await getAuthToken();
  const userPreloadPromise = preloadQuery(api.users.getLoggedUser);
  const groupListPreloadPromise = preloadQuery(
    api.groups.getGroupList,
    {},
    { token }
  );

  const [userPreload, groupListPreload] = await Promise.all([
    userPreloadPromise,
    groupListPreloadPromise,
  ]);

  return (
    <GroupListPage
      groupListPreloaded={groupListPreload}
      userPreloaded={userPreload}
    />
  );
};

export default GroupListServerPage;
