"use client";
import PageHeader from "@/components/global/PageHeader";
import { api } from "@/convex/_generated/api";
import React, { useRef, useState } from "react";
import GroupList from "@/components/groups/GroupList";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import ActionButton from "@/components/global/ActionButton";
import { Plus } from "lucide-react";
import { ButtonVariant, HttpResponseCode } from "@/enums";
import { ImageInputHandle, ImageStateProps } from "@/types";
import NewGroupHeader from "@/components/groups/header/NewGroupHeader";
import FormProviderWrapper from "@/components/FormProviderWrapper";
import { groupFormSchema, GroupFormValues } from "@/constants/formSchema";
import GroupForm from "@/components/groups/form/GroupForm";
import { SubmitHandler } from "react-hook-form";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { useTranslations } from "next-intl";

interface GroupListPageProps {
  groupListPreloaded: Preloaded<typeof api.groups.getGroupList>;
  userPreloaded: Preloaded<typeof api.users.getLoggedUser>;
}

const GroupListPage = ({
  groupListPreloaded,
  userPreloaded,
}: GroupListPageProps) => {
  const t = useTranslations();

  const user = usePreloadedQuery(userPreloaded);
  const groupList = usePreloadedQuery(groupListPreloaded);
  const createGroup = useMutation(api.groups.createGroup);
  const [isNewFormOpen, setIsNewFormOpen] = useState(false);

  const [resetForm, setResetForm] = useState<(() => void) | null>(null);
  const coverImageRef = useRef<ImageInputHandle>(null);

  const handleSubmit: SubmitHandler<GroupFormValues> = async (
    values: GroupFormValues
  ) => {
    try {
      const updatedImage = await coverImageRef.current?.commit();
      const response = await createGroup({
        name: values.name,
        description: values.description,
        coverImage: updatedImage ?? (values.coverImage as ImageStateProps),
      });
      if (!response.data) {
        switch (response.status) {
          case HttpResponseCode.InternalServerError:
            return notifyError(
              t("Groups.General.Notification.Error.Create500Database")
            );
          default:
            return notifyError(t("Global.Notification.UnexpectedError"));
        }
      }

      notifySuccess(t("Groups.General.Notification.Success.Create"));
      setIsNewFormOpen(false);
    } catch (error) {
      t("Groups.General.Notification.Error.Create");
    }
  };

  // New Form
  if (isNewFormOpen && user.data) {
    return (
      <FormProviderWrapper
        onSubmit={handleSubmit}
        formSchema={groupFormSchema}
        defaultValues={{
          name: "",
          description: undefined,
          coverImage: undefined,
        }}
        passResetToParent={setResetForm}
        coverImageRef={coverImageRef}
        manualLeaveAction={() => setIsNewFormOpen(false)}
      >
        <main className="page">
          <NewGroupHeader />
          <main className="page-content">
            <GroupForm isVerified={user.data.isVerified} />
          </main>
        </main>
      </FormProviderWrapper>
    );
  }

  // Overview
  return (
    <main className="page">
      <PageHeader
        title={t("Groups.General.Title")}
        icon="recipe_book"
        actionButton={
          <ActionButton
            title={t("Global.Button.New")}
            icon={<Plus />}
            onClick={() => setIsNewFormOpen(true)}
            variant={ButtonVariant.Positive}
          />
        }
      />
      <main className="page-content @container">
        <GroupList groupList={groupList} />
      </main>
    </main>
  );
};

export default GroupListPage;
