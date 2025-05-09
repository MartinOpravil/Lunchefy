"use client";

import { useState } from "react";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";

import GroupListFooter from "@/components/group/GroupListFooter";
import NewGroupForm from "@/components/group/form/NewGroupForm";
import GroupList from "@/components/group/item/GroupList";

interface GroupListPageProps {
  groupListPreloaded: Preloaded<typeof api.groups.getGroupList>;
  userPreloaded: Preloaded<typeof api.users.getLoggedUser>;
}

const GroupListPage = ({
  groupListPreloaded,
  userPreloaded,
}: GroupListPageProps) => {
  const user = usePreloadedQuery(userPreloaded);
  const groupList = usePreloadedQuery(groupListPreloaded);

  const [isNewFormOpen, setIsNewFormOpen] = useState(false);

  // New Form
  if (isNewFormOpen && user.data) {
    return (
      <NewGroupForm
        isUserVerified={user.data.isVerified}
        manualLeaveAction={() => setIsNewFormOpen(false)}
      />
    );
  }

  // Overview
  return (
    <main className="page page-width-normal justify-between gap-6">
      <section className="page-content min-h-[300px] flex-grow !items-center !justify-center @container">
        <GroupList
          groupList={groupList}
          onClick={() => setIsNewFormOpen(true)}
        />
      </section>
      <GroupListFooter />
    </main>
  );
};

export default GroupListPage;
