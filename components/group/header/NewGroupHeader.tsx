import { useFormContext } from "react-hook-form";

import { useTranslations } from "next-intl";

import { ArrowLeft, Save } from "lucide-react";

import ActionButton from "@/components/global/button/ActionButton";
import PageHeader from "@/components/global/content/PageHeader";

import { ButtonVariant } from "@/enums";

interface CustomFormContext {
  performManualLeaveAction: () => void;
}

const NewGroupHeader = () => {
  const t = useTranslations();

  const {
    formState: { isDirty, isSubmitting },
    handleSubmit,
    performManualLeaveAction,
  } = useFormContext() as ReturnType<typeof useFormContext> & CustomFormContext;

  return (
    <PageHeader
      title={t("Groups.General.NewGroupTitle")}
      leftSide={
        <ActionButton
          icon={<ArrowLeft />}
          onClick={performManualLeaveAction}
          variant={ButtonVariant.Minimalistic}
        />
      }
      rightSide={
        <ActionButton
          title={t("Global.Button.Save")}
          icon={<Save />}
          variant={ButtonVariant.Positive}
          onClick={() => handleSubmit}
          isDisabled={!isDirty}
          isLoading={isSubmitting}
        />
      }
    />
  );
};

export default NewGroupHeader;
