"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ActionButton from "./ActionButton";
import { Trash2 } from "lucide-react";
import { ButtonVariant } from "@/enums";

interface AlertDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  subject?: string;
  cancelAction?: () => void;
  confirmAction: () => void;
  confirmButtonIcon?: React.ReactNode;
  useConfirmButtonIcon?: boolean;
  confirmButtonLabel?: string;
}

const ActionDialog = ({
  isOpen,
  setIsOpen,
  title = "Are you absolutely sure want to delete",
  description,
  subject,
  cancelAction,
  confirmAction,
  useConfirmButtonIcon = true,
  confirmButtonIcon = <Trash2 />,
  confirmButtonLabel = "Delete",
}: AlertDialogProps) => {
  const performCancel = () => {
    if (cancelAction) {
      cancelAction();
      return;
    }
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary">{title}</AlertDialogTitle>
          {subject && (
            <AlertDialogTitle className="text-accent pb-2">
              &quot;{subject}&quot;
            </AlertDialogTitle>
          )}
          <AlertDialogDescription className="text-primary">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <ActionButton title="Cancel" onClick={performCancel} />
          <ActionButton
            icon={useConfirmButtonIcon ? confirmButtonIcon : null}
            title={confirmButtonLabel}
            onClick={confirmAction}
            variant={ButtonVariant.Negative}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ActionDialog;
