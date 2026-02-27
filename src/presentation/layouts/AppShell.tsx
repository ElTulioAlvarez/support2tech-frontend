import { useMemo, useState } from "react";
import { useAuth } from "../../app/providers/AuthProvider";

type NavItem = {
  key: string;
  label: string;
  href?: string;
};

export function AppShell(props: {
  title: string;
  role: "admin" | "tecnico";
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const nav = useMemo<NavItem[]>(() => {
    if (props.role === "admin") {
      return [
        { key: "dashboard", label: "Dashboard" },
        { key: "usuarios", label: "Usuarios" },
        { key: "proyectos", label: "Proyectos" },
        { key: "reportes", label: "Reportes" },
      ];
    }
    return [
      { key: "agenda", label: "Agenda" },
      { key: "tickets", label: "Tickets" },
      { key: "reportes", label: "Reportes" },
      { key: "proyectos", label: "Proyectos" },
    ];
  }, [props.role]);

  return (
    <div className="min-h-[100dvh] w-full bg-[#07090D] text-white">
      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur lg:hidden">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-2"
            aria-label="Abrir menú"
          >
            <HamburgerIcon />
          </button>

          <div className="text-sm font-semibold tracking-tight">{props.title}</div>

          <div className="text-xs text-white/60">{(user?.rol ?? props.role).toUpperCase()}</div>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[84%] max-w-xs border-r border-white/10 bg-[#07090D] p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Menú</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/80"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs text-white/50">Sesión</div>
              <div className="mt-1 text-sm font-medium">{user?.nombre ?? user?.email ?? "-"}</div>
              <div className="mt-1 text-xs text-white/60">rol: {user?.rol ?? props.role}</div>
            </div>

            <nav className="mt-4 space-y-2">
              {nav.map((i) => (
                <button
                  key={i.key}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/85 hover:bg-white/[0.06]"
                >
                  {i.label}
                </button>
              ))}
            </nav>

            <button
              type="button"
              onClick={logout}
              className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 hover:bg-white/[0.06]"
            >
              Cerrar sesión
            </button>
          </aside>
        </div>
      )}

      <div className="mx-auto grid min-h-[100dvh] w-full max-w-6xl grid-cols-1 lg:grid-cols-[260px_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden border-r border-white/10 bg-white/[0.02] p-4 lg:block">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs text-white/50">Sesión</div>
            <div className="mt-1 text-sm font-medium">{user?.nombre ?? user?.email ?? "-"}</div>
            <div className="mt-1 text-xs text-white/60">rol: {user?.rol ?? props.role}</div>
          </div>

          <nav className="mt-4 space-y-2">
            {nav.map((i) => (
              <button
                key={i.key}
                type="button"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/85 hover:bg-white/[0.06]"
              >
                {i.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 hover:bg-white/[0.06]"
          >
            Cerrar sesión
          </button>
        </aside>

        {/* Content */}
        <main className="p-4 sm:p-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-white/50">Panel</div>
                <h1 className="text-xl font-semibold tracking-tight">{props.title}</h1>
              </div>

              <div className="hidden text-right lg:block">
                <div className="text-xs text-white/50">Usuario</div>
                <div className="text-sm text-white/85">{user?.email ?? "-"}</div>
              </div>
            </div>

            {props.children}
          </div>
        </main>
      </div>
    </div>
  );
}

function HamburgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
