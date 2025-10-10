import { useAuth } from "@/hooks/useAuth";
import { useCampaignQuery } from "@/hooks/queries/useCampaign";
import { useCampaignStore } from "@/stores/campaignStore";
import { useActiveCombat } from "@/hooks/useActiveCombat";
import { AppHeader } from "./sidebar/AppHeader";
import { CurrentCampaignDisplay } from "./sidebar/CurrentCampaignDisplay";
import { GlobalNav } from "./sidebar/GlobalNav";
import { CampaignNav } from "./sidebar/CampaignNav";
import { UserMenu } from "./sidebar/UserMenu";

interface SidebarContentProps {
  currentPath: string;
}

export function SidebarContent({ currentPath }: SidebarContentProps) {
  const { user, isLoading: isLoadingUser, logout } = useAuth();
  const { selectedCampaignId } = useCampaignStore();
  const { data: campaign = null, isLoading: isLoadingCampaign } = useCampaignQuery(selectedCampaignId);
  const { activeCombat } = useActiveCombat(selectedCampaignId);

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      className="fixed left-0 top-0 h-screen w-60 bg-slate-900 border-r border-slate-800 flex flex-col"
    >
      {/* Top Section */}
      <AppHeader />

      {/* Current Campaign Display */}
      <CurrentCampaignDisplay campaign={campaign} isLoading={isLoadingCampaign} />

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
