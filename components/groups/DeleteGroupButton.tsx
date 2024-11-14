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

export interface DeleteGroupButtonProps extends ClassListProp {
  groupId: GenericId<"groups">;
  groupTitle: string;
  redirectAfterDelete?: boolean;
}

const DeleteGroupButton = ({
  groupId,
  groupTitle,
  redirectAfterDelete = false,
  classList,
}: DeleteGroupButtonProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deleteGroup = useMutation(api.groups.deleteGroup);

  const handleOpenDialog = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsDialogOpen(true);
  };

  const handleDeleteGroup = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteGroup({ id: groupId });
      setIsDeleting(false);
      if (!response.data)
        return notifyError(response.status.toString(), response.errorMessage);
      notifySuccess("Successfully deleted group");
      if (redirectAfterDelete) router.push("/app");
    } catch (error) {
      console.error("Error deleting group", error);
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
        description="This action cannot be undone and will permanently delete group from our servers."
        subject={groupTitle}
        confirmAction={handleDeleteGroup}
      />
    </>
  );
};

export default DeleteGroupButton;
