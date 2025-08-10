import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";

import Recipe from "@/components/recipe/item/Recipe";
import { Skeleton } from "@/components/ui/skeleton";

import { Privilage } from "@/enums";
import { useTagManager } from "@/hooks/useTagManager";

interface SimilarRecipesProps {
  groupId: string;
  recipeId: string;
  recipeTags: string;
}

const SimilarRecipes = ({
  groupId,
  recipeId,
  recipeTags,
}: SimilarRecipesProps) => {
  const t = useTranslations();
  const { convertToTags } = useTagManager();

  const similarRecipes = usePaginatedQuery(
    api.recipes.getRecipes,
    {
      groupId,
      searchTerm: undefined,
      searchTags: recipeTags
        ? convertToTags(recipeTags).map((x) => x.value)
        : undefined,
    },
    { initialNumItems: 5 },
  );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="pb text-[28px]">{t("Recipes.General.SimilarRecipes")}</h2>
      {/* <div className="heading-underline" /> */}
      {similarRecipes.status === "LoadingFirstPage" && (
        <Skeleton className="flex h-[150px] w-full items-center justify-center bg-primary/20">
          <h3>{t("Global.Loading")}</h3>
        </Skeleton>
      )}
      <div className="flex flex-col gap-6">
        {similarRecipes.results
          .filter((x) => x._id !== recipeId)
          .map((recipe, index) => (
            <div key={index}>
              <Recipe
                recipe={recipe}
                privilage={Privilage.Viewer}
                vertical={true}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SimilarRecipes;
