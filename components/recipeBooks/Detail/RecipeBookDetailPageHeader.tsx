"use client";
import React from "react";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PageHeader from "@/components/global/PageHeader";
import LinkButton from "@/components/global/LinkButton";

const RecipeBookDetailPageHeader = (props: {
  recipeBookPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBookById>;
}) => {
  const recipeBookResult = usePreloadedQuery(props.recipeBookPreloaded);
  return (
    recipeBookResult && (
      <PageHeader
        title={`${recipeBookResult.name}`}
        icon="recipe_book"
        actionButton={<LinkButton title="Back" icon="back" href="/app" />}
      />
    )
  );
};

export default RecipeBookDetailPageHeader;
