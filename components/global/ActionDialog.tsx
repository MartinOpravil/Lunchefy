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
import { AlertDialogProps } from "@/types";
import ActionButton from "./ActionButton";
import { Trash2 } from "lucide-react";
import { ButtonVariant } from "@/enums";

const ActionDialog = ({
  isOpen,
  setIsOpen,
  title = "Are you absolutely sure want to delete",
  description,
  subject,
  action,
  confirmButtonLabel = "Delete",
}: AlertDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary">{title}</AlertDialogTitle>
          <AlertDialogTitle className="text-accent pb-2">
            &quot;{subject}&quot;
          </AlertDialogTitle>
          <AlertDialogDescription className="text-primary">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <ActionButton title="Cancel" onClick={() => {}} />
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <ActionButton
              icon={<Trash2 />}
              title={confirmButtonLabel}
              onClick={action}
              variant={ButtonVariant.Negative}
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ActionDialog;
