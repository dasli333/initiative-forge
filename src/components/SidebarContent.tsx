import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useCampaignStore } from "@/stores/campaignStore";
import { AppHeader } from "./sidebar/AppHeader";
import { CurrentCampaignDisplay } from "./sidebar/CurrentCampaignDisplay";
import { GlobalNav } from "./sidebar/GlobalNav";
import { CampaignNav } from "./sidebar/CampaignNav";
import { UserMenu } from "./sidebar/UserMenu";

interface SidebarContentProps {
  currentPath: string;
}

export function SidebarContent({ currentPath }: SidebarContentProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  const { selectedCampaignId, selectedCampaign, clearSelection } = useCampaignStore();

  const campaign = selectedCampaign;

  // Handle logout with full page reload
  const handleLogout = useCallback(async () => {
    // 1. Logout from Supabase (clears cookies and localStorage)
    await logout();

    // 2. Clear campaign selection (both in-memory and localStorage)
    clearSelection();

    // 3. Clear React Query cache (removes all cached user data)
    queryClient.clear();

    // 4. Full page reload to /auth/login
    // Note: We use window.location.href instead of navigate() to avoid hydration mismatch
    // After clearing cache, SPA navigation would cause server/client state desync
    window.location.href = "/auth/login";
  }, [logout, clearSelection, queryClient]);

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      className="fixed left-0 top-0 h-screen w-60 bg-slate-900 border-r border-slate-800 flex flex-col"
    >
      {/* Top Section */}
      <AppHeader />

      {/* Current Campaign Display */}
      <CurrentCampaignDisplay campaign={campaign} isLoading={false} />

      {/* Navigation - flex-1 for spacing */}
      <nav className="flex-1 overflow-y-auto py-4">
        <GlobalNav currentPath={currentPath} />
        <CampaignNav selectedCampaignId={selectedCampaignId} currentPath={currentPath} />
      </nav>

      {/* Bottom Section - User Menu */}
      {isLoadingUser ? (
        <div className="h-16 bg-slate-800 animate-pulse m-4 rounded" />
      ) : (
        user && <UserMenu user={user} onLogout={handleLogout} />
      )}
    </aside>
  );
}
