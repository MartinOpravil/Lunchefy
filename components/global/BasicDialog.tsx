import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BasicDialogProps } from "@/types";

const BasicDialog = ({
  isOpen,
  setIsOpen,
  icon,
  title = "asfagsa",
  description,
  content,
  action,
}: BasicDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary flex gap-2 items-center">
            {icon}
            {title}
          </DialogTitle>
          <DialogDescription className="text-primary pb-2">
            {description}
          </DialogDescription>
          <div className="heading-underline" />
        </DialogHeader>
        {content}

        {action && <DialogFooter>{action}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default BasicDialog;
