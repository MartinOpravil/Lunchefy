"use client";
import FormProviderWrapper from "@/components/FormProviderWrapper";
import ErrorHandler from "@/components/global/ErrorHandler";
import RecipeDetailHeader from "@/components/recipes/Detail/RecipeDetailHeader";
import RecipeForm from "@/components/recipes/Form/RecipeForm";
import { recipeFormSchema, RecipeFormValues } from "@/constants/formSchemas";
import { api } from "@/convex/_generated/api";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { TagManager } from "@/lib/tags";
import { ImageInputHandle, ImageStateProps } from "@/types";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";

interface RecipeDetailPageProps {
  recipePreloaded: Preloaded<typeof api.recipes.getRecipeById>;
}

const RecipeDetailPage = ({ recipePreloaded }: RecipeDetailPageProps) => {
  const router = useRouter();
  const recipe = usePreloadedQuery(recipePreloaded);
  const updateRecipe = useMutation(api.recipes.updateRecipe);

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
        tags: values.tags ? TagManager.convertToValues(values.tags) : undefined,
      });

      if (!response.data)
        return notifyError(response.status.toString(), response.errorMessage);
      notifySuccess("Successfully updated recipe");

      // router.push(`/app/${recipe.data.recipeBookId}/${recipe.data._id}`);
      if (resetForm) resetForm();
      router.refresh();
    } catch (error) {
      notifyError("Error updating recipe", error?.toString());
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
        tags: recipe.data?.tags
          ? TagManager.convertToTags(recipe.data.tags)
          : undefined,
        recipeImage: recipe.data?.recipeImage,
        isImageRecipe: recipe.data?.isImageRecipe,
      }}
      onFormStateChange={setIsFormDirty}
      passResetToParent={setResetForm}
      coverImageRef={coverImageRef}
      recipeImageRef={recipeImageRef}
    >
      <main className="page">
        <RecipeDetailHeader recipe={recipe} />
        <main className="page-content">
          <ErrorHandler convexResponse={recipe} />
          <RecipeForm recipe={recipe} />
        </main>
      </main>
    </FormProviderWrapper>
  );
};

export default RecipeDetailPage;