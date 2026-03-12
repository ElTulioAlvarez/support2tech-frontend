import { AppShell } from "../../layouts/AppShell";
import { useAuth } from "../../../app/providers/AuthProvider";

export function TecnicoPanelPage() {
  const { user } = useAuth();

  return (
    <AppShell title="Panel Técnico" role="tecnico">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-[#101010] p-5">
            <div className="text-sm text-white/50">Hoy</div>
            <div className="mt-2 text-lg font-semibold text-white">
              Agenda pendiente
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#101010] p-5">
            <div className="text-sm text-white/50">Rol</div>
            <div className="mt-2 text-lg font-semibold text-white uppercase">
              TÉCNICO
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#101010] p-5">
            <div className="text-sm text-white/50">Usuario</div>
            <div className="mt-2 text-lg font-semibold text-white">
              {user?.nombre ?? "-"}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#101010] p-5">
            <div className="text-sm text-white/50">Correo</div>
            <div className="mt-2 break-all text-sm font-medium text-white">
              {user?.email ?? "-"}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#101010] p-6">
          <div className="text-sm uppercase tracking-[0.16em] text-[#db9700]">
            Dashboard Técnico
          </div>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Vista operativa
          </h2>
          <p className="mt-2 text-white/65">
            Aquí irá la lógica del dashboard para técnicos.
          </p>
        </div>
      </div>
    </AppShell>
  );
}