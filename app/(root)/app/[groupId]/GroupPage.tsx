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
import { ArrowLeft, ChefHat, Pencil, Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import NoContent from "@/components/global/NoContent";
import Recipe from "@/components/recipes/Recipe";
import { RECIPES_INITIAL_COUNT } from "@/constants/pagination";
import { Option } from "@/components/ui/multiple-selector";
import RecipeSearchInput from "@/components/RecipeSearchInput";
import { useTranslations } from "next-intl";
import { useTagManager } from "@/components/recipes/TagManager";
import PlannerButton from "@/components/groups/PlannerButton";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

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
  const [isShowingRecipeTags, setIsShowingRecipeTags] = useState(false);

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
        <main className="page page-width-normal">
          <NewRecipeHeader />
          <main className="page-content">
            <RecipeForm isVerified={user.data.isVerified} />
          </main>
        </main>
      </FormProviderWrapper>
    );
  }

  return (
    <main className="page pb-4 page-width-normal">
      <PageHeader
        title={group.data.name}
        icon={<ChefHat className="text-white-1" />}
        description={group.data.description}
        leftSide={
          <LinkButton
            icon={<ArrowLeft />}
            href="/app"
            variant={ButtonVariant.Minimalistic}
          />
        }
        rightSide={
          <>
            {group.data.privilage !== Privilage.Viewer && (
              <ActionButton
                title={t("Global.Button.New")}
                icon={<Plus />}
                onClick={() => setIsNewFormOpen(true)}
                variant={ButtonVariant.Positive}
              />
            )}
          </>
        }
        topLeftSide={
          <>
            {group.data.privilage !== Privilage.Viewer && (
              <LinkButton
                icon={
                  <Pencil className="text-text2 group-hover:text-text transition-all" />
                }
                href={`/app/${group.data._id}/edit`}
                variant={ButtonVariant.Minimalistic}
              />
            )}
          </>
        }
        topRightSide={
          <PlannerButton
            groupId={group.data._id}
            todayRecipeName={todayRecipe.data?.[0]?.name}
            todayRecipeCount={todayRecipe.data?.length}
          />
        }
      />
      <section className="page-content gap-6">
        {!!initialRecipes.page.length && (
          <div className="w-full flex-row flex-nowrap justify-center items-center">
            <RecipeSearchInput
              group={group}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchTags={searchTags}
              setSearchTags={setSearchTags}
              classList="@sm:w-[700px]"
              showSettings
              settingItems={
                <DropdownMenuCheckboxItem
                  checked={isShowingRecipeTags}
                  onCheckedChange={setIsShowingRecipeTags}
                >
                  {t("Recipes.View.ShowTags")}
                </DropdownMenuCheckboxItem>
              }
            />
          </div>
        )}

        {searchTerm.length > 0 || searchTags.length ? (
          <RecipeSearchResults
            groupId={group.data._id}
            searchTerm={searchTerm}
            searchTags={convertToValues(searchTags)}
            privilage={group.data.privilage}
            showTags={isShowingRecipeTags}
          />
        ) : (
          <div className="flex w-full h-full flex-col flex-grow items-center gap-3 @container">
            {!initialRecipes.page.length ? (
              <div className="w-full h-full flex flex-col flex-grow items-center justify-center pb-[64px]">
                {group.data.privilage === Privilage.Viewer ? (
                  <NoContent
                    title={t("Groups.Empty.Recipes.title")}
                    subTitle={t("Groups.Empty.Recipes.subTitleNoPermission")}
                  />
                ) : (
                  <NoContent
                    title={t("Groups.Empty.Recipes.title")}
                    subTitle={t("Groups.Empty.Recipes.subTitle")}
                  />
                )}
              </div>
            ) : (
              <>
                {!recipeListPaginated.results.length &&
                !!initialRecipes.page.length ? (
                  <div className="recipe-grid">
                    {initialRecipes.page.map((recipe) => (
                      <Recipe
                        recipe={recipe}
                        key={recipe._id}
                        privilage={group.data?.privilage!}
                        showTags={isShowingRecipeTags}
                      />
                    ))}
                  </div>
                ) : (
                  <RecipesPaginated
                    recipeListPaginated={recipeListPaginated}
                    privilage={group.data.privilage}
                    showTags={isShowingRecipeTags}
                  />
                )}
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default GroupPage;
