import { useAuth } from "../../app/providers/AuthProvider";

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="rounded-md border p-4">
        <div className="text-sm text-gray-600">Sesión activa</div>
        <div className="font-mono text-sm">uid: {user?.id}</div>
        <div className="text-sm">email: {user?.email ?? "-"}</div>
      </div>

      <button className="rounded-md border px-4 py-2" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  );
}