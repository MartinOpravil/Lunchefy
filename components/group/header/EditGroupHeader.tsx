"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { useTranslations } from "next-intl";

import { getGroupById } from "@/convex/groups";
import { ArrowLeft, ChefHat, Save, Share2, Users } from "lucide-react";

import ActionButton from "@/components/global/button/ActionButton";
import LinkButton from "@/components/global/button/LinkButton";
import PageHeader from "@/components/global/content/PageHeader";
import BasicDialog from "@/components/global/dialog/BasicDialog";
import AccessManager from "@/components/group/accessManager/AccessManager";
import DeleteGroupButton from "@/components/group/button/DeleteGroupButton";

import { ButtonVariant, Privilage } from "@/enums";

interface EditGroupHeaderProps {
  group: Awaited<ReturnType<typeof getGroupById>>;
}

const EditGroupHeader = ({ group }: EditGroupHeaderProps) => {
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
              </>
            )}
            {group.data.privilage !== Privilage.Viewer && (
              <ActionButton
                title={t("Global.Button.Save")}
                icon={<Save />}
                variant={ButtonVariant.Positive}
                onClick={() => handleSubmit}
                isLoading={isSubmitting}
                isDisabled={!isDirty}
              />
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

export default EditGroupHeader;
