"use client";

import { useRef } from "react";

import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ArrowLeft, CalendarDays, Pencil } from "lucide-react";

import LinkButton from "@/components/global/button/LinkButton";
import PageHeader from "@/components/global/content/PageHeader";
import ChosenImage from "@/components/global/image/ChosenImage";
import Lightbox, { LightboxHandle } from "@/components/global/image/Lightbox";
import LatestRecipeDateInPlanner from "@/components/recipe/LatestRecipeDateInPlanner";
import RecipeChangeBanner from "@/components/recipe/RecipeChangeBanner";
import SimilarRecipes from "@/components/recipe/SimilarRecipes";
import AssignRecipeToDateButton from "@/components/recipe/button/AssignRecipeToDateButton";
import RecipeTagList from "@/components/recipe/tag/RecipeTagList";

import { ButtonVariant, Privilage } from "@/enums";
import { useGroupStore } from "@/store/group";

interface RecipePageProps {
  recipePreloaded: Preloaded<typeof api.recipes.getRecipeById>;
}

const RecipePage = ({ recipePreloaded }: RecipePageProps) => {
  const t = useTranslations("Recipes.General");
  const { isRecipeInTodayList } = useGroupStore();
  const recipe = usePreloadedQuery(recipePreloaded);
  const lightboxRef = useRef<LightboxHandle>(null);

  if (!recipe.data) {
    return <></>;
  }

  return (
    <main className="page page-width-normal">
      <PageHeader
        title={recipe.data.name}
        showIcon={false}
        titleClassName="md:text-[60px]"
        descriptionSlot={
          <>
            {recipe.data.author && (
              <RecipeChangeBanner author={recipe.data.author} />
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
              icon={<CalendarDays />}
              href={`/app/${recipe.data.groupId}/planner`}
              variant={ButtonVariant.Minimalistic}
            />
            <LatestRecipeDateInPlanner recipe={recipe.data} />
          </>
        }
        rightSide={
          <>
            <AssignRecipeToDateButton recipe={recipe.data} />
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
      <section className="page-content">
        <div className="flex w-full flex-col gap-16">
          {recipe.data.description && (
            <div className="text-16 text-text sm:text-[20px]">
              {recipe.data.description}
            </div>
          )}
          {recipe.data.coverImage &&
            (recipe.data.coverImage.imageUrl ||
              recipe.data.coverImage.externalUrl) && (
              <div className="aspect-[16/10] w-full overflow-hidden rounded-xl outline outline-2 outline-transparent transition-all hover:outline-primary">
                <ChosenImage
                  image={recipe.data.coverImage}
                  onClick={() =>
                    lightboxRef.current?.setOpen(
                      recipe.data?.coverImage?.imageUrl ||
                        recipe.data?.coverImage?.externalUrl,
                    )
                  }
                />
              </div>
            )}
          <div className="flex flex-col gap-20 sm:flex-row">
            <div className="flex flex-grow flex-col">
              {!recipe.data.isImageRecipe ? (
                <div className="flex flex-col gap-12">
                  {recipe.data.ingredients && (
                    <div className="flex flex-col gap-2">
                      <h2 className="text-[28px]">
                        {t("Form.Property.Ingredients")}
                      </h2>
                      <div
                        className="prose-big prose"
                        dangerouslySetInnerHTML={{
                          __html: recipe.data.ingredients ?? "",
                        }}
                      />
                    </div>
                  )}
                  {recipe.data.instructions && (
                    <div className="flex flex-col gap-2">
                      <h2 className="text-[28px]">
                        {t("Form.Property.Instructions")}
                      </h2>
                      <div
                        className="prose-big prose"
                        dangerouslySetInnerHTML={{
                          __html: recipe.data.instructions ?? "",
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {recipe.data.recipeImage && (
                    <div className="flex flex-col gap-4">
                      <h2 className="text-[28px]">
                        {t("Form.Property.RecipeImage")}
                      </h2>
                      {recipe.data.recipeImage &&
                        (recipe.data.recipeImage.imageUrl ||
                          recipe.data.recipeImage.externalUrl) && (
                          <div className="flex h-full max-h-[800px] overflow-hidden rounded-lg outline outline-2 outline-transparent transition-all hover:outline-primary">
                            <ChosenImage
                              image={recipe.data.recipeImage}
                              onClick={() =>
                                lightboxRef.current?.setOpen(
                                  recipe.data?.recipeImage?.externalUrl,
                                )
                              }
                            />
                          </div>
                        )}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex flex-col gap-12 sm:w-[33%] sm:min-w-[33%]">
              {recipe.data.tags && (
                <div className="rounded-lg bg-secondary/15 p-4">
                  <h2 className="pb-6 text-[28px]">
                    {t("Form.Property.Tags")}
                  </h2>
                  <RecipeTagList recipeTags={recipe.data.tags} useName />
                </div>
              )}
              {recipe.data.tags && (
                <SimilarRecipes
                  groupId={recipe.data.groupId}
                  recipeId={recipe.data._id}
                  recipeTags={recipe.data.tags}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      <Lightbox
        ref={lightboxRef}
        imageSrcList={[
          recipe.data?.coverImage?.imageUrl,
          recipe.data?.coverImage?.externalUrl,
          recipe.data?.recipeImage?.imageUrl,
          recipe.data?.recipeImage?.externalUrl,
        ].filter((x) => x !== undefined)}
      />
    </main>
  );
};

export default RecipePage;
