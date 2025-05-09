import { useTranslations } from "next-intl";

import { getGroupList } from "@/convex/groups";

import NoContent from "@/components/global/content/NoContent";
import NewGroupButton from "@/components/group/button/NewGroupButton";
import Group from "@/components/group/item/Group";

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
        "flex flex-wrap justify-center",
        groupList.data.length ? "gap-4" : "gap-8",
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

export default GroupList;
