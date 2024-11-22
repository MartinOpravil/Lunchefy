"use client";
import FormProviderWrapper from "@/components/FormProviderWrapper";
import ActionButton from "@/components/global/ActionButton";
import ErrorHandler from "@/components/global/ErrorHandler";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import RecipeForm from "@/components/recipes/Form/RecipeForm";
import NewRecipeHeader from "@/components/recipes/headers/NewRecipeHeader";
import RecipesPaginated from "@/components/recipes/RecipeListPaginated";
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
import { ArrowLeft, CalendarFold, Pencil, Plus, Search } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import NoContent from "@/components/global/NoContent";
import Recipe from "@/components/recipes/Recipe";
import { RECIPES_INITIAL_COUNT } from "@/constants/pagination";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { TagManager } from "@/lib/tags";
import RecipeSearchInput from "@/components/RecipeSearchInput";

interface GroupPageProps {
  groupPreloaded: Preloaded<typeof api.groups.getGroupById>;
  recipesPreloaded: Preloaded<typeof api.recipes.getRecipes>;
  todayRecipePreload: Preloaded<typeof api.planner.getTodayRecipe>;
}

const GroupPage = ({
  groupPreloaded,
  recipesPreloaded,
  todayRecipePreload,
}: GroupPageProps) => {
  const group = usePreloadedQuery(groupPreloaded);
  const initialRecipes = usePreloadedQuery(recipesPreloaded);
  const createRecipe = useMutation(api.recipes.createRecipe);
  const todayRecipe = usePreloadedQuery(todayRecipePreload);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTags, setSearchTags] = useState<Option[]>([]);

  const [resetForm, setResetForm] = useState<(() => void) | null>(null);
  const coverImageRef = useRef<ImageInputHandle>(null);
  const recipeImageRef = useRef<ImageInputHandle>(null);

  const [isNewFormOpen, setIsNewFormOpen] = useState(false);

  const recipeListPaginated = usePaginatedQuery(
    api.recipes.getRecipes,
    {
      groupId: group.data?._id!,
    },
    { initialNumItems: RECIPES_INITIAL_COUNT }
  );

  const handleSubmit: SubmitHandler<RecipeFormValues> = async (
    values: RecipeFormValues
  ) => {
    console.log("Should trigger submit");
    if (!group.data?._id) {
      notifyError("Error when creating recipe", "GroupId is empty");
      return;
    }

    try {
      const updatedCoverImage = await coverImageRef.current?.commit();
      const updatedRecipePhotoImage = await recipeImageRef.current?.commit();
      const response = await createRecipe({
        groupId: group.data?._id,
        name: values.name,
        description: values.description,
        ingredients: values.ingredients,
        instructions: values.instructions,
        coverImage: updatedCoverImage ?? (values.coverImage as ImageStateProps),
        recipeImage:
          updatedRecipePhotoImage ?? (values.recipeImage as ImageStateProps),
        isImageRecipe: values.isImageRecipe,
        tags: values.tags ? TagManager.convertToValues(values.tags) : undefined,
      });

      if (response.data) {
        notifySuccess("Group successfully created.");
        setIsNewFormOpen(false);
        return;
      }
      notifyError(response.status.toString(), response.errorMessage);
    } catch (error) {
      notifyError("Error creating group", error?.toString());
    }
  };

  if (!group.data) {
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
          tags: undefined,
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
        title={group.data.name}
        icon="recipe_book"
        description={group.data.description}
        actionButton={
          <>
            <LinkButton
              icon={<ArrowLeft />}
              href="/app"
              variant={ButtonVariant.Dark}
            />
            <div className="flex gap-2 items-center bg-accent/70 rounded-md">
              <LinkButton
                icon={<CalendarFold />}
                href={`/app/${group.data._id}/planner`}
              />
              <div className="text-white-1 pr-2">
                <div className="text-12">Today</div>
                <div>
                  {todayRecipe.data?.length
                    ? todayRecipe.data[0].name
                    : "No recipe"}
                </div>
              </div>
            </div>
            <div className="bg-accent w-[1.5px] h-6 mx-2 rounded"></div>
            <LinkButton
              icon={<Pencil />}
              href={`/app/${group.data._id}/edit`}
            />
            {group.data.privilage !== Privilage.Viewer && (
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
        <ErrorHandler convexResponse={group} />
        {!!initialRecipes.page.length && (
          <>
            <RecipeSearchInput
              group={group}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchTags={searchTags}
              setSearchTags={setSearchTags}
            />

            {/* <div className="w-full flex flex-col gap-4 justify-start items-start sm:flex-row sm:items-start">
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
            <MultipleSelector
              className="input-class border-2 border-accent focus-visible:ring-secondary transition"
              defaultOptions={TagManager.getTagOptions()}
              placeholder="Tags"
              value={searchTags}
              onChange={setSearchTags}
            />
          </div> */}
          </>
        )}

        {searchTerm.length > 0 || searchTags.length ? (
          <RecipeSearchResults
            groupId={group.data._id}
            searchTerm={searchTerm}
            searchTags={TagManager.convertToValues(searchTags)}
            privilage={group.data.privilage}
          />
        ) : (
          <div className="w-full">
            <div className="w-full overflow-y-auto">
              <div className="flex w-full flex-col items-center gap-3 @container">
                {!initialRecipes.page.length ? (
                  <>
                    {group.data.privilage === Privilage.Viewer ? (
                      <NoContent
                        title="This group has no recipes yet"
                        subTitle="Contact a responsible person to add some"
                      />
                    ) : (
                      <NoContent
                        title="This group has no recipes yet"
                        subTitle="Start by creating one"
                      />
                    )}
                  </>
                ) : (
                  <>
                    {!recipeListPaginated.results.length &&
                    !!initialRecipes.page.length ? (
                      <div className="recipe-grid">
                        {initialRecipes.page.map((recipe) => (
                          <Recipe
                            key={recipe._id}
                            id={recipe._id}
                            groupId={recipe.groupId}
                            title={recipe.name}
                            description={recipe.description}
                            imageUrl={recipe.coverImage?.imageUrl}
                            privilage={group.data?.privilage!}
                          />
                        ))}
                      </div>
                    ) : (
                      <RecipesPaginated
                        recipeListPaginated={recipeListPaginated}
                        privilage={group.data.privilage}
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

export default GroupPage;
