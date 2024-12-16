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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Global");

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
        <AlertDialogHeader className="gap-2">
          <AlertDialogTitle className="text-primary">
            <h3>{title}</h3>
          </AlertDialogTitle>
          {subject && (
            <AlertDialogTitle className="text-accent pb-2">
              &quot;{subject}&quot;
            </AlertDialogTitle>
          )}
          <AlertDialogDescription className="">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-between pt-8">
          <ActionButton title={t("Button.Cancel")} onClick={performCancel} />
          <ActionButton
            icon={useConfirmButtonIcon ? confirmButtonIcon : null}
            title={confirmButtonLabel}
            onClick={confirmAction}
            variant={ButtonVariant.Positive}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ActionDialog;
