import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { LoginPage } from "../../presentation/pages/LoginPage";
import { AdminPanelPage } from "../../presentation/pages/admin/AdminPanelPage";
import { TecnicoPanelPage } from "../../presentation/pages/tecnico/TecnicoPanelPage";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div style={{ padding: 16 }}>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireRole({ role, children }: { role: "admin" | "tecnico"; children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div style={{ padding: 16 }}>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const r = user.rol ?? "tecnico";
  if (r !== role) return <Navigate to={r === "admin" ? "/admin" : "/tecnico"} replace />;
  return children;
}

function IndexRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div style={{ padding: 16 }}>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={(user.rol ?? "tecnico") === "admin" ? "/admin" : "/tecnico"} replace />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<IndexRedirect />} />

        <Route
          path="/admin"
          element={
            <RequireRole role="admin">
              <AdminPanelPage />
            </RequireRole>
          }
        />

        <Route
          path="/tecnico"
          element={
            <RequireRole role="tecnico">
              <TecnicoPanelPage />
            </RequireRole>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}