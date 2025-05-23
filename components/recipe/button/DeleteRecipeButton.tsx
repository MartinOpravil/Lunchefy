import { useState } from "react";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { GenericId } from "convex/values";
import { Trash2 } from "lucide-react";

import ActionButton from "@/components/global/button/ActionButton";
import ActionDialog from "@/components/global/dialog/ActionDialog";

import { ButtonVariant } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { cn } from "@/lib/utils";
import { ClassListProp } from "@/types";

export interface DeleteRecipeButtonProps extends ClassListProp {
  recipeId: GenericId<"recipes">;
  groupId: GenericId<"groups">;
  recipeTitle: string;
  redirectAfterDelete?: boolean;
  small?: boolean;
}

const DeleteRecipeButton = ({
  recipeId,
  groupId,
  recipeTitle,
  redirectAfterDelete = false,
  classList,
  small = false,
}: DeleteRecipeButtonProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deleteRecipe = useMutation(api.recipes.deleteRecipe);

  const handleOpenDialog = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsDialogOpen(true);
  };

  const handleDeleteRecipe = async () => {
    setIsDeleting(true);
    try {
      if (redirectAfterDelete) router.push(`/app/${groupId}`);
      const response = await deleteRecipe({ recipeId });
      setIsDeleting(false);
      if (!response.data)
        return notifyError(t("Recipes.General.Notification.Error.Delete500"));

      notifySuccess(t("Recipes.General.Notification.Success.Delete"));
      setIsDialogOpen(false);
    } catch (error) {
      notifyError(t("Recipes.General.Notification.Error.Delete500"));
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ActionButton
        icon={
          <Trash2
            className={cn(
              "text-text transition-all group-hover/delete:text-primary",
              {
                "!w-5 text-text2": small,
              },
            )}
          />
        }
        onClick={handleOpenDialog}
        isLoading={isDeleting}
        variant={ButtonVariant.NegativeMinimalistic}
        classList={cn("pointer-events-auto group/delete", classList)}
      />
      <ActionDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title={t("Recipes.General.Action.Delete.Title")}
        description={t("Recipes.General.Action.Delete.Disclaimer")}
        subject={recipeTitle}
        confirmAction={handleDeleteRecipe}
        confirmButtonLabel={t("Global.Button.Delete")}
      />
    </>
  );
};

export default DeleteRecipeButton;
