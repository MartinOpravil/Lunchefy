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
import { ArrowLeft, Book, Save, Share2 } from "lucide-react";
import HorizontalSeparator from "@/components/global/HorizontalSeparator";
import { useFormContext } from "react-hook-form";

interface RecipeBookDetailPageHeaderProps {
  recipeBook: Awaited<ReturnType<typeof getRecipeBookById>>;
}

const RecipeBookDetailHeader = ({
  recipeBook,
}: RecipeBookDetailPageHeaderProps) => {
  const {
    formState: { isDirty, isSubmitting },
    handleSubmit,
  } = useFormContext();
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
            <HorizontalSeparator />
            {recipeBook.data.privilage === Privilage.Owner && (
              <>
                <DeleteRecipeBookButton
                  recipeBookId={recipeBook.data._id}
                  recipeBookTitle={recipeBook.data.name}
                  redirectAfterDelete
                />
                <LinkButton
                  icon={<Book />}
                  href={`/app/${recipeBook.data._id}`}
                />
                <ActionButton
                  icon={<Share2 />}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAccessManagerOpen(true);
                  }}
                />
                <ActionButton
                  title="Save"
                  icon={<Save />}
                  variant={ButtonVariant.Positive}
                  onClick={() => handleSubmit}
                  isLoading={isSubmitting}
                  isDisabled={!isDirty}
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

export default RecipeBookDetailHeader;