import ActionButton from "@/components/global/ActionButton";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import { getRecipeById } from "@/convex/recipes";
import { Privilage } from "@/enums";
import React from "react";

interface RecipeHeaderProps {
  recipe: Awaited<ReturnType<typeof getRecipeById>>;
}

const RecipeHeader = ({ recipe }: RecipeHeaderProps) => {
  if (!recipe.data) return <></>;

  return (
    <PageHeader
      title={recipe.data.name}
      icon="recipe"
      description={recipe.data.description}
      actionButton={
        <>
          <LinkButton
            icon="back"
            href={`/app/${recipe.data.recipeBookId}`}
            classList="!bg-gray-700 hover:!bg-secondary"
          />
          {recipe.data.privilage !== Privilage.Viewer && (
            <>
              <div className="bg-accent w-[1.5px] h-6 mx-2 rounded"></div>
              <LinkButton
                icon="edit"
                href={`/app/${recipe.data.recipeBookId}/${recipe.data._id}/detail`}
              />
            </>
          )}
        </>
      }
    />
  );
};

export default RecipeHeader;
