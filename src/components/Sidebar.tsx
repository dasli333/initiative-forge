import { SidebarWrapper } from "./SidebarWrapper";

interface SidebarProps {
  currentPath: string;
}

/**
 * Main Sidebar component - delegates to SidebarWrapper which provides React Query context
 */
export function Sidebar({ currentPath }: SidebarProps) {
  return <SidebarWrapper currentPath={currentPath} />;
}
