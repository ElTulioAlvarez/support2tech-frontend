import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import logo from "../../assets/b2park-logo.png";

type NavItem = {
  key: string;
  label: string;
  href: string;
};

export function AppShell(props: {
  title: string;
  role: "admin" | "tecnico";
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const nav = useMemo<NavItem[]>(() => {
    if (props.role === "admin") {
      return [
        { key: "dashboard", label: "Dashboard", href: "/admin" },
        { key: "usuarios", label: "Usuarios", href: "/admin/usuarios" },
        { key: "proyectos", label: "Proyectos", href: "/admin" },
        { key: "reportes", label: "Reportes", href: "/admin" },
      ];
    }

    return [
      { key: "agenda", label: "Agenda", href: "/tecnico" },
      { key: "tickets", label: "Tickets", href: "/tecnico" },
      { key: "reportes", label: "Reportes", href: "/tecnico" },
      { key: "proyectos", label: "Proyectos", href: "/tecnico" },
    ];
  }, [props.role]);

  const displayName = user?.nombre ?? user?.email ?? "-";
  const displayRole = (user?.rol ?? props.role).toUpperCase();

  function isItemActive(href: string) {
    if (href === "/admin") return location.pathname === "/admin";
    if (href === "/tecnico") return location.pathname === "/tecnico";
    return location.pathname.startsWith(href);
  }

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="space-y-2">
      {nav.map((item) => {
        const active = isItemActive(item.href);

        return (
          <NavLink
            key={item.key}
            to={item.href}
            onClick={() => mobile && setOpen(false)}
            className={[
              "group flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition",
              active
                ? "border-[#db9700]/35 bg-[#141414] text-white shadow-[inset_0_0_0_1px_rgba(219,151,0,0.12)]"
                : "border-white/10 bg-[#101010] text-white/82 hover:border-[#db9700]/28 hover:bg-[#151515] hover:text-white",
            ].join(" ")}
          >
            <span className="text-sm font-medium">{item.label}</span>
            <span
              className={[
                "h-2.5 w-2.5 rounded-full transition",
                active ? "bg-[#db9700]" : "bg-white/15 group-hover:bg-[#db9700]/70",
              ].join(" ")}
            />
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-[100dvh] w-full bg-[#050505] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/90 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[#111111] text-white transition hover:border-[#db9700]/45 hover:text-[#db9700]"
            aria-label="Abrir menú"
          >
            <HamburgerIcon />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#db9700]/35 bg-black">
              <img src={logo} alt="B2Park" className="h-6 w-auto select-none" draggable={false} />
            </div>

            <div className="leading-tight">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#db9700]">B2Park</div>
              <div className="text-sm font-semibold text-white">{props.title}</div>
            </div>
          </div>

          <div className="rounded-full border border-white/10 bg-[#111111] px-3 py-1 text-[11px] font-medium text-white/80">
            {displayRole}
          </div>
        </div>
      </header>

      {open && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-black/75" onClick={() => setOpen(false)} aria-hidden />

          <aside className="fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-[340px] flex-col border-r border-[#db9700]/20 bg-[#080808] shadow-2xl shadow-black">
            <div className="border-b border-white/10 px-4 pb-4 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#db9700]/35 bg-black">
                    <img src={logo} alt="B2Park" className="h-7 w-auto select-none" draggable={false} />
                  </div>

                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#db9700]">B2Park</div>
                    <div className="text-sm font-semibold text-white">Support2Tech</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#111111] text-white/80 transition hover:border-[#db9700]/40 hover:text-white"
                  aria-label="Cerrar menú"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="mt-4 h-[2px] w-full rounded-full bg-[#db9700]" />
            </div>

            <div className="px-4 pt-4">
              <div className="rounded-3xl border border-white/10 bg-[#101010] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.16em] text-white/45">
                      Sesión activa
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white">{displayName}</div>
                    <div className="mt-1 text-xs text-white/55">{user?.email ?? "-"}</div>
                  </div>

                  <span className="rounded-full border border-[#db9700]/30 bg-[#db9700]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#db9700]">
                    {displayRole}
                  </span>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-4 pb-4 pt-5">
              <div className="mb-3 text-[11px] uppercase tracking-[0.16em] text-white/35">
                Navegación
              </div>
              <NavItems mobile />
            </nav>

            <div className="border-t border-white/10 p-4">
              <button
                type="button"
                onClick={logout}
                className="flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-[#111111] px-4 text-sm font-medium text-white/88 transition hover:border-[#db9700]/35 hover:bg-[#171717] hover:text-white"
              >
                Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="grid min-h-[100dvh] w-full grid-cols-1 lg:grid-cols-[300px_1fr]">
        <aside className="hidden border-r border-white/10 bg-[#080808] lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-6 pb-5 pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-[#db9700]/35 bg-black">
                <img src={logo} alt="B2Park" className="h-8 w-auto select-none" draggable={false} />
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#db9700]">B2Park</div>
                <div className="mt-1 text-lg font-semibold text-white">Support2Tech</div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-[#101010] p-4">
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/45">Sesión activa</div>
              <div className="mt-2 text-sm font-semibold text-white">{displayName}</div>
              <div className="mt-1 text-xs text-white/55">{user?.email ?? "-"}</div>
              <div className="mt-3 inline-flex rounded-full border border-[#db9700]/30 bg-[#db9700]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#db9700]">
                {displayRole}
              </div>
            </div>
          </div>

          <nav className="flex-1 px-6 py-5">
            <div className="mb-3 text-[11px] uppercase tracking-[0.16em] text-white/35">Navegación</div>
            <NavItems />
          </nav>

          <div className="border-t border-white/10 p-6">
            <button
              type="button"
              onClick={logout}
              className="flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-[#111111] px-4 text-sm font-medium text-white/88 transition hover:border-[#db9700]/35 hover:bg-[#171717] hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{props.children}</main>
      </div>
    </div>
  );
}

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}