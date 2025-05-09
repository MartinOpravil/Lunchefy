import { useTranslations } from "next-intl";

import { Doc } from "@/convex/_generated/dataModel";
import { ArrowLeft, ChefHat, Pencil, Plus } from "lucide-react";

import ActionButton from "@/components/global/button/ActionButton";
import LinkButton from "@/components/global/button/LinkButton";
import PageHeader from "@/components/global/content/PageHeader";
import PlannerButton from "@/components/group/button/PlannerButton";

import { ButtonVariant, Privilage } from "@/enums";

interface OverviewGroupHeaderProps {
  group: Doc<"groups">;
  privilage: Privilage;
  onNewClickAction: () => void;
}

const OverviewGroupHeader = ({
  group,
  privilage,
  onNewClickAction,
}: OverviewGroupHeaderProps) => {
  const t = useTranslations();

  return (
    <PageHeader
      title={group.name}
      description={group.description}
      leftSide={
        <LinkButton
          icon={<ArrowLeft />}
          href="/app"
          variant={ButtonVariant.Minimalistic}
        />
      }
      rightSide={
        <>
          {privilage !== Privilage.Viewer && (
            <ActionButton
              title={t("Global.Button.New")}
              icon={<Plus />}
              onClick={onNewClickAction}
              variant={ButtonVariant.Positive}
            />
          )}
        </>
      }
      topLeftSide={
        <>
          {privilage !== Privilage.Viewer && (
            <LinkButton
              icon={
                <Pencil className="text-text2 transition-all group-hover:text-text" />
              }
              href={`/app/${group._id}/edit`}
              variant={ButtonVariant.Minimalistic}
            />
          )}
        </>
      }
      topRightSide={<PlannerButton groupId={group._id} />}
    />
  );
};

export default OverviewGroupHeader;
