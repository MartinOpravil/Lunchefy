"use client";
import React, { useState } from "react";
import PageHeader from "@/components/global/PageHeader";
import LinkButton from "@/components/global/LinkButton";
import ActionButton from "@/components/global/ActionButton";
import BasicDialog from "@/components/global/BasicDialog";
import AccessManager from "./AccessManager/AccessManager";
import { ButtonVariant, Privilage } from "@/enums";
import Image from "next/image";
import DeleteRecipeBookButton from "../DeleteRecipeBookButton";
import { getRecipeBookById } from "@/convex/recipeBooks";
import { ArrowLeft, Share2, SquareArrowOutUpRight } from "lucide-react";

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
              icon={<ArrowLeft />}
              href="/app"
              variant={ButtonVariant.Dark}
            />
            <div className="bg-accent w-[1.5px] h-6 mx-2 rounded"></div>
            {recipeBook.data.privilage === Privilage.Owner && (
              <>
                <DeleteRecipeBookButton
                  recipeBookId={recipeBook.data._id}
                  recipeBookTitle={recipeBook.data.name}
                  redirectAfterDelete
                />
                <LinkButton
                  icon={<SquareArrowOutUpRight />}
                  href={`/app/${recipeBook.data._id}`}
                />
                <ActionButton
                  title="Share"
                  icon={<Share2 />}
                  variant={ButtonVariant.Positive}
                  onClick={() => setIsAccessManagerOpen(true)}
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
