import ActionButton from "@/components/global/ActionButton";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import { getRecipeById } from "@/convex/recipes";
import { Privilage } from "@/enums";
import React from "react";
import DeleteRecipeButton from "../DeleteRecipeButton";

interface RecipeDetailHeaderProps {
  recipe: Awaited<ReturnType<typeof getRecipeById>>;
}

const RecipeDetailHeader = ({ recipe }: RecipeDetailHeaderProps) => {
  if (!recipe.data) return <></>;

  return (
    <PageHeader
      title={`${recipe.data.name}`}
      icon="recipe"
      actionButton={
        <>
          <LinkButton
            icon="back"
            href={`/app/${recipe.data.recipeBookId}`}
            classList="!bg-gray-700 hover:!bg-secondary"
          />
          <div className="bg-accent w-[1.5px] h-6 mx-2 rounded"></div>
          {recipe.data.privilage === Privilage.Owner && (
            <DeleteRecipeButton
              recipeId={recipe.data._id}
              recipeBookId={recipe.data.recipeBookId}
              recipeTitle={recipe.data.name}
              redirectAfterDelete
              classList="!bg-accent"
            />
          )}
          <LinkButton
            icon="viewer"
            href={`/app/${recipe.data.recipeBookId}/${recipe.data._id}`}
          />
        </>
      }
    />
  );
};

export default RecipeDetailHeader;
