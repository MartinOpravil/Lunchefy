"use client";
import React, { useState } from "react";
import PageHeader from "@/components/global/PageHeader";
import LinkButton from "@/components/global/LinkButton";
import ActionButton from "@/components/global/ActionButton";
import BasicDialog from "@/components/global/BasicDialog";
import AccessManager from "./AccessManager/AccessManager";
import { ButtonVariant, Privilage } from "@/enums";
import Image from "next/image";
import DeleteGroupButton from "../DeleteGroupButton";
import { getGroupById } from "@/convex/groups";
import { ArrowLeft, Book, Save, Share2 } from "lucide-react";
import HorizontalSeparator from "@/components/global/HorizontalSeparator";
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
        icon="recipe_book"
        actionButton={
          <>
            <LinkButton
              icon={<ArrowLeft />}
              href="/app"
              variant={ButtonVariant.Dark}
            />
            <HorizontalSeparator />
            {group.data.privilage === Privilage.Owner && (
              <>
                <DeleteGroupButton
                  groupId={group.data._id}
                  groupTitle={group.data.name}
                  redirectAfterDelete
                />
                <LinkButton icon={<Book />} href={`/app/${group.data._id}`} />
                <ActionButton
                  icon={<Share2 />}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAccessManagerOpen(true);
                  }}
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
        icon={
          <Image
            src="/icons/share_primary.svg"
            alt="access"
            width={20}
            height={20}
          />
        }
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
