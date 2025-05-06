import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import { preloadQuery } from "convex/nextjs";
import { getAuthToken } from "@/lib/authentication";
import GroupEditPage from "./GroupEditPage";
import ContentHandler from "@/components/global/content/ContentHandler";

interface GroupEditServerPageProps {
  params: Promise<{ groupId: Id<"groups"> }>;
}

const GroupEditServerPage = async ({ params }: GroupEditServerPageProps) => {
  const groupId = (await params).groupId;

  const token = await getAuthToken();
  const userPreload = await preloadQuery(api.users.getLoggedUser);
  const groupPreload = await preloadQuery(
    api.groups.getGroupById,
    {
      id: groupId,
      checkPrivilages: true,
    },
    { token }
  );

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
