"use client";

import { useFormContext } from "react-hook-form";

import { useTranslations } from "next-intl";

import { ArrowLeft, NotebookText, Save } from "lucide-react";

import ActionButton from "@/components/global/button/ActionButton";
import PageHeader from "@/components/global/content/PageHeader";

import { ButtonVariant } from "@/enums";

interface CustomFormContext {
  performManualLeaveAction: () => void;
}

const NewRecipeHeader = () => {
  const t = useTranslations();
  const {
    formState: { isDirty, isSubmitting },
    handleSubmit,
    performManualLeaveAction,
  } = useFormContext() as ReturnType<typeof useFormContext> & CustomFormContext;

  return (
    <PageHeader
      title={t("Recipes.General.NewRecipeTitle")}
      icon={<NotebookText className="text-white-1" />}
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

export default NewRecipeHeader;
