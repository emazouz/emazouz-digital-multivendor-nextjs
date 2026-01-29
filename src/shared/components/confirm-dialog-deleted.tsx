import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface ConfirmDialogDeletedProps {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  title: string;
  question: string;
  isDeleting: boolean;
  handleDeleteConfirm: () => void;
}

function ConfirmDialogDeleted({
  deleteDialogOpen,
  setDeleteDialogOpen,
  title,
  question,
  isDeleting,
  handleDeleteConfirm,
}: ConfirmDialogDeletedProps) {
  return (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{question}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialogDeleted;
