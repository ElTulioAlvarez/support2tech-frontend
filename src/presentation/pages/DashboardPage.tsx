import { useAuth } from "../../app/providers/AuthProvider";
import { AdminPanelPage } from "./admin/AdminPanelPage";
import { TecnicoPanelPage } from "./tecnico/TecnicoPanelPage";

export function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return user.rol === "admin" ? <AdminPanelPage /> : <TecnicoPanelPage />;
}