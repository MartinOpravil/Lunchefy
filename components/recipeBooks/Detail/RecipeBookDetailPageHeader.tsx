"use client";
import React, { useState } from "react";
import PageHeader from "@/components/global/PageHeader";
import LinkButton from "@/components/global/LinkButton";
import ActionButton from "@/components/global/ActionButton";
import BasicDialog from "@/components/global/BasicDialog";
import AccessManager from "./AccessManager/AccessManager";
import { Privilage } from "@/enums";
import Image from "next/image";
import DeleteRecipeBookButton from "../DeleteRecipeBookButton";
import { getRecipeBookById } from "@/convex/recipeBooks";

interface RecipeBookDetailPageHeaderProps {
  recipeBook: Awaited<ReturnType<typeof getRecipeBookById>>;
}

const RecipeBookDetailPageHeader = ({
  recipeBook,
}: RecipeBookDetailPageHeaderProps) => {
  const [isAccessManagerOpen, setIsAccessManagerOpen] = useState(false);

  if (!recipeBook.data) return <></>;

  return (
    <>
      <PageHeader
        title={`${recipeBook.data.name}`}
        icon="recipe_book"
        actionButton={
          <>
            <LinkButton title="Back" icon="back" href="/app" />
            {recipeBook.data.privilage === Privilage.Owner && (
              <>
                <ActionButton
                  icon="share"
                  onClick={() => setIsAccessManagerOpen(true)}
                />
                <DeleteRecipeBookButton
                  recipeBookId={recipeBook.data._id}
                  recipeBookTitle={recipeBook.data.name}
                  redirectAfterDelete
                  classList="!bg-accent"
                />
              </>
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
            recipeBookName={recipeBook.data.name}
            recipeBookId={recipeBook.data._id}
          />
        }
      />
    </>
  );
};

export default RecipeBookDetailPageHeader;
