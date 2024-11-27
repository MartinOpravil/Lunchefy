"use client";
import FormProviderWrapper from "@/components/FormProviderWrapper";
import ErrorHandler from "@/components/global/ErrorHandler";
import GroupForm from "@/components/groups/form/GroupForm";
import GroupEditHeader from "@/components/groups/edit/GroupEditHeader";
import { groupFormSchema, GroupFormValues } from "@/constants/formSchema";
import { api } from "@/convex/_generated/api";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { ImageInputHandle, ImageStateProps } from "@/types";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";

interface GroupEditPageProps {
  groupPreloaded: Preloaded<typeof api.groups.getGroupById>;
}

const GroupEditPage = ({ groupPreloaded }: GroupEditPageProps) => {
  const router = useRouter();
  const group = usePreloadedQuery(groupPreloaded);
  const updateGroup = useMutation(api.groups.updateGroup);

  const coverImageRef = useRef<ImageInputHandle>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [resetForm, setResetForm] = useState<(() => void) | null>(null);

  const handleSubmit: SubmitHandler<GroupFormValues> = async (
    values: GroupFormValues
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

      if (!response.data)
        return notifyError(response.status.toString(), response.errorMessage);
      notifySuccess("Successfully updated group");
      // router.push("/app");
      if (resetForm) resetForm();
      router.refresh();
    } catch (error) {
      notifyError("Error updating group", error?.toString());
    }
  };

  return (
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
      <main className="page">
        <GroupEditHeader group={group} />
        <main className="page-content">
          <ErrorHandler convexResponse={group} />
          <GroupForm group={group} />
        </main>
      </main>
    </FormProviderWrapper>
  );
};

export default GroupEditPage;
