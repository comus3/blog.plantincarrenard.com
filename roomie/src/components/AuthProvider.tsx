// src/components/AuthProvider.tsx - DEBUG VERSION
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
  console.log(`🔐 [${isServer ? 'SERVER' : 'CLIENT'}] AuthProvider initializing`);
  
  // Create a resource that fetches current user with SSR-safe initial value
  const [user, { refetch }] = createResource(
    () => {
      console.log(`🔄 [${isServer ? 'SERVER' : 'CLIENT'}] AuthProvider resource fetching getCurrentUser`);
      return getCurrentUser();
    },
    {
      // Start with null on both server and client to prevent hydration mismatch
      initialValue: null
    }
  );

  // 🐛 DEBUG: Track auth state changes
  createEffect(() => {
    const currentUser = user();
    const loading = user.loading;
    const error = user.error;
    
    console.log(`🔐 AuthProvider state change:`, {
      environment: isServer ? 'SERVER' : 'CLIENT',
      user: currentUser?.username || 'none',
      userExists: !!currentUser,
      loading,
      error: error ? String(error) : 'none',
      isLoggedIn: !!currentUser && !loading
    });
  });

  onMount(() => {
    console.log(`🎯 AuthProvider mounted on ${isServer ? 'SERVER' : 'CLIENT'}`);
  });

  const contextValue = {
    user: () => {
      const currentUser = user() || null;
      console.log(`🔍 AuthProvider.user() called, returning:`, currentUser?.username || 'null');
      return currentUser;
    },
    isLoggedIn: () => {
      const loggedIn = !!user() && !user.loading;
      console.log(`🔍 AuthProvider.isLoggedIn() called, returning:`, loggedIn);
      return loggedIn;
    },
    isLoading: () => {
      const loading = user.loading;
      console.log(`🔍 AuthProvider.isLoading() called, returning:`, loading);
      return loading;
    },
    refetch, // This is key - allows manual refresh after login/logout
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
  console.log(`🔍 useAuth() called, context exists:`, !!context);
  return context;
};