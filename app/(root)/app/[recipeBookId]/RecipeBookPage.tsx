"use client";
import FormProviderWrapper from "@/components/FormProviderWrapper";
import ActionButton from "@/components/global/ActionButton";
import ErrorHandler from "@/components/global/ErrorHandler";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import RecipeForm from "@/components/recipes/Form/RecipeForm";
import NewRecipeHeader from "@/components/recipes/headers/NewRecipeHeader";
import RecipesPaginated from "@/components/recipes/RecipesPaginated";
import RecipeSearchResults from "@/components/RecipeSearchResults";
import { Input } from "@/components/ui/input";
import { recipeFormSchema, RecipeFormValues } from "@/constants/formSchemas";
import { api } from "@/convex/_generated/api";
import { ButtonVariant, Privilage } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { ImageInputHandle, ImageStateProps } from "@/types";
import {
  Preloaded,
  useMutation,
  usePaginatedQuery,
  usePreloadedQuery,
} from "convex/react";
import { debounce } from "lodash";
import { ArrowLeft, Pencil, Plus, Search } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import NoContent from "@/components/global/NoContent";
import Recipe from "@/components/recipes/Recipe";
import { RECIPES_INITIAL_COUNT } from "@/constants/pagination";

const RecipeBookPage = (props: {
  recipeBookPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBookById>;
  recipesPreloaded: Preloaded<typeof api.recipes.getRecipes>;
}) => {
  const recipeBook = usePreloadedQuery(props.recipeBookPreloaded);
  const initialRecipes = usePreloadedQuery(props.recipesPreloaded);
  const createRecipe = useMutation(api.recipes.createRecipe);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [resetForm, setResetForm] = useState<(() => void) | null>(null);
  const coverImageRef = useRef<ImageInputHandle>(null);
  const recipeImageRef = useRef<ImageInputHandle>(null);

  const [isNewFormOpen, setIsNewFormOpen] = useState(false);

  const recipesPaginated = usePaginatedQuery(
    api.recipes.getRecipes,
    {
      recipeBookId: recipeBook.data?._id!,
    },
    { initialNumItems: RECIPES_INITIAL_COUNT }
  );

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
      // setIsFiltering(true);
      setDebouncedSearchTerm(value);
      // setTimeout(() => setIsFiltering(false), 200);
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
    <main className="page pb-8">
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
        {!!initialRecipes.page.length && (
          <div className="w-full flex flex-col gap-4 justify-start items-start sm:flex-row sm:items-center">
            <div className="flex gap-1 bg-accent p-2 rounded-lg text-white-1">
              <Search color="white" />
              Search:
            </div>
            <Input
              className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
              placeholder="Recipe name"
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </div>
        )}

        {debouncedSearchTerm.length > 0 ? (
          <RecipeSearchResults
            recipeBookId={recipeBook.data._id}
            searchTerm={debouncedSearchTerm}
            privilage={recipeBook.data.privilage}
          />
        ) : (
          <div className="w-full">
            <div className="w-full overflow-y-auto">
              <div className="flex w-full flex-col items-center gap-3">
                {!initialRecipes.page.length ? (
                  <>
                    {recipeBook.data.privilage === Privilage.Viewer ? (
                      <NoContent
                        title="This book has no recipes yet"
                        subTitle="Contact a responsible person to add some"
                      />
                    ) : (
                      <NoContent
                        title="This book has no recipes yet"
                        subTitle="Start by creating one"
                      />
                    )}
                  </>
                ) : (
                  <>
                    {!recipesPaginated.results.length &&
                    !!initialRecipes.page.length ? (
                      <div className="recipe-grid">
                        {initialRecipes.page.map((recipe) => (
                          <Recipe
                            key={recipe._id}
                            id={recipe._id}
                            recipeBookId={recipe.recipeBookId}
                            title={recipe.name}
                            description={recipe.description}
                            imageUrl={recipe.coverImage?.imageUrl}
                            privilage={recipeBook.data?.privilage!}
                          />
                        ))}
                      </div>
                    ) : (
                      <RecipesPaginated
                        recipesPaginated={recipesPaginated}
                        privilage={recipeBook.data.privilage}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </main>
  );
};

export default RecipeBookPage;
