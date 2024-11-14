import ActionButton from "@/components/global/ActionButton";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import { getRecipeById } from "@/convex/recipes";
import { ButtonVariant, Privilage } from "@/enums";
import { ArrowLeft, Pencil } from "lucide-react";
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
            icon={<ArrowLeft />}
            href={`/app/${recipe.data.groupId}`}
            variant={ButtonVariant.Dark}
          />
          {recipe.data.privilage !== Privilage.Viewer && (
            <>
              <div className="bg-accent w-[1.5px] h-6 mx-2 rounded"></div>
              <LinkButton
                icon={<Pencil />}
                href={`/app/${recipe.data.groupId}/${recipe.data._id}/edit`}
              />
            </>
          )}
        </>
      }
    />
  );
};

export default RecipeHeader;
