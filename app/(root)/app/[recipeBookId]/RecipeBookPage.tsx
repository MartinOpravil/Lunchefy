"use client";
import FormProviderWrapper from "@/components/FormProviderWrapper";
import ActionButton from "@/components/global/ActionButton";
import ErrorHandler from "@/components/global/ErrorHandler";
import LinkButton from "@/components/global/LinkButton";
import LoaderSpinner from "@/components/global/LoaderSpinner";
import PageHeader from "@/components/global/PageHeader";
import RecipeForm from "@/components/recipes/Form/RecipeForm";
import NewRecipeHeader from "@/components/recipes/headers/NewRecipeHeader";
import Recipes from "@/components/recipes/Recipes";
import RecipeSearchResults from "@/components/RecipeSearchResults";
import { Input } from "@/components/ui/input";
import { recipeFormSchema, RecipeFormValues } from "@/constants/FormSchemas";
import { api } from "@/convex/_generated/api";
import { getRecipes } from "@/convex/recipes";
import { ButtonVariant, Privilage } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { ImageInputHandle, ImageStateProps } from "@/types";
import {
  Preloaded,
  resetPaginationId,
  useMutation,
  usePaginatedQuery,
  usePreloadedQuery,
  useQuery,
} from "convex/react";
import { debounce } from "lodash";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";

const RecipeBookPage = (props: {
  recipeBookPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBookById>;
  recipesPreloaded: Preloaded<typeof api.recipes.getRecipes>;
}) => {
  const recipeBook = usePreloadedQuery(props.recipeBookPreloaded);
  const recipes = usePreloadedQuery(props.recipesPreloaded);
  const createRecipe = useMutation(api.recipes.createRecipe);
  const [queryVersion, setQueryVersion] = useState(0); // Versioning to reset query

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Pagination options with reset based on search term
  const pageSize = 5; // Set how many items you want per page
  const paginationOpts = { numItems: pageSize };

  // UseEffect to reset the paginated query when searchTerm changes
  useEffect(() => {
    setQueryVersion((prev) => prev + 1); // Trigger query re-run by changing version
    resetPaginationId();
  }, [searchTerm]);

  // const filteredRecipes = usePaginatedQuery(
  //   api.recipes.getRecipes,
  //   {
  //     recipeBookId: recipeBook.data?._id!,
  //     searchTerm: debouncedSearchTerm,
  //   },
  //   {
  //     initialNumItems: 5,
  //   }
  // );

  const [isFiltering, setIsFiltering] = useState(false);

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

  const debouncedUpdate = useCallback(
    debounce((value) => {
      setIsFiltering(true);
      setDebouncedSearchTerm(value);
      setTimeout(() => setIsFiltering(false), 200);
    }, 500), // 500ms delay, adjust as needed
    []
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value); // Immediate state update for input
    debouncedUpdate(value); // Debounced state for the query
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
      <main className="page-content gap-6">
        <ErrorHandler convexResponse={recipeBook} />
        <Input
          className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
          placeholder="Search"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
        />
        {isFiltering ? (
          <LoaderSpinner />
        ) : (
          // <Recipes recipes={filteredRecipes ? filteredRecipes : recipes} />
          <div className="flex gap-2 items-start justify-around w-full">
            {searchTerm && (
              <RecipeSearchResults
                recipeBookId={recipeBook.data._id}
                searchTerm={debouncedSearchTerm}
                key={queryVersion}
              />
            )}

            <div className="flex flex-col gap-2 justify-center items-center">
              <h3>All results:</h3>
              {recipes.page.map((x, index) => (
                <div key={index}>{x.name}</div>
              ))}

              {/* Handle all status representations */}
              {/* <div
              onClick={() => filteredRecipes.loadMore(2)}
              className="p-2 bg-secondary"
            >
              {recipes.continueCursor === "CanLoadMore"
                ? "Load more"
                : "All loaded"}
            </div> */}
            </div>
          </div>
        )}
      </main>
    </main>
  );
};

export default RecipeBookPage;
