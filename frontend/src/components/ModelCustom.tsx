"use client";
import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ModelCustom = ({
  text,

  title,
  btn,
  content,
  isOpen = false,
}: {
  value?: any;
  className?: string;
  text: string;
  onClick?: any;
  create?: boolean;
  title: string;
  btn?: ReactNode;
  content: ReactNode;
  isOpen?: boolean;
}) => {
  const [open, setOpen] = React.useState(isOpen);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{btn}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{text}</DialogDescription>
        </DialogHeader>
        {content}
        {/* <DialogFooter className="self-end flex items-center gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default ModelCustom;
