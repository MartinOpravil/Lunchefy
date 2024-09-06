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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ActionButton from "./global/ActionButton";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import LinkButton from "./global/LinkButton";
import { useRouter } from "next/navigation";

const RecipeBook = ({ id, title }: RecipeBookProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deleteRecipeBook = useMutation(api.recipeBooks.deleteRecipeBook);
  const router = useRouter();

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
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  const openRecipeBook = () => {
    console.log("openRecipeBook");
    router.push(`/app/${id}`);
  };

  return (
    // <Link href={`/app/${id}`}>
    <Card
      className="hover:bg-secondary cursor-pointer transition-all bg-accent text-white-1"
      onClick={openRecipeBook}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-end">
        <div onClick={handleOpenDialog}>
          <ActionButton
            icon="delete"
            onClick={() => {}}
            classList="!bg-primary hover:bg-primary "
          />
        </div>
        <Dialog open={isDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-secondary pb-2">
                Are you absolutely sure want to delete{" "}
                <span className="text-accent">{title}</span>?
              </DialogTitle>
              <DialogDescription className="text-primary">
                This action cannot be undone and will permanently delete your
                recipe book from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <ActionButton
                  icon="delete"
                  title="Delete"
                  isLoading={isDeleting}
                  onClick={handleDeleteRecipeBook}
                  classList="!bg-primary hover:!bg-accent"
                />
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
    // </Link>
  );
};

export default RecipeBook;
