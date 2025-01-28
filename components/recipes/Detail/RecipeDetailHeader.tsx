import ActionButton from "@/components/global/ActionButton";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import { getRecipeById } from "@/convex/recipes";
import { ButtonVariant, Privilage } from "@/enums";
import React from "react";
import DeleteRecipeButton from "../DeleteRecipeButton";
import { ArrowLeft, Book, NotebookText, Save } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import RecipeChangeBanner from "../RecipeChangeBanner";

interface RecipeDetailHeaderProps {
  recipe: Awaited<ReturnType<typeof getRecipeById>>;
}

const RecipeDetailHeader = ({ recipe }: RecipeDetailHeaderProps) => {
  const t = useTranslations();
  const {
    formState: { isDirty, isSubmitting },
    handleSubmit,
  } = useFormContext();

  if (!recipe.data) return <></>;

  return (
    <PageHeader
      title={`${recipe.data.name}`}
      icon={<NotebookText className="text-white-1" />}
      descriptionSlot={
        <>
          {recipe.data.author && (
            <RecipeChangeBanner author={recipe.data.author} className="!pt-2" />
          )}
        </>
      }
      leftSide={
        <>
          <LinkButton
            icon={<ArrowLeft />}
            href={`/app/${recipe.data.groupId}`}
            variant={ButtonVariant.Minimalistic}
          />
          <LinkButton
            icon={<Book />}
            href={`/app/${recipe.data.groupId}/${recipe.data._id}`}
            variant={ButtonVariant.Minimalistic}
          />
        </>
      }
      rightSide={
        <>
          {recipe.data.privilage === Privilage.Owner && (
            <DeleteRecipeButton
              recipeId={recipe.data._id}
              groupId={recipe.data.groupId}
              recipeTitle={recipe.data.name}
              redirectAfterDelete
            />
          )}

          <ActionButton
            title={t("Global.Button.Save")}
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
