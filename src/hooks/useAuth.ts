import { useState, useEffect } from "react";
import { supabaseBrowserClient } from "@/db/supabase.browser";
import type { UserViewModel } from "@/types";

interface UseAuthReturn {
  user: UserViewModel | null;
  isLoading: boolean;
  error: Error | null;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const { data, error: authError } = await supabaseBrowserClient.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (data.user && isMounted) {
          setUser({
            id: data.user.id,
            email: data.user.email || "",
            avatar: data.user.user_metadata?.avatar_url,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to load user"));
          console.error("Error loading user:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const logout = async () => {
    try {
      const { error: signOutError } = await supabaseBrowserClient.auth.signOut();
      if (signOutError) {
        console.error("Logout error:", signOutError);
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Force logout UX - nawet jeśli API call failed
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return {
    user,
    isLoading,
    error,
    logout,
  };
}
