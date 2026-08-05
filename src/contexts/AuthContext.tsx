"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { ApiResponse } from "@/types/api";
import type { AuthUser } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

type AuthProviderProps = {
  children: ReactNode;
};

async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result =
      (await response.json()) as ApiResponse<AuthUser>;

    if (!result.success || !result.user) {
      return null;
    }

    return result.user;
  } catch {
    return null;
  }
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);

    const currentUser = await fetchCurrentUser();

    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialUser() {
      const currentUser = await fetchCurrentUser();

      if (cancelled) {
        return;
      }

      setUser(currentUser);
      setIsLoading(false);
    }

    void loadInitialUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      refreshUser,
      logout,
      setUser,
    }),
    [user, isLoading, refreshUser, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider."
    );
  }

  return context;
}