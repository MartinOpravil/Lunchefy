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
              icon="delete"
              title={confirmButtonLabel}
              onClick={action}
              classList="!bg-primary hover:!bg-accent"
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ActionDialog;
