import { useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";

import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

import FormProviderWrapper from "@/components/global/form/FormProviderWrapper";
import RecipeForm from "@/components/recipe/form/RecipeForm";
import NewRecipeHeader from "@/components/recipe/header/NewRecipeHeader";

import { RecipeFormValues, recipeFormSchema } from "@/constants/formSchema";
import { HttpResponseCode } from "@/enums";
import { useTagManager } from "@/hooks/TagManager";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { ImageInputHandle, ImageStateProps } from "@/types";

interface NewRecipeFormProps {
  groupId: Id<"groups">;
  isUserVerified: boolean;
  manualLeaveAction: () => void;
}

const NewRecipeForm = ({
  groupId,
  isUserVerified,
  manualLeaveAction,
}: NewRecipeFormProps) => {
  const t = useTranslations();
  const { convertToValues } = useTagManager();

  const createRecipe = useMutation(api.recipes.createRecipe);

  const [resetForm, setResetForm] = useState<(() => void) | null>(null);
  const coverImageRef = useRef<ImageInputHandle>(null);
  const recipeImageRef = useRef<ImageInputHandle>(null);

  const handleSubmit: SubmitHandler<RecipeFormValues> = async (
    values: RecipeFormValues,
  ) => {
    if (!groupId) {
      notifyError(
        t("Recipes.General.Notification.Error.Create"),
        "GroupId is empty",
      );
      return;
    }

    try {
      const updatedCoverImage = await coverImageRef.current?.commit();
      const updatedRecipePhotoImage = await recipeImageRef.current?.commit();
      const response = await createRecipe({
        groupId,
        name: values.name,
        description: values.description,
        ingredients: values.ingredients,
        instructions: values.instructions,
        coverImage: updatedCoverImage ?? (values.coverImage as ImageStateProps),
        recipeImage:
          updatedRecipePhotoImage ?? (values.recipeImage as ImageStateProps),
        isImageRecipe: values.isImageRecipe,
        tags: values.tags ? convertToValues(values.tags) : undefined,
      });

      if (!response.data) {
        switch (response.status) {
          case HttpResponseCode.InternalServerError:
            return notifyError(
              t("Recipes.General.Notification.Error.Create500"),
            );
          default:
            return notifyError(t("Global.Notification.UnexpectedError"));
        }
      }

      notifySuccess(t("Recipes.General.Notification.Success.Create"));
      manualLeaveAction();
    } catch (error) {
      notifyError(
        t("Recipes.General.Notification.Error.Create"),
        error?.toString(),
      );
    }
  };

  return (
    <main className="page page-width-normal">
      <FormProviderWrapper
        onSubmit={handleSubmit}
        formSchema={recipeFormSchema}
        defaultValues={{
          name: "",
          instructions: "",
          description: undefined,
          ingredients: undefined,
          coverImage: undefined,
          tags: undefined,
          recipeImage: undefined,
          isImageRecipe: false,
        }}
        passResetToParent={setResetForm}
        coverImageRef={coverImageRef}
        recipeImageRef={recipeImageRef}
        manualLeaveAction={manualLeaveAction}
      >
        <NewRecipeHeader />
        <section className="page-content">
          <RecipeForm isVerified={isUserVerified} />
        </section>
      </FormProviderWrapper>
    </main>
  );
};

export default NewRecipeForm;
