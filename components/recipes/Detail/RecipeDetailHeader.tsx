import ActionButton from "@/components/global/ActionButton";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import { getRecipeById } from "@/convex/recipes";
import { ButtonVariant, Privilage } from "@/enums";
import React from "react";
import DeleteRecipeButton from "../DeleteRecipeButton";
import {
  ArrowBigLeft,
  ArrowLeft,
  MoveLeft,
  NotebookText,
  Save,
  SquareArrowOutUpRight,
} from "lucide-react";

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
            icon={<SquareArrowOutUpRight />}
            // iconName="viewer"
            href={`/app/${recipe.data.recipeBookId}/${recipe.data._id}`}
          />
          {/* <ActionButton
            title="Save"
            icon={<Save />}
            // isLoading={isSubmitting}
            // isDisabled={!form.formState.isDirty}
            variant={ButtonVariant.Positive}
            // classList="min-w-32"
            // onClick={form.handleSubmit(onSubmit)}
            onClick={() => {}}
          /> */}
        </>
      }
    />
  );
};

export default RecipeDetailHeader;
