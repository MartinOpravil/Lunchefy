"use client";
import PageHeader from "@/components/global/PageHeader";
import { api } from "@/convex/_generated/api";
import React, { useRef, useState } from "react";
import RecipeBooks from "@/components/recipeBooks/RecipeBooks";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import ActionButton from "@/components/global/ActionButton";
import { Plus } from "lucide-react";
import { ButtonVariant } from "@/enums";
import { ImageInputHandle, ImageStateProps } from "@/types";
import NewRecipeBookHeader from "@/components/recipeBooks/header/NewRecipeBookHeader";
import FormProviderWrapper from "@/components/FormProviderWrapper";
import {
  recipeBookFormSchema,
  RecipeBookFormValues,
} from "@/constants/formSchemas";
import RecipeBookForm from "@/components/recipeBooks/form/RecipeBookForm";
import { SubmitHandler } from "react-hook-form";
import { notifyError, notifySuccess } from "@/lib/notifications";

const RecipeBooksPage = (props: {
  recipeBooksPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBooks>;
}) => {
  const recipeBooks = usePreloadedQuery(props.recipeBooksPreloaded);
  const createRecipeBook = useMutation(api.recipeBooks.createRecipeBook);
  const [isNewFormOpen, setIsNewFormOpen] = useState(false);

  const [resetForm, setResetForm] = useState<(() => void) | null>(null);
  const coverImageRef = useRef<ImageInputHandle>(null);

  const handleSubmit: SubmitHandler<RecipeBookFormValues> = async (
    values: RecipeBookFormValues
  ) => {
    try {
      const updatedImage = await coverImageRef.current?.commit();
      const response = await createRecipeBook({
        name: values.name,
        description: values.description,
        coverImage: updatedImage ?? (values.coverImage as ImageStateProps),
      });

      if (response.data) {
        notifySuccess("Recipe book successfully created.");
        setIsNewFormOpen(false);
        return;
      }
      notifyError(response.status.toString(), response.errorMessage);
    } catch (error) {
      console.log("Error creating recipe book", error);
    }
  };

  // New Form
  if (isNewFormOpen) {
    return (
      <FormProviderWrapper
        onSubmit={handleSubmit}
        formSchema={recipeBookFormSchema}
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
          <NewRecipeBookHeader />
          <main className="page-content">
            <RecipeBookForm />
          </main>
        </main>
      </FormProviderWrapper>
    );
  }

  // Overview
  return (
    <main className="page">
      <PageHeader
        title="Recipe books"
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
      <main className="page-content">
        <RecipeBooks recipeBooks={recipeBooks} />
      </main>
    </main>
  );
};

export default RecipeBooksPage;
