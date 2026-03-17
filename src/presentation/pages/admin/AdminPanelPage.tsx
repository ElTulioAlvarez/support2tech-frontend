import { Link } from "react-router-dom";
import { AppShell } from "../../layouts/AppShell";
import { useAuth } from "../../../app/providers/AuthProvider";

export function AdminPanelPage() {
  const { user } = useAuth();

  return (
    <AppShell title="Panel Admin" role="admin">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-[#101010] p-5">
            <div className="text-sm text-white/50">Estado</div>
            <div className="mt-2 text-lg font-semibold text-white">Operativo</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#101010] p-5">
            <div className="text-sm text-white/50">Rol</div>
            <div className="mt-2 text-lg font-semibold text-white uppercase">
              ADMIN
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
            Dashboard Admin
          </div>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Vista administrativa
          </h2>
          <p className="mt-2 text-white/65">
            Ya puedes administrar usuarios técnicos desde el módulo de usuarios.
          </p>

          <div className="mt-5">
            <Link
              to="/admin/usuarios"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#db9000] px-5 text-sm font-semibold text-black transition hover:bg-[#c98200]"
            >
              Ir a usuarios
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}