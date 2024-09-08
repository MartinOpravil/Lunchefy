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
import ActionButton from "./global/ActionButton";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ActionDialog from "./global/ActionDialog";
import LinkButton from "./global/LinkButton";

const RecipeBook = ({ id, title }: RecipeBookProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deleteRecipeBook = useMutation(api.recipeBooks.deleteRecipeBook);

  const handleDeleteRecipeBook = async () => {
    setIsDeleting(true);
    try {
      await deleteRecipeBook({ id });
      setIsDeleting(false);
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
      <Card className="relative hover:bg-secondary cursor-pointer transition-all bg-accent text-white-1 ">
        <Link
          href={`/app/${id}`}
          className="min-h-[300px] flex flex-col justify-center items-center"
        >
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
          <ActionButton
            icon="delete"
            onClick={handleOpenDialog}
            isLoading={isDeleting}
            classList="!bg-transparent hover:!bg-primary pointer-events-auto"
          />
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