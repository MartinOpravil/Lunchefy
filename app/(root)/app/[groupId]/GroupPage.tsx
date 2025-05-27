"use client";

import { useEffect, useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePaginatedQuery, usePreloadedQuery } from "convex/react";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ClockArrowDown,
  ClockArrowUp,
  Tags,
} from "lucide-react";

import OverviewGroupHeader from "@/components/group/header/OverviewGroupHeader";
import NewRecipeForm from "@/components/recipe/form/NewRecipeForm";
import DefaultRecipeList from "@/components/recipe/item/DefaultRecipeList";
import RecipeSearchInput from "@/components/recipe/search/RecipeSearchInput";
import RecipeSearchResults from "@/components/recipe/search/RecipeSearchResults";
import SettingsCheckboxItem from "@/components/recipe/search/settings/SettingsCheckboxItem";
import SettingsRadioItem from "@/components/recipe/search/settings/SettingsRadioItem";
import { DropdownMenuRadioGroup } from "@/components/ui/dropdown-menu";

import { DEFAULT_RECIPE_ORDER_BY } from "@/constants/order";
import { RECIPES_INITIAL_COUNT } from "@/constants/pagination";
import { OrderBy, PlannerAge } from "@/enums";
import { useTagManager } from "@/hooks/TagManager";
import { getPlannerAgeMiliseconds } from "@/lib/time";
import { useGroupStore } from "@/store/group";

interface GroupPageProps {
  userPreloaded: Preloaded<typeof api.users.getLoggedUser>;
  groupPreloaded: Preloaded<typeof api.groups.getGroupById>;
  recipesPreloaded: Preloaded<typeof api.recipes.getRecipes>;
  todayRecipePreload: Preloaded<typeof api.planner.getTodayRecipe>;
}

const currentDate = Date.now();

const GroupPage = ({
  userPreloaded,
  groupPreloaded,
  recipesPreloaded,
  todayRecipePreload,
}: GroupPageProps) => {
  const t = useTranslations();
  const {
    setIsFetched,
    searchBy,
    setSearchBy,
    searchTerm,
    setSearchTerm,
    searchTags,
    setSearchTags,
    planAge,
    setPlanAge,
    setTodayRecipeList,
  } = useGroupStore();
  const user = usePreloadedQuery(userPreloaded);
  const group = usePreloadedQuery(groupPreloaded);
  const initialRecipes = usePreloadedQuery(recipesPreloaded);

  const todayRecipe = usePreloadedQuery(todayRecipePreload);

  useEffect(() => {
    if (todayRecipe.data)
      setTodayRecipeList(
        todayRecipe.data.map((x) => {
          return { id: x._id, name: x.name };
        }),
      );
    setIsFetched(true);
  }, [todayRecipe, setTodayRecipeList, setIsFetched]);

  const { convertToValues } = useTagManager();

  const [orderBy, setOrderBy] = useState<OrderBy>(DEFAULT_RECIPE_ORDER_BY);

  const [isNewFormOpen, setIsNewFormOpen] = useState(false);
  const [isShowingRecipeTags, setIsShowingRecipeTags] = useState(false);

  const recipeListAge = useMemo(() => {
    return getPlannerAgeMiliseconds(currentDate, planAge as PlannerAge);
  }, [planAge]);

  const recipeListPaginated = usePaginatedQuery(
    api.recipes.getRecipes,
    {
      groupId: group.data?._id!,
      orderBy,
    },
    { initialNumItems: RECIPES_INITIAL_COUNT },
  );

  const isShowingFilteredResults = useMemo(() => {
    return searchTerm.length > 0 || !!searchTags.length || !!recipeListAge;
  }, [searchTerm, searchTags, recipeListAge]);

  if (!group.data) {
    return <></>;
  }

  if (isNewFormOpen && user.data) {
    return (
      <NewRecipeForm
        groupId={group.data._id}
        isUserVerified={user.data.isVerified}
        manualLeaveAction={() => setIsNewFormOpen(false)}
      />
    );
  }

  return (
    <main className="page page-width-normal pb-4">
      <OverviewGroupHeader
        group={group.data}
        privilage={group.data.privilage}
        onNewClickAction={() => setIsNewFormOpen(true)}
      />
      <section className="page-content gap-6">
        {!!initialRecipes.page.length && (
          <div className="w-full flex-row flex-nowrap items-center justify-center">
            <RecipeSearchInput
              group={group}
              searchBy={searchBy}
              setSearchBy={setSearchBy}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchTags={searchTags}
              setSearchTags={setSearchTags}
              plannerAge={planAge}
              setPlannerAge={setPlanAge}
              classList="@sm:w-[700px]"
              showSettings
              settingViewItems={
                <SettingsCheckboxItem
                  value={isShowingRecipeTags}
                  setValue={setIsShowingRecipeTags}
                  icon={<Tags />}
                  label={t("Recipes.View.ShowTags")}
                />
              }
              showOrderSettings={!isShowingFilteredResults}
              settingOrderItems={
                <DropdownMenuRadioGroup
                  value={orderBy}
                  onValueChange={(val: string) => setOrderBy(val as OrderBy)}
                >
                  <SettingsRadioItem
                    value={OrderBy.CreationDateDescend}
                    icon={<ClockArrowDown />}
                    label={t("Recipes.View.CreationDate")}
                  />
                  <SettingsRadioItem
                    value={OrderBy.CreationDateAscend}
                    icon={<ClockArrowUp />}
                    label={t("Recipes.View.CreationDate")}
                  />

                  <SettingsRadioItem
                    value={OrderBy.NameAscend}
                    icon={<ArrowDownAZ />}
                    label={t("Recipes.View.Name")}
                  />
                  <SettingsRadioItem
                    value={OrderBy.NameDescend}
                    icon={<ArrowUpAZ />}
                    label={t("Recipes.View.Name")}
                  />
                </DropdownMenuRadioGroup>
              }
            />
          </div>
        )}

        {isShowingFilteredResults ? (
          <RecipeSearchResults
            groupId={group.data._id}
            searchTerm={searchTerm}
            searchTags={convertToValues(searchTags)}
            privilage={group.data.privilage}
            showTags={isShowingRecipeTags}
            dateMiliseconds={recipeListAge}
          />
        ) : (
          <DefaultRecipeList
            initialRecipeList={initialRecipes}
            recipeList={recipeListPaginated}
            privilage={group.data.privilage}
            isShowingRecipeTags={isShowingRecipeTags}
          />
        )}
      </section>
    </main>
  );
};

export default GroupPage;
