"use client";
import React, { useState } from "react";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PageHeader from "@/components/global/PageHeader";
import LinkButton from "@/components/global/LinkButton";
import ActionButton from "@/components/global/ActionButton";
import BasicDialog from "@/components/global/BasicDialog";
import AccessManager from "./AccessManager/AccessManager";
import { Privilage } from "@/enums";
import Image from "next/image";

const RecipeBookDetailPageHeader = (props: {
  recipeBookPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBookById>;
}) => {
  const recipeBookResult = usePreloadedQuery(props.recipeBookPreloaded);
  const [isAccessManagerOpen, setIsAccessManagerOpen] = useState(false);
  return (
    recipeBookResult && (
      <>
        <PageHeader
          title={`${recipeBookResult.name}`}
          icon="recipe_book"
          actionButton={
            <>
              <LinkButton title="Back" icon="back" href="/app" />
              {recipeBookResult?.privilage === Privilage.Owner && (
                <ActionButton
                  icon="share"
                  onClick={() => setIsAccessManagerOpen(true)}
                />
              )}
            </>
          }
        />
        <BasicDialog
          isOpen={isAccessManagerOpen}
          setIsOpen={setIsAccessManagerOpen}
          icon={
            <Image
              src="/icons/share_primary.svg"
              alt="access"
              width={20}
              height={20}
            />
          }
          title="Access manager"
          description="Grant access for your family members or friends."
          content={
            <AccessManager
              recipeBookName={recipeBookResult.name}
              recipeBookId={recipeBookResult._id}
            />
          }
        />
      </>
    )
  );
};

export default RecipeBookDetailPageHeader;
