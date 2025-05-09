import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

import GroupListPage from "@/app/(root)/app/GroupListPage";
import ContentHandler from "@/components/global/content/ContentHandler";

import { getAuthToken } from "@/lib/authentication";

const GroupListServerPage = async () => {
  const token = await getAuthToken();
  const userPreloadPromise = preloadQuery(api.users.getLoggedUser);
  const groupListPreloadPromise = preloadQuery(
    api.groups.getGroupList,
    {},
    { token },
  );

  const [userPreload, groupListPreload] = await Promise.all([
    userPreloadPromise,
    groupListPreloadPromise,
  ]);

  return (
    <ContentHandler preloadedData={groupListPreload}>
      <GroupListPage
        groupListPreloaded={groupListPreload}
        userPreloaded={userPreload}
      />
    </ContentHandler>
  );
};

export default GroupListServerPage;
