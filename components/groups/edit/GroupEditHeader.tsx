"use client";
import React, { useState } from "react";
import PageHeader from "@/components/global/PageHeader";
import LinkButton from "@/components/global/LinkButton";
import ActionButton from "@/components/global/ActionButton";
import BasicDialog from "@/components/global/BasicDialog";
import AccessManager from "./AccessManager/AccessManager";
import { ButtonVariant, Privilage } from "@/enums";
import DeleteGroupButton from "../DeleteGroupButton";
import { getGroupById } from "@/convex/groups";
import { ArrowLeft, ChefHat, Save, Share2, Users } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";

interface GroupEditHeaderProps {
  group: Awaited<ReturnType<typeof getGroupById>>;
}

const GroupEditHeader = ({ group }: GroupEditHeaderProps) => {
  const t = useTranslations();
  const {
    formState: { isDirty, isSubmitting },
    handleSubmit,
  } = useFormContext();
  const [isAccessManagerOpen, setIsAccessManagerOpen] = useState(false);

  if (!group.data) return <></>;

  return (
    <>
      <PageHeader
        title={`${group.data.name}`}
        icon={<Users className="header-icon" />}
        leftSide={
          <>
            <LinkButton
              icon={<ArrowLeft className="text-text" />}
              href="/app"
              variant={ButtonVariant.Minimalistic}
            />
            <LinkButton
              icon={<ChefHat className="text-text" />}
              href={`/app/${group.data._id}`}
              variant={ButtonVariant.Minimalistic}
            />
          </>
        }
        rightSide={
          <>
            {group.data.privilage === Privilage.Owner && (
              <>
                <DeleteGroupButton
                  groupId={group.data._id}
                  groupTitle={group.data.name}
                  redirectAfterDelete
                />
                <ActionButton
                  icon={<Share2 className="text-text" />}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAccessManagerOpen(true);
                  }}
                  variant={ButtonVariant.Minimalistic}
                />
                <ActionButton
                  title={t("Global.Button.Save")}
                  icon={<Save />}
                  variant={ButtonVariant.Positive}
                  onClick={() => handleSubmit}
                  isLoading={isSubmitting}
                  isDisabled={!isDirty}
                />
              </>
            )}
          </>
        }
      />
      <BasicDialog
        isOpen={isAccessManagerOpen}
        setIsOpen={setIsAccessManagerOpen}
        icon={<Share2 className="ml-[-2px]" />}
        title={t("Groups.AccessManager.Title")}
        description={t("Groups.AccessManager.Description")}
        content={
          <AccessManager groupName={group.data.name} groupId={group.data._id} />
        }
      />
    </>
  );
};

export default GroupEditHeader;
