"use client";
import FormProviderWrapper from "@/components/FormProviderWrapper";
import RecipeDetailHeader from "@/components/recipes/Detail/RecipeDetailHeader";
import RecipeForm from "@/components/recipes/Form/RecipeForm";
import { useTagManager } from "@/components/recipes/TagManager";
import { recipeFormSchema, RecipeFormValues } from "@/constants/formSchema";
import { api } from "@/convex/_generated/api";
import { HttpResponseCode } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { ImageInputHandle, ImageStateProps } from "@/types";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";

interface RecipeDetailPageProps {
  userPreload: Preloaded<typeof api.users.getLoggedUser>;
  recipePreloaded: Preloaded<typeof api.recipes.getRecipeById>;
}

const RecipeDetailPage = ({
  userPreload,
  recipePreloaded,
}: RecipeDetailPageProps) => {
  const t = useTranslations();
  const router = useRouter();

  const user = usePreloadedQuery(userPreload);
  const recipe = usePreloadedQuery(recipePreloaded);
  const updateRecipe = useMutation(api.recipes.updateRecipe);

  const { convertToTags, convertToValues } = useTagManager();

  const [isFormDirty, setIsFormDirty] = useState(false);
  const [resetForm, setResetForm] = useState<(() => void) | null>(null);

  const coverImageRef = useRef<ImageInputHandle>(null);
  const recipeImageRef = useRef<ImageInputHandle>(null);

  const handleSubmit: SubmitHandler<RecipeFormValues> = async (
    values: RecipeFormValues
  ) => {
    if (!recipe.data) return;
    try {
      const updatedCoverImage = await coverImageRef.current?.commit();
      const updatedRecipePhotoImage = await recipeImageRef.current?.commit();
      const response = await updateRecipe({
        id: recipe.data?._id,
        name: values.name,
        description: values.description,
        coverImage: updatedCoverImage ?? (values.coverImage as ImageStateProps),
        ingredients: values.ingredients,
        instructions: values.instructions,
        recipeImage:
          updatedRecipePhotoImage ?? (values.recipeImage as ImageStateProps),
        isImageRecipe: values.isImageRecipe,
        tags: values.tags ? convertToValues(values.tags) : undefined,
      });
      if (!response.data) {
        switch (response.status) {
          case HttpResponseCode.NotFound:
            return notifyError(
              t("Recipes.General.Notification.Error.Update404")
            );
          default:
            return notifyError(t("Global.Notification.UnexpectedError"));
        }
      }
      notifySuccess(t("Recipes.General.Notification.Success.Update"));

      // router.push(`/app/${recipe.data.recipeBookId}/${recipe.data._id}`);
      if (resetForm) resetForm();
      router.refresh();
    } catch (error) {
      notifyError(
        t("Recipes.General.Notification.Error.Update"),
        error?.toString()
      );
    }
  };

  return (
    <FormProviderWrapper
      onSubmit={handleSubmit}
      formSchema={recipeFormSchema}
      defaultValues={{
        name: recipe.data?.name ?? "",
        instructions: recipe.data?.instructions ?? "",
        description: recipe.data?.description,
        ingredients: recipe.data?.ingredients,
        coverImage: recipe.data?.coverImage,
        tags: recipe.data?.tags ? convertToTags(recipe.data.tags) : undefined,
        recipeImage: recipe.data?.recipeImage,
        isImageRecipe: recipe.data?.isImageRecipe,
      }}
      onFormStateChange={setIsFormDirty}
      passResetToParent={setResetForm}
      coverImageRef={coverImageRef}
      recipeImageRef={recipeImageRef}
    >
      <main className="page page-width-normal">
        <RecipeDetailHeader recipe={recipe} />
        <main className="page-content">
          {user.data && (
            <RecipeForm recipe={recipe} isVerified={user.data.isVerified} />
          )}
        </main>
      </main>
    </FormProviderWrapper>
  );
};

export default RecipeDetailPage;
