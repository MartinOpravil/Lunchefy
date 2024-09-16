"use client";
import React, { useState } from "react";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PageHeader from "@/components/global/PageHeader";
import LinkButton from "@/components/global/LinkButton";
import ActionButton from "@/components/global/ActionButton";
import BasicDialog from "@/components/global/BasicDialog";
import AccessManager from "./AccessManager/AccessManager";
import { Privilage } from "@/enums";
import Image from "next/image";
import ActionDialog from "@/components/global/ActionDialog";
import { useRouter } from "next/navigation";
import { notifyError, notifySuccess } from "@/lib/notifications";

const RecipeBookDetailPageHeader = (props: {
  recipeBookPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBookById>;
}) => {
  const router = useRouter();
  const recipeBookResult = usePreloadedQuery(props.recipeBookPreloaded);
  const recipeBookResultData = recipeBookResult.data;
  const [isAccessManagerOpen, setIsAccessManagerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteRecipeBook = useMutation(api.recipeBooks.deleteRecipeBook);

  // TODO: Move recipe book deletion logic to separate deleteRecipeBookButton

  const handleDeleteRecipeBook = async () => {
    setIsDeleting(true);
    try {
      // TODO: Fix brief flash of 404 - try .then instead of async/await
      if (!recipeBookResult.data) {
        return;
      }
      const response = await deleteRecipeBook({
        id: recipeBookResult.data._id,
      });
      setIsDeleting(false);
      if (!response.data)
        return notifyError(response.status.toString(), response.errorMessage);
      notifySuccess("Successfully deleted recipe book");
      router.push("/app");
    } catch (error) {
      console.error("Error deleting recipe book", error);
      setIsDeleting(false);
    }
  };

  if (!recipeBookResultData) return <></>;

  return (
    <>
      <PageHeader
        title={`${recipeBookResultData.name}`}
        icon="recipe_book"
        actionButton={
          <>
            <LinkButton title="Back" icon="back" href="/app" />
            {recipeBookResultData.privilage === Privilage.Owner && (
              <>
                <ActionButton
                  icon="share"
                  onClick={() => setIsAccessManagerOpen(true)}
                />
                <ActionButton
                  icon="delete"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  isLoading={isDeleting}
                  classList="hover:!bg-primary pointer-events-auto"
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
            recipeBookName={recipeBookResultData.name}
            recipeBookId={recipeBookResultData._id}
          />
        }
      />
      <ActionDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        title="Are you absolutely sure want to delete?"
        description="This action cannot be undone and will permanently delete your recipe book from our servers."
        subject={recipeBookResultData.name}
        action={handleDeleteRecipeBook}
      />
    </>
  );
};

export default RecipeBookDetailPageHeader;
