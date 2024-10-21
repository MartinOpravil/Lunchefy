"use client";
import FormProviderWrapper from "@/components/FormProviderWrapper";
import ActionButton from "@/components/global/ActionButton";
import ErrorHandler from "@/components/global/ErrorHandler";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import RecipeForm from "@/components/recipes/Form/RecipeForm";
import NewRecipeHeader from "@/components/recipes/headers/NewRecipeHeader";
import Recipes from "@/components/recipes/Recipes";
import { recipeFormSchema, RecipeFormValues } from "@/constants/FormSchemas";
import { api } from "@/convex/_generated/api";
import { ButtonVariant, Privilage } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { ImageInputHandle, ImageStateProps } from "@/types";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { ArrowLeft, Pencil, Plus, Save } from "lucide-react";
import React, { useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";

const RecipeBookPage = (props: {
  recipeBookPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBookById>;
  recipesPreloaded: Preloaded<typeof api.recipes.getRecipes>;
}) => {
  const recipeBook = usePreloadedQuery(props.recipeBookPreloaded);
  const recipes = usePreloadedQuery(props.recipesPreloaded);
  const createRecipe = useMutation(api.recipes.createRecipe);

  const [resetForm, setResetForm] = useState<(() => void) | null>(null);
  const coverImageRef = useRef<ImageInputHandle>(null);
  const recipeImageRef = useRef<ImageInputHandle>(null);

  const [isNewFormOpen, setIsNewFormOpen] = useState(false);

  const handleSubmit: SubmitHandler<RecipeFormValues> = async (
    values: RecipeFormValues
  ) => {
    console.log("Should trigger submit");
    if (!recipeBook.data?._id) {
      notifyError("Error when creating recipe", "RecipebookId is empty");
      return;
    }

    try {
      const updatedCoverImage = await coverImageRef.current?.commit();
      const updatedRecipePhotoImage = await recipeImageRef.current?.commit();
      const response = await createRecipe({
        recipeBookId: recipeBook.data?._id,
        name: values.name,
        description: values.description,
        ingredients: values.ingredients,
        instructions: values.instructions,
        coverImage: updatedCoverImage ?? (values.coverImage as ImageStateProps),
        recipeImage:
          updatedRecipePhotoImage ?? (values.recipeImage as ImageStateProps),
        isImageRecipe: values.isImageRecipe,
      });

      if (response.data) {
        notifySuccess("Recipe book successfully created.");
        setIsNewFormOpen(false);
        return;
      }
      notifyError(response.status.toString(), response.errorMessage);
    } catch (error) {
      notifyError("Error creating recipe", error?.toString());
    }
  };

  if (!recipeBook.data) {
    return <></>;
  }

  if (isNewFormOpen) {
    return (
      <FormProviderWrapper
        onSubmit={handleSubmit}
        formSchema={recipeFormSchema}
        defaultValues={{
          name: "",
          instructions: "",
          description: undefined,
          ingredients: undefined,
          coverImage: undefined,
          recipeImage: undefined,
          isImageRecipe: false,
        }}
        passResetToParent={setResetForm}
        coverImageRef={coverImageRef}
        recipeImageRef={recipeImageRef}
        manualLeaveAction={() => setIsNewFormOpen(false)}
      >
        <main className="page">
          <NewRecipeHeader />
          <main className="page-content">
            <RecipeForm />
          </main>
        </main>
      </FormProviderWrapper>
    );
  }

  return (
    <main className="page">
      <PageHeader
        title={recipeBook.data.name}
        icon="recipe_book"
        description={recipeBook.data.description}
        actionButton={
          <>
            <LinkButton
              icon={<ArrowLeft />}
              href="/app"
              variant={ButtonVariant.Dark}
            />
            <div className="bg-accent w-[1.5px] h-6 mx-2 rounded"></div>
            <LinkButton
              icon={<Pencil />}
              href={`/app/${recipeBook.data._id}/detail`}
            />
            {recipeBook.data.privilage !== Privilage.Viewer && (
              <>
                <ActionButton
                  title="New"
                  icon={<Plus />}
                  onClick={() => setIsNewFormOpen(true)}
                  variant={ButtonVariant.Positive}
                />
              </>
            )}
          </>
        }
      />
      <main className="page-content">
        <ErrorHandler convexResponse={recipeBook} />
        <Recipes recipes={recipes} />
      </main>
    </main>
  );
};

export default RecipeBookPage;
