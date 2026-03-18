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
    <div className="space-y-2.5">
      {nav.map((item) => {
        const active = isItemActive(item.href);

        return (
          <NavLink
            key={item.key}
            to={item.href}
            onClick={() => mobile && setOpen(false)}
            className={[
              "group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-200",
              active
                ? "border-[#db9700]/35 bg-[linear-gradient(135deg,rgba(219,151,0,0.10),rgba(255,255,255,0.02))] text-white shadow-[inset_0_0_0_1px_rgba(219,151,0,0.08),0_10px_30px_rgba(0,0,0,0.28)]"
                : "border-white/8 bg-[rgba(255,255,255,0.02)] text-white/78 hover:border-[#db9700]/25 hover:bg-[rgba(255,255,255,0.045)] hover:text-white",
            ].join(" ")}
          >
            <span
              className={[
                "absolute inset-y-2 left-0 w-[3px] rounded-r-full transition-all duration-200",
                active ? "bg-[#db9700]" : "bg-transparent group-hover:bg-[#db9700]/40",
              ].join(" ")}
            />

            <div className="flex items-center gap-3">
              <span
                className={[
                  "h-2.5 w-2.5 rounded-full transition-all duration-200",
                  active
                    ? "bg-[#db9700] shadow-[0_0_14px_rgba(219,151,0,0.55)]"
                    : "bg-white/15 group-hover:bg-[#db9700]/70",
                ].join(" ")}
              />
              <span className="text-sm font-medium tracking-[0.01em]">{item.label}</span>
            </div>

            <span
              className={[
                "text-[11px] uppercase tracking-[0.16em] transition-all duration-200",
                active ? "text-[#db9700]" : "text-white/24 group-hover:text-white/45",
              ].join(" ")}
            >
              {String(item.key).slice(0, 3)}
            </span>
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(219,151,0,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(219,151,0,0.06),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.02))]" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(5,5,5,0.88)] backdrop-blur-xl lg:hidden">
        <div className="relative flex h-16 items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] text-white transition hover:border-[#db9700]/45 hover:bg-[rgba(219,151,0,0.08)] hover:text-[#db9700]"
            aria-label="Abrir menú"
          >
            <HamburgerIcon />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-[#db9700]/30 bg-black shadow-[0_0_24px_rgba(219,151,0,0.10)]">
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle,rgba(219,151,0,0.12),transparent_70%)]" />
              <img
                src={logo}
                alt="B2Park"
                className="relative h-6 w-auto select-none"
                draggable={false}
              />
            </div>

            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#db9700]">
                B2Park
              </div>
              <div className="text-sm font-semibold text-white">{props.title}</div>
            </div>
          </div>

          <div className="rounded-full border border-[#db9700]/20 bg-[rgba(219,151,0,0.08)] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#f4bb42]">
            {displayRole}
          </div>
        </div>
      </header>

      {open && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <aside className="fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-[348px] flex-col border-r border-[#db9700]/15 bg-[#080808] shadow-[0_30px_80px_rgba(0,0,0,0.75)]">
            <div className="relative overflow-hidden border-b border-white/10 px-4 pb-4 pt-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(219,151,0,0.12),transparent_42%)]" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#db9700]/30 bg-black shadow-[0_0_28px_rgba(219,151,0,0.12)]">
                    <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle,rgba(219,151,0,0.14),transparent_70%)]" />
                    <img
                      src={logo}
                      alt="B2Park"
                      className="relative h-7 w-auto select-none"
                      draggable={false}
                    />
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-[#db9700]">
                      B2Park
                    </div>
                    <div className="text-sm font-semibold text-white">Panel operativo</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] text-white/80 transition hover:border-[#db9700]/40 hover:bg-[rgba(219,151,0,0.08)] hover:text-white"
                  aria-label="Cerrar menú"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="relative mt-4 h-[2px] w-full overflow-hidden rounded-full bg-white/8">
                <div className="h-full w-2/5 rounded-full bg-[#db9700] shadow-[0_0_14px_rgba(219,151,0,0.45)]" />
              </div>
            </div>

            <div className="px-4 pt-4">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.26)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(219,151,0,0.10),transparent_35%)]" />

                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                      Sesión activa
                    </div>
                    <div className="mt-2 truncate text-sm font-semibold text-white">
                      {displayName}
                    </div>
                    <div className="mt-1 truncate text-xs text-white/55">{user?.email ?? "-"}</div>
                  </div>

                  <span className="shrink-0 rounded-full border border-[#db9700]/25 bg-[rgba(219,151,0,0.08)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#f4bb42]">
                    {displayRole}
                  </span>
                </div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 pb-4 pt-5">
              <div className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/30">
                Navegación
              </div>
              <NavItems mobile />
            </nav>

            <div className="border-t border-white/10 p-4">
              <button
                type="button"
                onClick={logout}
                className="flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 text-sm font-medium text-white/88 transition hover:border-[#db9700]/35 hover:bg-[rgba(219,151,0,0.08)] hover:text-white"
              >
                Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="relative grid h-full w-full grid-cols-1 lg:grid-cols-[320px_1fr]">
        <aside className="relative hidden h-full overflow-hidden border-r border-white/10 bg-[#080808] lg:flex lg:flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(219,151,0,0.10),transparent_30%)]" />

          <div className="relative border-b border-white/10 px-6 pb-5 pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-[26px] border border-[#db9700]/30 bg-black shadow-[0_0_30px_rgba(219,151,0,0.10)]">
                <div className="absolute inset-0 rounded-[26px] bg-[radial-gradient(circle,rgba(219,151,0,0.14),transparent_70%)]" />
                <img
                  src={logo}
                  alt="B2Park"
                  className="relative h-8 w-auto select-none"
                  draggable={false}
                />
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-[#db9700]">
                  B2Park
                </div>
                <div className="mt-1 text-lg font-semibold text-white">Panel operativo</div>
                <div className="mt-0.5 text-xs text-white/45">Parking to Business</div>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.28)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                    Sesión activa
                  </div>
                  <div className="mt-2 truncate text-sm font-semibold text-white">
                    {displayName}
                  </div>
                  <div className="mt-1 truncate text-xs text-white/55">{user?.email ?? "-"}</div>
                </div>

                <div className="shrink-0 rounded-full border border-[#db9700]/20 bg-[rgba(219,151,0,0.08)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#f4bb42]">
                  {displayRole}
                </div>
              </div>

              <div className="mt-4 h-px w-full bg-white/8" />

              <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-white/35">
                <span>Módulo</span>
                <span className="text-[#db9700]">{props.title}</span>
              </div>
            </div>
          </div>

          <nav className="relative flex-1 overflow-y-auto px-6 py-5">
            <div className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/30">
              Navegación
            </div>
            <NavItems />
          </nav>

          <div className="relative border-t border-white/10 p-6">
            <button
              type="button"
              onClick={logout}
              className="flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 text-sm font-medium text-white/88 transition hover:border-[#db9700]/35 hover:bg-[rgba(219,151,0,0.08)] hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="relative min-w-0 overflow-y-auto">
          <div className="border-b border-white/8 bg-[rgba(255,255,255,0.015)] px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#db9700]">
                  B2Park / {displayRole}
                </div>
                <h1 className="mt-2 text-2xl font-semibold tracking-[0.01em] text-white lg:text-[30px]">
                  {props.title}
                </h1>
              </div>

              <div className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-xs text-white/60">
                {user?.email ?? "-"}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">{props.children}</div>
        </main>
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