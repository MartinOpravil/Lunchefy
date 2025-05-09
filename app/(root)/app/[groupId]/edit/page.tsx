import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";

import GroupEditPage from "@/app/(root)/app/[groupId]/edit/GroupEditPage";
import ContentHandler from "@/components/global/content/ContentHandler";

import { getAuthToken } from "@/lib/authentication";

interface GroupEditServerPageProps {
  params: Promise<{ groupId: Id<"groups"> }>;
}

const GroupEditServerPage = async ({ params }: GroupEditServerPageProps) => {
  const groupId = (await params).groupId;

  const token = await getAuthToken();
  const userPreloadPromise = preloadQuery(api.users.getLoggedUser);
  const groupPreloadPromise = preloadQuery(
    api.groups.getGroupById,
    {
      id: groupId,
      checkPrivilages: true,
    },
    { token },
  );

  const [userPreload, groupPreload] = await Promise.all([
    userPreloadPromise,
    groupPreloadPromise,
  ]);

  return (
    <ContentHandler preloadedData={groupPreload}>
      <GroupEditPage
        groupPreloaded={groupPreload}
        userPreloaded={userPreload}
      />
    </ContentHandler>
  );
};

export default GroupEditServerPage;
