import { useState, useCallback } from "react";
import { navigate } from "astro:transitions/client";
import { useCombatsList } from "@/components/hooks/useCombatsList";
import { useDeleteCombat } from "@/components/hooks/useDeleteCombat";
import { CombatsHeader } from "./CombatsHeader";
import { CombatsGrid } from "./CombatsGrid";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { SkeletonLoader } from "./SkeletonLoader";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import type { CombatSummaryDTO } from "@/types";

export interface CombatsListViewProps {
  campaignId: string;
  campaignName: string;
}

export function CombatsListView({ campaignId, campaignName }: CombatsListViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [combatToDelete, setCombatToDelete] = useState<CombatSummaryDTO | null>(null);

  const { data, isLoading, isError, refetch } = useCombatsList(campaignId);
  const deleteMutation = useDeleteCombat(campaignId);

  const handleCreateNew = useCallback(() => {
    navigate(`/campaigns/${campaignId}/combats/new`);
  }, [campaignId]);

  const handleResume = useCallback((combatId: string) => {
    navigate(`/combats/${combatId}`);
  }, []);

  const handleView = useCallback((combatId: string) => {
    navigate(`/combats/${combatId}`);
  }, []);

  const handleDeleteClick = useCallback((combat: CombatSummaryDTO) => {
    setCombatToDelete(combat);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (combatToDelete) {
      deleteMutation.mutate(combatToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setCombatToDelete(null);
        },
      });
    }
  }, [combatToDelete, deleteMutation]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setCombatToDelete(null);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <CombatsHeader campaignId={campaignId} campaignName={campaignName} onCreateNew={handleCreateNew} />
        <div className="mt-6">
          <SkeletonLoader count={6} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <CombatsHeader campaignId={campaignId} campaignName={campaignName} onCreateNew={handleCreateNew} />
        <div className="mt-6">
          <ErrorState onRetry={refetch} />
        </div>
      </div>
    );
  }

  if (data && data.combats.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <CombatsHeader campaignId={campaignId} campaignName={campaignName} onCreateNew={handleCreateNew} />
        <div className="mt-6">
          <EmptyState onCreateNew={handleCreateNew} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <CombatsHeader campaignId={campaignId} campaignName={campaignName} onCreateNew={handleCreateNew} />
      <div className="mt-6">
        {data && (
          <CombatsGrid
            combats={data.combats}
            onResume={handleResume}
            onView={handleView}
            onDelete={handleDeleteClick}
          />
        )}
      </div>
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        combatName={combatToDelete?.name || ""}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
