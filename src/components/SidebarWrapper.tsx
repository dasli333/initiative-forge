import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { getQueryClient } from "@/lib/queryClient";
import { SidebarContent } from "./SidebarContent";

interface SidebarWrapperProps {
  currentPath: string;
}

/**
 * Wrapper component for the Sidebar
 * Provides React Query context for sidebar components
 *
 * Pattern: Each Astro island gets its own QueryClientProvider
 * but all share the same singleton QueryClient instance via getQueryClient()
 */
export function SidebarWrapper({ currentPath }: SidebarWrapperProps) {
  // Get singleton QueryClient instance (shared across all islands)
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarContent currentPath={currentPath} />
    </QueryClientProvider>
  );
}
