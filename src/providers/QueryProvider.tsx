import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import type { ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * React Query provider with SSR-friendly configuration
 * Creates a new QueryClient instance for each request to avoid data leaking between users
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create a new QueryClient instance for each component mount
  // This is important for SSR to avoid sharing cache between requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Good defaults for SSR and better UX
            staleTime: 60 * 1000, // Data is considered fresh for 1 minute
            gcTime: 5 * 60 * 1000, // Keep inactive data in cache for 5 minutes (formerly cacheTime)
            retry: 1, // Only retry once on failure
            refetchOnWindowFocus: false, // Don't refetch on window focus by default
            refetchOnReconnect: "always", // Always refetch on reconnect
          },
          mutations: {
            retry: 0, // Don't retry mutations by default
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />}
    </QueryClientProvider>
  );
}
