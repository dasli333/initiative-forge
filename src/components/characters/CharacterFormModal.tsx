import { useState, useRef } from "react";
import type { PlayerCharacterDTO, CreatePlayerCharacterCommand } from "@/types";
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
import { Button } from "@/components/ui/button";
import { CharacterForm } from "./CharacterForm";
import { useCreateCharacter } from "./hooks/useCreateCharacter";
import { useUpdateCharacter } from "./hooks/useUpdateCharacter";
import { toast } from "sonner";

interface CharacterFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  character: PlayerCharacterDTO | null;
  campaignId: string;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal dialog for creating/editing player characters
 * Includes unsaved changes confirmation
 */
export const CharacterFormModal = ({
  isOpen,
  mode,
  character,
  campaignId,
  onClose,
  onSuccess,
}: CharacterFormModalProps) => {
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const createMutation = useCreateCharacter(campaignId);
  const updateMutation = useUpdateCharacter(campaignId);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (data: CreatePlayerCharacterCommand) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Character created successfully");
      } else if (character) {
        await updateMutation.mutateAsync({
          characterId: character.id,
          data,
        });
        toast.success("Character updated successfully");
      }
      setIsDirty(false);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const err = error as {
        status?: number;
        message?: string;
        details?: Array<{ path: string; message: string }>;
      };

      if (err.status === 409) {
        toast.error("Character name already exists in this campaign");
      } else if (err.status === 400) {
        toast.error("Validation error: Please check your inputs");
      } else {
        toast.error("Failed to save character. Please try again.");
      }
      console.error("Error saving character:", error);
    }
  };

  const handleCloseAttempt = () => {
    if (isDirty && !isSubmitting) {
      setShowUnsavedWarning(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowUnsavedWarning(false);
    setIsDirty(false);
    onClose();
  };

  const handleFormSubmit = () => {
    formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseAttempt}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{mode === "create" ? "Add Player Character" : "Edit Character"}</DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Fill in the details to create a new player character"
                : "Update character information and abilities"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <CharacterForm mode={mode} defaultValues={character || undefined} onSubmit={handleSubmit} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseAttempt} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleFormSubmit}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Character" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showUnsavedWarning} onOpenChange={setShowUnsavedWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close? All changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>Discard Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
