import { useState } from "react";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { GenericId } from "convex/values";
import { Trash2 } from "lucide-react";

import ActionButton from "@/components/global/button/ActionButton";
import ActionDialog from "@/components/global/dialog/ActionDialog";

import { ButtonVariant, HttpResponseCode } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { cn } from "@/lib/utils";
import { ClassListProp } from "@/types";

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
  const t = useTranslations();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deleteGroup = useMutation(api.groups.deleteGroup);

  const handleOpenDialog = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
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
      if (!response.data) {
        switch (response.status) {
          case HttpResponseCode.InternalServerError:
            return notifyError(
              t("Groups.General.Notification.Error.Delete500"),
            );
          default:
            return notifyError(t("Global.Notification.UnexpectedError"));
        }
      }
      notifySuccess(t("Groups.General.Notification.Success.Delete"));
      if (redirectAfterDelete) router.push("/app");
    } catch (error) {
      console.error(t("Groups.General.Notification.Error.Delete500"), error);
      notifyError(t("Groups.General.Notification.Error.Delete500"));
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ActionButton
        icon={
          <Trash2 className="text-text transition-all group-hover:text-primary" />
        }
        onClick={handleOpenDialog}
        isLoading={isDeleting}
        variant={ButtonVariant.NegativeMinimalistic}
        classList={cn("pointer-events-auto", classList)}
      />
      <ActionDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title={t("Groups.General.Action.Delete.Title")}
        description={t("Groups.General.Action.Delete.Disclaimer")}
        confirmAction={handleDeleteGroup}
        confirmButtonLabel={t("Global.Button.Delete")}
      />
    </>
  );
};

export default DeleteGroupButton;
