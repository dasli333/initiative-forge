// Hook for handling unsaved changes (beforeunload event)

import { useEffect } from "react";

/**
 * Hook to warn user about unsaved changes before leaving the page
 * @param isDirty Whether there are unsaved changes
 * @param onBeforeUnload Callback to execute before unload
 */
export function useUnsavedChanges(isDirty: boolean, onBeforeUnload: () => void) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ""; // Chrome wymaga tej linii
        onBeforeUnload();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, onBeforeUnload]);
}
