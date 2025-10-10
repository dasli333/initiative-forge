import { useAuth } from "@/hooks/useAuth";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useSelectedCampaign } from "@/hooks/useSelectedCampaign";
import { useActiveCombat } from "@/hooks/useActiveCombat";
import { AppHeader } from "./sidebar/AppHeader";
import { CampaignSelector } from "./sidebar/CampaignSelector";
import { GlobalNav } from "./sidebar/GlobalNav";
import { CampaignNav } from "./sidebar/CampaignNav";
import { UserMenu } from "./sidebar/UserMenu";

interface SidebarProps {
  currentPath: string;
}

export function Sidebar({ currentPath }: SidebarProps) {
  const { user, isLoading: isLoadingUser, logout } = useAuth();
  const { campaigns, isLoading: isLoadingCampaigns, error: campaignsError, refetch } = useCampaigns();
  const { selectedCampaignId, setSelectedCampaignId } = useSelectedCampaign(campaigns);
  const { activeCombat } = useActiveCombat(selectedCampaignId);

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      className="fixed left-0 top-0 h-screen w-60 bg-slate-900 border-r border-slate-800 flex flex-col"
    >
      {/* Top Section */}
      <AppHeader />

      {/* Campaign Selector */}
      <CampaignSelector
        campaigns={campaigns}
        selectedCampaignId={selectedCampaignId}
        onSelectionChange={setSelectedCampaignId}
        isLoading={isLoadingCampaigns}
        error={campaignsError}
        onRetry={refetch}
      />

      {/* Navigation - flex-1 for spacing */}
      <nav className="flex-1 overflow-y-auto py-4">
        <GlobalNav currentPath={currentPath} />
        <CampaignNav selectedCampaignId={selectedCampaignId} activeCombat={activeCombat} currentPath={currentPath} />
      </nav>

      {/* Bottom Section - User Menu */}
      {isLoadingUser ? (
        <div className="h-16 bg-slate-800 animate-pulse m-4 rounded" />
      ) : (
        user && <UserMenu user={user} onLogout={logout} />
      )}
    </aside>
  );
}
