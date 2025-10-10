import { AppProviders } from "@/providers/AppProviders";
import { SidebarContent } from "./SidebarContent";

interface SidebarWrapperProps {
  currentPath: string;
}

/**
 * Wrapper component that provides React Query context to the Sidebar
 * This is needed because Astro mounts React components independently
 */
export function SidebarWrapper({ currentPath }: SidebarWrapperProps) {
  return (
    <AppProviders>
      <SidebarContent currentPath={currentPath} />
    </AppProviders>
  );
}
