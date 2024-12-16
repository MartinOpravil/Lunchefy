import ActionButton from "@/components/global/ActionButton";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import { getRecipeById } from "@/convex/recipes";
import { ButtonVariant, Privilage } from "@/enums";
import { ArrowLeft, NotebookText, Pencil } from "lucide-react";
import React from "react";

interface RecipeHeaderProps {
  recipe: Awaited<ReturnType<typeof getRecipeById>>;
}

const RecipeHeader = ({ recipe }: RecipeHeaderProps) => {
  if (!recipe.data) return <></>;

  return (
    <PageHeader
      title={recipe.data.name}
      icon={<NotebookText className="text-white-1" />}
      description={recipe.data.description}
      leftSide={
        <LinkButton
          icon={<ArrowLeft />}
          href={`/app/${recipe.data.groupId}`}
          variant={ButtonVariant.Minimalistic}
        />
      }
      rightSide={
        <>
          {recipe.data.privilage !== Privilage.Viewer && (
            <LinkButton
              icon={<Pencil />}
              href={`/app/${recipe.data.groupId}/${recipe.data._id}/edit`}
              variant={ButtonVariant.Minimalistic}
            />
          )}
        </>
      }
    />
  );
};

export default RecipeHeader;
