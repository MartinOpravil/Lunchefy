"use client";
import Lightbox, { LightboxHandle } from "@/components/global/Lightbox";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import LatestRecipeDateInPlanner from "@/components/recipes/LatestRecipeDateInPlanner";
import RecipeTagList from "@/components/recipes/RecipeTagList";
import SimilarRecipes from "@/components/recipes/SimilarRecipes";
import { api } from "@/convex/_generated/api";
import { ButtonVariant, Privilage } from "@/enums";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ArrowLeft, CalendarFold, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useRef } from "react";

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
    <main className="page">
      <PageHeader
        title={recipe.data.name}
        showIcon={false}
        titleClassName="md:text-[60px]"
        leftSide={
          <>
            <LinkButton
              icon={<ArrowLeft />}
              href={`/app/${recipe.data.groupId}`}
              variant={ButtonVariant.Minimalistic}
            />
            <LinkButton
              icon={<CalendarFold />}
              href={`/app/${recipe.data.groupId}/planner`}
              variant={ButtonVariant.Minimalistic}
            />
            <LatestRecipeDateInPlanner
              groupId={recipe.data.groupId}
              recipeId={recipe.data._id}
            />
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
      <main className="page-content">
        <div className="flex flex-col w-full gap-16">
          {recipe.data.description && (
            <div className="text-16 sm:text-[20px]">
              {recipe.data.description}
            </div>
          )}
          {recipe.data.coverImage?.imageUrl && (
            <div className="rounded-xl overflow-hidden w-full aspect-[16/10] outline outline-2 outline-transparent hover:outline-primary transition-all">
              <Image
                src={recipe.data.coverImage?.imageUrl}
                alt="recipe image"
                width={0}
                height={0}
                sizes="100vw"
                className="w-[100%] h-[100%] object-cover cursor-pointer"
                onClick={() =>
                  lightboxRef.current?.setOpen(
                    recipe.data?.coverImage?.imageUrl
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
                  {recipe.data.recipeImage?.imageUrl && (
                    <div className="flex flex-col gap-4">
                      <h2 className="text-[28px]">
                        {t("Form.Property.RecipeImage")}
                      </h2>
                      <div className="flex rounded-lg overflow-hidden h-full max-h-[800px] outline outline-2 outline-transparent hover:outline-primary transition-all">
                        <Image
                          src={recipe.data.recipeImage?.imageUrl}
                          alt="recipe image"
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-[100%] h-[100%] object-cover cursor-pointer"
                          onClick={() =>
                            lightboxRef.current?.setOpen(
                              recipe.data?.recipeImage?.imageUrl
                            )
                          }
                        />
                      </div>
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
      </main>
      <Lightbox
        ref={lightboxRef}
        imageSrcList={[
          recipe.data?.coverImage?.imageUrl,
          recipe.data?.recipeImage?.imageUrl,
        ].filter((x) => x !== undefined)}
      />
    </main>
  );
};

export default RecipePage;
