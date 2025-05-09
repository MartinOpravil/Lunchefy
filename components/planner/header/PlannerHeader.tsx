import { useTranslations } from "next-intl";

import { getGroupById } from "@/convex/groups";
import { ArrowLeft, CalendarFold, Plus } from "lucide-react";

import ActionButton from "@/components/global/button/ActionButton";
import LinkButton from "@/components/global/button/LinkButton";
import PageHeader from "@/components/global/content/PageHeader";

import { ButtonVariant } from "@/enums";

interface PlannerHeaderProps {
  group: Awaited<ReturnType<typeof getGroupById>>;
  assignAction: () => void;
}

const PlannerHeader = ({ group, assignAction }: PlannerHeaderProps) => {
  const t = useTranslations();

  if (!group.data) return <></>;

  return (
    <PageHeader
      title={t("Groups.Planner.Title")}
      icon={<CalendarFold className="text-white-1" />}
      leftSide={
        <LinkButton
          icon={<ArrowLeft />}
          href={`/app/${group.data._id}`}
          variant={ButtonVariant.Minimalistic}
        />
      }
      rightSide={
        <>
          <ActionButton
            title={t("Groups.Planner.Button.Assign")}
            icon={<Plus />}
            onClick={assignAction}
            variant={ButtonVariant.Positive}
          />
        </>
      }
    />
  );
};

export default PlannerHeader;
