"use client";
import Lightbox, { LightboxHandle } from "@/components/global/Lightbox";
import LinkButton from "@/components/global/LinkButton";
import ChosenImage from "@/components/global/ChosenImage";
import PageHeader from "@/components/global/PageHeader";
import LatestRecipeDateInPlanner from "@/components/recipes/LatestRecipeDateInPlanner";
import RecipeTagList from "@/components/recipes/RecipeTagList";
import SimilarRecipes from "@/components/recipes/SimilarRecipes";
import { api } from "@/convex/_generated/api";
import { ButtonVariant, Privilage } from "@/enums";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ArrowLeft, CalendarDays, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useRef } from "react";
import RecipeChangeBanner from "@/components/recipes/RecipeChangeBanner";

interface RecipePageProps {
  recipePreloaded: Preloaded<typeof api.recipes.getRecipeById>;
}

const RecipePage = ({ recipePreloaded }: RecipePageProps) => {
  const t = useTranslations("Recipes.General");
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
        <div className="flex flex-col w-full gap-16">
          {recipe.data.description && (
            <div className="text-16 sm:text-[20px] text-text">
              {recipe.data.description}
            </div>
          )}
          {recipe.data.coverImage &&
            (recipe.data.coverImage.imageUrl ||
              recipe.data.coverImage.externalUrl) && (
              <div className="rounded-xl overflow-hidden w-full aspect-[16/10] outline outline-2 outline-transparent hover:outline-primary transition-all">
                <ChosenImage
                  image={recipe.data.coverImage}
                  onClick={() =>
                    lightboxRef.current?.setOpen(
                      recipe.data?.coverImage?.imageUrl ||
                        recipe.data?.coverImage?.externalUrl
                    )
                  }
                />
              </div>
            )}
          <div className="flex flex-col sm:flex-row gap-20">
            <div className="flex flex-col flex-grow">
              {!recipe.data.isImageRecipe ? (
                <div className="flex flex-col gap-12">
                  {recipe.data.ingredients && (
                    <div className="flex flex-col gap-2">
                      <h2 className="text-[28px]">
                        {t("Form.Property.Ingredients")}
                      </h2>
                      <div
                        className="prose prose-big"
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
                        className="prose prose-big"
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
                          <div className="flex rounded-lg overflow-hidden h-full max-h-[800px] outline outline-2 outline-transparent hover:outline-primary transition-all">
                            <ChosenImage
                              image={recipe.data.recipeImage}
                              onClick={() =>
                                lightboxRef.current?.setOpen(
                                  recipe.data?.recipeImage?.externalUrl
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
            <div className="sm:min-w-[33%] sm:w-[33%] flex flex-col gap-12">
              {recipe.data.tags && (
                <div className="p-4 bg-secondary/15 rounded-lg">
                  <h2 className="text-[28px] pb-6">
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
