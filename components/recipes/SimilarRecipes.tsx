import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useTranslations } from "next-intl";
import React from "react";
import { useTagManager } from "./TagManager";
import { Skeleton } from "../ui/skeleton";
import Recipe from "./Recipe";
import { Privilage } from "@/enums";

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
    { initialNumItems: 5 }
  );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="pb text-[28px]">{t("Recipes.General.SimilarRecipes")}</h2>
      {/* <div className="heading-underline" /> */}
      {similarRecipes.status === "LoadingFirstPage" && (
        <Skeleton className="w-full h-[150px] bg-primary/20 flex justify-center items-center">
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
