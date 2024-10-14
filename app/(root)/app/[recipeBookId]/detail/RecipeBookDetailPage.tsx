"use client";
import FormProviderWrapper from "@/components/FormProviderWrapper";
import ErrorHandler from "@/components/global/ErrorHandler";
import RecipeBookForm from "@/components/recipeBooks/form/RecipeBookForm";
import RecipeBookDetailHeader from "@/components/recipeBooks/Detail/RecipeBookDetailHeader";
import {
  recipeBookFormSchema,
  RecipeBookFormValues,
} from "@/constants/FormSchemas";
import { api } from "@/convex/_generated/api";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { ImageInputHandle, ImageStateProps } from "@/types";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";

const RecipeBookDetailPage = (props: {
  recipeBookPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBookById>;
}) => {
  const router = useRouter();
  const recipeBook = usePreloadedQuery(props.recipeBookPreloaded);
  const updateRecipeBook = useMutation(api.recipeBooks.updateRecipeBook);

  const coverImageRef = useRef<ImageInputHandle>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [resetForm, setResetForm] = useState<(() => void) | null>(null);

  const handleSubmit: SubmitHandler<RecipeBookFormValues> = async (
    values: RecipeBookFormValues
  ) => {
    if (!recipeBook.data) return;

    try {
      const updatedImage = await coverImageRef.current?.commit();
      const response = await updateRecipeBook({
        id: recipeBook.data?._id,
        name: values.name,
        description: values.description,
        image: updatedImage ?? (values.image as ImageStateProps),
      });

      if (!response.data)
        return notifyError(response.status.toString(), response.errorMessage);
      notifySuccess("Successfully updated recipe book");
      // router.push("/app");
      if (resetForm) resetForm();
      router.refresh();
    } catch (error) {
      notifyError("Error creating recipe book", error?.toString());
    }
  };

  return (
    <FormProviderWrapper
      onSubmit={handleSubmit}
      formSchema={recipeBookFormSchema}
      defaultValues={{
        name: recipeBook.data?.name ?? "",
        description: recipeBook.data?.description,
        image: recipeBook.data?.image,
      }}
      onFormStateChange={setIsFormDirty}
      passResetToParent={setResetForm}
      coverImageRef={coverImageRef}
    >
      <main className="page">
        <RecipeBookDetailHeader recipeBook={recipeBook} />
        <main className="page-content">
          <ErrorHandler convexResponse={recipeBook} />
          <RecipeBookForm recipeBook={recipeBook} />
        </main>
      </main>
    </FormProviderWrapper>
  );
};

export default RecipeBookDetailPage;
