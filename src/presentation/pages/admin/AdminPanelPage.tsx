import { AppShell } from "../../layouts/AppShell";
import { useAuth } from "../../../app/providers/AuthProvider";

export function AdminPanelPage() {
  const { user } = useAuth();

  return (
    <AppShell title="Panel Admin" role="admin">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Estado" value="Operativo" />
        <Card title="Rol" value={(user?.rol ?? "admin").toUpperCase()} />
        <Card title="Pendiente" value="Módulos en construcción" />
        <Card title="Siguiente" value="Usuarios / Proyectos" />
      </div>
    </AppShell>
  );
}

function Card(props: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="text-xs text-white/55">{props.title}</div>
      <div className="mt-1 text-sm font-semibold text-white/90">{props.value}</div>
    </div>
  );
}
