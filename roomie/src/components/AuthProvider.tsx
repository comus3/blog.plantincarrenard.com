// src/components/AuthProvider.tsx
import { createContext, useContext, createResource, ParentComponent, createEffect, onMount } from "solid-js";
import { getCurrentUser } from "../lib/auth";
import { User } from "../lib/types";
import { isServer } from "solid-js/web";

type AuthContextType = {
  user: () => User | null;
  isLoggedIn: () => boolean;
  isLoading: () => boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType>();

export const AuthProvider: ParentComponent = (props) => {
  // SSR-safe authentication: Resource handles server/client hydration seamlessly
  // SolidJS resources automatically suspend rendering until data is available on the server
  const [user, { refetch }] = createResource(
    () => {
      return getCurrentUser();
    },
    {
      // SSR hydration strategy: Start with null on both server and client 
      // to prevent hydration mismatches. The client will fetch fresh data after hydration.
      initialValue: null
    }
  );

  createEffect(() => {
    const currentUser = user();
    const loading = user.loading;
    const error = user.error;
  });

  onMount(() => {
    // Client-side only: Component has successfully hydrated
    // Perfect place for client-specific auth initialization
  });

  const contextValue = {
    user: () => {
      const currentUser = user() || null;
      return currentUser;
    },
    isLoggedIn: () => {
      const loggedIn = !!user() && !user.loading;
      return loggedIn;
    },
    isLoading: () => {
      const loading = user.loading;
      return loading;
    },
    // Critical for SPA navigation: Allows manual refresh after login/logout
    // without full page reload, maintaining SPA user experience
    refetch,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};