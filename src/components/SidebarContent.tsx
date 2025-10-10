import { useEffect } from "react";
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
  const { selectedCampaignId, setSelectedCampaignId } = useCampaignStore();

  // Extract campaign ID from URL if on a campaign page
  const campaignIdFromUrl = (() => {
    const campaignMatch = currentPath.match(/^\/campaigns\/([^/]+)/);
    return campaignMatch ? campaignMatch[1] : null;
  })();

  // Sync URL campaign ID with store
  useEffect(() => {
    if (campaignIdFromUrl && campaignIdFromUrl !== selectedCampaignId) {
      setSelectedCampaignId(campaignIdFromUrl);
    } else if (!campaignIdFromUrl && currentPath === "/campaigns" && selectedCampaignId) {
      // Clear selection when on campaigns list page
      // Don't clear it on other pages like /login, /settings, etc.
    }
  }, [campaignIdFromUrl, selectedCampaignId, setSelectedCampaignId, currentPath]);

  // Use the campaign ID (from URL or store)
  const activeCampaignId = campaignIdFromUrl || selectedCampaignId;
  const { data: campaign = null, isLoading: isLoadingCampaign } = useCampaignQuery(activeCampaignId);
  const { activeCombat } = useActiveCombat(activeCampaignId);

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
        <CampaignNav selectedCampaignId={activeCampaignId} activeCombat={activeCombat} currentPath={currentPath} />
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
