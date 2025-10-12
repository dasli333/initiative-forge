import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { getQueryClient } from "@/lib/queryClient";

/**
 * Wrapper for React Query DevTools
 * Renders devtools only once for the entire application
 * Uses the singleton QueryClient from getQueryClient()
 */
export function ReactQueryDevtoolsWrapper() {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}
