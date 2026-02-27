import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import type { User } from "../../domain/entities/user";
import { AuthRepositoryImpl } from "../../infrastructure/repositories/auth.repository.impl";
import { LoginUseCase } from "../../application/use-cases/login.usecase";
import { MeUseCase } from "../../application/use-cases/me.usecase";
import { LogoutUseCase } from "../../application/use-cases/logout.usecase";
import { authEvents } from "../../infrastructure/http/authEvents";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  refresh(): Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const repo = useMemo(() => new AuthRepositoryImpl(), []);
  const loginUC = useMemo(() => new LoginUseCase(repo), [repo]);
  const meUC = useMemo(() => new MeUseCase(repo), [repo]);
  const logoutUC = useMemo(() => new LogoutUseCase(repo), [repo]);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refresh() {
    try {
      const u = await meUC.execute();
      setUser(u);
    } catch {
      setUser(null);
    }
  }

  async function login(email: string, password: string) {
    const session = await loginUC.execute(email, password);
    setUser(session.user);
    return session.user;
  }

  async function logout() {
    await logoutUC.execute();
    setUser(null);
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await refresh();
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  const off = authEvents.onUnauthorized(() => {
    // Cierre inmediato, sin depender de refresh()
    setUser(null);
  });
  return off;
}, []);

  const value: AuthState = { user, isLoading, login, logout, refresh };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}