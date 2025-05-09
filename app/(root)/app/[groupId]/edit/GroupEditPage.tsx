"use client";

import { useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";

import FormProviderWrapper from "@/components/global/form/FormProviderWrapper";
import GroupForm from "@/components/group/form/GroupForm";
import EditGroupHeader from "@/components/group/header/EditGroupHeader";

import { GroupFormValues, groupFormSchema } from "@/constants/formSchema";
import { HttpResponseCode } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { ImageInputHandle, ImageStateProps } from "@/types";

interface GroupEditPageProps {
  groupPreloaded: Preloaded<typeof api.groups.getGroupById>;
  userPreloaded: Preloaded<typeof api.users.getLoggedUser>;
}

const GroupEditPage = ({
  groupPreloaded,
  userPreloaded,
}: GroupEditPageProps) => {
  const t = useTranslations();
  const router = useRouter();
  const user = usePreloadedQuery(userPreloaded);
  const group = usePreloadedQuery(groupPreloaded);
  const updateGroup = useMutation(api.groups.updateGroup);

  const coverImageRef = useRef<ImageInputHandle>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [resetForm, setResetForm] = useState<(() => void) | null>(null);

  const handleSubmit: SubmitHandler<GroupFormValues> = async (
    values: GroupFormValues,
  ) => {
    if (!group.data) return;

    try {
      const updatedImage = await coverImageRef.current?.commit();
      const response = await updateGroup({
        id: group.data?._id,
        name: values.name,
        description: values.description,
        coverImage: updatedImage ?? (values.coverImage as ImageStateProps),
      });

      if (!response.data) {
        switch (response.status) {
          case HttpResponseCode.NotFound:
            return notifyError(
              t("Groups.General.Notification.Error.Update404"),
            );
          default:
            return notifyError(t("Global.Notification.UnexpectedError"));
        }
      }

      notifySuccess(t("Groups.General.Notification.Success.Update"));
      // router.push("/app");
      if (resetForm) resetForm();
      router.refresh();
    } catch (error) {
      notifyError(
        t("Groups.General.Notification.Error.Update"),
        error?.toString(),
      );
    }
  };

  return (
    <main className="page page-width-normal">
      <FormProviderWrapper
        onSubmit={handleSubmit}
        formSchema={groupFormSchema}
        defaultValues={{
          name: group.data?.name ?? "",
          description: group.data?.description,
          coverImage: group.data?.coverImage,
        }}
        onFormStateChange={setIsFormDirty}
        passResetToParent={setResetForm}
        coverImageRef={coverImageRef}
      >
        <EditGroupHeader group={group} />
        <section className="page-content">
          {user.data && (
            <GroupForm group={group} isVerified={user.data.isVerified} />
          )}
        </section>
      </FormProviderWrapper>
    </main>
  );
};

export default GroupEditPage;
