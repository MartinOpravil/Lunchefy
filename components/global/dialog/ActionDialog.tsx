"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ActionButton from "@/components/global/button/ActionButton";
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
  title,
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
        <AlertDialogHeader className="gap-4">
          <AlertDialogTitle className="text-text !text-[22px] sm:!text-[26px] text-center">
            {title}
          </AlertDialogTitle>
          {subject && (
            <AlertDialogTitle className="text-primary text-center !text-[18px] sm:!text-[24px] whitespace-pre-line">
              {subject}
            </AlertDialogTitle>
          )}
          <AlertDialogDescription className="text-center !text-[14px] sm:!text-[16px] pb-4 text-text2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-between">
          <ActionButton title={t("Button.Cancel")} onClick={performCancel} />
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
