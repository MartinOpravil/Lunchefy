"use client";
import PageHeader from "@/components/global/PageHeader";
import { api } from "@/convex/_generated/api";
import React, { useRef, useState } from "react";
import GroupList from "@/components/groups/GroupList";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import ActionButton from "@/components/global/ActionButton";
import { Plus } from "lucide-react";
import { ButtonVariant } from "@/enums";
import { ImageInputHandle, ImageStateProps } from "@/types";
import NewGroupHeader from "@/components/groups/header/NewGroupHeader";
import FormProviderWrapper from "@/components/FormProviderWrapper";
import { groupFormSchema, GroupFormValues } from "@/constants/formSchema";
import GroupForm from "@/components/groups/form/GroupForm";
import { SubmitHandler } from "react-hook-form";
import { notifyError, notifySuccess } from "@/lib/notifications";

interface GroupListPageProps {
  groupListPreloaded: Preloaded<typeof api.groups.getGroupList>;
}

const GroupListPage = ({ groupListPreloaded }: GroupListPageProps) => {
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

      if (response.data) {
        notifySuccess("Group successfully created.");
        setIsNewFormOpen(false);
        return;
      }
      notifyError(response.status.toString(), response.errorMessage);
    } catch (error) {
      console.log("Error creating group", error);
    }
  };

  // New Form
  if (isNewFormOpen) {
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
            <GroupForm />
          </main>
        </main>
      </FormProviderWrapper>
    );
  }

  // Overview
  return (
    <main className="page">
      <PageHeader
        title="Groups"
        icon="recipe_book"
        actionButton={
          <ActionButton
            title="New"
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
