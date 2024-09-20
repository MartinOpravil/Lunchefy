"use client";
import React, { useState } from "react";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PageHeader from "@/components/global/PageHeader";
import LinkButton from "@/components/global/LinkButton";
import ActionButton from "@/components/global/ActionButton";
import BasicDialog from "@/components/global/BasicDialog";
import { Privilage } from "@/enums";
import Image from "next/image";

const RecipeBookPageHeader = (props: {
  recipeBookPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBookById>;
}) => {
  const recipeBookResult = usePreloadedQuery(props.recipeBookPreloaded);
  const recipeBookResultData = recipeBookResult.data;
  const [isAccessManagerOpen, setIsAccessManagerOpen] = useState(false);

  if (!recipeBookResultData) return <></>;

  return (
    <>
      <PageHeader
        title={`${recipeBookResultData.name}`}
        icon="recipe_book"
        actionButton={
          <>
            <LinkButton title="Back" icon="back" href="/app" />
            {recipeBookResultData.privilage !== Privilage.Viewer && (
              <>
                <LinkButton
                  title="New"
                  icon="add"
                  href={`/app/${recipeBookResultData._id}/new-recipe`}
                />
              </>
            )}
          </>
        }
      />
    </>
  );
};

export default RecipeBookPageHeader;
