"use client";
import { RecipeBookProps } from "@/types";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ActionButton from "../global/ActionButton";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ActionDialog from "../global/ActionDialog";
import LinkButton from "../global/LinkButton";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Privilage } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";

const RecipeBook = ({ id, title, imageUrl, privilage }: RecipeBookProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deleteRecipeBook = useMutation(api.recipeBooks.deleteRecipeBook);

  // TODO: Move recipe book deletion logic to separate deleteRecipeBookButton

  const handleDeleteRecipeBook = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteRecipeBook({ id });
      setIsDeleting(false);
      if (!response.data)
        return notifyError(response.status.toString(), response.errorMessage);
      return notifySuccess("Successfully deleted recipe book");
    } catch (error) {
      console.error("Error deleting recipe book", error);
      setIsDeleting(false);
    }
  };

  const handleOpenDialog = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card
        className={cn(
          "relative hover:bg-secondary cursor-pointer transition-all bg-accent text-white-1 text-center overflow-hidden",
          {
            "bg-accentTransparent": imageUrl,
            "hover:bg-secondaryTransparent": imageUrl,
          }
        )}
      >
        <Link
          href={`/app/${id}`}
          className="min-h-[300px] flex flex-col justify-center items-center"
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Recipe book cover"
              className="absolute z-[-1]"
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }} // optional
            />
          )}
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          {/* <CardContent></CardContent>
          <CardFooter className="flex justify-end gap-1">
            <LinkButton
              icon="edit"
              href={`/app/${id}/detail`}
              classList="!bg-transparent hover:!bg-accent"
            />
            <ActionButton
              icon="delete"
              onClick={handleOpenDialog}
              isLoading={isDeleting}
              classList="!bg-transparent hover:!bg-primary"
            />
          </CardFooter> */}
        </Link>
        <div className="absolute w-full bottom-4 flex justify-between px-4 pointer-events-none">
          {privilage === Privilage.Owner ? (
            <ActionButton
              icon="delete"
              onClick={handleOpenDialog}
              isLoading={isDeleting}
              classList="!bg-transparent hover:!bg-primary pointer-events-auto"
            />
          ) : (
            <div></div>
          )}
          <LinkButton
            icon="edit"
            href={`/app/${id}/detail`}
            classList="!bg-transparent hover:!bg-accent pointer-events-auto"
          />
        </div>
      </Card>
      <ActionDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title="Are you absolutely sure want to delete?"
        description="This action cannot be undone and will permanently delete your recipe book from our servers."
        subject={title}
        action={handleDeleteRecipeBook}
      />
    </>
  );
};

export default RecipeBook;
