"use client";
import FormProviderWrapper from "@/components/FormProviderWrapper";
import ActionButton from "@/components/global/ActionButton";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import RecipeForm from "@/components/recipes/Form/RecipeForm";
import NewRecipeHeader from "@/components/recipes/headers/NewRecipeHeader";
import RecipesPaginated from "@/components/recipes/RecipeListPaginated";
import RecipeSearchResults from "@/components/RecipeSearchResults";
import { recipeFormSchema, RecipeFormValues } from "@/constants/formSchema";
import { api } from "@/convex/_generated/api";
import { ButtonVariant, HttpResponseCode, Privilage } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { ImageInputHandle, ImageStateProps } from "@/types";
import {
  Preloaded,
  useMutation,
  usePaginatedQuery,
  usePreloadedQuery,
} from "convex/react";
import { ArrowLeft, CalendarFold, Pencil, Plus, Search } from "lucide-react";
import React, { useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import NoContent from "@/components/global/NoContent";
import Recipe from "@/components/recipes/Recipe";
import { RECIPES_INITIAL_COUNT } from "@/constants/pagination";
import { Option } from "@/components/ui/multiple-selector";
import RecipeSearchInput from "@/components/RecipeSearchInput";
import { useTranslations } from "next-intl";
import { useTagManager } from "@/components/recipes/TagManager";

interface GroupPageProps {
  userPreloaded: Preloaded<typeof api.users.getLoggedUser>;
  groupPreloaded: Preloaded<typeof api.groups.getGroupById>;
  recipesPreloaded: Preloaded<typeof api.recipes.getRecipes>;
  todayRecipePreload: Preloaded<typeof api.planner.getTodayRecipe>;
}

const GroupPage = ({
  userPreloaded,
  groupPreloaded,
  recipesPreloaded,
  todayRecipePreload,
}: GroupPageProps) => {
  const t = useTranslations();

  const user = usePreloadedQuery(userPreloaded);
  const group = usePreloadedQuery(groupPreloaded);
  const initialRecipes = usePreloadedQuery(recipesPreloaded);
  const createRecipe = useMutation(api.recipes.createRecipe);
  const todayRecipe = usePreloadedQuery(todayRecipePreload);

  const { convertToValues } = useTagManager();

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
    if (!group.data?._id) {
      notifyError(
        t("Recipes.General.Notification.Error.Create"),
        "GroupId is empty"
      );
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
        tags: values.tags ? convertToValues(values.tags) : undefined,
      });

      if (!response.data) {
        switch (response.status) {
          case HttpResponseCode.InternalServerError:
            return notifyError(
              t("Recipes.General.Notification.Error.Create500")
            );
          default:
            return notifyError(t("Global.Notification.UnexpectedError"));
        }
      }

      notifySuccess(t("Recipes.General.Notification.Success.Create"));
      setIsNewFormOpen(false);
    } catch (error) {
      notifyError(
        t("Recipes.General.Notification.Error.Create"),
        error?.toString()
      );
    }
  };

  if (!group.data) {
    return <></>;
  }

  if (isNewFormOpen && user.data) {
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
            <RecipeForm isVerified={user.data.isVerified} />
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
                <div className="text-12">
                  {t("Groups.Planner.Button.Today")}
                </div>
                <div>
                  {todayRecipe.data?.length
                    ? todayRecipe.data[0].name
                    : t("Groups.Planner.TodayNoRecipe")}
                </div>
              </div>
            </div>
            {group.data.privilage !== Privilage.Viewer && (
              <>
                <div className="bg-accent w-[1.5px] h-6 mx-2 rounded"></div>
                <LinkButton
                  icon={<Pencil />}
                  href={`/app/${group.data._id}/edit`}
                />
                <ActionButton
                  title={t("Global.Button.New")}
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
        {!!initialRecipes.page.length && (
          <>
            <RecipeSearchInput
              group={group}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchTags={searchTags}
              setSearchTags={setSearchTags}
            />
          </>
        )}

        {searchTerm.length > 0 || searchTags.length ? (
          <RecipeSearchResults
            groupId={group.data._id}
            searchTerm={searchTerm}
            searchTags={convertToValues(searchTags)}
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
