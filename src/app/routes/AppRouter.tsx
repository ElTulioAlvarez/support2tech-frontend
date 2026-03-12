import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { LoginPage } from "../../presentation/pages/LoginPage";
import { DashboardPage } from "../../presentation/pages/DashboardPage";
import type { ReactNode } from "react";

function FullscreenLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
      <div className="text-sm text-white/70">Cargando...</div>
    </div>
  );
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <FullscreenLoading />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function RedirectByRole() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <FullscreenLoading />;
  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to={user.rol === "admin" ? "/admin" : "/tecnico"} replace />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RedirectByRole />} />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />

        <Route
          path="/tecnico"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}