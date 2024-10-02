import React, { useState } from "react";
import ActionButton from "../global/ActionButton";
import ActionDialog from "../global/ActionDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { GenericId } from "convex/values";
import { ClassListProp } from "@/types";
import { Trash2 } from "lucide-react";
import { ButtonVariant } from "@/enums";

export interface DeleteRecipeBookButtonProps extends ClassListProp {
  recipeBookId: GenericId<"recipeBooks">;
  recipeBookTitle: string;
  redirectAfterDelete?: boolean;
}

const DeleteRecipeBookButton = ({
  recipeBookId,
  recipeBookTitle,
  redirectAfterDelete = false,
  classList,
}: DeleteRecipeBookButtonProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deleteRecipeBook = useMutation(api.recipeBooks.deleteRecipeBook);

  const handleOpenDialog = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsDialogOpen(true);
  };

  const handleDeleteRecipeBook = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteRecipeBook({ id: recipeBookId });
      setIsDeleting(false);
      if (!response.data)
        return notifyError(response.status.toString(), response.errorMessage);
      notifySuccess("Successfully deleted recipe book");
      if (redirectAfterDelete) router.push("/app");
    } catch (error) {
      console.error("Error deleting recipe book", error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ActionButton
        icon={<Trash2 />}
        onClick={handleOpenDialog}
        isLoading={isDeleting}
        variant={ButtonVariant.Negative}
        classList={cn("pointer-events-auto", classList)}
      />
      <ActionDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title="Are you absolutely sure want to delete?"
        description="This action cannot be undone and will permanently delete your recipe book from our servers."
        subject={recipeBookTitle}
        action={handleDeleteRecipeBook}
      />
    </>
  );
};

export default DeleteRecipeBookButton;
