"use client";

import { useTranslations } from "next-intl";

import { Trash2 } from "lucide-react";

import ActionButton from "@/components/global/button/ActionButton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
          <AlertDialogTitle className="text-center !text-[22px] text-text sm:!text-[26px]">
            {title}
          </AlertDialogTitle>
          {subject && (
            <AlertDialogTitle className="whitespace-pre-line text-center !text-[18px] text-primary sm:!text-[24px]">
              {subject}
            </AlertDialogTitle>
          )}
          <AlertDialogDescription className="pb-4 text-center !text-[14px] text-text2 sm:!text-[16px]">
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
