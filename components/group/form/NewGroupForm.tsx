import { useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";

import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

import FormProviderWrapper from "@/components/global/form/FormProviderWrapper";
import GroupForm from "@/components/group/form/GroupForm";
import NewGroupHeader from "@/components/group/header/NewGroupHeader";

import { GroupFormValues, groupFormSchema } from "@/constants/formSchema";
import { HttpResponseCode } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { ImageInputHandle, ImageStateProps } from "@/types";

interface NewGroupFormProps {
  isUserVerified: boolean;
  manualLeaveAction: () => void;
}

const NewGroupForm = ({
  isUserVerified,
  manualLeaveAction,
}: NewGroupFormProps) => {
  const t = useTranslations();
  const createGroup = useMutation(api.groups.createGroup);

  const [resetForm, setResetForm] = useState<(() => void) | null>(null);
  const coverImageRef = useRef<ImageInputHandle>(null);

  const handleSubmit: SubmitHandler<GroupFormValues> = async (
    values: GroupFormValues,
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
              t("Groups.General.Notification.Error.Create500Database"),
            );
          default:
            return notifyError(t("Global.Notification.UnexpectedError"));
        }
      }

      notifySuccess(t("Groups.General.Notification.Success.Create"));
      manualLeaveAction();
    } catch (error) {
      t("Groups.General.Notification.Error.Create");
    }
  };

  return (
    <main className="page page-width-normal">
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
        manualLeaveAction={manualLeaveAction}
      >
        <NewGroupHeader />
        <section className="page-content">
          <GroupForm isVerified={isUserVerified} />
        </section>
      </FormProviderWrapper>
    </main>
  );
};

export default NewGroupForm;
