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
            <LinkButton
              icon="back"
              href="/app"
              classList="!bg-gray-700 hover:!bg-secondary"
            />
            <div className="bg-accent w-[1.5px] h-6 mx-2 rounded"></div>
            {recipeBook.data.privilage === Privilage.Owner && (
              <>
                <DeleteRecipeBookButton
                  recipeBookId={recipeBook.data._id}
                  recipeBookTitle={recipeBook.data.name}
                  redirectAfterDelete
                  classList="!bg-accent"
                />
                <ActionButton
                  icon="share"
                  onClick={() => setIsAccessManagerOpen(true)}
                />
                <LinkButton icon="list" href={`/app/${recipeBook.data._id}`} />
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
