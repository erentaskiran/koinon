"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";
import { ReadingStatus } from "@/lib/actions/book-actions";
import { Trash2 } from "lucide-react";

interface AddBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (status: ReadingStatus) => Promise<void>;
  bookTitle: string;
  isLoading?: boolean;
  currentStatus?: ReadingStatus | null;
  onRemove?: () => Promise<void>;
  showRemoveButton?: boolean;
}

type StatusOption = {
  value: ReadingStatus;
  label: string;
};

const statusOptions: StatusOption[] = [
  {
    value: "WANT_TO_READ",
    label: "Want to Read",
  },
  {
    value: "IS_READING",
    label: "Currently Reading",
  },
  {
    value: "COMPLETED",
    label: "Read",
  },
];

export function AddBookDialog({
  open,
  onOpenChange,
  onConfirm,
  bookTitle,
  isLoading = false,
  currentStatus = null,
  onRemove,
  showRemoveButton = false,
}: AddBookDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<ReadingStatus>(
    currentStatus || "WANT_TO_READ"
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    await onConfirm(selectedStatus);
  };

  const handleRemove = async () => {
    if (!onRemove) return;

    setIsDeleting(true);
    try {
      await onRemove();
      setShowDeleteDialog(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to remove book:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Update selected status when dialog opens with a current status
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && currentStatus) {
      setSelectedStatus(currentStatus);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentStatus ? "Update Status" : "Add to Shelf"}
          </DialogTitle>
          <DialogDescription>
            {currentStatus
              ? `Update the reading status for "${bookTitle}"`
              : `How would you like to track "${bookTitle}"?`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          {statusOptions.map((option) => {
            return (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={cn(
                  "w-full flex items-center justify-center p-3 rounded-lg border-2 transition-all",
                  selectedStatus === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                )}
              >
                <div className="font-medium text-sm">{option.label}</div>
              </button>
            );
          })}

          {showRemoveButton && currentStatus && onRemove && (
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isLoading || isDeleting}
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove from Shelf
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading || isDeleting}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || isDeleting}>
            {isLoading
              ? currentStatus
                ? "Updating..."
                : "Adding..."
              : currentStatus
              ? "Update Status"
              : "Add to Shelf"}
          </Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove book from shelf?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &quot;{bookTitle}&quot; from your
              shelf? This action cannot be undone and will delete all progress
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
