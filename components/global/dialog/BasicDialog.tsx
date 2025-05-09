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
          <DialogTitle className="flex items-center gap-4 text-center !text-[22px] text-text sm:!text-[26px]">
            {title}
            {icon}
          </DialogTitle>
          <div className="text-left !text-[14px] text-text2 sm:!text-[16px]">
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
