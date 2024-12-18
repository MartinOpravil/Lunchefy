"use client";
import Lightbox, { LightboxHandle } from "@/components/global/Lightbox";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import { useTagManager } from "@/components/recipes/TagManager";
import { api } from "@/convex/_generated/api";
import { ButtonVariant, Privilage } from "@/enums";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ArrowLeft, Pencil } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

interface RecipePageProps {
  recipePreloaded: Preloaded<typeof api.recipes.getRecipeById>;
}

const RecipePage = ({ recipePreloaded }: RecipePageProps) => {
  const recipe = usePreloadedQuery(recipePreloaded);
  const lightboxRef = useRef<LightboxHandle>(null);

  const { convertToTags } = useTagManager();

  const formatTextWithHTML = (text?: string) => {
    if (!text) return { __html: "" };
    return { __html: text.replace(/\n/g, "<br />") };
  };

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
      <main className="page-content">
        <div className="flex flex-col w-full gap-16">
          {recipe.data.description && (
            <div className="text-[20px]">{recipe.data.description}</div>
          )}
          {recipe.data.coverImage?.imageUrl && (
            <div className="rounded-xl overflow-hidden w-full aspect-[16/10]">
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
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex flex-col flex-grow">
              {!recipe.data.isImageRecipe ? (
                <div className="flex flex-col gap-12">
                  {recipe.data.ingredients && (
                    <div className="flex flex-col gap-2">
                      <h2>Ingredients:</h2>
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
                      <h2>Instrukce:</h2>
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
                      <h2 className="text-[28px]">Fotka receptu</h2>
                      {/* <div className="heading-underline !mt-0" /> */}
                      <div className="flex rounded-lg overflow-hidden h-full max-h-[800px]">
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
            <div className="sm:min-w-[33%] flex flex-col gap-12">
              {recipe.data.tags && (
                <div className="p-4 bg-[#f9f9f9] rounded-lg">
                  <h2>Tagy</h2>
                  <div className="flex flex-col gap-4 pt-8">
                    {convertToTags(recipe.data.tags).map((tag, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <Image
                          unoptimized
                          src={`/icons/tags/${tag.value}.svg`}
                          alt="Tag"
                          width={40}
                          height={40}
                          className="w-[40px] h-[40px]"
                        />
                        <h3>{tag.label}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col">
                <h2>Podobné recepty</h2>
                {/* <div className="heading-underline" /> */}
              </div>
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
