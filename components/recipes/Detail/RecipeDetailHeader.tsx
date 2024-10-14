import ActionButton from "@/components/global/ActionButton";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import { getRecipeById } from "@/convex/recipes";
import { ButtonVariant, Privilage } from "@/enums";
import React from "react";
import DeleteRecipeButton from "../DeleteRecipeButton";
import { ArrowLeft, Book, Save } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface RecipeDetailHeaderProps {
  recipe: Awaited<ReturnType<typeof getRecipeById>>;
}

const RecipeDetailHeader = ({ recipe }: RecipeDetailHeaderProps) => {
  const {
    formState: { isDirty, isSubmitting },
    handleSubmit,
  } = useFormContext();

  if (!recipe.data) return <></>;

  return (
    <PageHeader
      title={`${recipe.data.name}`}
      icon="recipe"
      actionButton={
        <>
          <LinkButton
            // iconName="back"
            icon={<ArrowLeft />}
            href={`/app/${recipe.data.recipeBookId}`}
            variant={ButtonVariant.Dark}
          />
          <div className="bg-accent w-[1.5px] h-6 mx-2 rounded"></div>
          {recipe.data.privilage === Privilage.Owner && (
            <DeleteRecipeButton
              recipeId={recipe.data._id}
              recipeBookId={recipe.data.recipeBookId}
              recipeTitle={recipe.data.name}
              redirectAfterDelete
            />
          )}
          <LinkButton
            icon={<Book />}
            href={`/app/${recipe.data.recipeBookId}/${recipe.data._id}`}
          />
          <ActionButton
            title="Save"
            icon={<Save />}
            variant={ButtonVariant.Positive}
            isDisabled={!isDirty}
            onClick={() => handleSubmit}
            isLoading={isSubmitting}
          />
        </>
      }
    />
  );
};

export default RecipeDetailHeader;
