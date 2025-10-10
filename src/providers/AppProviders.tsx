import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Main providers wrapper for the application
 * Combines all providers used in React components
 *
 * Note: Zustand stores don't need a provider, they work globally
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <QueryProvider>{children}</QueryProvider>;
}
