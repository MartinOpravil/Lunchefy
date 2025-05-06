import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BasicDialogProps } from "@/types";

const BasicDialog = ({
  isOpen,
  setIsOpen,
  icon,
  title,
  description,
  content,
  action,
  classList,
}: BasicDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={classList}>
        <DialogHeader className="gap-2">
          <DialogTitle className="flex gap-4 items-center text-text !text-[22px] sm:!text-[26px] text-center">
            {title}
            {icon}
          </DialogTitle>
          <div className="text-text2 !text-[14px] sm:!text-[16px] text-left">
            {description}
          </div>
          <div className="heading-underline" />
        </DialogHeader>
        {content}

        {action && <DialogFooter>{action}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default BasicDialog;
